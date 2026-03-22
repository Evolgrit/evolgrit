import React, { useEffect, useMemo, useState } from "react";
import { Pressable, ScrollView } from "react-native";
import { Stack, Text, YStack } from "tamagui";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { ScreenShell } from "../../../../components/system/ScreenShell";
import { SectionHeader } from "../../../../components/system/SectionHeader";
import { NavBackButton } from "../../../../components/system/NavBackButton";
import { loadA1Week } from "../../../../lib/content/loadA1";
import { getProgressState } from "../../../../lib/progressStore";
import { getLessonResume, type ResumeInfo } from "../../../../lib/progress/lessonProgress";
import { getCardStatusStyle, getLessonStatus } from "../../../../components/system/lessonCardStatus";

const TAB_BAR_HEIGHT = 80;

export default function A1WeekScreen() {
  const { week } = useLocalSearchParams();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const weekNum = Number(week);
  const [completedMap, setCompletedMap] = useState<Record<string, boolean>>({});
  const [resumeMap, setResumeMap] = useState<Record<string, ResumeInfo | null>>({});

  const currentWeek = useMemo(() => {
    if (weekNum === 1) {
      try {
        return loadA1Week(weekNum);
      } catch {
        return null;
      }
    }
    if (weekNum === 2) {
      return {
        week: 2,
        theme: "Einkaufen",
        story: { de: "Du lernst einfache Sätze fürs Einkaufen." },
      };
    }
    return null;
  }, [weekNum]);

  useEffect(() => {
    let active = true;
    (async () => {
      const state = await getProgressState();
      const tasks = currentWeek?.tasks ?? [];
      const resumes = await Promise.all(tasks.map((task: any) => getLessonResume(task.id)));
      const nextResume: Record<string, ResumeInfo | null> = {};
      tasks.forEach((task: any, idx: number) => {
        nextResume[task.id] = resumes[idx] ?? null;
      });
      if (!active) return;
      setCompletedMap(state.completedLessons.A1 ?? {});
      setResumeMap(nextResume);
    })();
    return () => {
      active = false;
    };
  }, [currentWeek?.tasks]);

  if (!currentWeek) {
    return (
      <ScreenShell title="A1" showBack backgroundColor="#FFFFFF">
        <Text color="$muted">Kommt bald.</Text>
      </ScreenShell>
    );
  }

  const runnerTasks =
    weekNum === 2
      ? [
          {
            id: "a1_l2_01_einkaufen_basics",
            title: "Einkaufen: Basics",
            subtitle: "Hallo, ich brauche …",
            duration: "3 Minuten",
          },
          {
            id: "a1_l2_02_preise_mengen",
            title: "Preise & Mengen",
            subtitle: "Wie viel kostet das?",
            duration: "3 Minuten",
          },
          {
            id: "a1_l2_03_fragen_wo_ist",
            title: "Fragen: Wo ist …",
            subtitle: "Wo ist der Reis?",
            duration: "3 Minuten",
          },
          {
            id: "a1_l2_04_kasse_bitte_danke",
            title: "Kasse",
            subtitle: "Bitte / Danke",
            duration: "3 Minuten",
          },
        ]
      : [
          {
            id: "a1_l1_01_name",
            title: "Sich vorstellen: Name",
            subtitle: "Du triffst jemanden zum ersten Mal.",
            duration: "3 Minuten",
          },
          {
            id: "a1_l1_02_herkunft",
            title: "Sich vorstellen: Herkunft",
            subtitle: "Du sagst, woher du kommst.",
            duration: "3 Minuten",
          },
          {
            id: "a1_l1_03_begruessen",
            title: "Begrüßen",
            subtitle: "Guten Morgen, Guten Tag, Guten Abend.",
            duration: "3 Minuten",
          },
          {
            id: "a1_l1_04_bitte_danke",
            title: "Bitte & Danke",
            subtitle: "Höflich und freundlich reagieren.",
            duration: "3 Minuten",
          },
        ];

  return (
    <ScreenShell
      title={`Lektion ${currentWeek.week}`}
      leftContent={<NavBackButton fallbackRoute="/learn/a1" />}
      backgroundColor="#FFFFFF"
    >
      <ScrollView contentContainerStyle={{ paddingBottom: insets.bottom + TAB_BAR_HEIGHT + 16 }}>
        <SectionHeader
          label="A1"
          title={`Lektion ${currentWeek.week}: ${currentWeek.theme}`}
          subtext={currentWeek.story.de}
          marginBottom="$4"
        />

        <YStack gap="$3">
          {runnerTasks.map((task) => (
            <Pressable
              key={task.id}
              accessibilityRole="button"
              onPress={() => router.push(`/lesson-runner/${task.id}`)}
              style={{ width: "100%" }}
            >
              {(() => {
                const resume = resumeMap[task.id];
                const status = getLessonStatus({
                  completed: completedMap[task.id],
                  resumeStep: resume?.stepIndex,
                  totalSteps: resume?.totalSteps,
                });
                const style = getCardStatusStyle(status);
                return (
                  <Stack
                    paddingHorizontal="$3"
                    paddingVertical="$3"
                    borderRadius="$6"
                    backgroundColor={style.bg}
                  >
                    <YStack gap="$1">
                      <Text fontWeight="900" color="$text" numberOfLines={1}>
                        {task.title}
                      </Text>
                      <Text color="$muted" numberOfLines={2}>
                        {task.subtitle}
                      </Text>
                    </YStack>
                    <Stack marginTop="$2">
                      <Text color="$muted" fontSize={12}>
                        {task.duration}
                      </Text>
                    </Stack>
                  </Stack>
                );
              })()}
            </Pressable>
          ))}
        </YStack>
      </ScrollView>
    </ScreenShell>
  );
}
