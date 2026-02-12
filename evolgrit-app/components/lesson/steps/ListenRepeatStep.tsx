import React, { useEffect, useMemo, useRef, useState } from "react";
import { ActivityIndicator, Alert, Pressable } from "react-native";
import { Text, XStack, YStack } from "tamagui";
import { Volume2, RotateCcw, Play, Pause, Mic, Square } from "lucide-react-native";
import * as Haptics from "expo-haptics";
import {
  requestRecordingPermissionsAsync,
  setAudioModeAsync,
  useAudioRecorder,
  useAudioRecorderState,
} from "expo-audio";
import Animated, { Easing, useAnimatedStyle, useSharedValue, withRepeat, withTiming } from "react-native-reanimated";
import { useAudioPlayer } from "../../../hooks/useAudioPlayer";
import { getTtsBase64 } from "../../../lib/tts/azureTtsClient";
import * as FileSystem from "expo-file-system/legacy";
import { evaluateRecording, AsrTokenStatus } from "../../../lib/asrClient";
import { playCorrect, playWrong } from "../../../lib/feedback";
import { AudioMeter } from "../AudioMeter";
import { SoftButton } from "../../system/SoftButton";
import { lessonType } from "@/design/typography";

const HIGHLIGHT_BG = "rgba(46,204,113,0.18)";
const PASS_SCORE = 0.9;
const MAX_ATTEMPTS = 3;
const WAV_REC_OPTIONS: any = {
  extension: ".wav",
  sampleRate: 16000,
  numberOfChannels: 1,
  bitRate: 256000,
  isMeteringEnabled: true,
  android: {
    extension: ".wav",
    sampleRate: 16000,
    isMeteringEnabled: true,
    outputFormat: "default",
    audioEncoder: "amr_wb",
  },
  ios: {
    extension: ".wav",
    sampleRate: 16000,
    isMeteringEnabled: true,
    outputFormat: "lpcm",
    audioQuality: 96,
    linearPCMBitDepth: 16,
    linearPCMIsBigEndian: false,
    linearPCMIsFloat: false,
  },
  web: {
    mimeType: "audio/wav",
  },
};

type RecPhase = "idle" | "recording" | "stopping" | "processing" | "recorded";

