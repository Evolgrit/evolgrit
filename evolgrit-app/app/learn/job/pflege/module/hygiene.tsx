import React from "react";
import { Pressable, ScrollView } from "react-native";
import { useRouter } from "expo-router";
import { Text, YStack } from "tamagui";
import { ScreenShell } from "../../../../../components/system/ScreenShell";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const moduleData = require("../../../../../content/job/pflege/module_hygiene_01.json");

export default function PflegeModuleHygieneScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  return (
    <ScreenShell title="Pflege · Hygiene" showBack>
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
