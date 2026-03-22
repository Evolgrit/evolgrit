import AsyncStorage from "@react-native-async-storage/async-storage";

export type NextActionType = "resume_lesson" | "job_drill" | "speak_drill";

export type NextAction = {
  type: NextActionType;
  title: string;
  subtitle: string;
  cta: string;
  route: string;
  durationMin: 3;
  accent: "blue" | "indigo" | "green" | "gray";
};

const KEY_LAST_JOB = "na:lastJobFocus";
const KEY_LAST_RESUME = "na:lastResumeLesson";
const KEY_LAST_SHOWN = "na:lastShown";

function todayKey() {
  return new Date().toISOString().slice(0, 10);
}

function usageKey(date: string) {
  return `na:usage:${date}`;
}

export async function logNextActionShown(actionType: NextActionType): Promise<void> {
  try {
    await AsyncStorage.setItem(KEY_LAST_SHOWN, actionType);
  } catch {
    // ignore
  }
}

export async function logNextActionCompleted(actionType: NextActionType, durationMin: number): Promise<void> {
  try {
    const key = usageKey(todayKey());
    const raw = await AsyncStorage.getItem(key);
    const parsed = raw ? JSON.parse(raw) : { minutes: 0, count: 0 };
    const minutes = Number(parsed.minutes) || 0;
    const count = Number(parsed.count) || 0;
    const next = {
      minutes: minutes + Math.max(0, durationMin),
      count: count + 1,
      lastType: actionType,
    };
    await AsyncStorage.setItem(key, JSON.stringify(next));
  } catch {
    // ignore
  }
}

export async function getUsageStats(): Promise<{ todayMinutes: number; todayCount: number }> {
  try {
    const raw = await AsyncStorage.getItem(usageKey(todayKey()));
    if (!raw) return { todayMinutes: 0, todayCount: 0 };
    const parsed = JSON.parse(raw);
    const minutes = Number(parsed.minutes) || 0;
    const count = Number(parsed.count) || 0;
    return { todayMinutes: minutes, todayCount: count };
  } catch {
    return { todayMinutes: 0, todayCount: 0 };
  }
}

export async function setLastJobFocus(jobKey: string | null): Promise<void> {
  try {
    if (!jobKey) {
      await AsyncStorage.removeItem(KEY_LAST_JOB);
      return;
    }
    await AsyncStorage.setItem(KEY_LAST_JOB, jobKey);
  } catch {
    // ignore
  }
}

export async function getLastJobFocus(): Promise<string | null> {
  try {
    return (await AsyncStorage.getItem(KEY_LAST_JOB)) ?? null;
  } catch {
    return null;
  }
}

export async function setLastResumeLesson(route: string | null): Promise<void> {
  try {
    if (!route) {
      await AsyncStorage.removeItem(KEY_LAST_RESUME);
      return;
    }
    await AsyncStorage.setItem(KEY_LAST_RESUME, route);
  } catch {
    // ignore
  }
}

export async function getLastResumeLesson(): Promise<string | null> {
  try {
    return (await AsyncStorage.getItem(KEY_LAST_RESUME)) ?? null;
  } catch {
    return null;
  }
}
