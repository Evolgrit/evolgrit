import React, { useEffect, useState } from "react";
import { ScrollView } from "react-native";
import { useRouter } from "expo-router";
import { Stack } from "tamagui";
import { ScreenShell } from "../../components/system/ScreenShell";
import { SectionHeader } from "../../components/system/SectionHeader";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { PullDownToDismiss } from "../../components/navigation/PullDownToDismiss";
import { NavBackButton } from "../../components/system/NavBackButton";
import { LevelCard } from "../../components/system/LevelCard";
import { getCompletedCount } from "../../lib/progressStore";
import { getUnlockAt, getUnlocked } from "../../lib/progress/unlocks";

const DEV_UNLOCK_ALL_LEVELS =
  typeof __DEV__ !== "undefined" ? __DEV__ : process.env.NODE_ENV !== "production";

const LEVEL_IMAGES = {
  A1: require("../../assets/learn/levels/a1.png"),
  A2: require("../../assets/learn/levels/a2.png"),
  B1: require("../../assets/learn/levels/b1.png"),
  B2: require("../../assets/learn/levels/b2.png"),
} as const;

export default function LanguageScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const TAB_BAR_HEIGHT = 80;
  const [a2Unlocked, setA2Unlocked] = useState(false);
  const [a2UnlockAt, setA2UnlockAt] = useState(0);
  const [a1Completed, setA1Completed] = useState(false);

  useEffect(() => {
    let isMounted = true;
    Promise.all([getUnlocked("A2"), getUnlockAt("A2"), getCompletedCount("A1")]).then(([unlocked, unlockedAt, completedCount]) => {
      if (!isMounted) return;
      setA2Unlocked(unlocked);
      setA2UnlockAt(unlockedAt);
      setA1Completed(completedCount >= 8);
    });
    return () => {
      isMounted = false;
    };
  }, []);

  const levels = [
    {
      level: "A1",
      subtitle: "Ankommen",
      subtitleUnlocked: "Ankommen",
      status: "completed",
      route: "/learn/a1",
      image: LEVEL_IMAGES.A1,
    },
    {
      level: "A2",
      title: "A2 Alltag",
      subtitle: a2Unlocked ? "Mehr Sicherheit im Alltag" : "Wird nach A1 freigeschaltet",
      subtitleUnlocked: "Mehr Sicherheit im Alltag",
      status: a2Unlocked ? "current" : "locked",
      route: "/learn/level/A2",
      image: LEVEL_IMAGES.A2,
      badgeText:
        a2Unlocked && a2UnlockAt && Date.now() - a2UnlockAt < 48 * 60 * 60 * 1000
          ? "Neu"
          : a1Completed
          ? "A2 freigeschaltet"
          : undefined,
      statusLabel: a2Unlocked ? "Start" : "Gesperrt",
      statusBg: "rgba(0,0,0,0.08)",
      statusColor: a2Unlocked ? "$text" : "$muted",
    },
    {
      level: "B1",
      subtitle: "Prüfungsmodus",
      subtitleUnlocked: "Prüfungsmodus",
      status: "current",
      route: "/learn/level/B1",
      image: LEVEL_IMAGES.B1,
    },
    {
      level: "B2",
      subtitle: "Sicher im Job",
      subtitleUnlocked: "Sicher im Job",
      status: "locked",
      route: "/learn/level/B2",
      image: LEVEL_IMAGES.B2,
      locked: true,
    },
  ];

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
            {levels.map((lvl) => {
              const effectiveLocked = DEV_UNLOCK_ALL_LEVELS ? false : lvl.status === "locked";
              const effectiveStatus = DEV_UNLOCK_ALL_LEVELS ? "current" : lvl.status;
              const effectiveSubtitle = DEV_UNLOCK_ALL_LEVELS
                ? (lvl as any).subtitleUnlocked ?? lvl.subtitle
                : lvl.subtitle;
              const effectiveStatusLabel = DEV_UNLOCK_ALL_LEVELS ? "Ready" : (lvl as any).statusLabel;
              const effectiveBadgeText = DEV_UNLOCK_ALL_LEVELS ? undefined : (lvl as any).badgeText;
              const effectiveStatusBg = DEV_UNLOCK_ALL_LEVELS ? "rgba(0,0,0,0.08)" : (lvl as any).statusBg;
              const effectiveStatusColor = DEV_UNLOCK_ALL_LEVELS ? "$text" : (lvl as any).statusColor;

              return (
                <Stack key={lvl.level} flexBasis="48%">
                  <LevelCard
                    level={lvl.level}
                    title={(lvl as any).title ?? lvl.level}
                    subtitle={effectiveSubtitle}
                    status={effectiveStatus as any}
                    imageSource={lvl.image}
                    disabled={effectiveLocked}
                    badgeText={effectiveBadgeText}
                    statusLabel={effectiveStatusLabel}
                    statusBg={effectiveStatusBg}
                    statusColor={effectiveStatusColor}
                    onPress={() => {
                      if (effectiveLocked && !DEV_UNLOCK_ALL_LEVELS) {
                        return;
                      }
                      if (lvl.route) {
                        router.push({ pathname: lvl.route as any });
                      } else {
                        router.push({ pathname: "/lesson", params: { lessonId: lvl.lessonId } });
                      }
                    }}
                  />
                </Stack>
              );
            })}
          </Stack>
        </ScrollView>
      </PullDownToDismiss>
    </ScreenShell>
  );
}
