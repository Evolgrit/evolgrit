import React from "react";
import { ScrollView, Pressable } from "react-native";
import { Stack, Text, XStack, YStack } from "tamagui";
import { useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { ScreenShell } from "../../../components/system/ScreenShell";
import { NavBackButton } from "../../../components/system/NavBackButton";
import { loadA1Week } from "../../../lib/content/loadA1";
import { HeroImage } from "../../../components/system/HeroImage";
import { SoftButton } from "../../../components/system/SoftButton";

const TAB_BAR_HEIGHT = 80;
const A1_HERO = require("../../../assets/learn/levels/a1-hero.jpg");

export default function A1WeeksScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const weeks = [
    loadA1Week(1),
    { week: 2, theme: "Demnächst", story: { de: "Kommt bald." }, tasks: [] },
    { week: 3, theme: "Demnächst", story: { de: "Kommt bald." }, tasks: [] },
    { week: 4, theme: "Demnächst", story: { de: "Kommt bald." }, tasks: [] },
    { week: 5, theme: "Demnächst", story: { de: "Kommt bald." }, tasks: [] },
    { week: 6, theme: "Demnächst", story: { de: "Kommt bald." }, tasks: [] },
    { week: 7, theme: "Demnächst", story: { de: "Kommt bald." }, tasks: [] },
    { week: 8, theme: "Demnächst", story: { de: "Kommt bald." }, tasks: [] },
  ];
  const contentPadBottom = insets.bottom + TAB_BAR_HEIGHT + 16;

  return (
    <ScreenShell header={<></>} backgroundColor="$background">
      <ScrollView
        contentContainerStyle={{
          paddingHorizontal: 16,
          paddingBottom: contentPadBottom,
          paddingTop: insets.top + 8,
        }}
      >
        {/* Topbar */}
        <XStack alignItems="center" justifyContent="space-between" marginBottom="$3">
          <NavBackButton fallbackRoute="/(tabs)/learn" />
          <Text fontWeight="800" color="$text" fontSize="$6">
            A1
          </Text>
          <Stack width={40} />{/* placeholder for right icon slot */}
        </XStack>

        {/* Hero */}
        <HeroImage source={A1_HERO} />

        {/* Title */}
        <YStack gap="$1" marginTop="$3">
          <Text fontSize="$8" fontWeight="900" color="$text">
            A1 Ankommen
          </Text>
          <Text color="$muted">8 Lektionen · 3-Minuten Aufgaben</Text>
        </YStack>

        {/* Bonus Card */}
        <Pressable
          accessibilityRole="button"
          onPress={() => router.push("/lesson-runner/a1_w1_name")}
          style={{ width: "100%" }}
        >
          <XStack
            marginTop="$4"
            height={76}
            borderRadius="$6"
            backgroundColor="rgba(0,0,0,0.035)"
            paddingHorizontal="$3.5"
            alignItems="center"
            justifyContent="space-between"
          >
            <YStack>
              <Text fontWeight="800" color="$text">
                Bonus · Mini-Lektion
              </Text>
              <Text color="$muted">Kurz und ruhig.</Text>
            </YStack>
            <SoftButton label="Start" />
          </XStack>
        </Pressable>

        {/* Lessons list */}
        <YStack marginTop="$4" gap="$3">
          {weeks.map((w: any) => (
            <YStack key={w.week} paddingHorizontal="$3" paddingVertical="$3" borderRadius="$6" backgroundColor="rgba(0,0,0,0.02)" gap="$2">
              <XStack alignItems="center" gap="$3">
                <YStack flex={1} gap="$1" minWidth={0}>
                  <Text fontWeight="900" color="$text" numberOfLines={1}>
                    Lektion {w.week} · {w.theme}
                  </Text>
                  <Text color="$muted" numberOfLines={2}>
                    {w.story?.de ?? "In Vorbereitung."}
                  </Text>
                </YStack>

                <SoftButton
                  label={w.tasks?.length ? "Start" : "Bald"}
                  tone="strong"
                  disabled={!w.tasks?.length}
                  onPress={() =>
                    router.push({ pathname: "/learn/a1/week/[week]", params: { week: String(w.week) } })
                  }
                />
              </XStack>
            </YStack>
          ))}
        </YStack>
      </ScrollView>
    </ScreenShell>
  );
}
