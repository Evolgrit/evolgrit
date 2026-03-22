import React, { useMemo } from "react";
import { Pressable } from "react-native";
import { useRouter } from "expo-router";
import { Stack, Text } from "tamagui";

import { GlassCard } from "../../components/system/GlassCard";
import { ScreenShell } from "../../components/system/ScreenShell";
import { loadAvatars } from "../../lib/avatars/loadAvatars";
import { useSelectedAvatarId } from "../../lib/avatars/avatarStore";
import { useSelectedJobTrack } from "../../lib/jobStore";
import { setLastJobFocus } from "../../lib/nextActionStore";
import { useI18n } from "../../lib/i18n";

const liveIndex = require("../../content/b1/live/index.json");

type LiveIndexItem = {
  id: string;
  title: string;
  subtitle: string;
  durationMin: number;
  coachName?: string;
};

export default function SpeakTab() {
  const router = useRouter();
  const { t } = useI18n();
  const selectedAvatarId = useSelectedAvatarId();
  const selectedJobTrack = useSelectedJobTrack();
  const coachName = useMemo(() => {
    const avatars = loadAvatars();
    return avatars.find((avatar) => avatar.id === selectedAvatarId)?.name ?? t("speak.coach_fallback");
  }, [selectedAvatarId, t]);

  const liveItems: LiveIndexItem[] = Array.isArray(liveIndex?.items) ? liveIndex.items : [];
  const filteredItems = useMemo(() => {
    const pflegeItems = liveItems.filter((item) => item.id.startsWith("pflege_"));
    const generalItems = liveItems.filter((item) => !item.id.startsWith("pflege_"));
    if (selectedJobTrack === "pflege") {
      return [...pflegeItems, ...generalItems];
    }
    return generalItems;
  }, [liveItems, selectedJobTrack]);

  return (
    <ScreenShell title={t("speak.title")}>
      <Stack flex={1} gap={12}>
        <Stack gap={4}>
          <Text fontSize={22} fontWeight="900" color="$text">
            {t("speak.title")}
          </Text>
          <Text color="$muted">{t("speak.subtitle")}</Text>
        </Stack>

        <GlassCard>
          <Text fontWeight="800" color="$text" marginBottom={8}>
            {t("speak.next_exercise_title")}
          </Text>
          <Text color="$muted" marginBottom={12}>
            {t("speak.next_exercise_sub")}
          </Text>
          <Text color="$textHint" fontSize={12} textAlign="right">
            {t("common.tap_to_start")}
          </Text>
        </GlassCard>

        <Stack gap={4} marginTop={8}>
          <Text fontSize={18} fontWeight="800" color="$text">
            {t("speak.live_title")}
          </Text>
          <Text color="$muted">{t("speak.live_sub")}</Text>
        </Stack>

        {filteredItems.map((item) => (
          <Pressable
            key={item.id}
            accessibilityRole="button"
            onPress={() => router.push(`/speak/live/${item.id}`)}
          >
            <GlassCard>
              <Text fontWeight="800" color="$text" marginBottom={6}>
                {item.title}
              </Text>
              <Text color="$muted" marginBottom={12}>
                {item.subtitle}
              </Text>
              <Text color="$muted" marginBottom={12}>
                {t("speak.coach_label", { name: item.coachName ?? coachName })}
              </Text>
              <Text color="$muted" marginBottom={12}>
                {t("common.minutes_short_approx", { count: item.durationMin })}
              </Text>
              <Text color="$textHint" fontSize={12} textAlign="right">
                {t("common.tap_to_start")}
              </Text>
            </GlassCard>
          </Pressable>
        ))}

        <Stack gap={4} marginTop={12}>
          <Text fontSize={18} fontWeight="800" color="$text">
            {t("speak.job_title")}
          </Text>
          <Text color="$muted">{t("speak.job_sub")}</Text>
        </Stack>

        <Pressable
          accessibilityRole="button"
          onPress={async () => {
            await setLastJobFocus("pflege");
            router.push("/learn/job/pflege");
          }}
        >
          <GlassCard>
            <Text fontWeight="800" color="$text" marginBottom={6}>
              {t("speak.job_module_1_title")}
            </Text>
          <Text color="$muted" marginBottom={12}>
            {t("speak.job_module_1_sub")}
          </Text>
          <Text color="$textHint" fontSize={12} textAlign="right">
            {t("common.tap_to_start")}
          </Text>
        </GlassCard>
      </Pressable>

        <Pressable
          accessibilityRole="button"
          onPress={async () => {
            await setLastJobFocus("pflege");
            router.push("/learn/job/pflege/module/02");
          }}
        >
          <GlassCard>
            <Text fontWeight="800" color="$text" marginBottom={6}>
              {t("speak.job_module_2_title")}
            </Text>
          <Text color="$muted" marginBottom={12}>
            {t("speak.job_module_2_sub")}
          </Text>
          <Text color="$textHint" fontSize={12} textAlign="right">
            {t("common.tap_to_start")}
          </Text>
        </GlassCard>
      </Pressable>

        <Pressable
          accessibilityRole="button"
          onPress={async () => {
            await setLastJobFocus("pflege");
            router.push("/learn/job/pflege/module/03");
          }}
        >
          <GlassCard>
            <Text fontWeight="800" color="$text" marginBottom={6}>
              {t("speak.job_module_3_title")}
            </Text>
          <Text color="$muted" marginBottom={12}>
            {t("speak.job_module_3_sub")}
          </Text>
          <Text color="$textHint" fontSize={12} textAlign="right">
            {t("common.tap_to_start")}
          </Text>
        </GlassCard>
      </Pressable>

        <Pressable
          accessibilityRole="button"
          onPress={async () => {
            await setLastJobFocus("pflege");
            router.push("/learn/job/pflege/module/04");
          }}
        >
          <GlassCard>
            <Text fontWeight="800" color="$text" marginBottom={6}>
              {t("speak.job_module_4_title")}
            </Text>
          <Text color="$muted" marginBottom={12}>
            {t("speak.job_module_4_sub")}
          </Text>
          <Text color="$textHint" fontSize={12} textAlign="right">
            {t("common.tap_to_start")}
          </Text>
        </GlassCard>
      </Pressable>
      </Stack>
    </ScreenShell>
  );
}
