import React, { useEffect, useState } from "react";
import { Pressable, ScrollView } from "react-native";
import { Stack, Text, XStack, YStack } from "tamagui";
import { useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { ScreenShell } from "../../../components/system/ScreenShell";
import { SectionHeader } from "../../../components/system/SectionHeader";
import { SoftButton } from "../../../components/system/SoftButton";
import { getReviewStats } from "../../../lib/progress/spaced";

const TAB_BAR_HEIGHT = 80;

export default function A1CompletedScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [stats, setStats] = useState<{ due: number; total: number }>({ due: 0, total: 0 });

  useEffect(() => {
    let isMounted = true;
    getReviewStats("A1").then((next) => {
      if (isMounted) setStats(next);
    });
    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <ScreenShell title="A1" backgroundColor="#FFFFFF">
      <ScrollView contentContainerStyle={{ paddingBottom: insets.bottom + TAB_BAR_HEIGHT + 16 }}>
        <SectionHeader
          label="A1"
          title="A1 geschafft 🎉"
          subtext="A2 ist jetzt freigeschaltet."
          marginBottom="$4"
        />

        <YStack gap="$3">
          <Pressable accessibilityRole="button" onPress={() => router.push("/learn/a1/review")} style={{ width: "100%" }}>
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
                  <Text fontWeight="900" color="$text">
                    A1 Review (5 Minuten)
                  </Text>
                  <Text color="$muted">Fällig: {stats.due} · Gesamt: {stats.total}</Text>
                </YStack>
                <SoftButton label="Start Review" onPress={() => router.push("/learn/a1/review")} />
              </XStack>
            </Stack>
          </Pressable>

          <Pressable accessibilityRole="button" onPress={() => router.push("/learn/a2")} style={{ width: "100%" }}>
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
                  <Text fontWeight="900" color="$text">
                    A2 starten
                  </Text>
                  <Text color="$muted">Weiter mit A2.</Text>
                </YStack>
                <SoftButton label="A2 öffnen" onPress={() => router.push("/learn/a2")} />
              </XStack>
            </Stack>
          </Pressable>
        </YStack>
      </ScrollView>
    </ScreenShell>
  );
}