export function ListenRepeatStep({
  prompt,
  text,
  onSolved,
}: {
  prompt: string;
  text: string;
  onSolved?: (ok: boolean) => void;
}) {
  const recorder = useAudioRecorder(WAV_REC_OPTIONS);
  const recState = useAudioRecorderState(recorder);
  const recSnapshot = useRef(recState);
  const [recordedUri, setRecordedUri] = useState<string | null>(null);
  const [isRequesting, setIsRequesting] = useState(false);
  const [recPhase, setRecPhase] = useState<RecPhase>("idle");
  const player = useAudioPlayer();
  const refPlayer = useAudioPlayer();
  const startTs = useRef<number | null>(null);
  const [amplitude, setAmplitude] = useState(0);
  const [activeWordIndex, setActiveWordIndex] = useState(-1);
  const refWordTimer = useRef<ReturnType<typeof setInterval> | null>(null);
  const [asrLoading, setAsrLoading] = useState(false);
  const [transcript, setTranscript] = useState<string | null>(null);
  const [score, setScore] = useState<number | null>(null);
  const [tokenStatuses, setTokenStatuses] = useState<{ token: string; status: AsrTokenStatus }[]>([]);
  const stopLockRef = useRef(false);
  const meterTimer = useRef<ReturnType<typeof setInterval> | null>(null);
  const meterBusy = useRef(false);
  const pulse = useSharedValue(0);
  const [attemptCount, setAttemptCount] = useState(0);
  const [hasMicPermission, setHasMicPermission] = useState(true);

  useEffect(() => {
    recSnapshot.current = recState;
  }, [recState]);

  useEffect(() => {
    return () => {
      player.stop?.();
      refPlayer.stop?.();
      if (refWordTimer.current) clearInterval(refWordTimer.current);
      if (meterTimer.current) clearInterval(meterTimer.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (recPhase === "recording") {
      meterTimer.current = setInterval(async () => {
        if (meterBusy.current) return;
        meterBusy.current = true;
        try {
          const status = (await (recorder as any)?.getStatusAsync?.()) ?? {};
          const raw = (status as any).metering;
          if (typeof raw === "number") {
            const clamped = Math.max(-60, Math.min(-10, raw));
            let norm = (clamped + 60) / 50;
            if (norm < 0.08) norm = 0;
            setAmplitude((prev) => prev * 0.7 + norm * 0.3);
          }
        } catch {
          // ignore metering errors
        } finally {
          meterBusy.current = false;
        }
      }, 60);
    } else {
      setAmplitude(0);
      if (meterTimer.current) {
        clearInterval(meterTimer.current);
        meterTimer.current = null;
      }
    }
    return () => {
      if (meterTimer.current) {
        clearInterval(meterTimer.current);
        meterTimer.current = null;
      }
    };
  }, [recPhase, recorder]);

  const startRec = async () => {
    if (recPhase === "recording" || recPhase === "stopping" || recPhase === "processing" || isRequesting)
      return;
    if (recPhase === "recorded") {
      await player.stop();
      setRecordedUri(null);
    }
    onSolved?.(false);
    setTranscript(null);
    setScore(null);
    setTokenStatuses([]);
    setAttemptCount(0);
    setIsRequesting(true);
    try {
      const perm = await requestRecordingPermissionsAsync();
      setHasMicPermission(perm.granted);
      if (!perm.granted) {
        setRecPhase("idle");
        return;
      }

      await setAudioModeAsync({ allowsRecording: true, playsInSilentMode: true });
      await recorder.prepareToRecordAsync();
      await Haptics.selectionAsync();
      startTs.current = Date.now();
      recorder.record();
      setRecPhase("recording");
    } catch (err) {
      console.error("[asr] record start failed", err);
      setRecPhase("idle");
    } finally {
      setIsRequesting(false);
    }
  };

  const stopRec = async () => {
    if (recPhase !== "recording") return;
    if (stopLockRef.current) return;
    stopLockRef.current = true;
    setRecPhase("stopping");
    try {
      await recorder.stop();
      await Haptics.selectionAsync();
      let uri: string | undefined | null = null;
      let durMs = 0;
      let tries = 0;
      while ((!uri || !durMs) && tries < 12) {
        const status = (await (recorder as any)?.getStatusAsync?.()) ?? recSnapshot.current;
        uri = (status as any)?.url ?? (status as any)?.uri ?? recSnapshot.current?.url;
        const maybeDur =
          (status as any)?.durationMillis ??
          recSnapshot.current?.durationMillis ??
          (startTs.current ? Date.now() - startTs.current : 0);
        durMs = typeof maybeDur === "number" ? maybeDur : 0;
        if (uri && durMs) break;
        await new Promise((r) => setTimeout(r, 80));
        tries += 1;
      }

      if (!uri || (durMs && durMs < 800)) {
        Alert.alert("Zu kurz", "Bitte noch einmal aufnehmen.");
        setRecordedUri(null);
        setRecPhase("idle");
        return;
      }
      const wavUri = await ensureWavCopy(uri);
      setRecordedUri(wavUri);
      setRecPhase("processing");
      await player.stop();
      await player.play({ uri: wavUri });
      await runAsr(
        wavUri,
        text,
        {
          setTranscript,
          setScore,
          setTokenStatuses,
          setAsrLoading,
        },
        attemptCount,
        setAttemptCount,
        onSolved
      );
      setRecPhase("recorded");
    } catch (err) {
      console.error("[asr] record stop failed", err);
      setRecPhase("idle");
    } finally {
      stopLockRef.current = false;
    }
  };

  const words = useMemo(() => text.split(/\s+/).filter(Boolean), [text]);

  const resetWordTimer = () => {
    if (refWordTimer.current) clearInterval(refWordTimer.current);
    refWordTimer.current = null;
  };

  useEffect(() => {
    if (!refPlayer.isPlaying || refPlayer.durationMs <= 0) {
      resetWordTimer();
      setActiveWordIndex(-1);
      return;
    }
    const dur = refPlayer.durationMs;
    const interval = Math.max(120, Math.min(600, Math.round(dur / Math.max(1, words.length))));
    let idx = 0;
    setActiveWordIndex(0);
    resetWordTimer();
    refWordTimer.current = setInterval(() => {
      idx += 1;
      if (idx >= words.length) {
        resetWordTimer();
        setActiveWordIndex(-1);
      } else {
        setActiveWordIndex(idx);
      }
    }, interval);
    return () => resetWordTimer();
  }, [refPlayer.isPlaying, refPlayer.durationMs, words.length]);

  const ensureTtsPath = async () => {
    const clean = sanitizeText(text);
    const res = await getTtsBase64({ text: clean, rate: "normal" });
    const dir = `${FileSystem.cacheDirectory}tts/`;
    const info = await FileSystem.getInfoAsync(dir);
    if (!info.exists) {
      await FileSystem.makeDirectoryAsync(dir, { intermediates: true });
    }
    const hash = hashCanonical(`de-DE|default|normal|${clean}`);
    const path = `${dir}tts_${hash}_normal.mp3`;
    const existing = await FileSystem.getInfoAsync(path);
    if (!existing.exists) {
      await FileSystem.writeAsStringAsync(path, res.base64, { encoding: FileSystem.EncodingType.Base64 });
    }
    return path;
  };

  const playTarget = async () => {
    try {
      setActiveWordIndex(-1);
      const path = await ensureTtsPath();
      await refPlayer.stop();
      await refPlayer.play({ uri: path });
    } catch (err) {
      console.error("[tts] ref play failed", err);
      Alert.alert("Audio", "Audio konnte nicht geladen werden.");
      setActiveWordIndex(-1);
    }
  };

  const ensureWavCopy = async (uri: string) => {
    if (uri.toLowerCase().endsWith(".wav")) return uri;
    const dir = `${FileSystem.cacheDirectory}asr/`;
    const info = await FileSystem.getInfoAsync(dir);
    if (!info.exists) {
      await FileSystem.makeDirectoryAsync(dir, { intermediates: true });
    }
    const dest = `${dir}${Date.now()}.wav`;
    await FileSystem.copyAsync({ from: uri, to: dest });
    return dest;
  };

  const playRecording = async () => {
    if (!recordedUri) return;
    try {
      await player.play({ uri: recordedUri });
    } catch (err) {
      console.error("[asr] play recording failed", err);
    }
  };

  const togglePlay = async () => {
    if (!recordedUri) return;
    if (player.isPlaying) {
      await player.pause();
    } else {
      await playRecording();
    }
  };

  useEffect(() => {
    if (recPhase === "recording") {
      pulse.value = withRepeat(withTiming(1, { duration: 900, easing: Easing.inOut(Easing.ease) }), -1, true);
    } else {
      pulse.value = withTiming(0, { duration: 240, easing: Easing.out(Easing.ease) });
    }
  }, [pulse, recPhase]);

  const micRingStyle = useAnimatedStyle(() => ({
    transform: [{ scale: 1 + pulse.value * 0.06 }],
    borderWidth: recPhase === "recording" ? 3 : 0,
    borderColor: recPhase === "recording" ? "rgba(46,204,113,0.65)" : "transparent",
    borderRadius: 999,
  }));

  const micDisabled =
    !hasMicPermission ||
    isRequesting ||
    recPhase === "stopping" ||
    recPhase === "processing" ||
    stopLockRef.current;
  const playDisabled =
    !recordedUri || recPhase === "recording" || recPhase === "stopping" || recPhase === "processing" || asrLoading;
  const replayDisabled = playDisabled;
  const targetDisabled = recPhase === "recording" || recPhase === "stopping" || recPhase === "processing";

  return (
    <YStack gap="$3" backgroundColor="#fff" width="100%">
      {/* Prompt Card */}
      <YStack gap="$3" padding="$4" borderRadius={24} backgroundColor="#F3F4F6">
        <XStack alignItems="center" justifyContent="space-between">
          <Text {...lessonType.section} color="$text" flexShrink={1}>
            Sprich nach
          </Text>
          <IconButton
            icon={<Volume2 size={22} color="#111" />}
            onPress={playTarget}
            accessibilityLabel="Referenz abspielen"
            disabled={targetDisabled}
            size={44}
            labelFallback="Audio"
          />
        </XStack>

        {prompt ? (
          <Text {...lessonType.body} color="$muted" flexShrink={1}>
            {prompt}
          </Text>
        ) : null}

        <XStack flexWrap="wrap" gap="$1">
          {words.map((w, idx) => (
            <Text
              key={`${w}-${idx}`}
              {...lessonType.body}
              backgroundColor={activeWordIndex === idx ? HIGHLIGHT_BG : "transparent"}
              paddingHorizontal={6}
              paddingVertical={3}
              borderRadius={10}
              color="$text"
            >
              {w}
            </Text>
          ))}
        </XStack>
      </YStack>

      {/* Attempt Card */}
      <YStack gap="$3" padding="$4" borderRadius={24} backgroundColor="#F3F4F6">
        <XStack alignItems="center" justifyContent="space-between">
          <Text {...lessonType.section} color="$text" flexShrink={1}>
            Dein Versuch
          </Text>
          {asrLoading ? (
            <XStack alignItems="center" gap="$2">
              <ActivityIndicator />
              <Text {...lessonType.muted} color="$muted" numberOfLines={1} ellipsizeMode="tail">
                Wird ausgewertet …
              </Text>
            </XStack>
          ) : null}
        </XStack>

        <YStack minHeight={28}>
          <AudioMeter amplitude={recPhase === "recording" ? amplitude : 0} />
        </YStack>

        <XStack gap="$3" alignItems="center" justifyContent="space-between" pointerEvents="auto">
          <IconButton
            icon={<RotateCcw size={22} color="#111" />}
            onPress={playRecording}
            accessibilityLabel="Aufnahme wiederholen"
            disabled={replayDisabled}
            size={44}
            labelFallback="Replay"
          />

          <IconButton
            icon={recordedUri && player.isPlaying ? <Pause size={24} color="#111" /> : <Play size={24} color="#111" />}
            onPress={togglePlay}
            accessibilityLabel="Aufnahme abspielen"
            disabled={playDisabled}
            size={56}
            labelFallback="Play"
          />

          <Animated.View style={micRingStyle}>
            <IconButton
              icon={recPhase === "recording" || recPhase === "stopping" ? <Square size={22} color="#111" /> : <Mic size={22} color="#111" />}
              onPress={recPhase === "recording" || recPhase === "stopping" ? stopRec : startRec}
              accessibilityLabel={recPhase === "recording" || recPhase === "stopping" ? "Stop" : "Aufnehmen"}
              disabled={micDisabled}
              size={52}
              bg={recPhase === "recording" ? "rgba(46,204,113,0.18)" : "$color2"}
              labelFallback="Mic"
            />
          </Animated.View>
        </XStack>

        {!hasMicPermission ? (
          <Text {...lessonType.muted} color="$muted">
            Mikrofon-Zugriff fehlt. Bitte erlauben.
          </Text>
        ) : null}

        {recPhase === "stopping" ? (
          <Text {...lessonType.muted} color="$muted">
            Stoppen …
          </Text>
        ) : null}

        {transcript ? (
          <YStack gap="$2">
            <Text {...lessonType.muted} color="$muted">
              Du hast gesagt:
            </Text>
            <Text {...lessonType.body}>{transcript}</Text>
            {score !== null ? (
              <Text {...lessonType.body} color={score >= PASS_SCORE ? "$text" : "$red10"}>
                Score: {score.toFixed(2)}
              </Text>
            ) : null}
            {attemptCount >= MAX_ATTEMPTS && (score ?? 0) < PASS_SCORE ? (
              <Text {...lessonType.muted} color="$muted">
                Reicht für jetzt. Du kannst später nochmal üben.
              </Text>
            ) : null}
            <XStack flexWrap="wrap" gap="$1">
              {tokenStatuses.length > 0
                ? tokenStatuses.map((t, idx) => (
                    <Text
                      key={`${t.token}-${idx}`}
                      {...lessonType.chip}
                      backgroundColor={
                        t.status === "ok"
                          ? "rgba(46,204,113,0.18)"
                          : "rgba(255,59,48,0.12)"
                      }
                      paddingHorizontal={6}
                      paddingVertical={3}
                      borderRadius={10}
                      numberOfLines={1}
                      ellipsizeMode="tail"
                    >
                      {t.token}
                    </Text>
                  ))
                : null}
            </XStack>
          </YStack>
        ) : null}

        {!transcript && recPhase === "recorded" && !asrLoading ? (
          <Text {...lessonType.muted} color="$muted">
            Keine Auswertung verfügbar. Bitte erneut aufnehmen.
          </Text>
        ) : null}

        <XStack justifyContent="flex-end">
          <SoftButton
            label="Nochmal"
            onPress={() => {
              setTranscript(null);
              setScore(null);
              setTokenStatuses([]);
              setRecordedUri(null);
              setAttemptCount(0);
              setRecPhase("idle");
              onSolved?.(false);
            }}
          />
        </XStack>
      </YStack>
    </YStack>
  );
}

function IconButton({
  icon,
  labelFallback,
  onPress,
  accessibilityLabel,
  disabled,
  size = 44,
  bg = "$color2",
}: {
  icon?: React.ReactNode;
  labelFallback?: string;
  onPress?: () => void;
  accessibilityLabel?: string;
  disabled?: boolean;
  size?: number;
  bg?: string;
}) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
      onPress={disabled ? undefined : onPress}
      style={disabled ? { opacity: 0.5 } : undefined}
    >
      <YStack
        width={size}
        height={size}
        borderRadius={size / 2}
        backgroundColor={bg}
        alignItems="center"
        justifyContent="center"
      >
        {icon ?? (
          <Text {...lessonType.muted} color="$text">
            {labelFallback ?? ""}
          </Text>
        )}
      </YStack>
    </Pressable>
  );
}

