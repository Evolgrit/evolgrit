import { useEffect, useState } from "react";
import { loadLangPrefs, saveLangPrefs } from "./languagePrefs";
import { getSelectedJobTrackOptional } from "./jobStore";

export type UserSettings = {
  nativeLanguageCode: string;
  targetLanguageCode: string;
  uiLocale: string;
  selectedJobTrackId: string | null;
};

const DEFAULTS: UserSettings = {
  nativeLanguageCode: "en",
  targetLanguageCode: "de",
  uiLocale: "system",
  selectedJobTrackId: null,
};

let currentSettings: UserSettings = { ...DEFAULTS };
const listeners = new Set<(next: UserSettings) => void>();

function notify(next: UserSettings) {
  listeners.forEach((cb) => cb(next));
}

export async function loadUserSettings(): Promise<UserSettings> {
  const [prefs, track] = await Promise.all([loadLangPrefs(), getSelectedJobTrackOptional()]);
  const next = {
    nativeLanguageCode: prefs?.nativeLang ?? DEFAULTS.nativeLanguageCode,
    targetLanguageCode: prefs?.targetLang ?? DEFAULTS.targetLanguageCode,
    uiLocale: prefs?.uiLocale ?? DEFAULTS.uiLocale,
    selectedJobTrackId: track ?? DEFAULTS.selectedJobTrackId,
  };
  currentSettings = next;
  return next;
}

export async function setNativeLanguageCode(code: string) {
  const current = (await loadLangPrefs()) ?? { nativeLang: "en", targetLang: "de", uiLocale: "system" };
  await saveLangPrefs({ ...current, nativeLang: code });
  currentSettings = { ...currentSettings, nativeLanguageCode: code };
  notify(currentSettings);
}

export async function setTargetLanguageCode(code: string) {
  const current = (await loadLangPrefs()) ?? { nativeLang: "en", targetLang: "de", uiLocale: "system" };
  await saveLangPrefs({ ...current, targetLang: code });
  currentSettings = { ...currentSettings, targetLanguageCode: code };
  notify(currentSettings);
}

export async function setUiLocale(uiLocale: string) {
  const current = (await loadLangPrefs()) ?? { nativeLang: "en", targetLang: "de", uiLocale: "system" };
  await saveLangPrefs({ ...current, uiLocale });
  currentSettings = { ...currentSettings, uiLocale };
  notify(currentSettings);
}

export function getUserSettingsSnapshot() {
  return currentSettings;
}

export function subscribeUserSettings(cb: (next: UserSettings) => void) {
  listeners.add(cb);
  return () => {
    listeners.delete(cb);
  };
}

export function useUserSettings() {
  const [settings, setSettings] = useState<UserSettings>(DEFAULTS);

  useEffect(() => {
    let active = true;
    loadUserSettings().then((next) => {
      if (!active) return;
      setSettings(next);
    });
    const unsubscribe = subscribeUserSettings((next) => {
      if (!active) return;
      setSettings(next);
    });
    return () => {
      active = false;
      unsubscribe();
    };
  }, []);

  return settings;
}
