import AsyncStorage from "@react-native-async-storage/async-storage";

// Reuse the same key as the existing profile avatar store for compatibility
const KEY = "evolgrit.profileAvatarUri";

export async function getAvatarUri(): Promise<string | null> {
  try {
    const v = await AsyncStorage.getItem(KEY);
    return v ?? null;
  } catch {
    return null;
  }
}

export async function setAvatarUri(uri: string | null): Promise<void> {
  try {
    if (!uri) {
      await AsyncStorage.removeItem(KEY);
      return;
    }
    await AsyncStorage.setItem(KEY, uri);
  } catch {
    // ignore
  }
}
