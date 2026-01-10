import AsyncStorage from "@react-native-async-storage/async-storage";

const KEY = "evolgrit.settings.v1";

export type AppSettings = {
  soundEffects: boolean;
  streakNotifications: boolean;
  autoAdvance: boolean;
  saveAudio: boolean;
  reminderEnabled: boolean;
  reminderDays: number[]; // 0=Sun..6=Sat
  reminderTime: string; // "08:00"
  audioLanguage: string; // e.g. "en", "tr", "pl"
};

export const DEFAULT_SETTINGS: AppSettings = {
  soundEffects: true,
  streakNotifications: true,
  autoAdvance: true,
  saveAudio: false,
  reminderEnabled: false,
  reminderDays: [1, 2, 3, 4, 5],
  reminderTime: "08:00",
  audioLanguage: "en",
};

export async function loadSettings(): Promise<AppSettings> {
  const raw = await AsyncStorage.getItem(KEY);
  if (!raw) return DEFAULT_SETTINGS;
  try {
    const parsed = JSON.parse(raw) as AppSettings;
    return { ...DEFAULT_SETTINGS, ...parsed };
  } catch {
    return DEFAULT_SETTINGS;
  }
}

export async function saveSettings(next: AppSettings): Promise<void> {
  await AsyncStorage.setItem(KEY, JSON.stringify(next));
}

export async function updateSettings(patch: Partial<AppSettings>): Promise<AppSettings> {
  const current = await loadSettings();
  const next = { ...current, ...patch };
  await saveSettings(next);
  return next;
}
