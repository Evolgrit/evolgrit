// @ts-nocheck
import { serve } from "https://deno.land/std@0.224.0/http/server.ts";

const corsHeaders: Record<string, string> = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

type Body = {
  text: string;
  locale?: string; // "de-DE"
  voice?: string; // "de-DE-KatjaNeural"
  rate?: "normal" | "slow";
  format?: "mp3"; // keep mp3 for now
};

function bad(msg: string, status = 400) {
  return new Response(JSON.stringify({ error: msg }), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  if (req.method !== "POST") return bad("Use POST", 405);

  let body: Body;
  try {
    body = await req.json();
  } catch {
    return bad("Invalid JSON");
  }

  const text = (body.text ?? "").trim();
  if (!text) return bad("Missing text");
  if (text.length > 800) return bad("Text too long (max 800 chars)");

  const locale = (body.locale ?? "de-DE").trim();
  const rate = body.rate ?? "normal";
  const voice = (body.voice ?? Deno.env.get("AZURE_SPEECH_VOICE") ?? "de-DE-KatjaNeural").trim();

  const azureKey = Deno.env.get("AZURE_SPEECH_KEY") ?? "";
  const azureRegion = (Deno.env.get("AZURE_SPEECH_REGION") ?? "").trim();

  if (!azureKey) return bad("Missing AZURE_SPEECH_KEY", 500);
  if (!azureRegion) return bad("Missing AZURE_SPEECH_REGION", 500);

  // Azure TTS endpoint:
  // https://{region}.tts.speech.microsoft.com/cognitiveservices/v1
  const ttsUrl = `https://${azureRegion}.tts.speech.microsoft.com/cognitiveservices/v1`;

  // SSML – slow via prosody rate
  const ssmlRate = rate === "slow" ? "0.8" : "1.0";
  const ssml =
    `<speak version="1.0" xml:lang="${locale}">` +
    `<voice name="${voice}">` +
    `<prosody rate="${ssmlRate}">${escapeXml(text)}</prosody>` +
    `</voice>` +
    `</speak>`;

  const res = await fetch(ttsUrl, {
    method: "POST",
    headers: {
      "Ocp-Apim-Subscription-Key": azureKey,
      "Content-Type": "application/ssml+xml",
      "X-Microsoft-OutputFormat": "audio-16khz-32kbitrate-mono-mp3",
      "User-Agent": "evolgrit-supabase-tts",
    },
    body: ssml,
  });

  if (!res.ok) {
    const errText = await res.text().catch(() => "");
    return bad(`Azure TTS failed: ${res.status} ${errText}`, 502);
  }

  const audioBytes = new Uint8Array(await res.arrayBuffer());
  const b64 = btoa(String.fromCharCode(...audioBytes));

  return new Response(
    JSON.stringify({
      ok: true,
      mime: "audio/mpeg",
      base64: b64,
      voice,
      locale,
      rate,
    }),
    { headers: { ...corsHeaders, "Content-Type": "application/json" } },
  );
});

function escapeXml(s: string) {
  return s
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&apos;");
}
