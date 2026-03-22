import { serve } from "https://deno.land/std@0.224.0/http/server.ts";

function json(status: number, obj: unknown) {
  return new Response(JSON.stringify(obj), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}

const corsHeaders: Record<string, string> = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

function mustEnv(name: string) {
  const v = Deno.env.get(name);
  if (!v) throw new Error(`Missing env ${name}`);
  return v;
}

function bad(msg: string, status = 400) {
  return json(status, { error: msg });
}

type Body = {
  audioPath?: string;
  audioUrl?: string;
  bucket?: string;
  targetText?: string;
  locale?: string;
};

const azureKey = Deno.env.get("AZURE_SPEECH_KEY") ?? "";
const azureRegion = (Deno.env.get("AZURE_SPEECH_REGION") ?? "").trim();

serve(async (req) => {
  try {
    const raw = await req.text();
    let body: Body | null = null;
    try {
      body = raw ? JSON.parse(raw) : null;
    } catch {
      return json(400, { error: "Invalid JSON body", rawPreview: raw.slice(0, 200) });
    }

    console.log("[asr-eval] content-type", req.headers.get("content-type"));
    console.log("[asr-eval] keys", body ? Object.keys(body) : []);

    if (req.method === "OPTIONS") {
      return new Response("ok", { headers: corsHeaders });
    }
    if (req.method !== "POST") return bad("Use POST", 405);

    if (!azureKey || !azureRegion) return bad("Azure Speech not configured", 500);

    const keys = body && typeof body === "object" ? Object.keys(body) : [];
    const audioUrl = body?.audioUrl;
    const audioPath = body?.audioPath;
    const targetText = body?.targetText;
    const locale = body?.locale;

    if (!audioUrl && !audioPath) {
      return json(400, { error: "Missing audioPath/audioUrl", receivedKeys: keys });
    }

    if (!locale) {
      return json(400, { error: "Missing locale", receivedKeys: keys });
    }

    const audioPathTrim = audioPath?.trim();
    const audioUrlTrim = audioUrl?.trim();
    const bucket = (body?.bucket ?? "asr-audio").trim();
    const targetTextClean =
      typeof targetText === "string" && targetText.trim().length > 0
        ? targetText.trim()
        : null;
    const localeTrim = (locale ?? "de-DE").trim();

    const SUPABASE_URL = mustEnv("SUPABASE_URL");
    const SERVICE_ROLE = mustEnv("SUPABASE_SERVICE_ROLE_KEY");

    let audioBytes: Uint8Array | null = null;
    let contentType = "unknown";

    if (audioPathTrim) {
      const storageUrl = `${SUPABASE_URL}/storage/v1/object/${bucket}/${audioPathTrim}`;
      const dl = await fetch(storageUrl, {
        headers: {
          apikey: SERVICE_ROLE,
          Authorization: `Bearer ${SERVICE_ROLE}`,
        },
      });
      if (!dl.ok) {
        const t = await dl.text().catch(() => "");
        return json(400, { error: `Storage download failed: ${dl.status} ${t}` });
      }
      contentType = dl.headers.get("content-type") ?? "unknown";
      const ab = await dl.arrayBuffer();
      if (!ab || ab.byteLength === 0) {
        return json(400, { error: "Downloaded 0 bytes from storage" });
      }
      audioBytes = new Uint8Array(ab);
    } else if (audioUrlTrim) {
      const dl = await fetch(audioUrlTrim);
      if (!dl.ok) {
        const t = await dl.text().catch(() => "");
        return json(400, { error: `Download fetch failed: ${dl.status} ${t}` });
      }
      contentType = dl.headers.get("content-type") ?? "unknown";
      const ab = await dl.arrayBuffer();
      if (!ab || ab.byteLength === 0) {
        return json(400, { error: "Downloaded 0 bytes from audioUrl" });
      }
      audioBytes = new Uint8Array(ab);
    }

    const byteLen = audioBytes?.byteLength ?? 0;

    console.log("[asr-eval] download ok", {
      status: 200,
      contentType,
      bytes: byteLen,
    });

    if (!byteLen) {
      return json(400, { error: "Downloaded 0 bytes" });
    }

    if (contentType.includes("application/json")) {
      return json(400, { error: "Downloaded JSON instead of audio" });
    }

    const sttUrl =
      `https://${azureRegion}.stt.speech.microsoft.com/speech/recognition/conversation/cognitiveservices/v1?language=${localeTrim}`;

    const sttRes = await fetch(sttUrl, {
      method: "POST",
      headers: {
        "Ocp-Apim-Subscription-Key": azureKey,
        "Content-Type": "audio/wav; codecs=audio/pcm; samplerate=16000",
        "Accept": "application/json;text/xml",
      },
      body: audioBytes,
    });

    if (!sttRes.ok) {
      const errText = await sttRes.text().catch(() => "");
      console.log("[asr-eval] azure stt", {
        status: sttRes.status,
        respSnippet: errText.slice(0, 200),
      });
      return bad(`Azure STT failed: ${sttRes.status} ${errText}`, 502);
    }

    const sttJson = await sttRes.json().catch(() => ({} as any));
    const transcript: string =
      sttJson?.DisplayText ?? sttJson?.NBest?.[0]?.Display ?? "";

    if (!targetTextClean) {
      return json(200, {
        transcript,
        score: null,
        tokens: [],
        mode: "live",
      });
    }

    const normTarget = normalize(targetTextClean);
    const normTranscript = normalize(transcript);
    const targetTokens = tokenize(normTarget);
    const spokenTokens = tokenize(normTranscript);

    if (normTarget && normTranscript && normTarget === normTranscript) {
      return json(200, {
        transcript,
        score: 1.0,
        tokens: targetTokens.map((t) => ({ token: t, status: "ok" as const })),
        mode: "scored",
      });
    }

    const { score, tokens } = diffTokens(targetTokens, spokenTokens);

    return json(200, {
      transcript,
      score,
      tokens,
      mode: "scored",
    });
  } catch (err: any) {
    console.error("[asr-eval] FATAL", err);
    return json(500, {
      error: "ASR internal error",
      details: String(err?.message ?? err),
      stack: String(err?.stack ?? "").slice(0, 1200),
    });
  }
});

function normalize(input: string): string {
  let s = input.toLowerCase();
  s = s.replace(/ß/g, "ss");
  s = s.replace(/[.,!?;:()"'“”„]/g, " ");
  s = s.replace(/\s+/g, " ").trim();
  const rules: Array<[RegExp, string]> = [
    [/\bwieviel\b/g, "wie viel"],
    [/\bso dass\b/g, "sodass"],
  ];
  for (const [pattern, replacement] of rules) {
    s = s.replace(pattern, replacement);
  }
  return s;
}

// Inline check:
// normalize("Wie viel kostet das?") === normalize("Wieviel kostet das?") // true

function tokenize(input: string): string[] {
  if (!input) return [];
  return input.split(" ").filter(Boolean);
}

function diffTokens(target: string[], spoken: string[]) {
  const len = Math.max(target.length, spoken.length);
  const tokens: Array<{ token: string; status: "ok" | "wrong" | "missing" }> =
    [];
  let matchCount = 0;
  for (let i = 0; i < len; i++) {
    const t = target[i];
    const s = spoken[i];
    if (t === undefined) continue;
    if (s && s === t) {
      tokens.push({ token: t, status: "ok" });
      matchCount += 1;
    } else if (s) {
      tokens.push({ token: t, status: "wrong" });
    } else {
      tokens.push({ token: t, status: "missing" });
    }
  }
  const score = target.length > 0 ? matchCount / target.length : 0;
  return { score, tokens };
}
