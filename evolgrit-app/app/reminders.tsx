import React, { useEffect, useState } from "react";
import { Linking } from "react-native";
import { Stack, Text, XStack } from "tamagui";

import { PrimaryButton } from "../components/system/PrimaryButton";
import { loadSettings, updateSettings, type AppSettings } from "../lib/settingsStore";
import { ensureNotificationPermission, cancelEvolgritReminders, scheduleEvolgritReminders } from "../lib/reminders";
import { ScreenShell } from "../components/system/ScreenShell";
import { PillButton } from "../components/system/PillButton";
import { SettingsSection } from "../components/system/SettingsSection";
import { SettingsRow } from "../components/system/SettingsRow";
import { SettingsToggle } from "../components/system/SettingsToggle";

const DAYS = [
  { code: 1, label: "Mo" },
  { code: 2, label: "Di" },
  { code: 3, label: "Mi" },
  { code: 4, label: "Do" },
  { code: 5, label: "Fr" },
  { code: 6, label: "Sa" },
  { code: 0, label: "So" },
];

function clampTime(hours: number, minutes: number) {
  const total = hours * 60 + minutes;
  const min = 6 * 60;
  const max = 22 * 60;
  const clamped = Math.max(min, Math.min(max, total));
  const h = Math.floor(clamped / 60);
  const m = clamped % 60;
  return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
}

export default function RemindersScreen() {
  const [settings, setSettings] = useState<AppSettings | null>(null);
  const [permissionDenied, setPermissionDenied] = useState(false);
  const [isRequesting, setIsRequesting] = useState(false);

  useEffect(() => {
    (async () => {
      const s = await loadSettings();
      setSettings(s);
    })();
  }, []);

  async function toggleReminder() {
    if (!settings) return;
    const nextEnabled = !settings.reminderEnabled;
    if (nextEnabled) {
      setIsRequesting(true);
      const granted = await ensureNotificationPermission();
      setPermissionDenied(!granted);
      setIsRequesting(false);
      if (!granted) {
        const next = await updateSettings({ reminderEnabled: false });
        setSettings(next);
        await cancelEvolgritReminders();
        return;
      }
    }
    const next = await updateSettings({ reminderEnabled: nextEnabled });
    setSettings(next);
    if (!nextEnabled) {
      await cancelEvolgritReminders();
    } else {
      await maybeSchedule(next);
    }
  }

  async function toggleDay(day: number) {
    if (!settings) return;
    const has = settings.reminderDays.includes(day);
    const nextDays = has ? settings.reminderDays.filter((d) => d !== day) : [...settings.reminderDays, day];
    const next = await updateSettings({ reminderDays: nextDays });
    setSettings(next);
    await maybeSchedule(next);
  }

  async function adjustMinutes(delta: number) {
    if (!settings) return;
    const [h, m] = settings.reminderTime.split(":").map((x) => parseInt(x, 10));
    const total = h * 60 + m + delta;
    const nextTime = clampTime(Math.floor(total / 60), total % 60);
    const next = await updateSettings({ reminderTime: nextTime });
    setSettings(next);
    await maybeSchedule(next);
  }

  async function maybeSchedule(nextSettings: AppSettings) {
    if (!nextSettings.reminderEnabled) return;
    if (nextSettings.reminderDays.length === 0) return;
    const [h, m] = nextSettings.reminderTime.split(":").map((x) => parseInt(x, 10));
    await scheduleEvolgritReminders({ weekdays: nextSettings.reminderDays, hour: h, minute: m });
  }

  if (!settings) {
    return (
      <ScreenShell title="Erinnerung einstellen" showBack>
        <Stack flex={1} alignItems="center" justifyContent="center">
          <Text color="$muted">Lädt…</Text>
        </Stack>
      </ScreenShell>
    );
  }

  const daysSelected = settings.reminderDays.length > 0;

  return (
    <ScreenShell title="Erinnerung einstellen" showBack>
      <Stack flex={1} gap={16} paddingBottom={24}>
        <Text fontSize={22} fontWeight="900" color="$text">
          Stelle Erinnerungen ein, um dein Ziel zu erreichen
        </Text>

        <SettingsSection title="Allgemein">
          <SettingsRow
            icon={<Text fontSize={16}>🕐</Text>}
            title="Erinnerungen"
            subtitle="Benachrichtigung einmal pro Tag"
            right={
              <SettingsToggle
                value={settings.reminderEnabled}
                onValueChange={toggleReminder}
                disabled={isRequesting}
              />
            }
            showChevron={false}
          />
        </SettingsSection>
        {permissionDenied ? (
          <Text color="$muted" fontSize={12}>
            Enable notifications in Settings to receive reminders.{" "}
            <Text color="$text" fontWeight="800" onPress={() => Linking.openSettings()}>
              Open Settings
            </Text>
          </Text>
        ) : null}

        <SettingsSection title="Tage auswählen">
          <Stack padding="$3" gap="$2">
            <Stack flexDirection="row" flexWrap="wrap" gap={8}>
              {DAYS.map((d) => {
                const active = settings.reminderDays.includes(d.code);
                return (
                  <PillButton
                    key={d.code}
                    label={d.label}
                    onPress={() => toggleDay(d.code)}
                    backgroundColor={active ? "$primary" : "$card"}
                    borderColor={active ? "$primary" : "$border"}
                    color={active ? "$textOnDark" : "$text"}
                  />
                );
              })}
            </Stack>
          </Stack>
        </SettingsSection>

        <SettingsSection title="Uhrzeiten auswählen">
          <Stack
            opacity={settings.reminderEnabled && daysSelected ? 1 : 0.45}
            pointerEvents={settings.reminderEnabled && daysSelected ? "auto" : "none"}
            padding="$3"
            gap="$3"
          >
            <SettingsRow
              icon={<Text fontSize={16}>⏱️</Text>}
              title="Gleiche Uhrzeit für alle Tage"
              showChevron={false}
              right={<SettingsToggle value onValueChange={() => {}} disabled />}
            />
            <XStack alignItems="center" justifyContent="space-between">
              <Text fontSize={20} fontWeight="900" color="$text">
                {settings.reminderTime}
              </Text>
              <XStack gap="$2">
                <PillButton label="-15" onPress={() => adjustMinutes(-15)} />
                <PillButton label="+15" onPress={() => adjustMinutes(15)} />
              </XStack>
            </XStack>
          </Stack>
        </SettingsSection>

        <PrimaryButton
          label="Bestätige"
          onPress={async () => {
            if (settings) await maybeSchedule(settings);
          }}
        />
      </Stack>
    </ScreenShell>
  );
}
