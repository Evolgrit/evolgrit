import React, { useEffect, useMemo, useRef, useState } from "react";
import { Pressable, ScrollView } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Text, XStack, YStack } from "tamagui";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Play, Pause, RotateCcw } from "lucide-react-native";

import { ScreenShell } from "../../../components/system/ScreenShell";
import { PillButton } from "../../../components/system/PillButton";
import { SoftButton } from "../../../components/system/SoftButton";
import { addFocusMinutes, getFocusVoice, type FocusVoiceId } from "../../../lib/focusStore";
import {
  getAmbientEnabled,
  getAmbientId,
  setAmbientEnabled,
  setAmbientId,
  type AmbientId,
} from "../../../lib/ambientStore";
import { duckForTts, startAmbient, stopAmbient } from "../../../lib/ambientPlayer";
import { playCoachTts, stopCoachTts } from "../../../lib/tts/liveCoachTts";
import { track } from "../../../lib/tracking";

const focusData = require("../../../content/focus/focus_sessions_v1.json");

type FocusSession = {
  id: string;
  levelId: string;
  mode: "pre_learning" | "post_learning" | "sleep";
  title: string;
  durationSec: number;
  script: string[];
};

type FocusLevel = { id: string; label: string; colorKey: string };

type FocusVoices = Record<string, { label: string; azureVoice: string }>;

const levelColors: Record<string, string> = {
  green: "rgba(34, 197, 94, 0.45)",
  blue: "rgba(59, 130, 246, 0.45)",
  purple: "rgba(139, 92, 246, 0.45)",
  orange: "rgba(249, 115, 22, 0.45)",
  yellow: "rgba(234, 179, 8, 0.45)",
};

