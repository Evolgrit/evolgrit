import AsyncStorage from "@react-native-async-storage/async-storage";

export type Mood = "calm" | "stressed" | "no_time";
export type MoodMap = Record<string, Mood>; // key: YYYY-MM-DD

const KEY = "evolgrit.moods.v1";

function pad(n: number) {
  return String(n).padStart(2, "0");
}

export function todayKey(): string {
  const d = new Date();
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

export async function getAllMoods(): Promise<MoodMap> {
  const raw = await AsyncStorage.getItem(KEY);
  if (!raw) return {};
  try {
    return JSON.parse(raw) as MoodMap;
  } catch {
    return {};
  }
}

export async function getMoodForDate(dateISO: string): Promise<Mood | null> {
  const map = await getAllMoods();
  return map[dateISO] ?? null;
}

export async function setMoodForDate(dateISO: string, mood: Mood): Promise<void> {
  const map = await getAllMoods();
  map[dateISO] = mood;
  await AsyncStorage.setItem(KEY, JSON.stringify(map));
}

export async function setMoodToday(mood: Mood): Promise<void> {
  await setMoodForDate(todayKey(), mood);
}
