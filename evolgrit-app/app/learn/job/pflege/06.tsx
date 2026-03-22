import React, { useState } from "react";
import { Pressable, ScrollView } from "react-native";
import { useRouter } from "expo-router";
import { Text, YStack } from "tamagui";
import { ScreenShell } from "../../../../components/system/ScreenShell";
import { SoftButton } from "../../../../components/system/SoftButton";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { ConfirmModal } from "../../../../components/system/ConfirmModal";
import { deriveNextAction } from "../../../../lib/deriveNextAction";
import { logNextActionShown, setLastJobFocus, type NextAction } from "../../../../lib/nextActionStore";
import { track } from "../../../../lib/tracking";

const moduleData = require("../../../../content/job/pflege/module_06.json");

const skillLessons = [
  {
    id: "pflege_m6_skill_01_vocab",
    title: "Vokabeln",
    subtitle: "Hygiene & Sicherheit",
  },
  {
    id: "pflege_m6_skill_02_word_build",
    title: "Satzbau",
    subtitle: "Sicherheit erklären",
  },
  {
    id: "pflege_m6_skill_03_dialogue_cloze",
    title: "Mini-Dialog",
    subtitle: "Sicherheit im Alltag",
  },
];

export default function PflegeModule06Screen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [hasStarted, setHasStarted] = useState(false);
  const [showNextAction, setShowNextAction] = useState(false);
  const [nextAction, setNextAction] = useState<NextAction | null>(null);

  async function openCompletion() {
    track({
      ts: Date.now(),
      category: "job",
      action: "module_complete",
      level: "JOB_PFLEGE",
      id: moduleData.id,
    }).catch(() => {});
    const action = await deriveNextAction();
    setNextAction(action);
    setShowNextAction(true);
  }

  return (
    <ScreenShell title="Pflege · Modul 6" showBack>
      <ScrollView contentContainerStyle={{ paddingBottom: insets.bottom + 24 }}>
        <YStack padding="$4" gap="$4">
          <YStack gap="$1">
            <Text fontSize={20} fontWeight="900" color="$text">
              {moduleData.title}
            </Text>
            <Text color="$muted">{moduleData.subtitle}</Text>
          </YStack>

          <YStack gap="$2">
            {Array.isArray(moduleData.outcomes) ? (
              moduleData.outcomes.map((item: string, index: number) => (
                <Text key={`${item}-${index}`} color="$muted">
                  • {item}
                </Text>
              ))
            ) : (
              <Text color="$muted">Keine Inhalte gefunden.</Text>
            )}
          </YStack>

          <YStack gap="$2">
            <Text fontSize={16} fontWeight="800" color="$text">
              Skills
            </Text>
            <Text color="$muted">Mini-Lektionen zu Hygiene & Sicherheit</Text>
          </YStack>

          <YStack gap="$3">
            {skillLessons.map((lesson) => (
              <Pressable
                key={lesson.id}
                accessibilityRole="button"
                onPress={async () => {
                  setHasStarted(true);
                  await setLastJobFocus("pflege");
                  router.push(`/lesson-runner/${lesson.id}`);
                }}
              >
                <YStack
                  padding="$4"
                  borderRadius="$6"
                  backgroundColor="rgba(0,0,0,0.04)"
                  gap="$2"
                >
                  <Text fontWeight="800" color="$text">
                    {lesson.title}
                  </Text>
                  <Text color="$muted">{lesson.subtitle}</Text>
                </YStack>
              </Pressable>
            ))}
          </YStack>

          <YStack gap="$2" marginTop="$2">
            <Text fontSize={16} fontWeight="800" color="$text">
              Live-Dialoge
            </Text>
            <Text color="$muted">Händehygiene, Sturzprävention, Klingel</Text>
          </YStack>

          <YStack gap="$3">
            {(moduleData.liveDialogues ?? []).map((dialogueId: string) => {
              const labelMap: Record<string, string> = {
                job_pflege_live_07_hygiene_haende: "Händehygiene",
                job_pflege_live_08_sicherheit_sturz: "Sturzprävention",
                job_pflege_live_09_lagerung_klingel: "Lagerung & Klingel",
              };
              return (
                <Pressable
                  key={dialogueId}
                  accessibilityRole="button"
                  onPress={async () => {
                    setHasStarted(true);
                    await setLastJobFocus("pflege");
                    router.push(`/speak/live/${dialogueId}`);
                  }}
                >
                  <YStack
                    padding="$4"
                    borderRadius="$6"
                    backgroundColor="rgba(0,0,0,0.04)"
                    gap="$2"
                  >
                    <Text fontWeight="800" color="$text">
                      {labelMap[dialogueId] ?? dialogueId}
                    </Text>
                    <Text color="$muted">Live-Dialog</Text>
                  </YStack>
                </Pressable>
              );
            })}
          </YStack>

          {hasStarted ? (
            <SoftButton label="Modul abschließen" onPress={openCompletion} />
          ) : null}
        </YStack>
      </ScrollView>

      <ConfirmModal
        open={showNextAction}
        title="Gut gemacht."
        description="Willst du direkt 3 Minuten weiterüben?"
        onClose={() => setShowNextAction(false)}
        primaryLabel="Jetzt starten · 3 Min"
        secondaryLabel="Später"
        onPrimary={async () => {
          if (!nextAction) return;
          await logNextActionShown(nextAction.type);
          setShowNextAction(false);
          router.push(nextAction.route);
        }}
        onSecondary={() => {
          setShowNextAction(false);
          router.back();
        }}
      />
    </ScreenShell>
  );
}
