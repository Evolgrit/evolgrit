import React, { useMemo } from "react";
import { Pressable, ScrollView } from "react-native";
import { useRouter } from "expo-router";
import { Text, XStack, YStack } from "tamagui";
import { ScreenShell } from "../../../components/system/ScreenShell";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { DEV_SHOW_ALL_JOBS } from "../../../lib/flags";
import { useSelectedJobTrack } from "../../../lib/jobStore";
import { setLastJobFocus } from "../../../lib/nextActionStore";

type ModuleItem = {
  id: string;
  title: string;
  subtitle: string;
  durationMin: number;
  lessonRunnerId?: string;
  liveId?: string;
};

const TRACKS = [
  { id: "pflege", title: "Pflege", subtitle: "Patienten · Übergabe · Alltag" },
  { id: "handwerk", title: "Handwerk", subtitle: "Werkstatt · Baustelle · Team" },
  { id: "gastro", title: "Gastro", subtitle: "Service · Küche · Bestellungen" },
  { id: "logistik", title: "Logistik", subtitle: "Lieferung · Routen · Übergaben" },
  { id: "reinigung", title: "Reinigung", subtitle: "Räume · Aufgaben · Rückmeldung" },
  { id: "lager", title: "Lager", subtitle: "Waren · Ordnung · Rückfragen" },
  { id: "kueche", title: "Küche", subtitle: "Vorbereitung · Abläufe · Hygiene" },
];

const pflegeContent = require("../../../content/job/pflege/index.json");

export default function JobTrackScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const selectedTrack = useSelectedJobTrack();

  const pflegeModules: ModuleItem[] = Array.isArray(pflegeContent?.modules)
    ? pflegeContent.modules
    : [];

  const tracksToShow = useMemo(() => {
    if (DEV_SHOW_ALL_JOBS) return TRACKS;
    return TRACKS.filter((track) => track.id === selectedTrack);
  }, [selectedTrack]);

  return (
    <ScreenShell title="Dein Beruf" showBack>
      <ScrollView contentContainerStyle={{ paddingBottom: insets.bottom + 24 }}>
        <YStack padding="$4" gap="$4">
          <XStack alignItems="center" justifyContent="space-between">
            <YStack>
              <Text fontSize={20} fontWeight="900" color="$text">
                Dein Beruf
              </Text>
              <Text color="$muted">Dein Lernpfad für den Arbeitsalltag.</Text>
            </YStack>
            <Pressable
              accessibilityRole="button"
              onPress={() => router.push("/learn/job")}
            >
              <Text color="$muted" fontWeight="700">
                Beruf wechseln
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
                          <Text color="$muted">~{mod.durationMin} Min</Text>
                        </YStack>
                      </Pressable>
                    ))}
                  </YStack>
                ) : (
                  <Text color="$muted">Kommt bald.</Text>
                )}
              </YStack>
            );
          })}
        </YStack>
      </ScrollView>
    </ScreenShell>
  );
}
