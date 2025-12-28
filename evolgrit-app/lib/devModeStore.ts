import AsyncStorage from "@react-native-async-storage/async-storage";

const KEY = "evolgrit.devMode";

export async function getDevMode(): Promise<boolean> {
  const raw = await AsyncStorage.getItem(KEY);
  return raw === "true";
}

export async function setDevMode(v: boolean) {
  await AsyncStorage.setItem(KEY, v ? "true" : "false");
}
