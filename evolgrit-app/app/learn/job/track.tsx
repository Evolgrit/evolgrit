import React, { useEffect, useMemo, useState } from "react";
import { Pressable, ScrollView } from "react-native";
import { useRouter } from "expo-router";
import { Text, XStack, YStack } from "tamagui";
import { ScreenShell } from "../../../components/system/ScreenShell";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useSelectedJobTrackOptional } from "../../../lib/jobStore";
import { setLastJobFocus } from "../../../lib/nextActionStore";
import { getDevMode } from "../../../lib/devModeStore";
import { JOBS } from "../../../lib/data/jobs";
import { useI18n } from "../../../lib/i18n";

type ModuleItem = {
  id: string;
  title: string;
  subtitle: string;
  durationMin: number;
  lessonRunnerId?: string;
  liveId?: string;
};

const TRACKS = JOBS.map((job) => ({ id: job.id, title: job.title, subtitle: job.subtitle }));

const pflegeContent = require("../../../content/job/pflege/index.json");

export default function JobTrackScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const selectedTrack = useSelectedJobTrackOptional();
  const [devMode, setDevModeState] = useState(false);
  const { t } = useI18n();

  const pflegeModules: ModuleItem[] = Array.isArray(pflegeContent?.modules)
    ? pflegeContent.modules
    : [];

  const tracksToShow = useMemo(() => {
    if (devMode) return TRACKS;
    if (!selectedTrack) return TRACKS;
    return TRACKS.filter((track) => track.id === selectedTrack);
  }, [devMode, selectedTrack]);

  useEffect(() => {
    getDevMode().then((enabled) => setDevModeState(enabled));
  }, []);

  return (
    <ScreenShell title={t("job.track_title")} showBack>
      <ScrollView contentContainerStyle={{ paddingBottom: insets.bottom + 24 }}>
        <YStack padding="$4" gap="$4">
          <XStack alignItems="center" justifyContent="space-between">
            <YStack>
              <Text fontSize={20} fontWeight="900" color="$text">
                {t("job.track_title")}
              </Text>
              <Text color="$muted">{t("job.track_subtitle")}</Text>
            </YStack>
            <Pressable
              accessibilityRole="button"
              onPress={() => router.push("/learn/job")}
            >
              <Text color="$muted" fontWeight="700">
                {t("job.change_track")}
              </Text>
            </Pressable>
          </XStack>

          {tracksToShow.map((track) => {
            const isSelected = track.id === selectedTrack;
            const modules = track.id === "pflege" ? pflegeModules : [];
            return (
              <YStack
                key={track.id}
                padding="$4"
                borderRadius="$6"
                backgroundColor={isSelected ? "rgba(0,0,0,0.06)" : "rgba(0,0,0,0.04)"}
                gap="$3"
              >
                <Text fontWeight="800" color="$text">
                  {track.title}
                </Text>
                <Text color="$muted">{track.subtitle}</Text>

                {modules.length ? (
                  <YStack gap="$3" marginTop="$2">
                    {modules.map((mod) => (
                      <Pressable
                        key={mod.id}
                        accessibilityRole="button"
                        onPress={async () => {
                          await setLastJobFocus(track.id);
                          if (mod.lessonRunnerId) {
                            router.push(`/lesson-runner/${mod.lessonRunnerId}`);
                          } else if (mod.liveId) {
                            router.push(`/speak/live/${mod.liveId}`);
                          }
                        }}
                      >
                        <YStack
                          padding="$3"
                          borderRadius="$6"
                          backgroundColor="rgba(0,0,0,0.04)"
                          gap="$2"
                        >
                          <Text fontWeight="700" color="$text">
                            {mod.title}
                          </Text>
                          <Text color="$muted">{mod.subtitle}</Text>
                          <Text color="$muted">{t("common.minutes_short_approx", { count: mod.durationMin })}</Text>
                        </YStack>
                      </Pressable>
                    ))}
                  </YStack>
                ) : (
                  <Text color="$muted">{t("job.coming_soon")}</Text>
                )}
              </YStack>
            );
          })}
        </YStack>
      </ScrollView>
    </ScreenShell>
  );
}
