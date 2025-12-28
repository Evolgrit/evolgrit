import AsyncStorage from "@react-native-async-storage/async-storage";

export type LangPrefs = {
  nativeLang: string; // e.g. "en", "pl", "ar"
  targetLang: string; // for now always "de"
};

const KEY = "evolgrit.langPrefs";

export async function loadLangPrefs(): Promise<LangPrefs | null> {
  const raw = await AsyncStorage.getItem(KEY);
  return raw ? JSON.parse(raw) : null;
}

export async function saveLangPrefs(prefs: LangPrefs) {
  await AsyncStorage.setItem(KEY, JSON.stringify(prefs));
}
