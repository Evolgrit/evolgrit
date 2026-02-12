import React, { useMemo, useState } from "react";
import { Pressable, ScrollView } from "react-native";
import { useRouter, useFocusEffect } from "expo-router";
import { Text, XStack, YStack } from "tamagui";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { ScreenShell } from "../../components/system/ScreenShell";
import { PillButton } from "../../components/system/PillButton";
import { getFocusMinutesToday, getFocusVoice, setFocusVoice, type FocusVoiceId } from "../../lib/focusStore";

const focusData = require("../../content/focus/focus_sessions_v1.json");

type FocusSession = {
  id: string;
  levelId: string;
  mode: "pre_learning" | "post_learning" | "sleep";
  title: string;
  durationSec: number;
};

type FocusLevel = { id: string; label: string; colorKey: string };

type Section = {
  id: FocusSession["mode"];
  title: string;
};

const sections: Section[] = [
  { id: "pre_learning", title: "Vor dem Lernen" },
  { id: "post_learning", title: "Nach dem Lernen" },
  { id: "sleep", title: "Abend & Schlaf" },
];

const levelColors: Record<string, string> = {
  green: "rgba(34, 197, 94, 0.45)",
  blue: "rgba(59, 130, 246, 0.45)",
  purple: "rgba(139, 92, 246, 0.45)",
  orange: "rgba(249, 115, 22, 0.45)",
  yellow: "rgba(234, 179, 8, 0.45)",
};

export default function FocusTab() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [voiceId, setVoiceId] = useState<FocusVoiceId>("katja");
  const [minutesToday, setMinutesToday] = useState(0);

  useFocusEffect(
    React.useCallback(() => {
      (async () => {
        setVoiceId(await getFocusVoice());
        setMinutesToday(await getFocusMinutesToday());
      })();
    }, [])
  );

  const sessions: FocusSession[] = Array.isArray(focusData?.sessions) ? focusData.sessions : [];
  const levels: FocusLevel[] = Array.isArray(focusData?.levels) ? focusData.levels : [];

  const levelMap = useMemo(() => {
    const map: Record<string, FocusLevel> = {};
    levels.forEach((lvl) => {
      map[lvl.id] = lvl;
    });
    return map;
  }, [levels]);

  const grouped = useMemo(() => {
    const byMode: Record<string, FocusSession[]> = {};
    sessions.forEach((s) => {
      if (!byMode[s.mode]) byMode[s.mode] = [];
      byMode[s.mode].push(s);
    });
    return byMode;
  }, [sessions]);

  async function handleVoiceChange(next: FocusVoiceId) {
    setVoiceId(next);
    await setFocusVoice(next);
  }

  return (
    <ScreenShell title="Focus">
      <ScrollView contentContainerStyle={{ paddingBottom: insets.bottom + 24 }}>
        <YStack padding="$4" gap="$4">
          <YStack gap="$1">
            <Text fontSize={22} fontWeight="900" color="$text">
              Focus
            </Text>
            <Text color="$muted">Ruhiger Kopf, besser lernen.</Text>
          </YStack>

          <YStack gap="$2">
            <Text fontSize={16} fontWeight="800" color="$text">
              Heute fokussiert: {minutesToday} Min
            </Text>
            <XStack gap="$2">
              <PillButton
                label="Katja"
                backgroundColor={voiceId === "katja" ? "rgba(0,0,0,0.06)" : "rgba(0,0,0,0.03)"}
                onPress={() => handleVoiceChange("katja")}
              />
              <PillButton
                label="Amala"
                backgroundColor={voiceId === "amala" ? "rgba(0,0,0,0.06)" : "rgba(0,0,0,0.03)"}
                onPress={() => handleVoiceChange("amala")}
              />
            </XStack>
          </YStack>

          {sections.map((section) => {
            const items = grouped[section.id] ?? [];
            if (items.length === 0) return null;
            return (
              <YStack key={section.id} gap="$3">
                <Text fontSize={16} fontWeight="800" color="$text">
                  {section.title}
                </Text>
                <YStack gap="$3">
                  {items.map((session) => {
                    const level = levelMap[session.levelId];
                    const color = levelColors[level?.colorKey ?? ""] ?? "rgba(0,0,0,0.25)";
                    return (
                      <Pressable
                        key={session.id}
                        accessibilityRole="button"
                        onPress={() => router.push(`/focus/session/${session.id}`)}
                      >
                        <YStack
                          padding="$4"
                          borderRadius="$6"
                          backgroundColor="rgba(0,0,0,0.04)"
                          gap="$2"
                        >
                          <XStack alignItems="center" gap="$2">
                            <YStack
                              width={10}
                              height={10}
                              borderRadius={999}
                              backgroundColor={color}
                            />
                            <Text fontWeight="800" color="$text">
                              {session.title}
                            </Text>
                          </XStack>
                          <Text color="$muted">{Math.round(session.durationSec / 60)} Min</Text>
                        </YStack>
                      </Pressable>
                    );
                  })}
                </YStack>
              </YStack>
            );
          })}
        </YStack>
      </ScrollView>
    </ScreenShell>
  );
}
