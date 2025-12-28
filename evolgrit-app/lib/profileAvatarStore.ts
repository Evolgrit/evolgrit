import AsyncStorage from "@react-native-async-storage/async-storage";

const KEY = "evolgrit.profileAvatarUri";

export async function getAvatarUri(): Promise<string | null> {
  const raw = await AsyncStorage.getItem(KEY);
  return raw || null;
}

export async function setAvatarUri(uri: string) {
  await AsyncStorage.setItem(KEY, uri);
}

export async function clearAvatarUri() {
  await AsyncStorage.removeItem(KEY);
}
