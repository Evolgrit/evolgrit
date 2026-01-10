import React, { useEffect, useState } from "react";
import { Stack, Text } from "tamagui";
import { useRouter } from "expo-router";

import { loadSettings, updateSettings, type AppSettings } from "../lib/settingsStore";
import { ScreenShell } from "../components/system/ScreenShell";
import { SettingsSection } from "../components/system/SettingsSection";
import { SettingsRow } from "../components/system/SettingsRow";

const LANGS = [
  { code: "en", label: "English", flag: "🇬🇧" },
  { code: "pl", label: "Polski", flag: "🇵🇱" },
  { code: "ar", label: "العربية", flag: "🇦🇪" },
  { code: "tr", label: "Türkçe", flag: "🇹🇷" },
  { code: "ro", label: "Română", flag: "🇷🇴" },
  { code: "uk", label: "Українська", flag: "🇺🇦" },
  { code: "ru", label: "Русский", flag: "🇷🇺" },
];

export default function AudioLanguage() {
  const router = useRouter();
  const [settings, setSettings] = useState<AppSettings | null>(null);

  useEffect(() => {
    (async () => {
      const s = await loadSettings();
      setSettings(s);
    })();
  }, []);

  async function select(code: string) {
    const next = await updateSettings({ audioLanguage: code });
    setSettings(next);
    router.back();
  }

  if (!settings) {
    return (
      <ScreenShell title="Erstsprache auswählen" showBack>
        <Stack flex={1} alignItems="center" justifyContent="center">
          <Text color="$muted">Lädt…</Text>
        </Stack>
      </ScreenShell>
    );
  }

  return (
    <ScreenShell title="Erstsprache auswählen" showBack>
      <Stack gap={12} paddingBottom={24}>
        <SettingsSection>
          {LANGS.map((l) => (
            <SettingsRow
              key={l.code}
              icon={<Text fontSize={18}>{l.flag}</Text>}
              title={`${l.label}`}
              subtitle={l.code}
              onPress={() => select(l.code)}
              right={
                settings.audioLanguage === l.code ? (
                  <Text color="$primary" fontWeight="800">
                    Aktiv
                  </Text>
                ) : null
              }
            />
          ))}
        </SettingsSection>
      </Stack>
    </ScreenShell>
  );
}
