import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Pressable, ScrollView } from "react-native";
import { useLocalSearchParams } from "expo-router";
import { Text, XStack, YStack } from "tamagui";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { ScreenShell } from "../../../components/system/ScreenShell";
import { NavBackButton } from "../../../components/system/NavBackButton";
import { loadLifeModule } from "../../../lib/content/loadLife";
import type { LifeSection } from "../../../types/lifeContent";
import { playCoachTts, stopCoachTts } from "../../../lib/tts/liveCoachTts";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  requestRecordingPermissionsAsync,
  setAudioModeAsync,
  useAudioRecorder,
} from "expo-audio";
import { evaluateRecording } from "../../../lib/asrClient";

const TAB_BAR_HEIGHT = 80;

function shortSentence(text: string) {
  const trimmed = text.trim();
  const parts = trimmed.split(/(?<=[.!?])\s/);
  return parts[0] ?? trimmed;
}

function moduleBg(moduleId: string) {
  if (moduleId.endsWith("_time")) return "$surfaceLife";
  if (moduleId.endsWith("_directness")) return "$surfaceLanguage";
  if (moduleId.endsWith("_neighbors")) return "$surfaceFocus";
  if (moduleId.endsWith("_rules")) return "$surfaceJob";
  if (moduleId.endsWith("_money")) return "$surfaceLife";
  if (moduleId.endsWith("_help")) return "$surfaceLanguage";
  return "$gray2";
}

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

function Card({ children, bg = "$gray2" }: { children: React.ReactNode; bg?: string }) {
  return (
    <YStack padding="$4" borderRadius="$6" backgroundColor={bg} gap="$3">
      {children}
    </YStack>
  );
}

function DoDont({ items, onPick }: { items: { text: string; answer: "do" | "dont" }[]; onPick: (idx: number, choice: "do" | "dont") => void }) {
  return (
    <YStack gap="$3">
      {items.map((it, idx) => (
        <YStack key={idx} gap="$2">
          <Text fontSize="$4" color="$text">
            {it.text}
          </Text>
          <XStack gap="$2">
            <Pressable onPress={() => onPick(idx, "do")}>
              <YStack paddingHorizontal="$3" paddingVertical="$2" borderRadius="$6" backgroundColor="$bgSurface">
                <Text fontSize="$3" color="$text">Do</Text>
              </YStack>
            </Pressable>
            <Pressable onPress={() => onPick(idx, "dont")}>
              <YStack paddingHorizontal="$3" paddingVertical="$2" borderRadius="$6" backgroundColor="$bgSurface">
                <Text fontSize="$3" color="$text">Don't</Text>
              </YStack>
            </Pressable>
          </XStack>
        </YStack>
      ))}
    </YStack>
  );
}

function SkillChoice({
  question,
  options,
  onSelect,
}: {
  question: string;
  options: string[];
  onSelect: (idx: number) => void;
}) {
  return (
    <YStack gap="$2">
      <Text fontSize="$5" fontWeight="700" color="$text">
        {question}
      </Text>
      {options.map((opt, i) => (
        <Pressable key={i} onPress={() => onSelect(i)}>
          <YStack padding="$3" borderRadius="$5" backgroundColor="$bgSurface">
            <Text fontSize="$4" color="$text">
              {opt}
            </Text>
          </YStack>
        </Pressable>
      ))}
    </YStack>
  );
}

function buildMicroStepsFromModule(data: { moduleId: string; durationMin: number; sections: LifeSection[] }) {
  const steps: any[] = [];
  const info = data.sections.find((s) => s.type === "info") as LifeSection | undefined;
  if (info && info.type === "info") {
    steps.push({
      type: "info_card",
      title: info.title,
      text: shortSentence(info.text),
      ttsText: shortSentence(info.text),
      bg: moduleBg(data.moduleId),
    });
  }

  const doDont = data.sections.find((s) => s.type === "do_dont") as LifeSection | undefined;
  if (doDont && doDont.type === "do_dont") {
    const items = doDont.items.slice(0, 3).map((it) => ({
      text: it.text,
      answer: it.kind,
    }));
    steps.push({
      type: "do_dont_quiz",
      title: "Do / Don't",
      items,
      bg: moduleBg(data.moduleId),
    });
  }

  const skill = data.sections.find((s) => s.type === "skill_choice") as LifeSection | undefined;
  if (skill && skill.type === "skill_choice") {
    steps.push({
      type: "choice_quiz",
      title: skill.title,
      question: skill.question,
      options: skill.options,
      correctIndex: skill.correctIndex,
      bg: moduleBg(data.moduleId),
    });
  }

  const examples = data.sections.find((s) => s.type === "examples") as LifeSection | undefined;
  if (examples && examples.type === "examples" && examples.items.length > 0) {
    steps.push({
      type: "info_card",
      title: examples.title,
      text: `Beispiel: ${examples.items[0]}`,
      ttsText: `Beispiel: ${examples.items[0]}`,
      bg: moduleBg(data.moduleId),
    });
  }

  steps.push({
    type: "wrap",
    title: "Merken",
    text: `Merksatz: ${shortSentence(data.sections[0]?.type === "info" ? data.sections[0].text : data.moduleId)}`,
    bg: moduleBg(data.moduleId),
  });

  return steps.slice(0, 6);
}

