import React, { useEffect, useMemo, useState } from "react";
import { Pressable, ScrollView, Image } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { Stack, Text } from "tamagui";
import { useRouter } from "expo-router";

import { loadLangPrefs } from "../lib/languagePrefs";
import { loadCurrentERS } from "../lib/readinessService";
import { ersMin, limiterOf, type ERS } from "../lib/ersStore";
import { getRiskState, type RiskState } from "../lib/riskService";
import { loadPhaseState, unlockAllWeeksForCurrentPhase } from "../lib/phaseStateStore";
import { getDevMode, setDevMode } from "../lib/devModeStore";
import { getAvatarUri, setAvatarUri } from "../lib/profileAvatarStore";
import { GlassCard } from "../components/system/GlassCard";
import { ListRow } from "../components/system/ListRow";

export default function Profile() {
  const router = useRouter();

  const [nativeLang, setNativeLang] = useState("en");
  const [targetLang] = useState("de");
  const [ers, setErs] = useState<ERS | null>(null);
  const [risk, setRisk] = useState<RiskState>("green");
  const [phaseText, setPhaseText] = useState<string>("A1 · Week 1");
  const [devMode, setDevModeState] = useState(false);
  const [avatarUri, setAvatarUriState] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      const prefs = await loadLangPrefs();
      if (prefs?.nativeLang) setNativeLang(prefs.nativeLang);
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
    if (limiter === "A") return "Application";
    if (limiter === "C") return "Consistency";
    if (limiter === "L") return "Language";
    return "Stability";
  }, [limiter]);

  function flagFor(lang: string) {
    const map: Record<string, string> = {
      en: "🇬🇧",
      tr: "🇹🇷",
      pl: "🇵🇱",
      ar: "🇸🇦",
      ro: "🇷🇴",
      uk: "🇺🇦",
      ru: "🇷🇺",
      de: "🇩🇪",
    };
    return map[lang] ?? "🏳️";
  }

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
        <Text fontSize={16} fontWeight="900" color="$text">
          Profile
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
                {nativeLang} → {targetLang}
              </Text>
            </Stack>
            <Ionicons name="chevron-forward" size={18} color="rgba(17,24,39,0.25)" />
          </Stack>
        </GlassCard>

        <GlassCard padding={0} marginBottom={12}>
          <ListRow
            icon={<Ionicons name="settings-outline" size={18} color="#111827" />}
            title="Einstellungen"
            subtitle="Allgemein, Erinnerungen, Tonaufnahmen"
            onPress={() => router.push("/settings")}
          />
          <ListRow icon={<Ionicons name="image-outline" size={18} color="#111827" />} title="Change photo" onPress={pickAvatar} />
          <ListRow
            icon={<Ionicons name="language-outline" size={18} color="#111827" />}
            title="Language"
            subtitle={`${nativeLang} → ${targetLang}`}
            value={`${flagFor(nativeLang)} → ${flagFor("de")}`}
          />
          <ListRow
            icon={<Ionicons name="analytics-outline" size={18} color="#111827" />}
            title="Readiness"
            subtitle={`Score ${score} · Focus ${limiterLabel}`}
            value={risk === "red" ? "Risk" : risk === "yellow" ? "Watch" : "Stable"}
            onPress={() => router.push("/(tabs)/progress")}
          />
          <ListRow
            icon={<Ionicons name="calendar-outline" size={18} color="#111827" />}
            title="Mood & check-ins"
            subtitle="Log how you feel today"
            onPress={() => router.push("/profile-mood")}
          />
        </GlassCard>

        <GlassCard padding={0} marginBottom={12}>
          <ListRow
            icon={<Ionicons name="briefcase-outline" size={18} color="#111827" />}
            title="Phase"
            subtitle={phaseText}
          />
          {devMode ? (
            <ListRow
              icon={<Ionicons name="airplane-outline" size={18} color="#111827" />}
              title="Open Demo"
              subtitle="Investor walkthrough"
              onPress={() => router.push("/demo")}
            />
          ) : null}
        </GlassCard>

        <GlassCard padding={0} marginBottom={12}>
          <ListRow
            icon={<Ionicons name="lock-open-outline" size={18} color="#111827" />}
            title={`Developer Mode: ${devMode ? "ON" : "OFF"}`}
            onPress={async () => {
              const next = !devMode;
              await setDevMode(next);
              setDevModeState(next);
            }}
          />
          {devMode ? (
            <ListRow
              icon={<Ionicons name="flash-outline" size={18} color="#111827" />}
              title="Unlock all weeks"
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
