import React, { useEffect, useState } from "react";
import { Stack, Text } from "tamagui";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

import { loadSettings, updateSettings, type AppSettings } from "../lib/settingsStore";
import { ScreenShell } from "../components/system/ScreenShell";
import { SettingsSection } from "../components/system/SettingsSection";
import { SettingsRow } from "../components/system/SettingsRow";
import { SettingsToggle } from "../components/system/SettingsToggle";

export default function AudioSettings() {
  const router = useRouter();
  const [settings, setSettings] = useState<AppSettings | null>(null);

  useEffect(() => {
    (async () => {
      const s = await loadSettings();
      setSettings(s);
    })();
  }, []);

  async function toggleSave() {
    if (!settings) return;
    const next = await updateSettings({ saveAudio: !settings.saveAudio });
    setSettings(next);
  }

  if (!settings) {
    return (
      <ScreenShell title="Tonaufnahmen" showBack>
        <Stack flex={1} alignItems="center" justifyContent="center">
          <Text color="$muted">Lädt…</Text>
        </Stack>
      </ScreenShell>
    );
  }

  return (
    <ScreenShell title="Tonaufnahmen" showBack>
      <Stack gap={12} paddingBottom={24}>
        <Stack backgroundColor="$surface" borderRadius={18} padding="$3" borderWidth={1} borderColor="$border">
          <Text fontWeight="800" color="$text" marginBottom={8}>
            Warum aufnehmen?
          </Text>
          <Text color="$muted" marginBottom={6}>
            Aufnahmen helfen, persönliches Feedback zu geben.
          </Text>
          <Text color="$muted" marginBottom={6}>
            Du kannst Aufnahmen jederzeit ausschalten.
          </Text>
          <Text color="$muted">Aufnahmen bleiben nur lokal in der App.</Text>
        </Stack>

        <SettingsSection>
          <SettingsRow
            icon={<Ionicons name="save-outline" size={18} color="#111827" />}
            title="Audioaufnahmen speichern"
            onPress={toggleSave}
            showChevron={false}
            right={<SettingsToggle value={settings.saveAudio} onValueChange={toggleSave} />}
          />
          <SettingsRow
            icon={<Ionicons name="language-outline" size={18} color="#111827" />}
            title="Erstsprache"
            subtitle={settings.audioLanguage}
            onPress={() => router.push("/audio-language" as any)}
          />
        </SettingsSection>
      </Stack>
    </ScreenShell>
  );
}
