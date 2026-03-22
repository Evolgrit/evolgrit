import * as FileSystem from "expo-file-system/legacy";
import { supabase } from "../supabaseClient";
import { LEXICON_KEYS, normalizeKey } from "./objectLexicon";
import { SNAP_OBJECTS } from "./generateCard";

export type RecognizeResult = {
  labels: { key: string; confidence: number }[];
};

const GENERIC_TAGS = new Set([
  "indoor",
  "outdoor",
  "sky",
  "building",
  "landscape",
  "scenery",
  "cloud",
  "clouds",
  "nature",
  "road",
  "street",
  "tree",
  "trees",
  "floor",
  "wall",
  "room",
  "person",
  "people",
  "clothing",
]);

function isUsefulTag(key: string) {
  if (!key) return false;
  if (GENERIC_TAGS.has(key)) return false;
  return LEXICON_KEYS.includes(key);
}

function toBase64(uri: string) {
  return FileSystem.readAsStringAsync(uri, { encoding: "base64" });
}

export async function recognizeObject(
  imageUri: string
): Promise<RecognizeResult> {
  if (!supabase) throw new Error("Supabase client missing");
  const base64 = await toBase64(imageUri);
  const payload = {
    imageBase64: base64,
  };
  const { data, error } = await supabase.functions.invoke("snap-recognize", {
    body: payload,
  });
  if (error) throw new Error(error.message ?? "snap-recognize failed");
  const labels = Array.isArray(data?.suggestions) ? data.suggestions : [];
  const cleaned = labels
    .filter((l: any) => l && typeof l.key === "string")
    .map((l: any) => ({
      key: normalizeKey(l.key),
      confidence: Number(l.confidence ?? 0),
    }))
    .filter((l: any) => isUsefulTag(l.key));

  const seen = new Set<string>();
  const unique = cleaned.filter((l) => {
    if (seen.has(l.key)) return false;
    seen.add(l.key);
    return true;
  });

  const fallback = SNAP_OBJECTS.length ? SNAP_OBJECTS : ["phone", "key", "cup", "table", "chair"];
  while (unique.length < 5) {
    const next = fallback[unique.length % fallback.length];
    if (!seen.has(next)) {
      seen.add(next);
      unique.push({ key: next, confidence: 0 });
    } else if (seen.size >= fallback.length) {
      break;
    }
  }

  return { labels: unique };
}
