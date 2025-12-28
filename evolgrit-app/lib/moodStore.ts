import AsyncStorage from "@react-native-async-storage/async-storage";

export type Mood = "calm" | "stressed" | "no_time";

const KEY = "evolgrit.moodsByDay";

type Store = Record<string, Mood>; // yyyy-mm-dd -> mood

export function dayKey(d: Date) {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

export async function loadMoods(): Promise<Store> {
  const raw = await AsyncStorage.getItem(KEY);
  return raw ? JSON.parse(raw) : {};
}

export async function saveMood(date: Date, mood: Mood) {
  const all = await loadMoods();
  all[dayKey(date)] = mood;
  await AsyncStorage.setItem(KEY, JSON.stringify(all));
  return all;
}

export async function getMood(date: Date): Promise<Mood | null> {
  const all = await loadMoods();
  return all[dayKey(date)] ?? null;
}
