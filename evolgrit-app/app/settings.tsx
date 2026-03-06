import React, { useEffect, useState } from "react";
import { Stack, Text } from "tamagui";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

import { loadSettings, updateSettings, type AppSettings } from "../lib/settingsStore";
import { SettingsToggle } from "../components/system/SettingsToggle";
import { ScreenShell } from "../components/system/ScreenShell";
import { SettingsSection } from "../components/system/SettingsSection";
import { SettingsRow } from "../components/system/SettingsRow";
import { SettingsSearchBar } from "../components/system/SettingsSearchBar";
import { getDevMode, setDevMode } from "../lib/devModeStore";
import { unlockAllWeeksForCurrentPhase } from "../lib/phaseStateStore";
import { useI18n } from "../lib/i18n";

export default function SettingsScreen() {
  const router = useRouter();
  const [settings, setSettings] = useState<AppSettings | null>(null);
  const [devMode, setDevModeState] = useState(false);
  const [search, setSearch] = useState("");
  const { t } = useI18n();

  useEffect(() => {
    (async () => {
      const s = await loadSettings();
      setSettings(s);
      setDevModeState(await getDevMode());
    })();
  }, []);

  async function toggle(key: keyof AppSettings) {
    if (!settings) return;
    const next = await updateSettings({ [key]: !settings[key] } as Partial<AppSettings>);
    setSettings(next);
  }

  if (!settings) {
    return (
      <ScreenShell title={t("settings.title")} showBack>
        <Stack flex={1} alignItems="center" justifyContent="center">
          <Text color="$muted">{t("settings.loading")}</Text>
        </Stack>
      </ScreenShell>
    );
  }

  return (
    <ScreenShell title={t("settings.title")} showBack>
      <Stack flex={1} gap={16} paddingBottom={20}>
        <SettingsSearchBar value={search} onChangeText={setSearch} />

        <SettingsSection title={t("settings.general")}>
          <SettingsRow
            icon={<Ionicons name="notifications-outline" size={18} color="#111827" />}
            title={t("settings.reminders")}
            subtitle={t("settings.reminders_sub")}
            onPress={() => router.push("/reminders" as any)}
          />
          <SettingsRow
            icon={<Ionicons name="mic-outline" size={18} color="#111827" />}
            title={t("settings.recordings")}
            subtitle={t("settings.recordings_sub")}
            onPress={() => router.push("/audio-settings" as any)}
          />
          <SettingsRow
            icon={<Ionicons name="volume-high-outline" size={18} color="#111827" />}
            title={t("settings.sound_effects")}
            right={<SettingsToggle value={settings.soundEffects} onValueChange={() => toggle("soundEffects")} />}
            onPress={() => {}}
            showChevron={false}
          />
          <SettingsRow
            icon={<Ionicons name="flame-outline" size={18} color="#111827" />}
            title={t("settings.streak_notifications")}
            right={<SettingsToggle value={settings.streakNotifications} onValueChange={() => toggle("streakNotifications")} />}
            onPress={() => {}}
            showChevron={false}
          />
          <SettingsRow
            icon={<Ionicons name="play-forward-outline" size={18} color="#111827" />}
            title={t("settings.auto_advance")}
            right={<SettingsToggle value={settings.autoAdvance} onValueChange={() => toggle("autoAdvance")} />}
            onPress={() => {}}
            showChevron={false}
          />
        </SettingsSection>

        <SettingsSection title={t("settings.account_language")}>
          <SettingsRow
            icon={<Ionicons name="rocket-outline" size={18} color="#111827" />}
            title={t("settings.open_demo")}
            onPress={() => router.push("/demo" as any)}
          />
        </SettingsSection>

        <SettingsSection title={t("settings.development")}>
          <SettingsRow
            icon={<Ionicons name="terminal-outline" size={18} color="#111827" />}
            title={t("settings.dev_mode")}
            right={
              <SettingsToggle
                value={devMode}
                onValueChange={async (next) => {
                  await setDevMode(next);
                  setDevModeState(next);
                }}
              />
            }
            onPress={() => {}}
            showChevron={false}
          />
          <SettingsRow
            icon={<Ionicons name="key-outline" size={18} color="#111827" />}
            title={t("settings.unlock_weeks")}
            subtitle={t("settings.unlock_weeks_sub")}
            onPress={async () => {
              await unlockAllWeeksForCurrentPhase();
            }}
          />
        </SettingsSection>

        <SettingsSection title={t("settings.about")}>
          <SettingsRow
            icon={<Ionicons name="information-circle-outline" size={18} color="#111827" />}
            title={t("settings.version")}
            subtitle="Evolgrit · Build 1"
            showChevron={false}
          />
        </SettingsSection>
      </Stack>
    </ScreenShell>
  );
}
