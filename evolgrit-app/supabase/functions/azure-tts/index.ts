// deno-lint-ignore-file
// @ts-nocheck
import { serve } from "https://deno.land/std@0.224.0/http/server.ts";

const corsHeaders: Record<string, string> = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

type Body = {
  text: string;
  locale?: string;
  voice?: string;
  rate?: "normal" | "slow";
};

function json(status: number, body: unknown) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}

function escapeXml(s: string) {
  return s
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&apos;");
}

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  if (req.method !== "POST") return json(405, { error: "Use POST" });

  let body: Body;
  try {
    body = await req.json();
  } catch {
    return json(400, { error: "Invalid JSON" });
  }

  const text = (body.text ?? "").trim();
  if (!text) return json(400, { error: "Missing text" });
  if (text.length > 800) return json(400, { error: "Text too long (max 800 chars)" });

  const locale = (body.locale ?? "de-DE").trim();
  const rate = body.rate ?? "normal";
  const voice =
    (body.voice ?? Deno.env.get("AZURE_SPEECH_VOICE") ?? "de-DE-KatjaNeural").trim();

  const azureKey = Deno.env.get("AZURE_SPEECH_KEY") ?? "";
  const azureRegion = (Deno.env.get("AZURE_SPEECH_REGION") ?? "").trim();

  if (!azureKey) return json(500, { error: "Missing AZURE_SPEECH_KEY" });
  if (!azureRegion) return json(500, { error: "Missing AZURE_SPEECH_REGION" });

  const ttsUrl = `https://${azureRegion}.tts.speech.microsoft.com/cognitiveservices/v1`;
  const ssmlRate = rate === "slow" ? "0.8" : "1.0";
  const ssml =
    `<speak version="1.0" xml:lang="${locale}">` +
    `<voice name="${voice}">` +
    `<prosody rate="${ssmlRate}">${escapeXml(text)}</prosody>` +
    `</voice></speak>`;

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
    return json(502, { error: `Azure TTS failed: ${res.status} ${errText}` });
  }

  const audioBytes = new Uint8Array(await res.arrayBuffer());
  const b64 = btoa(String.fromCharCode(...audioBytes));

  return json(200, {
    ok: true,
    mime: "audio/mpeg",
    base64: b64,
    voice,
    locale,
    rate,
  });
});
