// deno-lint-ignore-file no-explicit-any
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.6";

const SUPABASE_URL = Deno.env.get("SUPABASE_URL");
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
const BUCKET = "tts-audio";

const AZURE_KEY = Deno.env.get("AZURE_SPEECH_KEY");
const AZURE_REGION = Deno.env.get("AZURE_SPEECH_REGION") ?? "westeurope";
const DEFAULT_VOICE = Deno.env.get("AZURE_SPEECH_VOICE") ?? "de-DE-KatjaNeural";

if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
  throw new Error("Missing Supabase env vars");
}

if (!AZURE_KEY || !AZURE_REGION) {
  console.warn("Azure TTS env vars missing; function will fail without them.");
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

type Style = "normal" | "slow";

type Payload = {
  line_id: string;
  text: string;
  style?: Style;
  voice?: string;
};

const ALLOWED_STYLES: Style[] = ["normal", "slow"];

serve(async (req: Request) => {
  try {
    if (req.method !== "POST") {
      return json({ error: "POST only" }, 405);
    }

    const body = (await req.json()) as Payload;
    const lineId = body?.line_id?.trim();
    const text = body?.text?.trim();
    const style: Style = ALLOWED_STYLES.includes(body?.style as Style) ? (body.style as Style) : "normal";
    const voice = body?.voice || DEFAULT_VOICE;

    if (!lineId || !text) return json({ error: "line_id and text are required" }, 400);
    if (text.length > 300) return json({ error: "text too long" }, 400);
    if (!AZURE_KEY || !AZURE_REGION) return json({ error: "Azure TTS not configured" }, 500);

    // 1) check cache
    const { data: existing, error: existingErr } = await supabase
      .from("tts_audio_assets")
      .select("url")
      .eq("line_id", lineId)
      .eq("style", style)
      .maybeSingle();
    if (!existingErr && existing?.url) {
      return json({ url: existing.url });
    }

    // 2) Azure token
    const token = await fetchAzureToken(AZURE_KEY, AZURE_REGION);
    if (!token) return json({ error: "Failed to get Azure token" }, 500);

    // 3) synthesize
    const audio = await synthesizeAzure({
      token,
      region: AZURE_REGION,
      voice,
      text,
      style,
    });
    if (!audio) return json({ error: "TTS synthesis failed" }, 500);

    // 4) upload
    const path = `de/${lineId}/${style}.mp3`;
    const { error: uploadErr } = await supabase.storage.from(BUCKET).upload(path, audio, {
      contentType: "audio/mpeg",
      upsert: true,
    });
    if (uploadErr) return json({ error: uploadErr.message }, 500);

    const { data: pub } = supabase.storage.from(BUCKET).getPublicUrl(path);
    const url = pub.publicUrl;

    // 5) cache row
    const { error: upsertErr } = await supabase.from("tts_audio_assets").upsert(
      {
        line_id: lineId,
        style,
        url,
        voice,
        provider: "azure",
      },
      { onConflict: "line_id,style" }
    );
    if (upsertErr) return json({ error: upsertErr.message }, 500);

    return json({ url });
  } catch (err: any) {
    return json({ error: err?.message ?? "Unexpected error" }, 500);
  }
});

async function fetchAzureToken(key: string, region: string): Promise<string | null> {
  const resp = await fetch(`https://${region}.api.cognitive.microsoft.com/sts/v1.0/issueToken`, {
    method: "POST",
    headers: {
      "Ocp-Apim-Subscription-Key": key,
      "Content-Type": "application/x-www-form-urlencoded",
    },
  });
  if (!resp.ok) return null;
  return await resp.text();
}

async function synthesizeAzure(opts: {
  token: string;
  region: string;
  voice: string;
  text: string;
  style: Style;
}): Promise<ArrayBuffer | null> {
  const rate = opts.style === "slow" ? "0.88" : "1.0";
  const ssml = `
  <speak version="1.0" xml:lang="de-DE">
    <voice name="${opts.voice}">
      <prosody rate="${rate}">
        ${escapeXml(opts.text)}
      </prosody>
    </voice>
  </speak>`;

  const resp = await fetch(`https://${opts.region}.tts.speech.microsoft.com/cognitiveservices/v1`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${opts.token}`,
      "Content-Type": "application/ssml+xml",
      "X-Microsoft-OutputFormat": "audio-16khz-32kbitrate-mono-mp3",
      "User-Agent": "evolgrit-tts-edge",
    },
    body: ssml,
  });
  if (!resp.ok) {
    const errText = await resp.text();
    console.error("Azure TTS error", resp.status, errText);
    return null;
  }
  return await resp.arrayBuffer();
}

function escapeXml(s: string) {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

function json(body: Record<string, unknown>, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}
