import AsyncStorage from "@react-native-async-storage/async-storage";

export type AmbientId = "off" | "ocean" | "forest" | "rain" | "wind";

const AMBIENT_ID_KEY = "evolgrit.ambient.id";
const AMBIENT_ENABLED_KEY = "evolgrit.ambient.enabled";

export async function getAmbientId(): Promise<AmbientId> {
  const raw = await AsyncStorage.getItem(AMBIENT_ID_KEY);
  if (raw === "ocean" || raw === "forest" || raw === "rain" || raw === "wind" || raw === "off") {
    return raw;
  }
  return "ocean";
}

export async function setAmbientId(id: AmbientId): Promise<void> {
  await AsyncStorage.setItem(AMBIENT_ID_KEY, id);
}

export async function getAmbientEnabled(): Promise<boolean> {
  const raw = await AsyncStorage.getItem(AMBIENT_ENABLED_KEY);
  if (raw === "true") return true;
  if (raw === "false") return false;
  return false;
}

export async function setAmbientEnabled(v: boolean): Promise<void> {
  await AsyncStorage.setItem(AMBIENT_ENABLED_KEY, v ? "true" : "false");
}
