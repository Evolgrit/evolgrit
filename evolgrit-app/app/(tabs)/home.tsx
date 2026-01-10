import React, { useEffect, useMemo, useRef, useState } from "react";
import type { NextAction, NextActionSource } from "../../lib/nextActionService";
import { getNextAction, completeNextActionAndRecompute } from "../../lib/nextActionService";
import { useRouter } from "expo-router";
import { loadLangPrefs } from "../../lib/languagePrefs";
import { ReadinessRing } from "../../components/ReadinessRing";
import { loadCurrentERS } from "../../lib/readinessService";
import { appendEvent } from "../../lib/eventsStore";
import { setMoodForDate, todayKey, getMoodForDate, type Mood } from "../../lib/moodStore";
import { GlassCard } from "../../components/system/GlassCard";
import { PillButton } from "../../components/system/PillButton";
import { ScreenShell } from "../../components/system/ScreenShell";
import { Stack, Text, YStack, useThemeName, ScrollView, Button, XStack } from "tamagui";
import { getAvatarUri } from "../../lib/avatarStore";
import { NextActionCard } from "../../components/home/NextActionCard";
import { Feather } from "@expo/vector-icons";
import { Image } from "react-native";
import { openMentorChat } from "../../lib/navigation/openMentorChat";

type ERS = { L: number; A: number; S: number; C: number };

const ersMin = (e: ERS) => Math.min(e.L, e.A, e.S, e.C);

function Card({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <GlassCard marginBottom={12}>
      <Text fontSize={14} fontWeight="700" color="$text" marginBottom={10}>
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
  const [selectedMood, setSelectedMood] = useState<Mood | null>(null);
  const hintTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const router = useRouter();
  const [avatarUri, setAvatarUri] = React.useState<string | null>(null);
  const theme = useThemeName();
  const TAB_BAR_HEIGHT = 80;

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
      const storedMood = await getMoodForDate(todayKey());
      setSelectedMood(storedMood);
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

  React.useEffect(() => {
    let mounted = true;
    (async () => {
      const uri = await getAvatarUri();
      if (mounted) setAvatarUri(uri);
    })();
    return () => {
      mounted = false;
    };
  }, []);

  const score = useMemo(() => ersMin(ers), [ers]);
  const limiter = useMemo<"L" | "A" | "S" | "C">(() => {
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
        return "Heute zählt ein klarer Satz.";
      case "A":
        return "Heute üben wir Anwendung im Alltag.";
      case "S":
        return "Heute stabilisieren wir zuerst.";
      case "C":
        return "Heute reichen 3 Minuten.";
      default:
        return "Ein ruhiger Schritt reicht.";
    }
  }, [limiter]);

  useEffect(() => {
    return () => {
      if (hintTimer.current) clearTimeout(hintTimer.current);
    };
  }, []);

  async function onCheckin(mood: "calm" | "stressed" | "no_time") {
    await appendEvent("checkin_submitted", { mood });
    await setMoodForDate(todayKey(), mood);
    setSelectedMood(mood);
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
      <ScreenShell title="Home">
        <YStack flex={1} alignItems="center" justifyContent="center">
          <Text color="$muted">Loading…</Text>
        </YStack>
      </ScreenShell>
    );

  const avatarButton = (
    <Button
      unstyled
      onPress={() => router.push("/profile")}
      width={36}
      height={36}
      borderRadius={18}
      overflow="hidden"
      backgroundColor="rgba(17,24,39,0.08)"
      alignItems="center"
      justifyContent="center"
    >
      {avatarUri ? <Image source={{ uri: avatarUri }} style={{ width: "100%", height: "100%" }} /> : null}
    </Button>
  );

  const chatButton = (
    <Button
      unstyled
      onPress={() => openMentorChat(router)}
      padding={6}
      alignItems="center"
      justifyContent="center"
    >
      <Feather name="message-square" size={22} color={theme === "dark" ? "#fff" : "#111827"} />
    </Button>
  );

  const isSelected = (mood: Mood) => selectedMood === mood;

  return (
    <ScreenShell title="Home" leftContent={avatarButton} rightActions={chatButton}>
      <ScrollView contentContainerStyle={{ paddingBottom: TAB_BAR_HEIGHT + 32 }}>
        <YStack gap="$4">
          <NextActionCard
            action={nextAction}
            source={nextActionSource}
            onStart={() => router.push("/speak-v2")}
            showAdjusted={showAdjustedHint}
          />

          <Card title="Readiness Score (ERS)">
            <Stack alignItems="center" marginBottom={8}>
              <ReadinessRing
                value={ersMin(currentERS)}
                size={190}
                strokeWidth={14}
                onPress={() => router.push("/(tabs)/progress")}
              />
            </Stack>
            <Text marginTop={6} color="$muted" textAlign="center">
              {whatToImprove}
            </Text>
          </Card>

          <Card title="Wie fühlst du dich heute?">
            <Text color="$muted" marginBottom={12}>
              Eine kleine Stimmung reicht.
            </Text>

            <XStack gap="$2">
              <PillButton
                flex={1}
                backgroundColor={isSelected("calm") ? "$border" : "$card"}
                onPress={() => onCheckin("calm")}
              >
                Calm
              </PillButton>
              <PillButton
                flex={1}
                backgroundColor={isSelected("stressed") ? "$border" : "$card"}
                onPress={() => onCheckin("stressed")}
              >
                Stressed
              </PillButton>
              <PillButton
                flex={1}
                backgroundColor={isSelected("no_time") ? "$border" : "$card"}
                onPress={() => onCheckin("no_time")}
              >
                No time
              </PillButton>
            </XStack>
          </Card>
        </YStack>
      </ScrollView>
    </ScreenShell>
  );
}
