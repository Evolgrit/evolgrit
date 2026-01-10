import * as FileSystem from "expo-file-system/legacy";
import { supabase } from "./supabaseClient";
import { uuid } from "./uuid";
import { Alert } from "react-native";

export type AsrTokenStatus = "ok" | "wrong" | "missing";

export type AsrResult = {
  transcript: string;
  score: number;
  tokens: Array<{ token: string; status: AsrTokenStatus }>;
};

export async function evaluateRecording({
  fileUri,
  targetText,
  locale = "de-DE",
}: {
  fileUri: string;
  targetText: string;
  locale?: string;
}): Promise<AsrResult> {
  if (!supabase) throw new Error("Supabase client missing");

  const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

  const bucket = "asr-audio";
  const uid = "local-user";
  const recordingId = uuid();
  const audioPath = `users/${uid}/recordings/${recordingId}.wav`;

  // Ensure the source file is non-empty (retry a few times)
  let info: any = await FileSystem.getInfoAsync(fileUri);
  console.log("[asr] local file info initial", info);
  const infoSize = info?.size ?? 0;
  if (!info.exists) {
    Alert.alert("Aufnahme fehlgeschlagen", "Datei wurde nicht gefunden.");
    throw new Error("Recording file missing");
  }

  let retries = 8;
  while ((info?.size ?? 0) === 0 && retries > 0) {
    await sleep(250);
    info = await FileSystem.getInfoAsync(fileUri);
    retries -= 1;
  }

  if (!info?.size || info.size === 0) {
    Alert.alert("Aufnahme fehlgeschlagen", "Die Aufnahme ist 0 Bytes. Bitte erneut aufnehmen.");
    throw new Error("Recording file is empty (0 bytes)");
  }

  const cacheDir = (FileSystem as any).cacheDirectory ?? "";
  const stableDir = `${cacheDir}asr/`;
  await FileSystem.makeDirectoryAsync(stableDir, { intermediates: true }).catch(
    () => {},
  );
  const stableUri = `${stableDir}${Date.now()}.wav`;
  await FileSystem.copyAsync({ from: fileUri, to: stableUri });

  const stableInfo: any = await FileSystem.getInfoAsync(stableUri);
  console.log("[asr] stable file info", stableInfo);
  if (!stableInfo.exists || !stableInfo?.size || stableInfo.size === 0) {
    Alert.alert("Aufnahme fehlgeschlagen", "Die Aufnahme ist 0 Bytes. Bitte erneut aufnehmen.");
    throw new Error("Local recording is 0 bytes after copy");
  }

  const b64 = await FileSystem.readAsStringAsync(stableUri, {
    encoding: "base64",
  });
  if (!b64 || b64.length < 100) {
    Alert.alert("Aufnahme fehlgeschlagen", "Audio konnte nicht gelesen werden.");
    throw new Error("Base64 read failed or too short");
  }
  const bytes = Uint8Array.from(atob(b64), (c) => c.charCodeAt(0));
  if (bytes.length < 1000) {
    Alert.alert("Aufnahme fehlgeschlagen", "Audio ist zu kurz oder leer.");
    throw new Error("Decoded bytes too short");
  }

  console.log("[asr] upload", {
    bucket,
    audioPath,
    contentType: "audio/wav",
    upsert: false,
    sizeOriginal: info?.size ?? infoSize ?? 0,
    sizeStable: stableInfo?.size ?? 0,
    base64Len: b64.length,
    bytesLen: bytes.length,
  });
  const upload = await supabase.storage.from(bucket).upload(
    audioPath,
    bytes,
    {
      contentType: "audio/wav",
      upsert: false,
    },
  );
  if (upload.error) {
    console.error("[asr] upload error", upload.error);
    throw new Error(upload.error.message);
  }

  const signed = await supabase.storage
    .from(bucket)
    .createSignedUrl(audioPath, 60);
  if (signed.error || !signed.data?.signedUrl) {
    console.error("[asr] signed url error", signed.error);
    throw new Error(signed.error?.message ?? "Signed URL failed");
  }

  const audioUrl = signed.data.signedUrl;

  const invokeBody = { audioUrl, targetText, locale };
  console.log("[asr] eval request", invokeBody);
  const { data, error } = await supabase.functions.invoke("asr-eval", {
    body: invokeBody,
  });
  if (error) {
    console.error("[asr] invoke error raw", JSON.stringify(error, null, 2));
    const status = (error as any)?.status ?? "unknown";
    const details = (error as any)?.details ?? "";
    throw new Error(
      `ASR failed: status=${status} message=${error.message ?? ""} details=${details}`
    );
  }

  return {
    transcript: data?.transcript ?? "",
    score: typeof data?.score === "number" ? data.score : 0,
    tokens: Array.isArray(data?.tokens) ? data.tokens : [],
  };
}
