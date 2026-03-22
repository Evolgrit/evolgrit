import AsyncStorage from "@react-native-async-storage/async-storage";

export type ReviewItem = {
  id: string;
  level: "A1";
  prompt: string;
  answer: string;
  nextDueAt: number;
  intervalDays: number;
  ease: number;
  reps: number;
};

const STORAGE_KEY = "reviews:A1";
const DAY_MS = 24 * 60 * 60 * 1000;

const readItems = async () => {
  try {
    const raw = await AsyncStorage.getItem(STORAGE_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? (parsed as ReviewItem[]) : [];
  } catch {
    return [];
  }
};

const writeItems = async (items: ReviewItem[]) => {
  try {
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  } catch {
    // ignore
  }
};

export async function enqueueReviewItems(items: ReviewItem[]) {
  const existing = await readItems();
  const map = new Map(existing.map((item) => [item.id, item]));
  items.forEach((item) => {
    map.set(item.id, item);
  });
  await writeItems(Array.from(map.values()));
}

export async function getDueReviews(level: "A1", limit = 10) {
  const now = Date.now();
  const items = await readItems();
  return items
    .filter((item) => item.level === level && item.nextDueAt <= now)
    .sort((a, b) => a.nextDueAt - b.nextDueAt)
    .slice(0, limit);
}

export async function gradeReview(id: string, quality: 0 | 1 | 2 | 3 | 4 | 5) {
  const now = Date.now();
  const items = await readItems();
  const updated = items.map((item) => {
    if (item.id !== id) return item;
    if (quality >= 4) {
      const nextInterval = Math.max(1, Math.round(item.intervalDays * item.ease));
      return {
        ...item,
        intervalDays: nextInterval,
        reps: item.reps + 1,
        nextDueAt: now + nextInterval * DAY_MS,
      };
    }
    return {
      ...item,
      intervalDays: 0,
      reps: 0,
      nextDueAt: now,
    };
  });
  await writeItems(updated);
}

export async function getReviewStats(level: "A1") {
  const now = Date.now();
  const items = await readItems();
  const byLevel = items.filter((item) => item.level === level);
  return {
    due: byLevel.filter((item) => item.nextDueAt <= now).length,
    total: byLevel.length,
  };
}
