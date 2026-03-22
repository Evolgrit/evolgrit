import React from "react";
import { Pressable, ScrollView } from "react-native";
import { useRouter } from "expo-router";
import { Text, XStack, YStack } from "tamagui";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { ScreenShell } from "../../../components/system/ScreenShell";
import { NavBackButton } from "../../../components/system/NavBackButton";
import { loadLifeModules } from "../../../lib/content/loadLife";

const TAB_BAR_HEIGHT = 80;

function moduleBg(moduleId: string) {
  if (moduleId.endsWith("_time")) return "$surfaceLife";
  if (moduleId.endsWith("_directness")) return "$surfaceLanguage";
  if (moduleId.endsWith("_neighbors")) return "$surfaceFocus";
  if (moduleId.endsWith("_rules")) return "$surfaceJob";
  if (moduleId.endsWith("_money")) return "$surfaceLife";
  if (moduleId.endsWith("_help")) return "$surfaceLanguage";
  return "$gray2";
}

function ModuleCard({
  title,
  subtitle,
  durationMin,
  onPress,
  bg,
}: {
  title: string;
  subtitle: string;
  durationMin: number;
  onPress: () => void;
  bg: string;
}) {
  return (
    <Pressable accessibilityRole="button" onPress={onPress} style={{ width: "100%" }}>
      <YStack
        padding="$4"
        borderRadius="$6"
        backgroundColor={bg}
        gap="$2"
      >
        <XStack alignItems="center" justifyContent="space-between">
          <Text fontSize="$6" fontWeight="700" color="$text">
            {title}
          </Text>
          <Text fontSize="$3" color="$textSecondary">
            {durationMin} Min
          </Text>
        </XStack>
        <Text fontSize="$4" color="$textSecondary">
          {subtitle}
        </Text>
      </YStack>
    </Pressable>
  );
}

export default function LifeHubScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const modules = loadLifeModules();

  return (
    <ScreenShell title="Leben in Deutschland" leftContent={<NavBackButton fallbackRoute="/learn" />}>
      <ScrollView contentContainerStyle={{ paddingBottom: insets.bottom + TAB_BAR_HEIGHT + 16 }}>
        <YStack gap="$3" padding="$4">
          {modules.map((m) => (
            <ModuleCard
              key={m.moduleId}
              title={m.title}
              subtitle={m.subtitle}
              durationMin={m.durationMin}
              bg={moduleBg(m.moduleId)}
              onPress={() => router.push(`/learn/life/${m.moduleId}`)}
            />
          ))}
        </YStack>
      </ScrollView>
    </ScreenShell>
  );
}
