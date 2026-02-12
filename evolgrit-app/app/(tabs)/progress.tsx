import React, { useEffect, useMemo, useState } from "react";
import { ScrollView, StyleSheet } from "react-native";
import { Stack, Text, XStack, YStack, useTheme } from "tamagui";

import { ScreenShell } from "../../components/system/ScreenShell";
import { getCompletedCount } from "../../lib/progressStore";
import { getEvents, getMonthBuckets, getSummary } from "../../lib/tracking";

type TodayStats = {
  words: number;
  exercises: number;
  focusMinutes: number;
};

type ProgressData = {
  lessonsTotal: number;
  hoursTotal: number;
  today: TodayStats;
  buckets: {
    labels: string[];
    languageLessons: number[];
    jobCompletes: number[];
  };
};

function startOfTodayMs() {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  return d.getTime();
}

function getStatusColor(status: "not_started" | "in_progress" | "completed") {
  if (status === "completed") return "$surfaceLanguage";
  if (status === "in_progress") return "$surfaceFocus";
  return "$bgSurfaceMuted";
}

export default function ProgressTab() {
  const theme = useTheme();
  const [data, setData] = useState<ProgressData | null>(null);

  useEffect(() => {
    let active = true;
    (async () => {
      const [a1, a2, b1, b2] = await Promise.all([
        getCompletedCount("A1"),
        getCompletedCount("A2"),
        getCompletedCount("B1"),
        getCompletedCount("B2"),
      ]);
      const lessonsTotal = a1 + a2 + b1 + b2;
      const summary = await getSummary(30);
      const hoursTotal = summary ? Math.round((summary.minutesTotal / 60) * 10) / 10 : 0;
      const eventsToday = await getEvents(startOfTodayMs());
      const todayWords = eventsToday.filter((e) => e.category === "language" && e.action === "lesson_complete").length * 6;
      const todayExercises = eventsToday.filter((e) => e.category === "speak" && e.action === "live_dialogue_complete").length;
      const todayFocusMinutes = eventsToday
        .filter((e) => e.category === "focus" && e.durationSec)
        .reduce((sum, e) => sum + Math.round((e.durationSec ?? 0) / 60), 0);
      const monthBuckets = await getMonthBuckets(3);
      if (!active) return;
      setData({
        lessonsTotal,
        hoursTotal,
        today: {
          words: todayWords,
          exercises: todayExercises,
          focusMinutes: todayFocusMinutes,
        },
        buckets: {
          labels: monthBuckets.labels,
          languageLessons: monthBuckets.languageLessons,
          jobCompletes: monthBuckets.jobCompletes,
        },
      });
    })();
    return () => {
      active = false;
    };
  }, []);

  const percent = useMemo(() => {
    const total = data?.lessonsTotal ?? 0;
    const goal = 100;
    return Math.min(1, total / goal);
  }, [data?.lessonsTotal]);

  return (
    <ScreenShell title="Progress">
      <ScrollView contentContainerStyle={styles.scroll}>
        <YStack padding="$4" gap="$4">
          <YStack gap="$1">
            <Text color="$text" fontSize={28} fontWeight="800">
              Progress
            </Text>
            <Text color="$textSecondary">Dein Weg — ruhig & konstant.</Text>
          </YStack>

          <XStack gap="$3">
            <StatTile
              title="Lektionen"
              value={String(data?.lessonsTotal ?? 0)}
              subtitle="Completed"
              bg="$surfaceLanguage"
            />
            <StatTile
              title="Zeit"
              value={String(data?.hoursTotal ?? 0)}
              subtitle="Hours"
              bg="$surfaceFocus"
            />
          </XStack>

          <RingCard percent={percent} />

          <YStack gap="$2">
            <Text color="$text" fontSize={16} fontWeight="800">
              Today’s milestones
            </Text>
            <Stack backgroundColor="$surfaceLife" borderRadius="$r20" padding="$s16">
              <XStack gap="$2" justifyContent="space-between">
                <MiniTile label="Neue Wörter" value={String(data?.today.words ?? 0)} />
                <MiniTile label="Übungen" value={String(data?.today.exercises ?? 0)} />
                <MiniTile label="Focus" value={`${data?.today.focusMinutes ?? 0} Min`} />
              </XStack>
            </Stack>
          </YStack>

          <YStack gap="$2">
            <Text color="$text" fontSize={16} fontWeight="800">
              Progress
            </Text>

            <YStack gap="$3">
              <ProgressRow
                title="Sprache"
                values={data?.buckets.languageLessons ?? [0, 0, 0]}
                labels={data?.buckets.labels ?? ["—", "—", "—"]}
                fill="$surfaceLanguage"
              />
              <ProgressRow
                title="Job"
                values={data?.buckets.jobCompletes ?? [0, 0, 0]}
                labels={data?.buckets.labels ?? ["—", "—", "—"]}
                fill="$surfaceJob"
              />
            </YStack>
          </YStack>

          <XStack gap="$2">
            {[
              { label: "Nicht gestartet", status: "not_started" as const },
              { label: "Begonnen", status: "in_progress" as const },
              { label: "Fertig", status: "completed" as const },
            ].map((chip) => (
              <Stack
                key={chip.label}
                paddingHorizontal="$s12"
                paddingVertical="$s8"
                borderRadius="$r20"
                backgroundColor={getStatusColor(chip.status)}
              >
                <Text fontSize={12} color="$textSecondary">
                  {chip.label}
                </Text>
              </Stack>
            ))}
          </XStack>
        </YStack>
      </ScrollView>
    </ScreenShell>
  );
}