function hashCanonical(input: string): string {
  let h1 = 0x811c9dc5;
  let h2 = 0xc9dc5118;
  for (let i = 0; i < input.length; i++) {
    const ch = input.charCodeAt(i);
    h1 ^= ch;
    h1 = Math.imul(h1, 0x01000193);
    h2 ^= ch;
    h2 = Math.imul(h2, 0x01000197);
  }
  h1 = (h1 << 13) | (h1 >>> 19);
  h2 = (h2 << 11) | (h2 >>> 21);
  const combined = (BigInt(h1 >>> 0) << 32n) ^ BigInt(h2 >>> 0);
  return combined.toString(16).padStart(16, "0").slice(0, 16);
}

function sanitizeText(input: string) {
  const trimmed = input.trim();
  const strippedPrefix = trimmed.replace(/^(Say:|Sag:)\s*/i, "");
  const strippedQuotes = strippedPrefix.replace(/^["“‚‘]+|["”‚‘]+$/g, "");
  return strippedQuotes.trim();
}

async function runAsr(
  uri: string,
  target: string,
  setters: {
    setTranscript: (t: string | null) => void;
    setScore: (s: number | null) => void;
    setTokenStatuses: (t: { token: string; status: AsrTokenStatus }[]) => void;
    setAsrLoading: (b: boolean) => void;
  },
  attemptCount: number,
  setAttemptCount: React.Dispatch<React.SetStateAction<number>>,
  onSolved?: (ok: boolean) => void
) {
  const { setTranscript, setScore, setTokenStatuses, setAsrLoading } = setters;
  setAsrLoading(true);
  try {
    const res = await evaluateRecording({ fileUri: uri, targetText: target, locale: "de-DE" });
    const score = typeof res.score === "number" ? res.score : 0;
    setTranscript(res.transcript);
    setScore(score);
    setTokenStatuses(res.tokens ?? []);
    const nextAttempt = attemptCount + 1;
    setAttemptCount(nextAttempt);
    const ok = score >= PASS_SCORE;
    const canContinue = ok || nextAttempt >= MAX_ATTEMPTS;
    console.log("[asr] attempt", { attemptCount: nextAttempt, score, canContinue });
    onSolved?.(canContinue);
    if (ok) {
      await playCorrect();
    } else {
      await playWrong();
    }
  } catch (err) {
    console.error("[asr] eval failed", err);
    Alert.alert("ASR", "Audio konnte nicht ausgewertet werden.");
    setTranscript(null);
    setScore(null);
    setTokenStatuses([]);
    onSolved?.(false);
  } finally {
    setAsrLoading(false);
  }
}
