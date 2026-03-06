import React from "react";
import { ScrollView } from "react-native";
import { useRouter } from "expo-router";
import { YStack } from "tamagui";

import { ScreenShell } from "../../components/system/ScreenShell";
import { SectionHeader } from "../../components/system/SectionHeader";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { LearnTrackCard } from "../../components/system/LearnTrackCard";
import { useI18n } from "../../lib/i18n";

const TRACK_IMAGES = {
  language: require("../../assets/learn/tracks/language.jpg"),
  life: require("../../assets/learn/tracks/life.jpg"),
  job: require("../../assets/learn/tracks/job.jpg"),
};

export default function LearnTab() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const TAB_BAR_HEIGHT = 80;
  const { t } = useI18n();

  return (
    <ScreenShell title={t("learn.title")}>
      <ScrollView
        contentContainerStyle={{
          paddingBottom: insets.bottom + TAB_BAR_HEIGHT + 16,
        }}
      >
        <SectionHeader
          label={t("learn.header.label")}
          title={t("learn.header.title")}
          subtext={t("learn.header.subtext")}
          marginBottom="$4"
        />

        <YStack gap="$3" padding="$4">
          <LearnTrackCard
            image={TRACK_IMAGES.language}
            title={t("learn.track.language.title")}
            subtitle={t("learn.track.language.subtitle")}
            onPress={() => router.push("/learn/language")}
          />

          <LearnTrackCard
            image={TRACK_IMAGES.life}
            title={t("learn.track.life.title")}
            subtitle={t("learn.track.life.subtitle")}
            onPress={() => router.push("/learn/life")}
          />

          <LearnTrackCard
            image={TRACK_IMAGES.job}
            title={t("learn.track.job.title")}
            subtitle={t("learn.track.job.subtitle")}
            onPress={() => router.push("/learn/job")}
          />
        </YStack>
      </ScrollView>
    </ScreenShell>
  );
}
