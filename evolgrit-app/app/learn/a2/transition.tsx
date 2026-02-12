import React from "react";
import { Pressable, ScrollView } from "react-native";
import { Stack, Text, XStack, YStack } from "tamagui";
import { useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { ScreenShell } from "../../../components/system/ScreenShell";
import { SectionHeader } from "../../../components/system/SectionHeader";
import { SoftButton } from "../../../components/system/SoftButton";

const TAB_BAR_HEIGHT = 80;

export default function A2TransitionScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const actions = [
    {
      id: "a2",
      title: "A2 starten",
      subtitle: "Weiter mit A2 fortsetzen.",
      onPress: () => router.push("/learn/a2"),
    },
    {
      id: "a1",
      title: "A1 wiederholen",
      subtitle: "Zur A1 Übersicht zurück.",
      onPress: () => router.push("/learn/a1"),
    },
    {
      id: "later",
      title: "Später",
      subtitle: "Zurück zur Übersicht.",
      onPress: () => router.back(),
    },
  ];

  return (
    <ScreenShell title="A2" backgroundColor="#FFFFFF">
      <ScrollView contentContainerStyle={{ paddingBottom: insets.bottom + TAB_BAR_HEIGHT + 16 }}>
        <SectionHeader
          label="A1"
          title="A1 geschafft."
          subtext="Du kannst jetzt einfache Gespräche führen. Als Nächstes festigen wir A2."
          marginBottom="$4"
        />

        <YStack gap="$3">
          {actions.map((action) => (
            <Pressable key={action.id} accessibilityRole="button" onPress={action.onPress} style={{ width: "100%" }}>
              <Stack
                paddingHorizontal="$3"
                paddingVertical="$3"
                borderRadius="$6"
                backgroundColor="rgba(0,0,0,0.02)"
                style={{
                }}
              >
                <XStack alignItems="center" gap="$3">
                  <YStack flex={1} gap="$1" minWidth={0}>
                    <Text fontWeight="900" color="$text" numberOfLines={1}>
                      {action.title}
                    </Text>
                    <Text color="$muted" numberOfLines={2}>
                      {action.subtitle}
                    </Text>
                  </YStack>
                  <SoftButton label="Weiter" onPress={action.onPress} />
                </XStack>
              </Stack>
            </Pressable>
          ))}
        </YStack>

        <YStack marginTop="$4">
          <SoftButton label="Review öffnen" onPress={() => router.push("/learn/a1/review")} />
        </YStack>
      </ScrollView>
    </ScreenShell>
  );
}
