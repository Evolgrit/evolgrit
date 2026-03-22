import AsyncStorage from "@react-native-async-storage/async-storage";

export type UnlockableLevel = "A2" | "B1" | "B2";

const keyFor = (level: UnlockableLevel) => `unlock:${level}`;
const timeKeyFor = (level: UnlockableLevel) => `unlockAt:${level}`;

export async function getUnlocked(level: UnlockableLevel) {
  try {
    const raw = await AsyncStorage.getItem(keyFor(level));
    return raw === "true";
  } catch {
    return false;
  }
}

export async function setUnlocked(level: UnlockableLevel, value: boolean) {
  try {
    await AsyncStorage.setItem(keyFor(level), value ? "true" : "false");
    if (value) {
      await AsyncStorage.setItem(timeKeyFor(level), String(Date.now()));
    }
  } catch {
    // ignore
  }
}

export async function getUnlockAt(level: UnlockableLevel) {
  try {
    const raw = await AsyncStorage.getItem(timeKeyFor(level));
    const parsed = raw ? Number(raw) : 0;
    return Number.isFinite(parsed) ? parsed : 0;
  } catch {
    return 0;
  }
}
