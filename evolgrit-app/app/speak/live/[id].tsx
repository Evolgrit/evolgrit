import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { ActivityIndicator, Alert, Animated, Modal, Pressable, ScrollView } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { XStack, YStack, Text } from "tamagui";
import { useLocalSearchParams } from "expo-router";
import { NavBackButton } from "../../../components/system/NavBackButton";
import { IconOnlyButton } from "../../../components/system/IconOnlyButton";
import { loadLiveDialogue } from "../../../lib/content/loadLiveDialogue";
import { LiveAvatarHeader } from "../../../components/speak/LiveAvatarHeader";
import { MicRing } from "../../../components/speak/MicRing";
import { loadAvatars } from "../../../lib/avatars/loadAvatars";
import { useSelectedAvatarId } from "../../../lib/avatars/avatarStore";
import { playCoachTts, stopCoachTts } from "../../../lib/tts/liveCoachTts";
import { playRecordStop, stopAllSfx } from "../../../lib/feedback";
import * as Haptics from "expo-haptics";
import * as FileSystem from "expo-file-system/legacy";
import {
  requestRecordingPermissionsAsync,
  setAudioModeAsync,
  useAudioRecorder,
  useAudioRecorderState,
} from "expo-audio";
import { evaluateRecording } from "../../../lib/asrClient";
import { routeCoachReply, type LiveModuleType, type ConvoState } from "../../../lib/liveCoachRouter";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { logNextActionCompleted } from "../../../lib/nextActionStore";
import { track } from "../../../lib/tracking";
import {
  RotateCcw,
  Volume2,
  Languages,
  Lightbulb,
  Mic,
  Square,
  X,
} from "lucide-react-native";

type RecState = "idle" | "recording" | "stopping" | "processing";

type MentorTurn = {
  id: string;
  text: string;
  tipSuggestions?: string[];
};

type ChatMsg = { id: string; role: "coach" | "user"; text: string; ts: number };

type VoiceOption = "de-DE-KatjaNeural" | "de-DE-AmalaNeural";
type Phase = "IDLE" | "COACH_TALK" | "USER_READY" | "RECORDING";

const VOICE_KEY = "evolgrit.voice.selected";

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