export default function FocusSessionScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ id?: string }>();
  const insets = useSafeAreaInsets();
  const [voiceId, setVoiceId] = useState<FocusVoiceId>("katja");
  const [ambientEnabled, setAmbientEnabledState] = useState(false);
  const [ambientId, setAmbientIdState] = useState<AmbientId>("ocean");
  const [isPlaying, setIsPlaying] = useState(false);
  const mountedRef = useRef(true);

  const sessions: FocusSession[] = Array.isArray(focusData?.sessions) ? focusData.sessions : [];
  const levels: FocusLevel[] = Array.isArray(focusData?.levels) ? focusData.levels : [];
  const voices: FocusVoices = focusData?.voices ?? {};

  const session = useMemo(() => sessions.find((s) => s.id === params.id), [sessions, params.id]);
  const level = useMemo(() => levels.find((l) => l.id === session?.levelId), [levels, session?.levelId]);

  const voice = voices[voiceId]?.azureVoice ?? "de-DE-KatjaNeural";

  const sessionText = useMemo(() => {
    if (!session?.script) return "";
    return session.script.join(" ... ");
  }, [session?.script]);

  useEffect(() => {
    (async () => {
      setVoiceId(await getFocusVoice());
      setAmbientEnabledState(await getAmbientEnabled());
      setAmbientIdState(await getAmbientId());
    })();
    return () => {
      mountedRef.current = false;
      stopCoachTts().catch(() => {});
      stopAmbient().catch(() => {});
    };
  }, []);

  useEffect(() => {
    if (ambientEnabled) {
      startAmbient(ambientId, 0.12).catch(() => {});
    } else {
      stopAmbient().catch(() => {});
    }
  }, [ambientEnabled, ambientId]);

  async function handleAmbientToggle(next: boolean) {
    setAmbientEnabledState(next);
    await setAmbientEnabled(next);
    if (!next) {
      await stopAmbient();
    }
  }

  async function handleAmbientSelect(next: AmbientId) {
    setAmbientIdState(next);
    await setAmbientId(next);
    if (ambientEnabled) {
      await startAmbient(next, 0.12);
    }
  }

  async function handlePlay() {
    if (!sessionText) return;
    setIsPlaying(true);
    try {
      duckForTts(true);
      await playCoachTts(sessionText, { voice, rate: "normal" });
    } catch {
      // ignore
    } finally {
      duckForTts(false);
      if (mountedRef.current) setIsPlaying(false);
    }
  }

  async function handlePause() {
    await stopCoachTts();
    duckForTts(false);
    setIsPlaying(false);
  }

  async function handleRestart() {
    await stopCoachTts();
    duckForTts(false);
    setIsPlaying(false);
    await handlePlay();
  }

  async function handleDone() {
    if (session?.durationSec) {
      await addFocusMinutes(session.durationSec);
      track({
        ts: Date.now(),
        category: "focus",
        action: "focus_session_complete",
        durationSec: session.durationSec,
        id: session.id,
      }).catch(() => {});
    }
    router.back();
  }

  if (!session) {
    return (
      <ScreenShell title="Focus">
        <YStack padding="$4" gap="$3">
          <Text fontSize={16} color="$muted">
            Sitzung nicht gefunden.
          </Text>
        </YStack>
      </ScreenShell>
    );
  }

  const badgeColor = levelColors[level?.colorKey ?? ""] ?? "rgba(0,0,0,0.25)";

  return (
    <ScreenShell title="Focus">
      <ScrollView contentContainerStyle={{ paddingBottom: insets.bottom + 24 }}>
        <YStack padding="$4" gap="$4">
          <YStack gap="$1">
            <Text fontSize={22} fontWeight="900" color="$text">
              {session.title}
            </Text>
            <XStack alignItems="center" gap="$2">
              <YStack width={10} height={10} borderRadius={999} backgroundColor={badgeColor} />
              <Text color="$muted">{Math.round(session.durationSec / 60)} Min</Text>
              {level?.label ? <Text color="$muted">• {level.label}</Text> : null}
            </XStack>
          </YStack>

          <YStack gap="$2">
            <Text fontSize={14} fontWeight="800" color="$text">
              Ambient
            </Text>
            <XStack gap="$2" alignItems="center">
              <PillButton
                label="Aus"
                backgroundColor={ambientEnabled ? "rgba(0,0,0,0.03)" : "rgba(0,0,0,0.06)"}
                onPress={() => handleAmbientToggle(false)}
              />
              <PillButton
                label="An"
                backgroundColor={ambientEnabled ? "rgba(0,0,0,0.06)" : "rgba(0,0,0,0.03)"}
                onPress={() => handleAmbientToggle(true)}
              />
            </XStack>
            <XStack gap="$2" alignItems="center">
              <PillButton
                label="Meer"
                backgroundColor={ambientId === "ocean" ? "rgba(0,0,0,0.06)" : "rgba(0,0,0,0.03)"}
                onPress={() => handleAmbientSelect("ocean")}
              />
              <PillButton
                label="Wald"
                backgroundColor={ambientId === "forest" ? "rgba(0,0,0,0.06)" : "rgba(0,0,0,0.03)"}
                onPress={() => handleAmbientSelect("forest")}
              />
              <PillButton
                label="Regen"
                backgroundColor={ambientId === "rain" ? "rgba(0,0,0,0.06)" : "rgba(0,0,0,0.03)"}
                onPress={() => handleAmbientSelect("rain")}
              />
              <PillButton
                label="Wind"
                backgroundColor={ambientId === "wind" ? "rgba(0,0,0,0.06)" : "rgba(0,0,0,0.03)"}
                onPress={() => handleAmbientSelect("wind")}
              />
            </XStack>
          </YStack>

          <YStack gap="$2">
            {session.script.map((line, index) => (
              <Text key={`${line}-${index}`} color="$text">
                {line}
              </Text>
            ))}
          </YStack>

          <XStack gap="$3" alignItems="center" justifyContent="flex-start">
            <Pressable accessibilityRole="button" onPress={isPlaying ? handlePause : handlePlay}>
              <YStack
                width={48}
                height={48}
                borderRadius={24}
                backgroundColor="rgba(0,0,0,0.05)"
                alignItems="center"
                justifyContent="center"
              >
                {isPlaying ? <Pause size={22} /> : <Play size={22} />}
              </YStack>
            </Pressable>

            <Pressable accessibilityRole="button" onPress={handleRestart}>
              <YStack
                width={48}
                height={48}
                borderRadius={24}
                backgroundColor="rgba(0,0,0,0.05)"
                alignItems="center"
                justifyContent="center"
              >
                <RotateCcw size={20} />
              </YStack>
            </Pressable>
          </XStack>

          <SoftButton label="Fertig" onPress={handleDone} />
        </YStack>
      </ScrollView>
    </ScreenShell>
  );
}
