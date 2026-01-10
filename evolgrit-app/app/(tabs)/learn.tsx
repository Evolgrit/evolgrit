import React from "react";
import { ScrollView } from "react-native";
import { useRouter } from "expo-router";
import { YStack } from "tamagui";

import { ScreenShell } from "../../components/system/ScreenShell";
import { SectionHeader } from "../../components/system/SectionHeader";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { LearnTrackCard } from "../../components/system/LearnTrackCard";

const TRACK_IMAGES = {
  language: require("../../assets/learn/tracks/language.jpg"),
  life: require("../../assets/learn/tracks/life.jpg"),
  job: require("../../assets/learn/tracks/job.jpg"),
};

export default function LearnTab() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const TAB_BAR_HEIGHT = 80;

  return (
    <ScreenShell title="Learn">
      <ScrollView
        contentContainerStyle={{
          paddingBottom: insets.bottom + TAB_BAR_HEIGHT + 16,
        }}
      >
        <SectionHeader
          label="Learn"
          title="Learn"
          subtext="Guided paths for Sprache, Leben & Job."
          marginBottom="$4"
        />

        <YStack gap="$3" padding="$4">
          <LearnTrackCard
            image={TRACK_IMAGES.language}
            title="Sprache"
            subtitle="A1–B2 · klarer Lernpfad"
            onPress={() => router.push("/learn/language")}
          />

          <LearnTrackCard
            image={TRACK_IMAGES.life}
            title="Leben in Deutschland"
            subtitle="Kultur · Do & Don’t · Alltag"
            onPress={() => router.push("/learn/life")}
          />

          <LearnTrackCard
            image={TRACK_IMAGES.job}
            title="Job & Zukunft"
            subtitle="Bewerbung · Telefonate · Arbeit"
            onPress={() => router.push("/learn/job")}
          />
        </YStack>
      </ScrollView>
    </ScreenShell>
  );
}
