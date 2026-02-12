import React, { useEffect, useState } from "react";
import { Pressable, ScrollView } from "react-native";
import { Stack, Text, YStack } from "tamagui";
import { useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { ScreenShell } from "../../../components/system/ScreenShell";
import { SectionHeader } from "../../../components/system/SectionHeader";
import { NavBackButton } from "../../../components/system/NavBackButton";
import { getProgressState } from "../../../lib/progressStore";
import { getLessonResume, type ResumeInfo } from "../../../lib/progress/lessonProgress";
import { getCardStatusStyle, getLessonStatus } from "../../../components/system/lessonCardStatus";

const TAB_BAR_HEIGHT = 80;

const lessons = [
  { id: "b1_01_smalltalk_opinion", title: "Smalltalk & Meinung", subtitle: "Meinung äußern, zustimmen" },
  { id: "b1_02_phone_reschedule", title: "Termin telefonisch verschieben", subtitle: "Nachfragen und bestätigen" },
  { id: "b1_03_polite_complaint", title: "Beschwerde höflich äußern", subtitle: "Problem erklären, Lösung erbitten" },
  { id: "b1_04_work_problem", title: "Im Job: Problem erklären", subtitle: "Situation ruhig schildern" },
  { id: "b1_05_exam_sim_1", title: "Prüfungssimulation: Teil 1", subtitle: "Kurz & strukturiert" },
  { id: "b1_06_exam_sim_2", title: "Prüfungssimulation: Teil 2", subtitle: "Weiter üben" },
];

export default function B1IndexScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [completedMap, setCompletedMap] = useState<Record<string, boolean>>({});
  const [resumeMap, setResumeMap] = useState<Record<string, ResumeInfo | null>>({});

  useEffect(() => {
    let active = true;
    (async () => {
      const state = await getProgressState();
      const resumes = await Promise.all(lessons.map((lesson) => getLessonResume(lesson.id)));
      const nextResume: Record<string, ResumeInfo | null> = {};
      lessons.forEach((lesson, idx) => {
        nextResume[lesson.id] = resumes[idx] ?? null;
      });
      if (!active) return;
      setCompletedMap(state.completedLessons.B1 ?? {});
      setResumeMap(nextResume);
    })();
    return () => {
      active = false;
    };
  }, []);

  return (
    <ScreenShell title="B1" leftContent={<NavBackButton fallbackRoute="/learn" />} backgroundColor="#FFFFFF">
      <ScrollView contentContainerStyle={{ paddingBottom: insets.bottom + TAB_BAR_HEIGHT + 16 }}>
        <SectionHeader
          label="B1"
          title="B1"
          subtext="Prüfungsmodus – strukturiert & ruhig."
          marginBottom="$4"
        />

        <YStack gap="$3">
          {lessons.map((lesson) => (
            <Pressable
              key={lesson.id}
              accessibilityRole="button"
              onPress={() => router.push(`/lesson-runner/${lesson.id}`)}
              style={{ width: "100%" }}
            >
              {(() => {
                const resume = resumeMap[lesson.id];
                const status = getLessonStatus({
                  completed: completedMap[lesson.id],
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
                    <YStack flex={1} gap="$1" minWidth={0}>
                      <Text fontWeight="900" color="$text" numberOfLines={1}>
                        {lesson.title}
                  </Text>
                  <Text color="$muted" numberOfLines={2}>
                    {lesson.subtitle}
                  </Text>
                </YStack>
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
