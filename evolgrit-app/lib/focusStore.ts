import AsyncStorage from "@react-native-async-storage/async-storage";

export type FocusVoiceId = "katja" | "amala";

const VOICE_KEY = "evolgrit.focus.voice";
const MINUTES_KEY = "evolgrit.focus.minutes_today";
const DATE_KEY = "evolgrit.focus.last_date";

function todayKey() {
  return new Date().toISOString().slice(0, 10);
}

export async function getFocusVoice(): Promise<FocusVoiceId> {
  const raw = await AsyncStorage.getItem(VOICE_KEY);
  if (raw === "amala" || raw === "katja") return raw;
  return "katja";
}

export async function setFocusVoice(voiceId: FocusVoiceId) {
  await AsyncStorage.setItem(VOICE_KEY, voiceId);
}

export async function getFocusMinutesToday(): Promise<number> {
  const today = todayKey();
  const storedDate = await AsyncStorage.getItem(DATE_KEY);
  if (storedDate !== today) {
    await AsyncStorage.setItem(DATE_KEY, today);
    await AsyncStorage.setItem(MINUTES_KEY, "0");
    return 0;
  }
  const raw = await AsyncStorage.getItem(MINUTES_KEY);
  const val = raw ? Number(raw) : 0;
  return Number.isFinite(val) ? val : 0;
}

export async function addFocusMinutes(durationSec: number): Promise<number> {
  const today = todayKey();
  const storedDate = await AsyncStorage.getItem(DATE_KEY);
  if (storedDate !== today) {
    await AsyncStorage.setItem(DATE_KEY, today);
    await AsyncStorage.setItem(MINUTES_KEY, "0");
  }
  const raw = await AsyncStorage.getItem(MINUTES_KEY);
  const current = raw ? Number(raw) : 0;
  const next = Math.max(0, (Number.isFinite(current) ? current : 0)) + Math.max(0, Math.round(durationSec / 60));
  await AsyncStorage.setItem(MINUTES_KEY, String(next));
  return next;
}
