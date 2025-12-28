import React, { useEffect, useMemo, useRef, useState } from "react";
import { Pressable, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import Animated, {
  useAnimatedScrollHandler,
  useSharedValue,
  useAnimatedStyle,
  interpolate,
  Extrapolation,
} from "react-native-reanimated";
import { BlurView } from "expo-blur";
import type { NextAction, NextActionSource } from "../../lib/nextActionService";
import { getNextAction, completeNextActionAndRecompute } from "../../lib/nextActionService";
import { useRouter } from "expo-router";
import { loadLangPrefs } from "../../lib/languagePrefs";
import { resetApp } from "../../lib/resetApp";
import { ReadinessRing } from "../../components/ReadinessRing";
import { loadCurrentERS } from "../../lib/readinessService";
import { appendEventAt, appendEvent } from "../../lib/eventsStore";
import { saveMood } from "../../lib/moodStore";
import { GlassCard } from "../../components/system/GlassCard";
import { PrimaryButton } from "../../components/system/PrimaryButton";
import { SecondaryButton } from "../../components/system/SecondaryButton";
import { PillButton } from "../../components/system/PillButton";
import { Stack, Text } from "tamagui";

type ERS = { L: number; A: number; S: number; C: number };

const ersMin = (e: ERS) => Math.min(e.L, e.A, e.S, e.C);

const MAX_HEADER = 120;
const MIN_HEADER = 68;
const HEADER_RANGE = MAX_HEADER - MIN_HEADER;

function Card({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <GlassCard marginBottom={12}>
      <Text fontSize={14} fontWeight="700" color="#111827" marginBottom={10}>
        {title}
      </Text>
      {children}
    </GlassCard>
  );
}

export default function HomeHub() {
  const [ers, setErs] = useState<ERS>({ L: 32, A: 18, S: 55, C: 40 });
  const [currentERS, setCurrentERS] = useState<ERS | null>(null);
  const [nextAction, setNextAction] = useState<NextAction | null>(null);
  const [nextActionSource, setNextActionSource] = useState<NextActionSource | null>(null);
  const [showAdjustedHint, setShowAdjustedHint] = useState(false);
  const hintTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const router = useRouter();

  const scrollY = useSharedValue(0);

  useEffect(() => {
    (async () => {
      const prefs = await loadLangPrefs();
      if (!prefs) router.replace("/language");
    })();
  }, [router]);

  useEffect(() => {
    (async () => {
      const current = await loadCurrentERS();
      setErs(current);
      setCurrentERS(current);
    })();
  }, []);

  useEffect(() => {
    (async () => {
      const stored = await getNextAction();
      setNextAction(stored.action);
      setNextActionSource(stored.source);
      await appendEvent("next_action_shown", { source: stored.source });
    })();
  }, []);

  const onScroll = useAnimatedScrollHandler({
    onScroll: (e) => {
      scrollY.value = e.contentOffset.y;
    },
  });

  const headerStyle = useAnimatedStyle(() => {
    const h = interpolate(scrollY.value, [0, HEADER_RANGE], [MAX_HEADER, MIN_HEADER], Extrapolation.CLAMP);
    return { height: h };
  });

  const blurStyle = useAnimatedStyle(() => {
    const opacity = interpolate(scrollY.value, [0, 10, 40], [0, 0.4, 1], Extrapolation.CLAMP);
    return { opacity };
  });

  const titleStyle = useAnimatedStyle(() => {
    const scale = interpolate(scrollY.value, [0, HEADER_RANGE], [1, 0.84], Extrapolation.CLAMP);
    const ty = interpolate(scrollY.value, [0, HEADER_RANGE], [0, -6], Extrapolation.CLAMP);
    return {
      transform: [{ scale }, { translateY: ty }],
    };
  });

  const score = useMemo(() => ersMin(ers), [ers]);
  const limiter = useMemo(() => {
    const min = score;
    const entries: [keyof ERS, number][] = [
      ["L", ers.L],
      ["A", ers.A],
      ["S", ers.S],
      ["C", ers.C],
    ];
    return entries.find(([, v]) => v === min)?.[0] ?? "A";
  }, [ers, score]);

  const whatToImprove = useMemo(() => {
    switch (limiter) {
      case "L":
        return "Language is limiting. Do 1 speaking + 1 listening micro-check today.";
      case "A":
        return "Application is limiting. Do 1 real-life simulation (shop / transport / work).";
      case "S":
        return "Stability is limiting. Reduce plan: fewer minutes, higher consistency.";
      case "C":
        return "Consistency is limiting. Make it smaller: 3 minutes daily for 7 days.";
      default:
        return "Do one small step now.";
    }
  }, [limiter]);

  async function onCompleteNextAction() {
    const updated = await completeNextActionAndRecompute();
    setNextAction(updated.action);
    setNextActionSource(updated.source);
  }

  async function onSimulateRisk() {
    const ts = new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString();
    await appendEventAt("next_action_completed", ts, { source: "dev_sim" });
    await completeNextActionAndRecompute();
    const stored = await getNextAction();
    setNextAction(stored.action);
    setNextActionSource(stored.source);
  }

  useEffect(() => {
    return () => {
      if (hintTimer.current) clearTimeout(hintTimer.current);
    };
  }, []);

  async function onCheckin(mood: "calm" | "stressed" | "no_time") {
    await appendEvent("checkin_submitted", { mood });
    await saveMood(new Date(), mood);
    await completeNextActionAndRecompute();
    const stored = await getNextAction();
    setNextAction(stored.action);
    setNextActionSource(stored.source);
    if (hintTimer.current) clearTimeout(hintTimer.current);
    setShowAdjustedHint(true);
    hintTimer.current = setTimeout(() => setShowAdjustedHint(false), 3000);
  }

  if (!nextAction || !currentERS)
    return (
      <SafeAreaView style={{ flex: 1, alignItems: "center", justifyContent: "center", backgroundColor: "#F7F8FA" }}>
        <Text color="#6B7280">Loading next action...</Text>
      </SafeAreaView>
    );

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#F7F8FA" }}>
      <Stack flex={1}>
        <Animated.ScrollView
          onScroll={onScroll}
          scrollEventThrottle={16}
          contentContainerStyle={{ paddingTop: MAX_HEADER + 12, paddingBottom: 140, paddingHorizontal: 16 }}
        >
          <Stack backgroundColor="#111827" borderRadius={18} padding={16} marginBottom={12} gap={6}>
            <Text color="#E5E7EB" fontSize={12} fontWeight="700">
              {nextAction.title.toUpperCase()}
            </Text>
            <Text color="#fff" fontSize={18} fontWeight="800">
              {nextAction.cta}
            </Text>
            <Text color="#D1D5DB" marginBottom={4}>
              {nextAction.subtitle}
            </Text>

            <PrimaryButton onPress={() => router.push("/speak-v2")} label={`Start now · ${nextAction.etaMin} min`} />
            {nextActionSource === "risk" || showAdjustedHint ? (
              <Text color="#9CA3AF" fontSize={12} marginTop={6}>
                Adjusted for today.
              </Text>
            ) : null}

            <Pressable onPress={onCompleteNextAction}>
              <Text color="#9CA3AF" fontSize={12} marginTop={6}>
                Tap to simulate “completed”.
              </Text>
            </Pressable>
          </Stack>

          <Card title="Readiness Score (ERS)">
            <Stack alignItems="center" marginBottom={8}>
              <ReadinessRing
                value={ersMin(currentERS)}
                size={190}
                strokeWidth={14}
                onPress={() => router.push("/(tabs)/progress")}
              />
            </Stack>
            <Text marginTop={6} color="#6B7280" textAlign="center">
              Limiter:{" "}
              <Text fontWeight="800" color="#111827">
                {limiter}
              </Text>{" "}
              · {whatToImprove}
            </Text>
          </Card>

          <GlassCard>
            <Text color="#111827" fontWeight="700" marginBottom={10}>
              Mentor
            </Text>
            <Text color="#6B7280" marginBottom={12}>
              Ask a question (text or voice later). Mentor reply becomes your next action.
            </Text>

            <PrimaryButton onPress={() => router.push("/mentor")} label="Ask Mentor" />

            <PillButton
              onPress={async () => {
                await resetApp();
                router.replace("/language");
              }}
              marginTop={10}
            >
              Reset
            </PillButton>

            <SecondaryButton label="Simulate Risk (6d)" marginTop={8} onPress={onSimulateRisk} />

            <Text color="#9CA3AF" fontSize={12} marginTop={10}>
              Tap to simulate mentor impact.
            </Text>
          </GlassCard>

          <Card title="Quick check-in (optional)">
            <Text color="#6B7280" marginBottom={12}>
              How is today? This creates signals for Risk & Plan Adjustments.
            </Text>

            <Stack flexDirection="row" gap={10}>
              <Stack flex={1}>
                <PillButton onPress={() => onCheckin("calm")}>Calm</PillButton>
              </Stack>
              <Stack flex={1}>
                <PillButton onPress={() => onCheckin("stressed")}>Stressed</PillButton>
              </Stack>
              <Stack flex={1}>
                <PillButton onPress={() => onCheckin("no_time")}>No time</PillButton>
              </Stack>
            </Stack>
          </Card>
        </Animated.ScrollView>

        <Animated.View style={[styles.header, headerStyle]}>
          <Animated.View style={[StyleSheet.absoluteFill, blurStyle]}>
            <BlurView intensity={24} tint="light" style={StyleSheet.absoluteFill} />
            <Stack style={{ ...StyleSheet.absoluteFillObject, backgroundColor: "rgba(255,255,255,0.70)" }} />
          </Animated.View>

          <Stack style={styles.headerRowPinned}>
            <Stack flex={1} />
            <Pressable onPress={() => router.push("/mentor")} style={styles.iconBtn}>
              <Ionicons name="chatbubble-ellipses-outline" size={18} color="#111827" />
            </Pressable>
            <Pressable onPress={() => router.push("/profile")} style={styles.iconBtn}>
              <Ionicons name="person-circle-outline" size={20} color="#111827" />
            </Pressable>
          </Stack>

          <Animated.View style={[styles.titleWrap, titleStyle]}>
            <Text fontSize={30} fontWeight="800" color="#111827">
              Home
            </Text>
            <Text marginTop={4} fontSize={13} color="#6B7280">
              One next action. Visible proof. Calm progress.
            </Text>
          </Animated.View>
        </Animated.View>
      </Stack>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  header: {
    position: "absolute",
    left: 0,
    right: 0,
    top: 0,
    paddingHorizontal: 16,
    paddingTop: 12,
    justifyContent: "flex-end",
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
  },
  headerRowPinned: {
    position: "absolute",
    top: 12,
    left: 16,
    right: 16,
    height: 44,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  iconBtn: {
    width: 36,
    height: 36,
    borderRadius: 999,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(255,255,255,0.55)",
    borderWidth: 1,
    borderColor: "rgba(17,24,39,0.04)",
  },
  titleWrap: { paddingBottom: 10 },
});
