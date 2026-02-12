import AsyncStorage from "@react-native-async-storage/async-storage";

const A1_SRS_KEY = "@evolgrit/srs/a1";
const DAY_MS = 24 * 60 * 60 * 1000;
const MIN_DAYS = 1;
const MAX_DAYS = 21;

export type ReviewResult = "easy" | "ok" | "hard" | "fail";

export type LessonSrsEntry = {
  lessonId: string;
  lastResult: ReviewResult;
  intervalDays: number;
  nextReviewAt: number;
  lastReviewedAt: number;
};

const clampDays = (days: number) => Math.max(MIN_DAYS, Math.min(MAX_DAYS, days));

const applyInterval = (intervalDays: number, result: ReviewResult) => {
  if (result === "fail") return MIN_DAYS;
  const multipliers: Record<Exclude<ReviewResult, "fail">, number> = {
    easy: 2.5,
    ok: 1.7,
    hard: 1.2,
  };
  return clampDays(intervalDays * multipliers[result]);
};

const readStore = async () => {
  try {
    const raw = await AsyncStorage.getItem(A1_SRS_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? (parsed as LessonSrsEntry[]) : [];
  } catch {
    return [];
  }
};

const writeStore = async (entries: LessonSrsEntry[]) => {
  try {
    await AsyncStorage.setItem(A1_SRS_KEY, JSON.stringify(entries));
  } catch {
    // ignore
  }
};

export async function recordReview(lessonId: string, result: ReviewResult) {
  const now = Date.now();
  const entries = await readStore();
  const existing = entries.find((entry) => entry.lessonId === lessonId);
  const baseInterval = existing ? existing.intervalDays : MIN_DAYS;
  const nextInterval = existing ? applyInterval(baseInterval, result) : MIN_DAYS;
  const nextReviewAt = __DEV__ ? now + 60 * 1000 : now + Math.round(nextInterval * DAY_MS);
  const nextEntry: LessonSrsEntry = {
    lessonId,
    lastResult: result,
    intervalDays: nextInterval,
    nextReviewAt,
    lastReviewedAt: now,
  };
  const updated = existing
    ? entries.map((entry) => (entry.lessonId === lessonId ? nextEntry : entry))
    : [...entries, nextEntry];
  await writeStore(updated);
}

export async function getDueLessons(now: number) {
  const entries = await readStore();
  return entries
    .filter((entry) => entry.nextReviewAt <= now)
    .sort((a, b) => a.nextReviewAt - b.nextReviewAt)
    .map((entry) => entry.lessonId);
}

export async function getNextLesson(now: number) {
  const due = await getDueLessons(now);
  return due[0] ?? null;
}
