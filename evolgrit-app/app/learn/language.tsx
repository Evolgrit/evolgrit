import React from "react";
import { ScrollView } from "react-native";
import { useRouter } from "expo-router";
import { Stack } from "tamagui";
import { ScreenShell } from "../../components/system/ScreenShell";
import { SectionHeader } from "../../components/system/SectionHeader";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { PullDownToDismiss } from "../../components/navigation/PullDownToDismiss";
import { NavBackButton } from "../../components/system/NavBackButton";
import { LevelCard } from "../../components/system/LevelCard";

const LEVEL_IMAGES = {
  A1: require("../../assets/learn/levels/a1.png"),
  A2: require("../../assets/learn/levels/a2.png"),
  B1: require("../../assets/learn/levels/b1.png"),
  B2: require("../../assets/learn/levels/b2.png"),
} as const;

const levels = [
  {
    level: "A1",
    subtitle: "Ankommen",
    status: "completed",
    route: "/learn/a1",
    image: LEVEL_IMAGES.A1,
  },
  {
    level: "A2",
    subtitle: "Alltag",
    status: "completed",
    lessonId: "a1_introduce",
    image: LEVEL_IMAGES.A2,
  },
  {
    level: "B1",
    subtitle: "Prüfungsmodus",
    status: "current",
    route: "/learn/b1",
    image: LEVEL_IMAGES.B1,
  },
  {
    level: "B2",
    subtitle: "Sicher im Job",
    status: "locked",
    lessonId: "a1_introduce",
    image: LEVEL_IMAGES.B2,
  },
];

export default function LanguageScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const TAB_BAR_HEIGHT = 80;

  return (
    <ScreenShell
      title="Sprache"
      leftContent={<NavBackButton fallbackRoute="/(tabs)/learn" />}
    >
      <PullDownToDismiss>
        <ScrollView contentContainerStyle={{ paddingBottom: insets.bottom + TAB_BAR_HEIGHT + 16 }}>
          <SectionHeader
            label="Language"
            title="Sprache"
            subtext="Wähle dein Niveau. Ein klarer Pfad ohne Überforderung."
            marginBottom="$4"
          />

          <Stack flexDirection="row" flexWrap="wrap" gap="$3" justifyContent="space-between">
            {levels.map((lvl) => (
              <Stack key={lvl.level} flexBasis="48%">
                <LevelCard
                  level={lvl.level}
                  title={lvl.level}
                  subtitle={lvl.subtitle}
                  status={lvl.status as any}
                  imageSource={lvl.image}
                  disabled={lvl.status === "locked"}
                  onPress={() => {
                    if (lvl.status === "locked") return;
                    if (lvl.route) {
                      router.push({ pathname: lvl.route as any });
                    } else {
                      router.push({ pathname: "/lesson", params: { lessonId: lvl.lessonId } });
                    }
                  }}
                />
              </Stack>
            ))}
          </Stack>
        </ScrollView>
      </PullDownToDismiss>
    </ScreenShell>
  );
}
