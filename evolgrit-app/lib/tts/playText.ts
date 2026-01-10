import { Alert } from "react-native";
import { getTtsBase64 } from "./azureTtsClient";
import { playBase64Tts } from "./ttsPlayer";

export async function playTtsText(text: string, rate: "normal" | "slow" = "normal") {
  try {
    const clean = sanitizeText(text);

    if (!clean) {
      console.warn("[tts] missing text");
      return;
    }

    const res = await getTtsBase64({ text: clean, rate });
    await playBase64Tts({ base64: res.base64, mime: res.mime, text: clean, rate, voice: res.voice, locale: res.locale });
  } catch (err: any) {
    console.error("[tts] play failed", err);
    Alert.alert("Audio", "Audio konnte nicht geladen werden.");
  }
}

function sanitizeText(input: string) {
  const trimmed = input.trim();
  const strippedPrefix = trimmed.replace(/^(Say:|Sag:)\s*/i, "");
  const strippedQuotes = strippedPrefix.replace(/^["“‚‘]+|["”‚‘]+$/g, "");
  return strippedQuotes.trim();
}
