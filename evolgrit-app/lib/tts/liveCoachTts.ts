import * as FileSystem from "expo-file-system/legacy";
import { createAudioPlayer, setAudioModeAsync, type AudioPlayer } from "expo-audio";
import { supabase } from "../supabaseClient";
import AsyncStorage from "@react-native-async-storage/async-storage";

type Rate = "normal" | "slow";

type TtsResponse = {
  base64?: string;
  mime?: string;
  voice?: string;
  rate?: Rate;
  locale?: string;
};

let currentPlayer: AudioPlayer | null = null;
let currentSub: { remove: () => void } | null = null;
const CACHE_VERSION = 2;
const CACHE_VERSION_KEY = "evolgrit.tts.live.cache_version";

async function ensureDir() {
  const dir = `${FileSystem.cacheDirectory}live_tts/`;
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
      const dir = `${FileSystem.cacheDirectory}live_tts/`;
      await FileSystem.deleteAsync(dir, { idempotent: true });
      await AsyncStorage.setItem(CACHE_VERSION_KEY, String(CACHE_VERSION));
    }
  } catch {
    // ignore
  }
}

void ensureCacheVersion();

function toUtf8Bytes(str: string) {
  const utf8 = unescape(encodeURIComponent(str));
  const bytes = new Array(utf8.length);
  for (let i = 0; i < utf8.length; i++) {
    bytes[i] = utf8.charCodeAt(i);
  }
  return bytes;
}

function sha1(input: string) {
  const bytes = toUtf8Bytes(input);
  const words: number[] = [];
  for (let i = 0; i < bytes.length; i++) {
    words[i >> 2] |= bytes[i] << (24 - (i % 4) * 8);
  }
  const bitLength = bytes.length * 8;
  words[bitLength >> 5] |= 0x80 << (24 - (bitLength % 32));
  words[((bitLength + 64 >> 9) << 4) + 15] = bitLength;

  const w = new Array(80);
  let a = 0x67452301;
  let b = 0xefcdab89;
  let c = 0x98badcfe;
  let d = 0x10325476;
  let e = 0xc3d2e1f0;

  for (let i = 0; i < words.length; i += 16) {
    const oldA = a;
    const oldB = b;
    const oldC = c;
    const oldD = d;
    const oldE = e;

    for (let j = 0; j < 80; j++) {
      if (j < 16) {
        w[j] = words[i + j] | 0;
      } else {
        const t = w[j - 3] ^ w[j - 8] ^ w[j - 14] ^ w[j - 16];
        w[j] = (t << 1) | (t >>> 31);
      }
      let f = 0;
      let k = 0;
      if (j < 20) {
        f = (b & c) | (~b & d);
        k = 0x5a827999;
      } else if (j < 40) {
        f = b ^ c ^ d;
        k = 0x6ed9eba1;
      } else if (j < 60) {
        f = (b & c) | (b & d) | (c & d);
        k = 0x8f1bbcdc;
      } else {
        f = b ^ c ^ d;
        k = 0xca62c1d6;
      }
      const temp = (((a << 5) | (a >>> 27)) + f + e + k + w[j]) | 0;
      e = d;
      d = c;
      c = (b << 30) | (b >>> 2);
      b = a;
      a = temp;
    }

    a = (a + oldA) | 0;
    b = (b + oldB) | 0;
    c = (c + oldC) | 0;
    d = (d + oldD) | 0;
    e = (e + oldE) | 0;
  }

  const toHex = (n: number) => (n >>> 0).toString(16).padStart(8, "0");
  return `${toHex(a)}${toHex(b)}${toHex(c)}${toHex(d)}${toHex(e)}`;
}

export async function getTtsAudio({
  text,
  voice,
  rate = "normal",
}: {
  text: string;
  voice: string;
  rate?: Rate;
}) {
  await ensureCacheVersion();
  const dir = await ensureDir();
  const key = sha1(`v${CACHE_VERSION}|de-DE|${voice}|${rate}|${text}`);
  const uri = `${dir}${key}.mp3`;
  const info = await FileSystem.getInfoAsync(uri);
  const size = "size" in info && info.exists ? (info as any).size ?? 0 : 0;
  if (info.exists && size > 0) return uri;

  if (!supabase) {
    throw new Error("[live-tts] supabase missing");
  }

  const { data, error } = await supabase.functions.invoke("azure-tts", {
    body: { text, rate, voice, locale: "de-DE" },
  });

  if (error) {
    throw error;
  }

  const payload = data as TtsResponse;
  if (!payload?.base64) {
    throw new Error("[live-tts] missing base64");
  }

  await FileSystem.writeAsStringAsync(uri, payload.base64, {
    encoding: FileSystem.EncodingType.Base64,
  });
  return uri;
}

async function stopCurrent() {
  if (currentSub) {
    try {
      currentSub.remove();
    } catch {}
    currentSub = null;
  }
  if (currentPlayer) {
    try {
      currentPlayer.pause();
    } catch {}
    try {
      currentPlayer.remove?.();
    } catch {}
    currentPlayer = null;
  }
}

export async function stopCoachTts() {
  await stopCurrent();
}

export async function playCoachTts(
  text: string,
  opts: { voice: string; rate?: Rate }
) {
  if (!text || !text.trim()) {
    console.warn("[tts] missing text - skipping speak");
    return;
  }
  if (text.toLowerCase().includes("daniel")) {
    console.warn("[tts] blocked debug phrase");
    return;
  }
  const uri = await getTtsAudio({ text, voice: opts.voice, rate: opts.rate ?? "normal" });

  await stopCurrent();

  await setAudioModeAsync({
    playsInSilentMode: true,
    allowsRecording: false,
    shouldPlayInBackground: false,
    shouldRouteThroughEarpiece: false,
    interruptionMode: "mixWithOthers",
  });

  const player = createAudioPlayer(null, { updateInterval: 250, downloadFirst: true });
  currentPlayer = player;

  return new Promise<void>((resolve) => {
    const timeout = setTimeout(() => {
      resolve();
      void stopCurrent();
    }, 30000);

    const sub = player.addListener?.("playbackStatusUpdate", (status: any) => {
      if (status?.didJustFinish) {
        clearTimeout(timeout);
        resolve();
        void stopCurrent();
      }
    });
    currentSub = sub ?? null;

    player.replace({ uri });
    player.play();
  });
}
