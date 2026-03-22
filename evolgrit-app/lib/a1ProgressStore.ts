import AsyncStorage from "@react-native-async-storage/async-storage";

const A1_DONE_KEY = "a1_done_lessons";

export async function markLessonDone(lessonId: string) {
  try {
    const raw = await AsyncStorage.getItem(A1_DONE_KEY);
    const current: string[] = raw ? JSON.parse(raw) : [];
    if (!current.includes(lessonId)) {
      const next = [...current, lessonId];
      await AsyncStorage.setItem(A1_DONE_KEY, JSON.stringify(next));
    }
  } catch {
    // ignore
  }
}

export async function getDoneLessons() {
  try {
    const raw = await AsyncStorage.getItem(A1_DONE_KEY);
    const current: unknown = raw ? JSON.parse(raw) : [];
    if (Array.isArray(current)) {
      return current.filter((id) => typeof id === "string") as string[];
    }
    return [];
  } catch {
    return [];
  }
}

export async function resetA1Progress() {
  try {
    await AsyncStorage.removeItem(A1_DONE_KEY);
  } catch {
    // ignore
  }
}