export default function LiveSpeakScreen() {
  const params = useLocalSearchParams<{ id?: string }>();
  const id = params.id ?? "";
  const data = useMemo(() => (id ? loadLiveDialogue(id) : null), [id]);
  const insets = useSafeAreaInsets();

  const [recState, setRecState] = useState<RecState>("idle");
  const [messages, setMessages] = useState<ChatMsg[]>([]);
  const [showTasks, setShowTasks] = useState(false);
  const [showTips, setShowTips] = useState(false);
  const [showTranslation, setShowTranslation] = useState(false);
  const [translationText, setTranslationText] = useState("");
  const [draftText, setDraftText] = useState("");
  const [voice, setVoice] = useState<VoiceOption>("de-DE-KatjaNeural");
  const [phase, setPhase] = useState<Phase>("IDLE");
  const [showRetryHint, setShowRetryHint] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [uiRecording, setUiRecording] = useState(false);
  const [isCoachSpeaking, setIsCoachSpeaking] = useState(false);
  const [convo, setConvo] = useState<ConvoState>({
    module: "pfleg_aufnahme",
    step: 0,
    stepKey: "aufnahme_01_name_zimmer",
    slots: {},
    noAudioCount: 0,
    tooShortCount: 0,
    offTopicCount: 0,
    rephraseCount: 0,
  });

  const lastSpokenIdRef = useRef<string | null>(null);
  const lastInitIdRef = useRef<string | null>(null);
  const lastEmptyTranscriptAtRef = useRef<number>(0);
  const lastCoachTextRef = useRef("");
  const speakStartRef = useRef(Date.now());
  const trackedCompleteRef = useRef(false);
  const recordingRef = useRef<any>(null);
  const isStartingRef = useRef(false);
  const isStoppingRef = useRef(false);
  const isRecordingRef = useRef(false);
  const engineRecordingRef = useRef(false);
  const startTokenRef = useRef(0);
  const lastStartAtRef = useRef(0);
  const turnLockRef = useRef(false);
  const recorder = useAudioRecorder(WAV_REC_OPTIONS);
  const recorderState = useAudioRecorderState(recorder);
  const recSnapshot = useRef(recorderState);
  const levelAnim = useRef(new Animated.Value(0)).current;
  const pressAnim = useRef(new Animated.Value(1)).current;
  const ringAnim = useRef(new Animated.Value(0)).current;
  const fallbackLoopRef = useRef<Animated.CompositeAnimation | null>(null);

  const selectedAvatarId = useSelectedAvatarId();
  const selectedCoach = useMemo(() => {
    const avatars = loadAvatars();
    return avatars.find((avatar) => avatar.id === selectedAvatarId) ?? avatars[0] ?? null;
  }, [selectedAvatarId]);
  const coachName =
    selectedCoach?.name ?? data?.avatar?.displayName ?? data?.coach?.name ?? "Coach";

  const mentorTurns: MentorTurn[] = useMemo(() => {
    if (Array.isArray(data?.mentorTurns) && data?.mentorTurns?.length) {
      return data.mentorTurns as MentorTurn[];
    }
    const turns = Array.isArray(data?.turns) ? data.turns : [];
    return turns.map((turn: any, index: number) => ({
      id: turn?.id ?? `t${index + 1}`,
      text: turn?.mentor?.say ?? turn?.mentor?.text ?? turn?.text ?? "…",
      tipSuggestions: turn?.tipSuggestions ?? turn?.learner?.targetHints ?? [],
    }));
  }, [data]);

  const tasks = Array.isArray(data?.tasks) ? data.tasks : [];
  const mentorText = mentorTurns[0]?.text ?? "…";
  const tipSuggestions =
    mentorTurns[0]?.tipSuggestions ?? data?.tipSuggestionsGlobal ?? [];
  const userCount = messages.filter((msg) => msg.role === "user" && msg.text !== "…").length;
  const taskProgress = tasks.length ? Math.min(tasks.length, userCount) : 0;
  const lastCoachText =
    [...messages].reverse().find((msg) => msg.role === "coach")?.text ?? mentorText;

  const micAreaHeight = 140 + insets.bottom;
  const scrollRef = useRef<ScrollView | null>(null);

  useEffect(() => {
    recordingRef.current = recorder;
  }, [recorder]);

  useEffect(() => {
    recSnapshot.current = recorderState;
  }, [recorderState]);

  const moduleFromId = useMemo<LiveModuleType>(() => {
    if (id.includes("aufnahme")) return "pfleg_aufnahme";
    if (id.includes("schmerzen") || id.includes("schmerz")) return "pfleg_schmerzen";
    if (id.includes("medik") || id.includes("zeiten")) return "pfleg_medikamente";
    if (id.includes("vital")) return "pfleg_vital";
    if (id.includes("hygiene") || id.includes("sicherheit")) return "pfleg_hygiene";
    if (id.includes("deeskalation") || id.includes("wartezeit") || id.includes("kommunikation")) {
      return "pfleg_kommunikation";
    }
    return "pfleg_aufnahme";
  }, [id]);

  useEffect(() => {
    const firstStep =
      moduleFromId === "pfleg_schmerzen"
        ? "schmerz_01_ort"
        : moduleFromId === "pfleg_medikamente"
          ? "med_01_medikament"
          : moduleFromId === "pfleg_vital"
            ? "vital_01_bp"
            : moduleFromId === "pfleg_hygiene"
              ? "hyg_01_haende"
              : moduleFromId === "pfleg_kommunikation"
                ? "comm_01_empathie"
          : "aufnahme_01_name_zimmer";
    setConvo({
      module: moduleFromId,
      step: 0,
      stepKey: firstStep,
      slots: {},
      noAudioCount: 0,
      tooShortCount: 0,
      offTopicCount: 0,
      rephraseCount: 0,
    });
  }, [moduleFromId]);

  useEffect(() => {
    let mounted = true;
    AsyncStorage.getItem(VOICE_KEY)
      .then((stored) => {
        if (!mounted || !stored) return;
        if (stored === "de-DE-KatjaNeural" || stored === "de-DE-AmalaNeural") {
          setVoice(stored);
        }
      })
      .catch(() => {});
    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    speakStartRef.current = Date.now();
    return () => {
      const durationMs = Date.now() - speakStartRef.current;
      if (durationMs >= 60000) {
        logNextActionCompleted("speak_drill", 3).catch(() => {});
      }
      const durationSec = Math.round(durationMs / 1000);
      if (durationSec > 0) {
        track({
          ts: Date.now(),
          category: "speak",
          action: "speak_minutes",
          durationSec,
          id,
        }).catch(() => {});
      }
    };
  }, [id]);

  useEffect(() => {
    if (trackedCompleteRef.current) return;
    if (tasks.length > 0 && taskProgress >= tasks.length) {
      trackedCompleteRef.current = true;
      track({
        ts: Date.now(),
        category: "speak",
        action: "live_dialogue_complete",
        id,
      }).catch(() => {});
    }
  }, [id, taskProgress, tasks.length]);

  useEffect(() => {
    const id = setTimeout(() => {
      scrollRef.current?.scrollToEnd?.({ animated: true });
    }, 50);
    return () => clearTimeout(id);
  }, [messages.length, draftText]);

  useEffect(() => {
    if (recState !== "recording") {
      fallbackLoopRef.current?.stop();
      fallbackLoopRef.current = null;
      levelAnim.stopAnimation();
      levelAnim.setValue(0);
      return;
    }

    if (!fallbackLoopRef.current) {
      const loop = Animated.loop(
        Animated.sequence([
          Animated.timing(levelAnim, { toValue: 0.4, duration: 600, useNativeDriver: true }),
          Animated.timing(levelAnim, { toValue: 0.1, duration: 600, useNativeDriver: true }),
        ])
      );
      fallbackLoopRef.current = loop;
      loop.start();
    }
  }, [recState, levelAnim]);

  const speakCoach = useCallback(
    async (text: string, rate: "normal" | "slow" = "normal") => {
      if (isRecordingRef.current) return;
      setPhase("COACH_TALK");
      setIsCoachSpeaking(true);
      try {
        await playCoachTts(text, { voice, rate });
      } catch (err: any) {
        console.warn("[live-tts] failed", err?.message ?? err);
      } finally {
        setIsCoachSpeaking(false);
        setPhase("USER_READY");
      }
    },
    [voice]
  );

  const cleanupRecording = useCallback(async () => {
    const rec = recordingRef.current;
    isRecordingRef.current = false;
    setIsRecording(false);
    recordingRef.current = null;
    if (!rec) return;
    try {
      await rec.stop();
    } catch {}
    try {
      await setAudioModeAsync({ allowsRecording: false, playsInSilentMode: true });
    } catch {}
  }, []);

  useEffect(() => {
    return () => {
      void cleanupRecording();
    };
  }, [cleanupRecording]);

  const ensureAudioModeAndPermission = useCallback(async () => {
    const perm = await requestRecordingPermissionsAsync();
    if (!perm.granted) {
      Alert.alert("Mikrofon", "Bitte Mikrofon erlauben.");
      throw new Error("mic-permission");
    }
    await setAudioModeAsync({ allowsRecording: true, playsInSilentMode: true });
  }, []);

  const stopCoachAudio = useCallback(async () => {
    try {
      await stopCoachTts();
    } catch {}
    setIsCoachSpeaking(false);
    setPhase("USER_READY");
  }, []);

  const stopAllAudio = useCallback(async () => {
    try {
      await stopCoachTts();
    } catch {}
    try {
      stopAllSfx();
    } catch {}
    setIsCoachSpeaking(false);
  }, []);

  useEffect(() => {
    if (!mentorText) return;
    if (lastInitIdRef.current === id) return;
    lastInitIdRef.current = id;
    const initialId = `coach-${id}-0`;
    setMessages([{ id: initialId, role: "coach", text: mentorText, ts: Date.now() }]);
    if (lastSpokenIdRef.current !== initialId) {
      lastSpokenIdRef.current = initialId;
      void speakCoach(mentorText, "normal");
    }
  }, [id, mentorText, speakCoach]);

  useEffect(() => {
    if (!showTranslation) return;
    setTranslationText(lastCoachText ? `Übersetzung: ${lastCoachText}` : "");
  }, [showTranslation, lastCoachText]);

  const animatePressIn = () => {
    Animated.spring(pressAnim, { toValue: 1.05, useNativeDriver: true }).start();
  };

  const animatePressOut = () => {
    Animated.spring(pressAnim, { toValue: 1, useNativeDriver: true }).start();
  };

  const animateRing = (on: boolean) => {
    Animated.timing(ringAnim, {
      toValue: on ? 1 : 0,
      duration: 180,
      useNativeDriver: false,
    }).start();
  };

  const addUserMessage = useCallback((text: string) => {
    const now = Date.now();
    const id = `user-${now}`;
    setMessages((prev) => [...prev, { id, role: "user", text, ts: now }]);
  }, []);

  const addCoachMessage = useCallback((text: string) => {
    const now = Date.now();
    const id = `coach-${now}`;
    setMessages((prev) => [...prev, { id, role: "coach", text, ts: now }]);
    return id;
  }, []);

  const addCoachOnce = useCallback(
    (text: string) => {
      if (!text) return;
      if (lastCoachTextRef.current === text) return;
      lastCoachTextRef.current = text;
      const coachId = addCoachMessage(text);
      if (lastSpokenIdRef.current !== coachId) {
        lastSpokenIdRef.current = coachId;
        void speakCoach(text, "normal");
      }
    },
    [addCoachMessage, speakCoach]
  );


  const startRec = useCallback(async () => {
    if (isStartingRef.current || isRecordingRef.current || recordingRef.current) return;
    isStartingRef.current = true;
    const token = ++startTokenRef.current;
    lastStartAtRef.current = Date.now();

    try {
      await stopAllAudio();
      setIsCoachSpeaking(false);

      await cleanupRecording();
      await ensureAudioModeAndPermission();

      const rec = recordingRef.current ?? recorder;
      recordingRef.current = rec;
      setRecState("stopping");
      await rec.prepareToRecordAsync();
      if (startTokenRef.current !== token) {
        await cleanupRecording();
        return;
      }
      rec.record();
      if (startTokenRef.current !== token) {
        await cleanupRecording();
        return;
      }

      isRecordingRef.current = true;
      engineRecordingRef.current = true;
      setIsRecording(true);
      setPhase("RECORDING");
      animateRing(true);
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
      setRecState("recording");
    } catch (err) {
      console.warn("[live-asr] record start failed", err);
      engineRecordingRef.current = false;
      setUiRecording(false);
      const now = Date.now();
      if (now - lastEmptyTranscriptAtRef.current > 5000) {
        lastEmptyTranscriptAtRef.current = now;
        addCoachOnce("Ich konnte das Mikro gerade nicht starten. Versuch’s nochmal.");
      }
      await cleanupRecording();
      setRecState("idle");
      setPhase("USER_READY");
    } finally {
      isStartingRef.current = false;
    }
  }, [cleanupRecording, ensureAudioModeAndPermission, stopAllAudio]);

  const stopRec = useCallback(async () => {
    if (isStoppingRef.current) return;
    if (!recordingRef.current) return;
    isStoppingRef.current = true;
    setRecState("stopping");
    const rec = recordingRef.current;
    recordingRef.current = null;

    try {
      if (!rec) return;

      if (isStartingRef.current) {
        await new Promise((r) => setTimeout(r, 80));
      }

      try {
        await rec.stop();
      } catch {}
      let uri: string | undefined | null = null;
      let durMs = 0;
      let tries = 0;
      while ((!uri || !durMs) && tries < 12) {
        const status = (await rec?.getStatusAsync?.()) ?? recSnapshot.current;
        uri = (status as any)?.url ?? (status as any)?.uri ?? recSnapshot.current?.url;
        const maybeDur =
          (status as any)?.durationMillis ??
          recSnapshot.current?.durationMillis ??
          (lastStartAtRef.current ? Date.now() - lastStartAtRef.current : 0);
        durMs = typeof maybeDur === "number" ? maybeDur : 0;
        if (uri && durMs) break;
        await new Promise((r) => setTimeout(r, 80));
        tries += 1;
      }
      isRecordingRef.current = false;
      engineRecordingRef.current = false;
      setIsRecording(false);
      setPhase("USER_READY");
      animateRing(false);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => {});
      playRecordStop().catch(() => {});

      if (!uri) return;

      const info = await FileSystem.getInfoAsync(uri);
      const size = typeof (info as any)?.size === "number" ? (info as any).size : 0;
      const durationMs = lastStartAtRef.current ? Date.now() - lastStartAtRef.current : 0;
      console.log("[live-rec] stop info", { uri, size, exists: info.exists, durationMs });

      if (turnLockRef.current) return;
      turnLockRef.current = true;
      setRecState("processing");

      if (!info.exists || size < 2000 || durationMs < 700) {
        const now = Date.now();
        if (now - lastEmptyTranscriptAtRef.current > 5000) {
          lastEmptyTranscriptAtRef.current = now;
          addCoachOnce("Ich habe nichts gehört – halte länger und sprich lauter.");
        }
        setShowRetryHint(true);
        return;
      }

      console.log("[live-asr] sending", { uri, size, durationMs });
      const result = await evaluateRecording({
        fileUri: uri,
        targetText: null,
        locale: "de-DE",
      });
      const transcript = (result?.transcript ?? "").trim();

      if (!transcript) {
        setShowRetryHint(true);
        const now = Date.now();
        if (now - lastEmptyTranscriptAtRef.current > 5000) {
          lastEmptyTranscriptAtRef.current = now;
          addCoachOnce("Ich habe nichts gehört – halte länger und sprich lauter.");
        }
        return;
      }

      setShowRetryHint(false);
      addUserMessage(transcript);
      const routed = routeCoachReply({ module: moduleFromId, userText: transcript, state: convo });
      setConvo(routed.nextState);
      addCoachOnce(routed.coachText);
    } catch (err: any) {
      console.warn("[live-asr] record stop failed", err?.message ?? err);
    } finally {
      turnLockRef.current = false;
      isStoppingRef.current = false;
      setRecState("idle");
      if (!isCoachSpeaking) setPhase("USER_READY");
      await new Promise((r) => setTimeout(r, 120));
    }
  }, [addCoachOnce, addUserMessage, convo, isCoachSpeaking, moduleFromId]);

  const handleMicPressIn = useCallback(() => {
    if (uiRecording || isStartingRef.current || recordingRef.current || isRecordingRef.current) return;
    if (phase === "COACH_TALK") return;
    setUiRecording(true);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
    void startRec();
  }, [phase, startRec, uiRecording]);

  const handleMicPressOut = useCallback(() => {
    setUiRecording(false);
    if (!engineRecordingRef.current) {
      if (recordingRef.current) {
        void cleanupRecording();
      }
      return;
    }
    engineRecordingRef.current = false;
    void stopRec();
  }, [cleanupRecording, stopRec]);

  if (!data) {
    return (
      <YStack flex={1} backgroundColor="$background">
        <YStack padding="$4" paddingTop="$6" flex={1}>
          <XStack alignItems="center" justifyContent="space-between">
            <NavBackButton />
            <YStack width={40} />
          </XStack>
          <Text fontSize={16}>Nicht gefunden: {id}</Text>
        </YStack>
      </YStack>
    );
  }

  const userLine = draftText || "Sprich jetzt.";
  const lastCoachId = [...messages].reverse().find((msg) => msg.role === "coach")?.id;

  return (
    <YStack flex={1} backgroundColor="$background">
      <YStack padding="$4" paddingTop="$6" flex={1} position="relative">
        <ScrollView
          ref={scrollRef}
          contentContainerStyle={{
            paddingBottom: micAreaHeight + 24,
            paddingHorizontal: 16,
            paddingTop: 12,
          }}
        >
          <YStack gap="$4">
            <XStack alignItems="center" justifyContent="space-between">
              <NavBackButton />
              <YStack flex={1} alignItems="center" paddingHorizontal="$2">
                <Text fontSize={16} fontWeight="700" numberOfLines={1}>
                  {data.title}
                </Text>
              </YStack>
              <Pressable accessibilityRole="button" onPress={() => setShowTasks(true)}>
                <YStack
                  paddingHorizontal="$2.5"
                  paddingVertical="$1.5"
                  borderRadius="$10"
                  backgroundColor="$gray2"
                >
                  <Text fontSize={14}>Aufgaben</Text>
                </YStack>
              </Pressable>
            </XStack>

            <LiveAvatarHeader
              name={coachName}
              stage={recState === "recording" ? "user" : "mentor"}
              isRecording={recState === "recording"}
              isThinking={recState === "processing"}
              isSpeaking={isCoachSpeaking}
            />

            <XStack gap="$2" alignItems="center">
              {(["de-DE-KatjaNeural", "de-DE-AmalaNeural"] as VoiceOption[]).map((item) => {
                const active = voice === item;
                const label = item.includes("Katja") ? "Katja" : "Amala";
                return (
                  <Pressable
                    key={item}
                    accessibilityRole="button"
                    onPress={() => {
                      setVoice(item);
                      AsyncStorage.setItem(VOICE_KEY, item).catch(() => {});
                    }}
                  >
                    <YStack
                      paddingHorizontal="$3"
                      paddingVertical="$2"
                      borderRadius="$6"
                      backgroundColor={active ? "rgba(0,0,0,0.08)" : "rgba(0,0,0,0.04)"}
                    >
                      <Text color="$text" fontWeight={active ? "800" : "600"}>
                        {label}
                      </Text>
                    </YStack>
                  </Pressable>
                );
              })}
            </XStack>

            <YStack gap="$2">
              {messages.map((msg) => {
                const align = msg.role === "user" ? "flex-end" : "flex-start";
                const bg =
                  msg.role === "user" ? "rgba(34, 197, 94, 0.14)" : "rgba(0,0,0,0.06)";
                return (
                  <YStack key={msg.id} alignSelf={align} maxWidth="82%">
                    <YStack padding="$3" borderRadius="$6" backgroundColor={bg}>
                      <Text color="$text">{msg.text}</Text>
                      {showTranslation && msg.role === "coach" && msg.id === lastCoachId && translationText ? (
                        <Text color="$muted" fontSize={13} marginTop="$2">
                          {translationText}
                        </Text>
                      ) : null}
                    </YStack>
                  </YStack>
                );
              })}
              {draftText ? (
                <YStack alignSelf="flex-end" maxWidth="82%">
                  <YStack padding="$3" borderRadius="$6" backgroundColor="rgba(34, 197, 94, 0.14)">
                    <Text color="$text">{userLine}</Text>
                  </YStack>
                </YStack>
              ) : null}
            </YStack>
          </YStack>
        </ScrollView>

        <YStack
          position="absolute"
          left={0}
          right={0}
          bottom={Math.max(16, insets.bottom + 8)}
          alignItems="center"
          pointerEvents={showTips ? "none" : "box-none"}
          zIndex={20}
          opacity={showTips ? 0 : 1}
        >
          <Animated.View
            pointerEvents="none"
            style={{
              position: "absolute",
              left: 0,
              right: 0,
              bottom: -12,
              height: 180,
              opacity: ringAnim.interpolate({
                inputRange: [0, 1],
                outputRange: [0, 0.12],
              }),
              backgroundColor: "rgba(34, 197, 94, 1)",
            }}
          />
          <XStack gap="$2" marginBottom="$3">
            <IconOnlyButton
              icon={<RotateCcw size={18} color="#111" />}
              onPress={() => speakCoach(lastCoachText, "normal")}
              disabled={!lastCoachText}
            />
            <IconOnlyButton
              icon={<Volume2 size={18} color="#111" />}
              onPress={() => speakCoach(lastCoachText, "slow")}
              disabled={!lastCoachText}
            />
            <IconOnlyButton
              icon={<Languages size={18} color="#111" />}
              onPress={() => {
                const next = !showTranslation;
                setShowTranslation(next);
                setTranslationText(next ? `Übersetzung: ${lastCoachText}` : "");
              }}
            />
            <IconOnlyButton
              icon={<Lightbulb size={18} color="#111" />}
              onPress={() => setShowTips(true)}
            />
          </XStack>

          <YStack alignItems="center" justifyContent="center">
            <Animated.View
              style={{
                position: "absolute",
                width: 92,
                height: 92,
                borderRadius: 46,
                backgroundColor: "rgba(0,0,0,0.08)",
                transform: [
                  {
                    scale: levelAnim.interpolate({
                      inputRange: [0, 1],
                      outputRange: [1, 1.25],
                    }),
                  },
                ],
                opacity: levelAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0.08, 0.4],
                }),
              }}
            />
            <Animated.View style={{ transform: [{ scale: pressAnim }] }}>
              <MicRing
                isRecording={uiRecording}
                isCoachSpeaking={isCoachSpeaking}
                onPressIn={() => {
                  animatePressIn();
                  void handleMicPressIn();
                }}
                onPressOut={() => {
                  animatePressOut();
                  void handleMicPressOut();
                }}
              >
                {uiRecording ? (
                  <Square size={22} color="#111" />
                ) : (
                  <Mic size={22} color="#111" />
                )}
              </MicRing>
            </Animated.View>
          </YStack>
          <Text fontSize={12} color="$muted" marginTop="$2">
            Gedrückt halten
          </Text>
          {recState === "processing" ? (
            <XStack alignItems="center" gap="$2" marginTop="$2">
              <ActivityIndicator />
              <Text fontSize={12} color="$muted">
                Transkribiere …
              </Text>
            </XStack>
          ) : null}
          {showRetryHint ? (
            <Text fontSize={12} color="$muted" marginTop="$1">
              Tipp: halte 2 Sekunden & sprich klar.
            </Text>
          ) : null}
        </YStack>

        <Modal
          visible={showTasks}
          transparent
          animationType="fade"
          onRequestClose={() => setShowTasks(false)}
        >
          <Pressable
            style={{ flex: 1, backgroundColor: "rgba(0,0,0,0.25)", justifyContent: "center", padding: 16 }}
            onPress={() => setShowTasks(false)}
          >
            <Pressable onPress={() => {}} style={{ width: "100%" }}>
              <YStack backgroundColor="$background" borderRadius="$6" padding="$4" gap="$3">
                <XStack justifyContent="space-between" alignItems="center">
                  <Text fontSize={18} fontWeight="700">Aufgaben</Text>
                  <Pressable onPress={() => setShowTasks(false)}>
                    <Text fontSize={16}>✕</Text>
                  </Pressable>
                </XStack>
                <YStack gap="$2">
                  {tasks.length ? (
                    tasks.map((task: string, index: number) => (
                      <XStack key={`${task}-${index}`} gap="$2" alignItems="flex-start">
                        <Text>•</Text>
                        <Text flex={1}>{task}</Text>
                      </XStack>
                    ))
                  ) : (
                    <Text color="$muted">Keine Aufgaben verfügbar.</Text>
                  )}
                </YStack>
              </YStack>
            </Pressable>
          </Pressable>
        </Modal>

        <Modal
          visible={showTips}
          transparent
          animationType="fade"
          onRequestClose={() => setShowTips(false)}
        >
          <Pressable
            style={{ flex: 1, backgroundColor: "rgba(0,0,0,0.25)", justifyContent: "flex-end", padding: 16 }}
            onPress={() => setShowTips(false)}
          >
            <Pressable onPress={() => {}} style={{ width: "100%" }}>
              <YStack backgroundColor="$background" borderRadius="$6" padding="$4" gap="$3" paddingBottom={micAreaHeight}>
                <XStack justifyContent="space-between" alignItems="center">
                  <Text fontSize={18} fontWeight="700">Vorschläge</Text>
                  <Pressable onPress={() => setShowTips(false)}>
                    <Text fontSize={16}>✕</Text>
                  </Pressable>
                </XStack>
                <YStack gap="$2">
                  {Array.isArray(tipSuggestions) && tipSuggestions.length ? (
                    tipSuggestions.slice(0, 3).map((tip: string, index: number) => (
                      <Pressable
                        key={`${tip}-${index}`}
                        accessibilityRole="button"
                        onPress={() => {
                          setDraftText(tip);
                          setShowTips(false);
                        }}
                      >
                        <YStack padding="$3" borderRadius="$6" backgroundColor="rgba(0,0,0,0.04)">
                          <Text>{tip}</Text>
                        </YStack>
                      </Pressable>
                    ))
                  ) : (
                    <Text color="$muted">Keine Vorschläge verfügbar.</Text>
                  )}
                </YStack>
              </YStack>
            </Pressable>
          </Pressable>
        </Modal>
      </YStack>
    </YStack>
  );
}