function StatTile({
  title,
  value,
  subtitle,
  bg,
}: {
  title: string;
  value: string;
  subtitle: string;
  bg: string;
}) {
  return (
    <Stack flex={1} backgroundColor={bg} borderRadius="$r20" padding="$s16">
      <XStack alignItems="center" justifyContent="space-between">
        <Text color="$textSecondary" fontSize={12} fontWeight="700">
          {title}
        </Text>
        <Stack width={28} height={28} borderRadius={14} backgroundColor="$bgSurface" />
      </XStack>
      <Text marginTop="$s12" color="$text" fontSize={32} fontWeight="800">
        {value}
      </Text>
      <Text color="$textSecondary" fontSize={12}>
        {subtitle}
      </Text>
    </Stack>
  );
}

function RingCard({ percent }: { percent: number }) {
  return (
    <Stack backgroundColor="$bgSurface" borderRadius="$r20" padding="$s16">
      <Text color="$textSecondary" fontSize={12} fontWeight="700">
        Learning progress
      </Text>
      <XStack marginTop="$s12" alignItems="center" gap="$3">
        <RingProgress percent={percent} />
        <YStack gap="$1" flex={1}>
          <Text color="$text" fontSize={18} fontWeight="800">
            {Math.round(percent * 100)}%
          </Text>
          <Text color="$textSecondary">
            Ziel: 100 Lektionen
          </Text>
        </YStack>
      </XStack>
    </Stack>
  );
}

function RingProgress({ percent }: { percent: number }) {
  const theme = useTheme();
  const track = theme.bgSurfaceMuted?.val ?? theme.colorMuted?.val ?? theme.textSecondary?.val ?? theme.color?.val ?? "black";
  const progress = theme.surfaceFocus?.val ?? theme.color?.val ?? theme.text?.val ?? "black";
  const size = 88;
  const stroke = 8;
  const clamped = Math.max(0, Math.min(1, percent));
  const rotation = clamped <= 0.5 ? clamped * 360 : (clamped - 0.5) * 360;

  return (
    <Stack width={size} height={size}>
      <Stack
        width={size}
        height={size}
        borderRadius={size / 2}
        borderWidth={stroke}
        borderColor={track}
      />
      <Stack
        position="absolute"
        width={size}
        height={size}
        borderRadius={size / 2}
        borderWidth={stroke}
        borderColor={progress}
        style={clamped <= 0.5 ? { ...styles.rightHalf, transform: [{ rotate: `${rotation}deg` }] } : styles.rightHalf}
      />
      {clamped > 0.5 ? (
        <Stack
          position="absolute"
          width={size}
          height={size}
          borderRadius={size / 2}
          borderWidth={stroke}
          borderColor={progress}
          style={{ ...styles.leftHalf, transform: [{ rotate: `${rotation}deg` }] }}
        />
      ) : null}
    </Stack>
  );
}

function MiniTile({ label, value }: { label: string; value: string }) {
  return (
    <Stack flex={1} backgroundColor="$bgSurface" borderRadius="$r16" padding="$s12">
      <Text color="$textSecondary" fontSize={12}>
        {label}
      </Text>
      <Text color="$text" fontSize={16} fontWeight="800" marginTop="$s8">
        {value}
      </Text>
    </Stack>
  );
}

function ProgressRow({
  title,
  values,
  labels,
  fill,
}: {
  title: string;
  values: number[];
  labels: string[];
  fill: string;
}) {
  const max = Math.max(1, ...values);
  return (
    <Stack backgroundColor="$bgSurface" borderRadius="$r20" padding="$s16">
      <Text color="$textSecondary" fontSize={12} fontWeight="700">
        {title}
      </Text>
      <XStack gap="$3" marginTop="$s12">
        {values.map((value, idx) => {
          const height = Math.max(0.12, value / max);
          return (
            <YStack key={`${title}-${idx}`} flex={1} alignItems="center" gap="$1">
              <Stack width="100%" height={120} backgroundColor="$bgSurfaceMuted" borderRadius="$r16" justifyContent="flex-end">
                <Stack
                  height={Math.round(120 * height)}
                  backgroundColor={fill}
                  borderRadius="$r16"
                  margin="$s8"
                />
                <Stack position="absolute" top="$s8" right="$s8" paddingHorizontal="$s8" paddingVertical="$s8" borderRadius="$r20" backgroundColor="$bgSurface">
                  <Text fontSize={12} color="$text">
                    {value}
                  </Text>
                </Stack>
              </Stack>
              <Text color="$textSecondary" fontSize={12}>
                {labels[idx] ?? "—"}
              </Text>
            </YStack>
          );
        })}
      </XStack>
    </Stack>
  );
}

const styles = StyleSheet.create({
  scroll: {
    paddingBottom: 110,
  },
  rightHalf: {
    position: "absolute",
    width: "50%",
    height: "100%",
    right: 0,
    overflow: "hidden",
  },
  leftHalf: {
    position: "absolute",
    width: "50%",
    height: "100%",
    left: 0,
    overflow: "hidden",
  },
});
