import React, { useMemo } from "react";
import { ScrollView, StyleSheet } from "react-native";
import { Stack, Text, YStack } from "tamagui";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { ScreenShell } from "../../../../components/system/ScreenShell";
import { SectionHeader } from "../../../../components/system/SectionHeader";
import { GlassCard } from "../../../../components/system/GlassCard";
import { PrimaryButton } from "../../../../components/system/PrimaryButton";
import { NavBackButton } from "../../../../components/system/NavBackButton";
import { loadA1Week } from "../../../../lib/content/loadA1";
import type { A1Task } from "../../../../types/a1Content";

const TAB_BAR_HEIGHT = 80;

export default function A1WeekScreen() {
  const { week } = useLocalSearchParams();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const weekNum = Number(week);

  const currentWeek = useMemo(() => {
    try {
      return loadA1Week(weekNum);
    } catch {
      return null;
    }
  }, [weekNum]);

  if (!currentWeek) {
    return (
      <ScreenShell title="A1" showBack>
        <Text color="$muted">Lektion nicht gefunden.</Text>
      </ScreenShell>
    );
  }

  const tasks = [...currentWeek.tasks].sort((a, b) => a.order - b.order);

  return (
    <ScreenShell title={`Lektion ${currentWeek.week}`} leftContent={<NavBackButton fallbackRoute="/learn/a1" />}>
      <ScrollView contentContainerStyle={{ paddingBottom: insets.bottom + TAB_BAR_HEIGHT + 16 }}>
        <SectionHeader
          label="A1"
          title={`Lektion ${currentWeek.week}: ${currentWeek.theme}`}
          subtext={currentWeek.story.de}
          marginBottom="$4"
        />

        <Stack gap="$3">
          {tasks.map((task: A1Task, idx) => (
            <GlassCard key={task.id} padding="$3" gap="$2">
              <Text fontWeight="900" color="$text">
                {task.title}
              </Text>
              <Text color="$muted" numberOfLines={2}>
                {task.situation.de}
              </Text>

              <YStack gap="$2" marginTop="$2">
                <PrimaryButton
                  label="Start"
                  onPress={() =>
                    router.push({
                      pathname: "/learn/a1/task/[slug]",
                      params: { slug: task.slug, week: String(currentWeek.week) },
                    })
                  }
                />
                <Text textAlign="center" color="$muted" fontSize={12}>
                  {task.duration_min} Minuten
                </Text>
              </YStack>
              {idx < tasks.length - 1 ? (
                <Stack height={StyleSheet.hairlineWidth} backgroundColor="$borderColor" marginTop="$2" />
              ) : null}
            </GlassCard>
          ))}
        </Stack>
      </ScrollView>
    </ScreenShell>
  );
}
