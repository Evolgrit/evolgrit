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

function json(body: unknown, status = 200) {
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
  let text = "";
  let stage = "init";
  let azureRegion = "";
  let azureVoice = "";
  try {
    if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
    if (req.method !== "POST") return json({ error: "Use POST" }, 405);

    let body: Body;
    try {
      body = await req.json();
    } catch {
      return json({ error: "Invalid JSON" }, 400);
    }

    text = (body.text ?? "").trim();
    if (!text) return json({ error: "Missing text" }, 400);
    if (text.length > 800) return json({ error: "Text too long (max 800 chars)" }, 400);

    const locale = (body.locale ?? "de-DE").trim();
    const rate = body.rate ?? "normal";
    azureVoice = (Deno.env.get("AZURE_SPEECH_VOICE")?.trim() || "de-DE-KatjaNeural");
    const azureKey = Deno.env.get("AZURE_SPEECH_KEY")?.trim() ?? "";
    azureRegion = Deno.env.get("AZURE_SPEECH_REGION")?.trim().toLowerCase() ?? "";

    if (!azureKey || !azureRegion) {
      return json(
        {
          error: "env_missing",
          missing: { AZURE_SPEECH_KEY: !azureKey, AZURE_SPEECH_REGION: !azureRegion },
        },
        500
      );
    }

    if (!/^[a-z0-9]+$/.test(azureRegion) || azureRegion.length > 32) {
      return json({ error: "env_invalid_region", azureRegion }, 500);
    }

    const endpoint = `https://${azureRegion}.tts.speech.microsoft.com/cognitiveservices/v1`;
    const ssmlRate = rate === "slow" ? "0.8" : "1.0";
    const ssml =
      `<speak version="1.0" xml:lang="${locale}">` +
      `<voice name="${azureVoice}">` +
      `<prosody rate="${ssmlRate}">${escapeXml(text)}</prosody>` +
      `</voice></speak>`;

    stage = "azure_request";
    console.log(
      "[azure-tts] endpoint",
      endpoint,
      "regionLen",
      azureRegion.length,
      "keyLen",
      azureKey.length,
      "voice",
      azureVoice
    );
    const res = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/ssml+xml",
        "X-Microsoft-OutputFormat": "audio-16khz-32kbitrate-mono-mp3",
        "Ocp-Apim-Subscription-Key": azureKey,
        "User-Agent": "evolgrit-tts",
      },
      body: ssml,
    });

    if (!res.ok) {
      stage = "azure_response";
      const errText = await res.text().catch(() => "");
      console.error("[azure-tts] fail", {
        stage,
        status: res.status,
        region: azureRegion,
        voice: azureVoice,
        textLen: text.length,
      });
      return new Response(
        JSON.stringify({
          error: "azure-tts failed",
          stage,
          status: res.status,
          details: errText.slice(0, 300),
        }),
        { status: 502, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    stage = "success";
    const audioBytes = new Uint8Array(await res.arrayBuffer());
    const b64 = btoa(String.fromCharCode(...audioBytes));

    return json({
      ok: true,
      mime: "audio/mpeg",
      base64: b64,
      voice: azureVoice,
      locale,
      rate,
    });
  } catch (e) {
    stage = "catch";
    console.error("[azure-tts] fail", {
      stage,
      status: 500,
      region: azureRegion,
      voice: azureVoice,
      textLen: text?.length ?? 0,
    });
    return new Response(
      JSON.stringify({
        error: "azure-tts failed",
        stage,
        message: String(e?.message ?? e),
      }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
