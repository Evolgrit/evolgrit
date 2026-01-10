import { serve } from "https://deno.land/std@0.224.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.2";

const corsHeaders: Record<string, string> = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

function bad(msg: string, status = 400) {
  return new Response(JSON.stringify({ error: msg }), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}

type Body = {
  audioPath?: string;
  audioUrl?: string;
  bucket?: string;
  targetText?: string;
  locale?: string;
};

const supabaseUrl = Deno.env.get("SUPABASE_URL") ?? "";
const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "";

const supabase = supabaseUrl && serviceKey
  ? createClient(supabaseUrl, serviceKey)
  : null;

const azureKey = Deno.env.get("AZURE_SPEECH_KEY") ?? "";
const azureRegion = (Deno.env.get("AZURE_SPEECH_REGION") ?? "").trim();

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }
  if (req.method !== "POST") return bad("Use POST", 405);

  if (!supabase) return bad("Supabase not configured", 500);
  if (!azureKey || !azureRegion) return bad("Azure Speech not configured", 500);

  let body: Body;
  try {
    body = await req.json();
  } catch {
    return bad("Invalid JSON");
  }

  const audioPath = body.audioPath?.trim();
  const audioUrl = body.audioUrl?.trim();
  const bucket = (body.bucket ?? "asr-audio").trim();
  const targetText = (body.targetText ?? "").trim();
  const locale = (body.locale ?? "de-DE").trim();

  if (!audioPath && !audioUrl) return bad("Missing audioUrl or audioPath");
  if (!targetText) return bad("Missing targetText");

  let signedUrl = audioUrl;

  if (!signedUrl) {
    const signed = await supabase.storage.from(bucket).createSignedUrl(
      audioPath!,
      120,
    );
    if (signed.error || !signed.data?.signedUrl) {
      return bad(
        `Download sign failed: ${signed.error?.message ?? "unknown"}`,
        500,
      );
    }
    signedUrl = signed.data.signedUrl;
  }

  const dlRes = await fetch(signedUrl);
  if (!dlRes.ok) {
    return bad(
      `Download fetch failed: ${dlRes.status} ${await dlRes.text().catch(() =>
        "")}`,
      400,
    );
  }
  const contentType = dlRes.headers.get("content-type") ?? "unknown";
  const audioBuf = await dlRes.arrayBuffer();
  const byteLen = audioBuf.byteLength;

  console.log("[asr-eval] download ok", {
    status: dlRes.status,
    contentType,
    bytes: byteLen,
  });

  if (!byteLen) {
    return bad("Downloaded 0 bytes", 400);
  }

  if (contentType.includes("application/json")) {
    return bad("Downloaded JSON instead of audio", 400);
  }

  // Azure Speech-to-Text REST
  const sttUrl =
    `https://${azureRegion}.stt.speech.microsoft.com/speech/recognition/conversation/cognitiveservices/v1?language=${locale}`;

  const sttRes = await fetch(sttUrl, {
    method: "POST",
    headers: {
      "Ocp-Apim-Subscription-Key": azureKey,
      "Content-Type": "audio/wav; codecs=audio/pcm; samplerate=16000",
      "Accept": "application/json;text/xml",
    },
    body: audioBuf,
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

  const normTarget = normalize(targetText);
  const normTranscript = normalize(transcript);
  const targetTokens = tokenize(normTarget);
  const spokenTokens = tokenize(normTranscript);

  const { score, tokens } = diffTokens(targetTokens, spokenTokens);

  return new Response(
    JSON.stringify({ transcript, score, tokens }),
    { headers: { ...corsHeaders, "Content-Type": "application/json" } },
  );
});

function normalize(input: string): string {
  return input
    .toLowerCase()
    .replace(/[.,!?;:()"“”„]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

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