export default function LifeModuleScreen() {
  const params = useLocalSearchParams<{ moduleId?: string }>();
  const moduleId = params.moduleId ?? "life_01_time";
  const insets = useSafeAreaInsets();
  const data = useMemo(() => loadLifeModule(moduleId), [moduleId]);
  const [stepIndex, setStepIndex] = useState(0);
  const [doDontAnswers, setDoDontAnswers] = useState<Record<number, "do" | "dont" | null>>({});
  const [doDontFeedback, setDoDontFeedback] = useState<string>("");
  const [choiceIndex, setChoiceIndex] = useState<number | null>(null);
  const [choiceFeedback, setChoiceFeedback] = useState<string>("");
  const [wordAnswer, setWordAnswer] = useState<string[]>([]);
  const [wordFeedback, setWordFeedback] = useState<string>("");
  const [transcript, setTranscript] = useState<string>("");
  const [better, setBetter] = useState<string>("");
  const [miniTip, setMiniTip] = useState<string>("");
  const [isRecording, setIsRecording] = useState(false);
  const recordingRef = useRef<any>(null);
  const recorder = useAudioRecorder(WAV_REC_OPTIONS);

  useEffect(() => {
    setStepIndex(0);
    setDoDontAnswers({});
    setDoDontFeedback("");
    setChoiceIndex(null);
    setChoiceFeedback("");
    setWordAnswer([]);
    setWordFeedback("");
    setTranscript("");
    setBetter("");
    setMiniTip("");
  }, [moduleId]);

  const microSteps = useMemo(() => {
    if (moduleId !== "life_01_time") {
      return buildMicroStepsFromModule(data);
    }
    return [
      {
        type: "info_card",
        title: "Pünktlichkeit = Respekt",
        text: "5–10 Minuten können schon unzuverlässig wirken.",
        ttsText: "Fünf bis zehn Minuten können schon unzuverlässig wirken.",
        bg: "$surfaceLife",
      },
      {
        type: "do_dont_quiz",
        title: "Do / Don't",
        items: [
          { text: "Sag früh Bescheid.", answer: "do" },
          { text: "Einfach später erscheinen.", answer: "dont" },
          { text: "Neue Uhrzeit nennen.", answer: "do" },
        ],
        bg: "$surfaceLanguage",
      },
      {
        type: "choice_quiz",
        title: "Mini-Skill",
        question: "Du bist 10 Minuten zu spät. Was sagst du?",
        options: [
          "Entschuldigung, ich komme 10 Minuten später. Ich bin um 18:10 da.",
          "Ich komme irgendwann. Ist doch nicht schlimm.",
        ],
        correctIndex: 0,
        bg: "$surfaceLife",
      },
      {
        type: "word_order",
        title: "Bau den Satz",
        tokens: ["Entschuldigung", "ich", "komme", "10", "Minuten", "später", "."],
        answer: ["Entschuldigung", "ich", "komme", "10", "Minuten", "später", "."],
        bg: "$surfaceFocus",
      },
      {
        type: "speak_asr",
        title: "Sprich es jetzt",
        prompt: "Sag es jetzt in einem Satz.",
        target: "Entschuldigung, ich komme 10 Minuten später.",
        tip: "Entschuldigung + neue Uhrzeit.",
        bg: "$surfaceLife",
      },
      {
        type: "wrap",
        title: "Merken",
        text: "Merksatz: Entschuldigung + neue Uhrzeit.",
        bg: "$surfaceLife",
      },
    ];
  }, [data, moduleId]);

  const currentStep = microSteps[stepIndex];

  const handlePlay = useCallback(async (text: string, rate: "normal" | "slow" = "normal") => {
    if (!text) return;
    await stopCoachTts().catch(() => {});
    await playCoachTts(text, { voice: "de-DE-KatjaNeural", rate });
  }, []);

  const handleDoDontPick = (idx: number, choice: "do" | "dont") => {
    const items = (currentStep as any).items as { text: string; answer: "do" | "dont" }[];
    const next = { ...doDontAnswers, [idx]: choice };
    setDoDontAnswers(next);
    const correct = items[idx]?.answer === choice;
    setDoDontFeedback(correct ? "Richtig." : "Nicht ganz.");
  };

  const handleChoiceSelect = (idx: number) => {
    const step = currentStep as any;
    setChoiceIndex(idx);
    setChoiceFeedback(idx === step.correctIndex ? "Richtig." : "Nicht ganz.");
  };

  const availableTokens = useMemo(() => {
    if (currentStep?.type !== "word_order") return [] as string[];
    const tokens = (currentStep as any).tokens as string[];
    return tokens.filter((t) => !wordAnswer.includes(t) || wordAnswer.filter((x) => x === t).length < tokens.filter((x) => x === t).length);
  }, [currentStep, wordAnswer]);

  const handleTokenTap = (token: string) => {
    setWordAnswer((prev) => [...prev, token]);
  };

  const handleTokenRemove = (idx: number) => {
    setWordAnswer((prev) => prev.filter((_, i) => i !== idx));
  };

  const checkWordOrder = () => {
    const step = currentStep as any;
    const answer = step.answer as string[];
    const ok = answer.length === wordAnswer.length && answer.every((t: string, i: number) => t === wordAnswer[i]);
      setWordFeedback(ok ? "Richtig." : "Tipp: Uhrzeit hinzufügen.");
  };

  const startRecording = useCallback(async () => {
    try {
      const perm = await requestRecordingPermissionsAsync();
      if (!perm.granted) {
        setMiniTip("Mikrofon-Zugriff fehlt. Bitte erlauben.");
        return;
      }
      await stopCoachTts().catch(() => {});
      await setAudioModeAsync({
        allowsRecording: true,
        playsInSilentMode: true,
      } as any);
      const rec = recordingRef.current ?? recorder;
      recordingRef.current = rec;
      rec.record();
      setIsRecording(true);
    } catch {
      setIsRecording(false);
    }
  }, [recorder]);

  const stopRecording = useCallback(async () => {
    try {
      const rec = recordingRef.current ?? recorder;
      recordingRef.current = null;
      if (!rec) return;
      const result = await rec.stop();
      setIsRecording(false);
      const uri = result?.uri;
      if (!uri) {
        setMiniTip("Ich habe noch nichts gehört.");
        return;
      }
      const res = await evaluateRecording({
        fileUri: uri,
        locale: "de-DE",
        targetText: null,
      });
      const text = (res?.transcript ?? "").trim();
      setTranscript(text || "–");
      if (!text) {
        setBetter("");
        setMiniTip("Ich habe noch nichts gehört.");
        return;
      }
      setBetter("Entschuldigung, ich komme 10 Minuten später.");
      setMiniTip("Entschuldigung + neue Uhrzeit.");
    } catch {
      setIsRecording(false);
    }
  }, [recorder]);

  const canContinue = useMemo(() => {
    const step = currentStep as any;
    switch (step.type) {
      case "do_dont_quiz":
        return Object.keys(doDontAnswers).length >= (step.items?.length ?? 0);
      case "choice_quiz":
        return choiceIndex !== null;
      case "word_order":
        return wordAnswer.length > 0;
      case "speak_asr":
        return Boolean(transcript.trim());
      default:
        return true;
    }
  }, [currentStep, doDontAnswers, choiceIndex, wordAnswer, transcript]);

  const goNext = () => {
    setChoiceFeedback("");
    setWordFeedback("");
    setMiniTip("");
    setStepIndex((prev) => Math.min(prev + 1, microSteps.length - 1));
  };

  return (
    <ScreenShell title={data.title} leftContent={<NavBackButton fallbackRoute="/learn/life" />}>
      <ScrollView contentContainerStyle={{ paddingBottom: insets.bottom + TAB_BAR_HEIGHT + 16 }}>
        <YStack gap="$3" padding="$4">
          {currentStep?.type === "info_card" ? (
            <Card bg={currentStep.bg}>
              <XStack alignItems="center" justifyContent="space-between">
                <Text fontSize="$6" fontWeight="800" color="$text">
                  {currentStep.title}
                </Text>
                <Text fontSize="$3" color="$textSecondary">
                  {data.durationMin} Min · {stepIndex + 1}/{microSteps.length}
                </Text>
              </XStack>
              <Text fontSize="$4" color="$textSecondary">
                {currentStep.text}
              </Text>
              <Pressable onPress={() => handlePlay(currentStep.ttsText ?? currentStep.text)}>
                <YStack paddingHorizontal="$3" paddingVertical="$2" borderRadius="$6" backgroundColor="$bgSurface">
                  <Text fontSize="$3" color="$text">🔊 Anhören</Text>
                </YStack>
              </Pressable>
            </Card>
          ) : null}

          {currentStep?.type === "do_dont_quiz" ? (
            <Card bg={currentStep.bg}>
              <XStack alignItems="center" justifyContent="space-between">
                <Text fontSize="$6" fontWeight="800" color="$text">
                  {currentStep.title}
                </Text>
                <Text fontSize="$3" color="$textSecondary">
                  {data.durationMin} Min · {stepIndex + 1}/{microSteps.length}
                </Text>
              </XStack>
              <Text fontSize="$4" color="$textSecondary">
                Tippe Do oder Don't.
              </Text>
              <DoDont items={currentStep.items} onPick={handleDoDontPick} />
              {doDontFeedback ? (
                <Text fontSize="$3" color="$textSecondary">
                  {doDontFeedback}
                </Text>
              ) : null}
            </Card>
          ) : null}

          {currentStep?.type === "choice_quiz" ? (
            <Card bg={currentStep.bg}>
              <XStack alignItems="center" justifyContent="space-between">
                <Text fontSize="$6" fontWeight="800" color="$text">
                  {currentStep.title}
                </Text>
                <Text fontSize="$3" color="$textSecondary">
                  {data.durationMin} Min · {stepIndex + 1}/{microSteps.length}
                </Text>
              </XStack>
              <Text fontSize="$4" color="$textSecondary">
                Wähle die bessere Antwort.
              </Text>
              <SkillChoice
                question={currentStep.question}
                options={currentStep.options}
                onSelect={(idx) => {
                  handleChoiceSelect(idx);
                  if (idx === currentStep.correctIndex) {
                    void handlePlay(currentStep.options[currentStep.correctIndex]);
                  }
                }}
              />
              <XStack gap="$2">
                <Pressable onPress={() => handlePlay(currentStep.options[currentStep.correctIndex], "normal")}>
                  <YStack paddingHorizontal="$3" paddingVertical="$2" borderRadius="$6" backgroundColor="$bgSurface">
                    <Text fontSize="$3" color="$text">🔊</Text>
                  </YStack>
                </Pressable>
                <Pressable onPress={() => handlePlay(currentStep.options[currentStep.correctIndex], "slow")}>
                  <YStack paddingHorizontal="$3" paddingVertical="$2" borderRadius="$6" backgroundColor="$bgSurface">
                    <Text fontSize="$3" color="$text">🐢</Text>
                  </YStack>
                </Pressable>
              </XStack>
              {choiceFeedback ? (
                <Text fontSize="$3" color="$textSecondary">
                  {choiceFeedback}
                </Text>
              ) : null}
            </Card>
          ) : null}

          {currentStep?.type === "word_order" ? (
            <Card bg={currentStep.bg}>
              <XStack alignItems="center" justifyContent="space-between">
                <Text fontSize="$6" fontWeight="800" color="$text">
                  {currentStep.title}
                </Text>
                <Text fontSize="$3" color="$textSecondary">
                  {data.durationMin} Min · {stepIndex + 1}/{microSteps.length}
                </Text>
              </XStack>
              <Text fontSize="$4" color="$textSecondary">
                Ordne die Wörter.
              </Text>
              <XStack gap="$2" flexWrap="wrap">
                {availableTokens.map((token, idx) => (
                  <Pressable key={`${token}-${idx}`} onPress={() => handleTokenTap(token)}>
                    <YStack paddingHorizontal="$3" paddingVertical="$2" borderRadius="$6" backgroundColor="$bgSurface">
                      <Text fontSize="$3" color="$text">{token}</Text>
                    </YStack>
                  </Pressable>
                ))}
              </XStack>
              <XStack gap="$2" flexWrap="wrap" marginTop="$2">
                {wordAnswer.map((token, idx) => (
                  <Pressable key={`${token}-${idx}`} onPress={() => handleTokenRemove(idx)}>
                    <YStack paddingHorizontal="$3" paddingVertical="$2" borderRadius="$6" backgroundColor="$bgInput">
                      <Text fontSize="$3" color="$text">{token}</Text>
                    </YStack>
                  </Pressable>
                ))}
              </XStack>
              <Pressable onPress={checkWordOrder}>
                <YStack paddingHorizontal="$3" paddingVertical="$2" borderRadius="$6" backgroundColor="$bgSurface">
                  <Text fontSize="$3" color="$text">Prüfen</Text>
                </YStack>
              </Pressable>
              {wordFeedback ? (
                <Text fontSize="$3" color="$textSecondary">
                  {wordFeedback}
                </Text>
              ) : null}
            </Card>
          ) : null}

          {currentStep?.type === "speak_asr" ? (
            <Card bg={currentStep.bg}>
              <XStack alignItems="center" justifyContent="space-between">
                <Text fontSize="$6" fontWeight="800" color="$text">
                  {currentStep.title}
                </Text>
                <Text fontSize="$3" color="$textSecondary">
                  {data.durationMin} Min · {stepIndex + 1}/{microSteps.length}
                </Text>
              </XStack>
              <Text fontSize="$4" color="$textSecondary">
                {currentStep.prompt}
              </Text>
              <Pressable
                onPressIn={() => {
                  if (!isRecording) {
                    void startRecording();
                  }
                }}
                onPressOut={() => {
                  if (isRecording) {
                    void stopRecording();
                  }
                }}
              >
                <YStack paddingHorizontal="$3" paddingVertical="$2" borderRadius="$6" backgroundColor="$bgSurface">
                  <Text fontSize="$3" color="$text">🎤 Gedrückt halten</Text>
                </YStack>
              </Pressable>
              {transcript ? (
                <Text fontSize="$3" color="$textSecondary">
                  Du hast gesagt: {transcript}
                </Text>
              ) : null}
              {better ? (
                <Text fontSize="$3" color="$textSecondary">
                  Besser: {better}
                </Text>
              ) : null}
              {miniTip ? (
                <Text fontSize="$3" color="$textSecondary">
                  Mini-Tipp: {miniTip}
                </Text>
              ) : null}
            </Card>
          ) : null}

          {currentStep?.type === "wrap" ? (
            <Card bg={currentStep.bg}>
              <XStack alignItems="center" justifyContent="space-between">
                <Text fontSize="$6" fontWeight="800" color="$text">
                  {currentStep.title}
                </Text>
                <Text fontSize="$3" color="$textSecondary">
                  {data.durationMin} Min · {stepIndex + 1}/{microSteps.length}
                </Text>
              </XStack>
              <Text fontSize="$4" color="$textSecondary">
                Merksatz.
              </Text>
              <Text fontSize="$4" color="$textSecondary">
                {currentStep.text}
              </Text>
              <XStack gap="$2">
                <Pressable
                  onPress={async () => {
                    await AsyncStorage.setItem("life_saved:life_01_time", "1");
                    console.log("[life] saved");
                  }}
                >
                  <YStack paddingHorizontal="$3" paddingVertical="$2" borderRadius="$6" backgroundColor="$bgSurface">
                    <Text fontSize="$3" color="$text">Merken</Text>
                  </YStack>
                </Pressable>
                <Pressable onPress={() => setStepIndex(0)}>
                  <YStack paddingHorizontal="$3" paddingVertical="$2" borderRadius="$6" backgroundColor="$bgSurface">
                    <Text fontSize="$3" color="$text">Nochmal 30s</Text>
                  </YStack>
                </Pressable>
              </XStack>
            </Card>
          ) : null}

          <Pressable onPress={goNext} disabled={!canContinue || stepIndex >= microSteps.length - 1}>
            <YStack padding="$3" borderRadius="$6" backgroundColor="$bgSurface" alignItems="center">
              <Text fontSize="$4" color="$text">Weiter</Text>
            </YStack>
          </Pressable>
        </YStack>
      </ScrollView>
    </ScreenShell>
  );
}
