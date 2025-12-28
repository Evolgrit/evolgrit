import React, { useEffect, useMemo, useState } from "react";
import { View, Text, Pressable, ScrollView, Image } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import * as ImagePicker from "expo-image-picker";

import { loadLangPrefs } from "../lib/languagePrefs";
import { loadCurrentERS } from "../lib/readinessService";
import { ersMin, limiterOf, type ERS } from "../lib/ersStore";
import { getRiskState, type RiskState } from "../lib/riskService";
import { loadPhaseState } from "../lib/phaseStateStore";
import { getDevMode, setDevMode } from "../lib/devModeStore";
import { unlockAllWeeksForCurrentPhase } from "../lib/phaseStateStore";
import { TopBar } from "../components/TopBar";
import { getAvatarUri, setAvatarUri } from "../lib/profileAvatarStore";
import { GlassCard } from "../components/GlassCard";

const C = {
  bg: "#F6F7FB",
  card: "#FFFFFF",
  border: "#E5E7EB",
  text: "#111827",
  sub: "#6B7280",
  dark: "#111827",
};

function Group({ children }: { children: React.ReactNode }) {
  return (
    <GlassCard style={{ marginBottom: 12, padding: 0 }}>
      {children}
    </GlassCard>
  );
}

function Row({
  icon,
  iconBg,
  title,
  subtitle,
  value,
  onPress,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  iconBg: string;
  title: string;
  subtitle?: string;
  value?: string;
  onPress?: () => void;
}) {
  return (
    <Pressable onPress={onPress} style={{ flexDirection: "row", alignItems: "center", paddingHorizontal: 14, paddingVertical: 12 }}>
      <View
        style={{
          width: 34,
          height: 34,
          borderRadius: 10,
          backgroundColor: iconBg,
          alignItems: "center",
          justifyContent: "center",
          marginRight: 12,
        }}
      >
        <Ionicons name={icon} size={18} color="#ffffff" />
      </View>
      <View style={{ flex: 1 }}>
        <Text style={{ fontSize: 15, fontWeight: "700", color: C.text }}>{title}</Text>
        {subtitle ? <Text style={{ marginTop: 2, color: C.sub }}>{subtitle}</Text> : null}
      </View>
      {value ? <Text style={{ color: C.sub, marginRight: 6 }}>{value}</Text> : null}
      <Ionicons name="chevron-forward" size={18} color="rgba(17,24,39,0.25)" />
    </Pressable>
  );
}

export default function Profile() {
  const router = useRouter();

  const [nativeLang, setNativeLang] = useState("en");
  const [targetLang] = useState("de");
  const [ers, setErs] = useState<ERS | null>(null);
  const [risk, setRisk] = useState<RiskState>("green");
  const [phaseText, setPhaseText] = useState<string>("A1 · Week 1");
  const [devMode, setDevModeState] = useState(false);
  const [avatarUri, setAvatarUri] = useState<string | null>(null);

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
      if (savedAvatar) setAvatarUri(savedAvatar);
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

  async function pickAvatar() {
    const perm = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!perm.granted) return;
    const res = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: [ImagePicker.MediaType.Images],
      quality: 0.9,
    });
    if (!res.canceled && res.assets?.[0]?.uri) {
      setAvatarUri(res.assets[0].uri);
      await setAvatarUri(res.assets[0].uri);
    }
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: C.bg }}>
      <TopBar title="Profile" />
      <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 24 }}>
        {/* Account */}
        <Group>
          <View style={{ flexDirection: "row", alignItems: "center", padding: 14 }}>
            <View
              style={{
                width: 42,
                height: 42,
                borderRadius: 12,
                backgroundColor: "#0B1220",
                alignItems: "center",
                justifyContent: "center",
                marginRight: 12,
                overflow: "hidden",
              }}
            >
              {avatarUri ? (
                <Image source={{ uri: avatarUri }} style={{ width: 42, height: 42 }} />
              ) : (
                <Text style={{ color: "#fff", fontWeight: "900", fontSize: 16 }}>DW</Text>
              )}
            </View>
            <View style={{ flex: 1 }}>
              <Text style={{ fontSize: 16, fontWeight: "900", color: C.text }}>Daniel West</Text>
              <Text style={{ color: C.sub, marginTop: 2 }}>{nativeLang} → {targetLang}</Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color="rgba(17,24,39,0.25)" />
          </View>
        </Group>

        <Group>
          <Row
            icon="image-outline"
            iconBg="#9CA3AF"
            title="Change photo"
            onPress={pickAvatar}
          />
          <View style={{ height: 1, backgroundColor: "rgba(229,231,235,0.7)" }} />
          <Row
            icon="language"
            iconBg="#2563EB"
            title="Language"
            subtitle={`${nativeLang} → ${targetLang}`}
            onPress={() => {}}
          />
          <View style={{ height: 1, backgroundColor: "rgba(229,231,235,0.7)" }} />
          <Row
            icon="speedometer-outline"
            iconBg="#0EA5E9"
            title="Readiness"
            subtitle={`Score ${score} · Focus ${limiterLabel}`}
            value={risk === "red" ? "Risk" : risk === "yellow" ? "Watch" : "Stable"}
            onPress={() => router.push("/(tabs)/progress")}
          />
          <View style={{ height: 1, backgroundColor: "rgba(229,231,235,0.7)" }} />
          <Row
            icon="calendar-outline"
            iconBg="#22C55E"
            title="Mood & check-ins"
            subtitle="Log how you feel today"
            onPress={() => router.push("/profile-mood")}
          />
        </Group>

        <Group>
          <Row
            icon="briefcase-outline"
            iconBg="#F59E0B"
            title="Phase"
            subtitle={phaseText}
            onPress={() => {}}
          />
        </Group>

        <Group>
          <Row
            icon="code-outline"
            iconBg="#6366F1"
            title="Developer Mode"
            subtitle={devMode ? "On" : "Off"}
            onPress={async () => {
              const next = !devMode;
              await setDevMode(next);
              setDevModeState(next);
            }}
          />
          <View style={{ height: 1, backgroundColor: "rgba(229,231,235,0.7)" }} />
          <Row
            icon="lock-open-outline"
            iconBg="#10B981"
            title="Unlock all weeks"
            subtitle="For testing"
            onPress={async () => {
              await unlockAllWeeksForCurrentPhase();
            }}
          />
        </Group>
      </ScrollView>
    </SafeAreaView>
  );
}
