import * as FileSystem from "expo-file-system/legacy";
import { supabase } from "./supabaseClient";
import { uuid } from "./uuid";

type UploadResult = {
  storagePath: string;
  signedUrl: string;
  mimeType: string;
  sizeBytes: number;
};

export async function uploadChatAudio({
  threadId,
  messageId,
  localUri,
}: {
  threadId: string;
  messageId: string;
  localUri: string;
}): Promise<UploadResult> {
  if (!supabase) {
    console.error("[chatAudio] supabase missing");
    throw new Error("Supabase client not configured");
  }

  const { data: auth, error: authErr } = await supabase.auth.getUser();
  if (authErr) {
    console.error("[chatAudio] auth error", authErr);
    throw authErr;
  }
  const uid = auth.user?.id;
  if (!uid) {
    console.error("[chatAudio] NOT_AUTHENTICATED");
    throw new Error("NOT_AUTHENTICATED");
  }

  const info = await FileSystem.getInfoAsync(localUri);
  if (!info.exists) throw new Error("Datei nicht gefunden");
  if ((info.size ?? 0) <= 0) throw new Error("Leere Datei (size=0)");

  const mimeType = "audio/m4a";
  const storagePath = `users/${uid}/threads/${threadId}/messages/${messageId}/${uuid()}.m4a`;

  console.log("[chatAudio] upload start", {
    uid,
    storagePath,
    bucket: "chat-media",
    mimeType,
    size: info.size,
  });

  const res = await fetch(localUri);
  const arrayBuffer = await res.arrayBuffer();

  const { error: uploadErr } = await supabase.storage
    .from("chat-media")
    .upload(storagePath, arrayBuffer, { contentType: mimeType, upsert: true });

  if (uploadErr) {
    console.error("[chatAudio] upload error", { uid, storagePath, uploadErr });
    throw uploadErr;
  }

  const { data: signedData, error: signedErr } = await supabase.storage
    .from("chat-media")
    .createSignedUrl(storagePath, 600);

  if (signedErr || !signedData?.signedUrl) {
    console.error("[chatAudio] signed url error", { uid, storagePath, signedErr });
    throw signedErr ?? new Error("signed url missing");
  }

  return {
    storagePath,
    signedUrl: signedData.signedUrl,
    mimeType,
    sizeBytes: info.size ?? 0,
  };
}
