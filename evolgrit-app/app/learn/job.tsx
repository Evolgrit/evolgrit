import React from "react";
import { ScrollView } from "react-native";
import { useRouter } from "expo-router";
import { Stack, Text, YStack } from "tamagui";
import { ScreenShell } from "../../components/system/ScreenShell";
import { SectionHeader } from "../../components/system/SectionHeader";
import { TileGrid } from "../../components/system/TileGrid";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { PullDownToDismiss } from "../../components/navigation/PullDownToDismiss";
import { NavBackButton } from "../../components/system/NavBackButton";
import { SoftButton } from "../../components/system/SoftButton";

const topics = [
  { title: "Bewerbung", hint: "CV + kurze E-Mail", lessonId: "a1_introduce" },
  { title: "Telefonate", hint: "Termine & Nachfragen", lessonId: "a1_ask_direction" },
  { title: "Interview", hint: "Kurz vorstellen", lessonId: "a1_introduce" },
  { title: "Arbeitsalltag", hint: "Aufgaben klären", lessonId: "a1_ask_help" },
  { title: "Behörden", hint: "Formulare & Termine", lessonId: "a1_goodbye_evening" },
  { title: "Konflikte", hint: "Höflich reklamieren", lessonId: "a1_shop_price" },
];

export default function JobScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const TAB_BAR_HEIGHT = 80;

  return (
    <ScreenShell
      title="Job & Zukunft"
      leftContent={<NavBackButton fallbackRoute="/(tabs)/learn" />}
    >
      <PullDownToDismiss>
        <ScrollView contentContainerStyle={{ paddingBottom: insets.bottom + TAB_BAR_HEIGHT + 16 }}>
          <SectionHeader
            label="Job"
            title="Job & Zukunft"
            subtext="Kurze Aufgaben, die dich job-ready machen."
            marginBottom="$4"
          />

          <TileGrid>
            {topics.map((item) => (
              <YStack key={item.title} padding="$3" gap="$2" borderRadius="$6" backgroundColor="$background">
                <Text fontWeight="900" color="$text">
                  {item.title}
                </Text>
                <Text color="$muted">{item.hint}</Text>
                <Stack marginTop="$3">
                  <SoftButton
                    label="Öffnen"
                    onPress={() => router.push({ pathname: "/lesson", params: { lessonId: item.lessonId } })}
                  />
                </Stack>
              </YStack>
            ))}
          </TileGrid>
        </ScrollView>
      </PullDownToDismiss>
    </ScreenShell>
  );
}
