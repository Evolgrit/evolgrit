import React, { useCallback, useState } from "react";
import { LayoutAnimation, Platform, Pressable, ScrollView, UIManager } from "react-native";
import { useRouter } from "expo-router";
import { Text, XStack, YStack, useTheme } from "tamagui";
import { ScreenShell } from "../../../components/system/ScreenShell";
import { setSelectedJobTrack } from "../../../lib/jobStore";
import { setLastJobFocus } from "../../../lib/nextActionStore";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import * as Haptics from "expo-haptics";
import { ChevronDown, ChevronRight, Lock } from "lucide-react-native";
import { DEV_UNLOCK_ALL } from "../../../lib/config/devFlags";
import { JOBS, type JobGroup } from "../../../lib/data/jobs";
import { useI18n } from "../../../lib/i18n";

export default function JobSelectScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [openJobId, setOpenJobId] = useState<string | null>(null);
  const [openUnitId, setOpenUnitId] = useState<string | null>(null);
  const { t } = useI18n();
  const theme = useTheme();
  const iconColor = theme.textSecondary?.val ?? theme.text?.val ?? "black";
  const jobsToShow: JobGroup[] = JOBS;

  const toggleJob = useCallback(
    (jobId: string) => {
      if (Platform.OS === "android" && UIManager.setLayoutAnimationEnabledExperimental) {
        UIManager.setLayoutAnimationEnabledExperimental(true);
      }
      LayoutAnimation.configureNext(
        LayoutAnimation.create(220, LayoutAnimation.Types.easeInEaseOut, LayoutAnimation.Properties.opacity)
      );
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
      setOpenJobId((prev) => (prev === jobId ? null : jobId));
      setOpenUnitId(null);
    },
    []
  );

  const toggleUnit = useCallback((unitId: string) => {
    if (Platform.OS === "android" && UIManager.setLayoutAnimationEnabledExperimental) {
      UIManager.setLayoutAnimationEnabledExperimental(true);
    }
    LayoutAnimation.configureNext(
      LayoutAnimation.create(220, LayoutAnimation.Types.easeInEaseOut, LayoutAnimation.Properties.opacity)
    );
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
    setOpenUnitId((prev) => (prev === unitId ? null : unitId));
  }, []);

  return (
    <ScreenShell title={t("job.title")} showBack>
      <ScrollView contentContainerStyle={{ paddingBottom: insets.bottom + 24 }}>
        <YStack padding="$4" gap="$4">
          <YStack gap="$3">
            {jobsToShow.map((job) => {
              const open = openJobId === job.id;
              return (
                <YStack key={job.id} backgroundColor="$bgSurface" borderRadius="$6">
                  <Pressable
                    accessibilityRole="button"
                    onPress={() => toggleJob(job.id)}
                    style={({ pressed }) => ({
                      transform: [{ scale: pressed ? 0.98 : 1 }],
                    })}
                  >
                    <YStack padding="$4" borderRadius="$6" backgroundColor={job.bg} gap="$2">
                      <XStack alignItems="center" justifyContent="space-between">
                        <YStack gap="$1">
                          <Text fontWeight="800" color="$text">
                            {job.title}
                          </Text>
                          <Text color="$textSecondary">{job.subtitle}</Text>
                        </YStack>
                        {open ? <ChevronDown size={18} color={iconColor} /> : <ChevronRight size={18} color={iconColor} />}
                      </XStack>
                    </YStack>
                  </Pressable>
                  {open ? (
                    <YStack paddingHorizontal="$3" paddingBottom="$3" gap="$2">
                      {job.units.map((unit) => {
                        const unitOpen = openUnitId === unit.id;
                        return (
                          <YStack key={unit.id} gap="$2">
                            <Pressable
                              accessibilityRole="button"
                              onPress={() => toggleUnit(unit.id)}
                              style={({ pressed }) => ({
                                transform: [{ scale: pressed ? 0.98 : 1 }],
                              })}
                            >
                              <XStack
                                alignItems="center"
                                justifyContent="space-between"
                                paddingVertical="$3"
                                paddingHorizontal="$3"
                                borderRadius="$6"
                                backgroundColor="$bgSurface"
                              >
                                <YStack gap="$1" flex={1} minWidth={0}>
                                  <Text fontWeight="700" color="$text" numberOfLines={1}>
                                    {unit.title}
                                  </Text>
                                  {unit.subtitle ? (
                                    <Text color="$textSecondary" numberOfLines={1}>
                                      {unit.subtitle}
                                    </Text>
                                  ) : null}
                                </YStack>
                                {unitOpen ? <ChevronDown size={16} color={iconColor} /> : <ChevronRight size={16} color={iconColor} />}
                              </XStack>
                            </Pressable>
                            {unitOpen ? (
                              <YStack gap="$2" paddingLeft="$2">
                                {unit.modules.map((mod) => {
                                  const isLocked = Boolean(mod.locked) || !mod.route;
                                  const canOpen = DEV_UNLOCK_ALL ? Boolean(mod.route) : !isLocked && Boolean(mod.route);
                                  return (
                                    <Pressable
                                      key={`${unit.id}-${mod.title}`}
                                      accessibilityRole="button"
                                      onPress={async () => {
                                        if (!canOpen) return;
                                        await setSelectedJobTrack(job.id);
                                        await setLastJobFocus(job.id);
                                        router.push(mod.route as any);
                                      }}
                                      style={({ pressed }) => ({
                                        transform: [{ scale: pressed ? 0.98 : 1 }],
                                        opacity: !canOpen ? 0.6 : 1,
                                      })}
                                    >
                                      <XStack
                                        alignItems="center"
                                        justifyContent="space-between"
                                        paddingVertical="$3"
                                        paddingHorizontal="$3"
                                        borderRadius="$6"
                                        backgroundColor="$bgSurface"
                                      >
                                        <YStack gap="$1" flex={1} minWidth={0}>
                                          <Text fontWeight="700" color="$text" numberOfLines={1}>
                                            {mod.title}
                                          </Text>
                                          {mod.subtitle ? (
                                            <Text color="$textSecondary" numberOfLines={1}>
                                              {mod.subtitle}
                                            </Text>
                                          ) : null}
                                        </YStack>
                                        <XStack alignItems="center" gap="$2">
                                          {mod.durationMin ? (
                                            <Text color="$textSecondary" fontSize={12}>
                                              {t("common.minutes_short_approx", { count: mod.durationMin })}
                                            </Text>
                                          ) : null}
                                          {isLocked ? <Lock size={16} color={iconColor} /> : null}
                                        </XStack>
                                      </XStack>
                                    </Pressable>
                                  );
                                })}
                              </YStack>
                            ) : null}
                          </YStack>
                        );
                      })}
                    </YStack>
                  ) : null}
                </YStack>
              );
            })}
          </YStack>
        </YStack>
      </ScrollView>
    </ScreenShell>
  );
}
