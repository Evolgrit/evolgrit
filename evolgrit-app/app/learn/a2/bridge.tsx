import React from "react";
import { ScrollView } from "react-native";
import { Stack, Text, YStack } from "tamagui";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { ScreenShell } from "../../../components/system/ScreenShell";
import { SectionHeader } from "../../../components/system/SectionHeader";

const items = [
  { title: "Tag 1", hint: "A1 schneller wiederholen" },
  { title: "Tag 2", hint: "Gleiche Szene + ein Wort mehr" },
  { title: "Tag 3", hint: "Mini-Simulation mit 2 Sätzen" },
];

export default function A2Bridge() {
  const insets = useSafeAreaInsets();
  const TAB_BAR_HEIGHT = 80;

  return (
    <ScreenShell title="A2 Bridge">
      <ScrollView contentContainerStyle={{ paddingBottom: insets.bottom + TAB_BAR_HEIGHT + 16 }}>
        <SectionHeader
          label="A2"
          title="Brücke A1 → A2"
          subtext="Kurz, ruhig, 3 Tage à 3 Minuten."
          marginBottom="$4"
        />

        <Stack gap="$3">
          {items.map((item) => (
            <YStack key={item.title} padding="$3" gap="$2" borderRadius="$6" backgroundColor="$background">
              <Text fontWeight="900" color="$text">
                {item.title}
              </Text>
              <Text color="$muted">{item.hint}</Text>
            </YStack>
          ))}
        </Stack>
      </ScrollView>
    </ScreenShell>
  );
}
