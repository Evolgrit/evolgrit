import * as FileSystem from "expo-file-system/legacy";
import { supabase } from "./supabaseClient";
import { uuid } from "./uuid";

type UploadResult = {
  storagePath: string;
  signedUrl: string;
  mimeType: string;
  sizeBytes: number;
};

function extFromUri(uri: string) {
  const match = uri.split(".").pop();
  if (!match) return "jpg";
  const clean = match.split("?")[0];
  if (clean.length > 4) return "jpg";
  return clean.toLowerCase();
}

function guessMime(uri: string) {
  const ext = extFromUri(uri);
  if (ext === "png") return "image/png";
  if (ext === "heic") return "image/heic";
  return "image/jpeg";
}

async function normalizeUri(uri: string) {
  if (uri.startsWith("ph://")) {
    const target = `${FileSystem.cacheDirectory ?? ""}${uuid()}.jpg`;
    await FileSystem.copyAsync({ from: uri, to: target });
    return target;
  }
  return uri;
}

async function toBlob(uri: string) {
  const res = await fetch(uri);
  const blob = await res.blob();
  return blob;
}

/**
 * Uploads chat image to private bucket chat-media and returns signed URL.
 */
export async function uploadChatImage({
  threadId,
  messageId,
  localUri,
}: {
  threadId: string;
  messageId: string;
  localUri: string;
}): Promise<UploadResult> {
  if (!supabase) {
    console.error("[chatMedia] supabase missing");
    throw new Error("Supabase client not configured");
  }

  const { data: auth, error: authErr } = await supabase.auth.getUser();
  if (authErr) {
    console.error("[chatMedia] auth error", authErr);
    throw authErr;
  }
  const uid = auth.user?.id;
  if (!uid) {
    console.error("[chatMedia] NOT_AUTHENTICATED");
    throw new Error("NOT_AUTHENTICATED");
  }

  const fileUri = await normalizeUri(localUri);
  const info = await FileSystem.getInfoAsync(fileUri);
  if (!info.exists) throw new Error("Datei nicht gefunden");
  if ((info.size ?? 0) <= 0) throw new Error("Leere Datei (size=0)");

  const ext = extFromUri(fileUri);
  const mimeType = guessMime(fileUri);
  const fileName = `${uuid()}.${ext}`;
  const storagePath = `users/${uid}/threads/${threadId}/messages/${messageId}/${fileName}`;

  console.log("[chatMedia] upload start", { uid, storagePath, bucket: "chat-media", mimeType, size: info.size });

  const res = await fetch(fileUri);
  const arrayBuffer = await res.arrayBuffer();

  const { error: uploadErr } = await supabase.storage
    .from("chat-media")
    .upload(storagePath, arrayBuffer, { contentType: mimeType, upsert: true });

  if (uploadErr) {
    console.error("[chatMedia] upload error", { uid, storagePath, uploadErr });
    throw uploadErr;
  }

  const { data: signedData, error: signedErr } = await supabase.storage
    .from("chat-media")
    .createSignedUrl(storagePath, 600);

  if (signedErr || !signedData?.signedUrl) {
    console.error("[chatMedia] signed url error", { uid, storagePath, signedErr });
    throw signedErr ?? new Error("signed url missing");
  }

  return {
    storagePath,
    signedUrl: signedData.signedUrl,
    mimeType,
    sizeBytes: info.size ?? 0,
  };
}
