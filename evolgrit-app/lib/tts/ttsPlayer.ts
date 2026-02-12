import * as FileSystem from "expo-file-system/legacy";
import AudioModule from "expo-audio/build/AudioModule";
import type { AudioPlayer } from "expo-audio/build/AudioModule.types";
import AsyncStorage from "@react-native-async-storage/async-storage";

let currentPlayer: AudioPlayer | null = null;
const TTS_DEBUG = __DEV__ && false;
const CACHE_VERSION = 2;
const CACHE_VERSION_KEY = "evolgrit.tts.cache_version";

async function ensureDir() {
  const dir = `${FileSystem.cacheDirectory}tts/`;
  const info = await FileSystem.getInfoAsync(dir);
  if (!info.exists) {
    await FileSystem.makeDirectoryAsync(dir, { intermediates: true });
  }
  return dir;
}

async function ensureCacheVersion() {
  try {
    const stored = await AsyncStorage.getItem(CACHE_VERSION_KEY);
    if (stored !== String(CACHE_VERSION)) {
      const dir = `${FileSystem.cacheDirectory}tts/`;
      await FileSystem.deleteAsync(dir, { idempotent: true });
      await AsyncStorage.setItem(CACHE_VERSION_KEY, String(CACHE_VERSION));
    }
  } catch {
    // ignore
  }
}

void ensureCacheVersion();

async function buildCachePath({
  text,
  rate,
  voice,
  locale,
}: {
  text: string;
  rate: string;
  voice?: string;
  locale?: string;
}) {
  const dir = await ensureDir();
  const canonical = `v${CACHE_VERSION}|${locale ?? "de-DE"}|${voice ?? "default"}|${rate}|${text.trim()}`;
  const hash = hashCanonical(canonical);
  const fileName = `tts_${hash}_${rate}.mp3`;
  return { pathMp3: `${dir}${fileName}`, fileName };
}

function hashCanonical(input: string): string {
  let h1 = 0x811c9dc5;
  let h2 = 0xc9dc5118;
  for (let i = 0; i < input.length; i++) {
    const ch = input.charCodeAt(i);
    h1 ^= ch;
    h1 = Math.imul(h1, 0x01000193);
    h2 ^= ch;
    h2 = Math.imul(h2, 0x01000197);
  }
  h1 = (h1 << 13) | (h1 >>> 19);
  h2 = (h2 << 11) | (h2 >>> 21);
  const combined = (BigInt(h1 >>> 0) << 32n) ^ BigInt(h2 >>> 0);
  return combined.toString(16).padStart(16, "0").slice(0, 16);
}

export async function playBase64Tts({
  base64,
  mime,
  text,
  rate,
  voice,
  locale,
}: {
  base64: string;
  mime: string;
  text: string;
  rate: string;
  voice?: string;
  locale?: string;
}): Promise<string> {
  if (!text || !text.trim()) {
    console.warn("[tts] missing text - skipping speak");
    return "";
  }
  if (text.toLowerCase().includes("daniel")) {
    console.warn("[tts] blocked debug phrase");
    return "";
  }
  const { pathMp3, fileName } = await buildCachePath({ text, rate, voice, locale });

  const info = await FileSystem.getInfoAsync(pathMp3);
  if (!info.exists) {
    await FileSystem.writeAsStringAsync(pathMp3, base64, { encoding: FileSystem.EncodingType.Base64 });
    const after = await FileSystem.getInfoAsync(pathMp3);
    const size = "size" in after && after.exists ? (after as any).size ?? 0 : 0;
    if (TTS_DEBUG) console.log("[tts] wrote file", fileName, "size", size);
  } else {
    const size = "size" in info && info.exists ? (info as any).size ?? 0 : 0;
    if (TTS_DEBUG) console.log("[tts] cache hit", fileName, "size", size);
  }

  // stop previous
  if (currentPlayer) {
    try {
      currentPlayer.pause();
    } catch {
      // ignore
    }
    currentPlayer = null;
  }

  const player = new AudioModule.AudioPlayer({ uri: pathMp3 }, 500, false);
  currentPlayer = player;
  if (TTS_DEBUG) console.log("[tts] play", pathMp3);
  player.play();
  return pathMp3;
}

export async function stopTts() {
  if (!currentPlayer) return;
  try {
    currentPlayer.pause();
  } catch {
    // ignore
  }
  currentPlayer = null;
}
