import React, { useEffect, useState } from "react";
import { ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { Stack, Text } from "tamagui";

import { loadPhaseState, type PhaseState } from "../../lib/phaseStateStore";
import { getDevMode } from "../../lib/devModeStore";
import { getLessonsByLevel } from "../../lessons/catalog";
import type { LessonLevel } from "../../lessons/schema";
import { GlassCard } from "../../components/system/GlassCard";
import { PrimaryButton } from "../../components/system/PrimaryButton";
import { PillButton } from "../../components/system/PillButton";

const C = {
  bg: "#F7F8FA",
  text: "#111827",
  sub: "#6B7280",
};

function Card({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <GlassCard marginBottom={12}>
      <Text fontSize={12} fontWeight="800" color={C.sub} marginBottom={10}>
        {title.toUpperCase()}
      </Text>
      {children}
    </GlassCard>
  );
}

function Pill({ label, active }: { label: string; active?: boolean }) {
  return (
    <Stack
      paddingVertical={8}
      paddingHorizontal={12}
      borderRadius={999}
      borderWidth={1}
      borderColor={active ? "$text" : "$border"}
      backgroundColor="$card"
    >
      <Text fontWeight="800" color="$text">
        {label}
      </Text>
    </Stack>
  );
}

export default function LearnTab() {
  const [phaseState, setPhaseState] = useState<PhaseState | null>(null);
  const [devMode, setDevMode] = useState(false);
  const [selectedLevel, setSelectedLevel] = useState<LessonLevel>("A1");
  const router = useRouter();

  useEffect(() => {
    (async () => {
      setPhaseState(await loadPhaseState());
      setDevMode(await getDevMode());
    })();
  }, []);

  if (!phaseState) {
    return (
      <Stack flex={1} backgroundColor={C.bg} alignItems="center" justifyContent="center">
        <Text color={C.sub}>Loading…</Text>
      </Stack>
    );
  }

  const { phase, week } = phaseState;
  const lessons = getLessonsByLevel(selectedLevel);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: C.bg }}>
      <Stack paddingHorizontal={16} paddingTop={22} paddingBottom={10}>
        <Text fontSize={22} fontWeight="900" color={C.text}>
          Learn
        </Text>
        <Text marginTop={4} color={C.sub}>
          Structured path. No browsing. Unlocks by progress.
        </Text>
        {devMode ? (
          <PillButton
            marginTop={8}
            alignSelf="flex-start"
            label="Open Tour Lesson"
            onPress={() => router.push({ pathname: "/lesson", params: { lessonId: "a1_tour_tickets_photos" } })}
          />
        ) : null}
      </Stack>

      <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 40 }}>
        <Card title="Journey">
          <Stack flexDirection="row" gap={10} flexWrap="wrap">
            {(["A1", "A2"] as LessonLevel[]).map((lvl) => (
              <PillButton
                key={lvl}
                label={lvl}
                disabled={!devMode && lvl !== "A1"}
                backgroundColor={selectedLevel === lvl ? "$card" : "$card"}
                onPress={() => setSelectedLevel(lvl)}
              />
            ))}
          </Stack>
          <Text marginTop={10} color={C.sub}>
            Current:{" "}
            <Text fontWeight="900" color={C.text}>
              {phase}
            </Text>{" "}
            · Week{" "}
            <Text fontWeight="900" color={C.text}>
              {week}
            </Text>
          </Text>
        </Card>

        <Card title="Lessons">
          {lessons.map((lesson) => (
            <GlassCard key={lesson.id} marginBottom={10}>
              <Text fontWeight="900" color={C.text}>
                {lesson.title}
              </Text>
              <Text marginTop={4} color={C.sub}>
                {lesson.capability}
              </Text>

              <Stack marginTop={10}>
                <PrimaryButton onPress={() => router.push(`/lesson?lessonId=${lesson.id}`)} label="Start" />
              </Stack>
            </GlassCard>
          ))}
        </Card>
      </ScrollView>
    </SafeAreaView>
  );
}
