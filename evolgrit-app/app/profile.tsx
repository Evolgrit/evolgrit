import React, { useEffect, useMemo, useState } from "react";
import { Pressable, ScrollView, Image } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { Stack, Text } from "tamagui";
import { useRouter } from "expo-router";

import { loadCurrentERS } from "../lib/readinessService";
import { ersMin, limiterOf, type ERS } from "../lib/ersStore";
import { getRiskState, type RiskState } from "../lib/riskService";
import { loadPhaseState, unlockAllWeeksForCurrentPhase } from "../lib/phaseStateStore";
import { getDevMode, setDevMode } from "../lib/devModeStore";
import { getAvatarUri, setAvatarUri } from "../lib/profileAvatarStore";
import { GlassCard } from "../components/system/GlassCard";
import { ListRow } from "../components/system/ListRow";
import { useI18n } from "../lib/i18n";
import { getLanguage } from "../lib/data/languages";
import { useUserSettings } from "../lib/userSettings";

export default function Profile() {
  const router = useRouter();
  const { t } = useI18n();

  const { nativeLanguageCode, targetLanguageCode } = useUserSettings();
  const [ers, setErs] = useState<ERS | null>(null);
  const [risk, setRisk] = useState<RiskState>("green");
  const [phaseText, setPhaseText] = useState<string>("A1 · Week 1");
  const [devMode, setDevModeState] = useState(false);
  const [avatarUri, setAvatarUriState] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      setErs(await loadCurrentERS());
      setRisk(await getRiskState());
      const ps = await loadPhaseState();
      setPhaseText(`${ps.phase} · Week ${ps.week}`);
      setDevModeState(await getDevMode());
      const savedAvatar = await getAvatarUri();
      if (savedAvatar) setAvatarUriState(savedAvatar);
    })();
  }, []);

  const score = ers ? ersMin(ers) : 0;
  const limiter = ers ? limiterOf(ers) : "A";
  const limiterLabel = useMemo(() => {
    if (limiter === "A") return t("profile.limiter_application");
    if (limiter === "C") return t("profile.limiter_consistency");
    if (limiter === "L") return t("profile.limiter_language");
    return t("profile.limiter_stability");
  }, [limiter, t]);

  const nativeLangInfo = getLanguage(nativeLanguageCode);
  const targetLangInfo = getLanguage(targetLanguageCode);
  const speakLabel = `${nativeLangInfo.flag} ${nativeLangInfo.nativeName} (${nativeLangInfo.englishName})`;
  const learnLabel = `${targetLangInfo.flag} ${targetLangInfo.nativeName} (${targetLangInfo.englishName})`;

  async function pickAvatar() {
    const perm = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!perm.granted) return;
    const res = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      quality: 0.9,
    });
    if (!res.canceled && res.assets?.[0]?.uri) {
      setAvatarUriState(res.assets[0].uri);
      await setAvatarUri(res.assets[0].uri);
    }
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#F7F8FA" }}>
      <Stack paddingHorizontal={16} paddingTop={10} paddingBottom={10} flexDirection="row" alignItems="center" justifyContent="space-between">
        <Pressable onPress={() => router.back()} hitSlop={10} style={{ padding: 6 }}>
          <Ionicons name="chevron-back" size={22} color="#111827" />
        </Pressable>
        <Text fontFamily="$heading" fontSize="$screenTitle" lineHeight="$screenTitle" fontWeight="700" color="$text">
          {t("profile.title")}
        </Text>
        <Stack width={34} />
      </Stack>

      <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 24 }}>
        <GlassCard padding={0} marginBottom={12}>
          <Stack flexDirection="row" alignItems="center" padding={14} gap={12}>
            <Stack
              width={46}
              height={46}
              borderRadius={14}
              backgroundColor="$glassDark"
              alignItems="center"
              justifyContent="center"
              overflow="hidden"
            >
              {avatarUri ? (
                <Image source={{ uri: avatarUri }} style={{ width: 46, height: 46 }} />
              ) : (
                <Text color="$textOnDark" fontWeight="900" fontSize={16}>
                  DW
                </Text>
              )}
            </Stack>
            <Stack flex={1}>
              <Text fontSize={16} fontWeight="900" color="$text">
                Daniel West
              </Text>
              <Text color="$muted" marginTop={2}>
                {nativeLanguageCode} → {targetLanguageCode}
              </Text>
            </Stack>
            <Ionicons name="chevron-forward" size={18} color="rgba(17,24,39,0.25)" />
          </Stack>
        </GlassCard>

        <GlassCard padding={0} marginBottom={12}>
          <ListRow
            icon={<Ionicons name="settings-outline" size={18} color="#111827" />}
            title={t("profile.settings")}
            subtitle={t("profile.settings_sub")}
            onPress={() => router.push("/settings")}
          />
          <ListRow
            icon={<Ionicons name="chatbubble-outline" size={18} color="#111827" />}
            title={t("profile.iSpeak")}
            subtitle={speakLabel}
            onPress={() => router.push("/profile/language?mode=native")}
          />
          <ListRow
            icon={<Ionicons name="book-outline" size={18} color="#111827" />}
            title={t("profile.iLearn")}
            subtitle={learnLabel}
            onPress={() => router.push("/profile/language?mode=target")}
          />
          <ListRow icon={<Ionicons name="image-outline" size={18} color="#111827" />} title={t("profile.changePhoto")} onPress={pickAvatar} />
          <ListRow
            icon={<Ionicons name="analytics-outline" size={18} color="#111827" />}
            title={t("profile.readiness")}
            subtitle={t("profile.readiness_sub", { score, focus: limiterLabel })}
            value={risk === "red" ? t("profile.risk") : risk === "yellow" ? t("profile.watch") : t("profile.stable")}
            onPress={() => router.push("/(tabs)/progress")}
          />
          <ListRow
            icon={<Ionicons name="calendar-outline" size={18} color="#111827" />}
            title={t("profile.mood_checkins")}
            subtitle={t("profile.mood_sub")}
            onPress={() => router.push("/profile-mood")}
          />
        </GlassCard>

        <GlassCard padding={0} marginBottom={12}>
          <ListRow
            icon={<Ionicons name="briefcase-outline" size={18} color="#111827" />}
            title={t("profile.phase")}
            subtitle={phaseText}
          />
          {devMode ? (
            <ListRow
              icon={<Ionicons name="airplane-outline" size={18} color="#111827" />}
              title={t("profile.open_demo")}
              subtitle={t("profile.demo_sub")}
              onPress={() => router.push("/demo")}
            />
          ) : null}
        </GlassCard>

        <GlassCard padding={0} marginBottom={12}>
          <ListRow
            icon={<Ionicons name="lock-open-outline" size={18} color="#111827" />}
            title={t("profile.dev_mode", { state: devMode ? t("profile.on") : t("profile.off") })}
            onPress={async () => {
              const next = !devMode;
              await setDevMode(next);
              setDevModeState(next);
            }}
          />
          {devMode ? (
            <ListRow
              icon={<Ionicons name="flash-outline" size={18} color="#111827" />}
              title={t("settings.unlock_weeks")}
              onPress={async () => {
                await unlockAllWeeksForCurrentPhase();
              }}
            />
          ) : null}
        </GlassCard>
      </ScrollView>
    </SafeAreaView>
  );
}
