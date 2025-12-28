import AsyncStorage from "@react-native-async-storage/async-storage";

const KEY = "evolgrit.mentorUnreadCount";

export async function getMentorUnreadCount(): Promise<number> {
  const raw = await AsyncStorage.getItem(KEY);
  const n = raw ? Number(raw) : 0;
  return Number.isFinite(n) ? n : 0;
}

export async function setMentorUnreadCount(value: number) {
  const v = Math.max(0, Math.floor(value));
  await AsyncStorage.setItem(KEY, String(v));
}

export async function incMentorUnreadCount(by: number = 1) {
  const cur = await getMentorUnreadCount();
  await setMentorUnreadCount(cur + by);
}
