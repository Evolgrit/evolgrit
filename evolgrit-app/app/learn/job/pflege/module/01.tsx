import React from "react";
import { Pressable, ScrollView } from "react-native";
import { useRouter } from "expo-router";
import { Text, YStack } from "tamagui";
import { ScreenShell } from "../../../../../components/system/ScreenShell";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const moduleData = require("../../../../../content/job/pflege/module_01.json");
const skillLessons = [
  {
    id: "pflege_m1_skill_01_vocab",
    title: "Vokabeln",
    subtitle: "Aufnahme & Schmerz – Grundwörter",
  },
  {
    id: "pflege_m1_skill_02_word_build",
    title: "Satzbau",
    subtitle: "Sätze ruhig & klar bauen",
  },
  {
    id: "pflege_m1_skill_03_dialogue_cloze",
    title: "Mini-Dialog",
    subtitle: "Kurz antworten – dann nachfragen",
  },
];

export default function PflegeModule01Screen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  return (
    <ScreenShell title="Pflege · Modul 1" showBack>
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
            <Text color="$muted">Mini-Lektionen für Aufnahme & Schmerz</Text>
          </YStack>

          <YStack gap="$3">
            {skillLessons.map((lesson) => (
              <Pressable
                key={lesson.id}
                accessibilityRole="button"
                onPress={() => router.push(`/lesson-runner/${lesson.id}`)}
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
            <Text color="$muted">Aufnahme, Schmerzen, Übergabe</Text>
          </YStack>

          <YStack gap="$3">
            {(moduleData.liveDialogues ?? []).map((dialogueId: string) => {
              const labelMap: Record<string, string> = {
                job_pflege_live_01_aufnahme: "Aufnahme",
                job_pflege_live_02_schmerzen: "Schmerzen abfragen",
                job_pflege_live_03_uebergabe: "Übergabe",
              };
              return (
                <Pressable
                  key={dialogueId}
                  accessibilityRole="button"
                  onPress={() => router.push(`/speak/live/${dialogueId}`)}
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
        </YStack>
      </ScrollView>
    </ScreenShell>
  );
}
