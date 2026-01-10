import React, { useEffect, useMemo, useState } from "react";
import { ScrollView } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Notifications from "expo-notifications";
import { Text, YStack } from "tamagui";
import { useLocalSearchParams, useRouter } from "expo-router";
import { ImageChoiceStep } from "../../components/lesson/steps/ImageChoiceStep";
import { ChoiceStep } from "../../components/lesson/steps/ChoiceStep";
import { ClozeChoiceStep } from "../../components/lesson/steps/ClozeChoiceStep";
import { ListenRepeatStep } from "../../components/lesson/steps/ListenRepeatStep";
import { ImageAudioChoiceStep } from "../../components/lesson/steps/ImageAudioChoiceStep";
import { ClozeAudioChoiceStep } from "../../components/lesson/steps/ClozeAudioChoiceStep";
import { playCorrect, playWrong, hapticCorrect, hapticWrong } from "../../lib/feedback";
import { LessonStepShell } from "../../components/lesson/LessonStepShell";
import { ConfirmModal } from "../../components/system/ConfirmModal";
import { lessonType } from "../../design/typography";

type ImageChoiceStepData = {
  type: "image_choice";
  prompt: string;
  ttsText?: string;
  choices: { id: string; label: string; imageKey?: string | null }[];
  answer: string;
};

type ImageAudioChoiceStepData = {
  type: "image_audio_choice";
  prompt: string;
  tts?: { text: string; rate?: "normal" | "slow" };
  options: { id: string; label: string; imageKey?: string | null; audioText?: string; ttsText?: string }[];
  answerId: string;
};

type ChoiceStepDef = {
  type: "choice";
  prompt: string;
  text?: string;
  choices: { id: string; label: string }[];
  answer: string;
};

type ClozeChoiceStepData = {
  type: "cloze_choice";
  prompt: string;
  text: string;
  choices: { id: string; label: string }[];
  answer: string;
};

type ClozeAudioChoiceStepData = {
  type: "cloze_audio_choice";
  prompt: string;
  tts?: { text: string; rate?: "normal" | "slow" };
  imageKey?: string | null;
  sentence: { before?: string; after?: string };
  translation?: string;
  choices: { id: string; label: string }[];
  answerId: string;
};

type WordBuildStep = {
  type: "word_build";
  prompt: string;
  text: string;
  choices: { id: string; label: string }[];
  answer: string;
};

type DialogueChoiceStep = {
  type: "dialogue_choice";
  prompt: string;
  text?: string;
  choices: { id: string; label: string }[];
  answer: string;
};

type ListenRepeatStepDef = {
  type: "listen_repeat";
  prompt: string;
  ttsText: string;
  cta?: string;
};

type Step =
  | ImageChoiceStepData
  | ImageAudioChoiceStepData
  | ChoiceStepDef
  | ClozeChoiceStepData
  | ClozeAudioChoiceStepData
  | WordBuildStep
  | DialogueChoiceStep
  | ListenRepeatStepDef;

type Lesson = { id: string; title: string; level?: string; week?: number; steps: Step[] };

const lessons: Record<string, Lesson> = {
  a1_w1_name: require("../../content/a1/week1/lesson_sich_vorstellen_name.json"),
};

type ConfirmMode = "none" | "exit" | "resume";

export default function LessonRunnerScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const [confirmMode, setConfirmMode] = useState<ConfirmMode>("none");
  const [resumeStep, setResumeStep] = useState<number | null>(null);
  const [canAdvance, setCanAdvance] = useState(false);

  const lesson = useMemo(() => {
    if (!id) return null;
    return lessons[String(id)];
  }, [id]);

  const [stepIndex, setStepIndex] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [reveal, setReveal] = useState(false);

  const storageKey = lesson ? `lesson_progress:${lesson.id}` : "";

  useEffect(() => {
    const loadProgress = async () => {
      if (!storageKey) return;
      try {
        const raw = await AsyncStorage.getItem(storageKey);
        if (!raw) return;
        const parsed = JSON.parse(raw);
        if (typeof parsed?.stepIndex === "number" && parsed.stepIndex > 0) {
          setResumeStep(parsed.stepIndex);
          setConfirmMode("resume");
        }
      } catch {
        // ignore
      }
    };
    loadProgress();
  }, [storageKey]);

  useEffect(() => {
    const persist = async () => {
      if (!storageKey) return;
      try {
        await AsyncStorage.setItem(storageKey, JSON.stringify({ stepIndex }));
      } catch {
        // ignore
      }
    };
    persist();
  }, [storageKey, stepIndex]);

  useEffect(() => {
    setSelected(null);
    setReveal(false);
    setCanAdvance(false);
  }, [stepIndex]);

  if (!lesson) {
    return (
      <YStack flex={1} backgroundColor="#FFFFFF" padding="$4" justifyContent="center">
        <Text color="$muted" {...lessonType.body}>
          Lektion nicht gefunden.
        </Text>
      </YStack>
    );
  }

  const step = lesson.steps[stepIndex];

  const onChoice = async (optionId: string, correct: boolean) => {
    setSelected(optionId);
    setReveal(true);
    if (correct) {
      await hapticCorrect();
      await playCorrect();
      setCanAdvance(true);
    } else {
      await hapticWrong();
      await playWrong();
      setCanAdvance(false);
    }
  };

  const advance = () => {
    if (stepIndex < lesson.steps.length - 1) {
      setStepIndex((i) => i + 1);
      setCanAdvance(false);
    } else {
      if (storageKey) AsyncStorage.removeItem(storageKey).catch(() => {});
      router.back();
    }
  };

  const resetLessonProgress = () => {
    setStepIndex(0);
    setSelected(null);
    setReveal(false);
    setCanAdvance(false);
    setResumeStep(null);
    if (storageKey) AsyncStorage.removeItem(storageKey).catch(() => {});
  };

  const handleBack = () => {
    if (confirmMode !== "none") return;
    setConfirmMode("exit");
  };

  const remindLater = async () => {
    try {
      const perm = await Notifications.requestPermissionsAsync();
      if (!perm.granted) {
        return;
      }
      await Notifications.scheduleNotificationAsync({
        content: { title: "Evolgrit", body: "Weiter mit deiner Mini-Lektion?" },
        trigger: { type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL, seconds: 60 * 60 },
      });
      setConfirmMode("none");
      router.back();
    } catch {
      // ignore
    }
  };

  return (
    <YStack flex={1} backgroundColor="#FFFFFF">
      <ScrollView
        style={{ flex: 1, backgroundColor: "#FFFFFF" }}
        contentContainerStyle={{
          paddingBottom: 48,
          alignItems: "center",
          gap: 16,
        }}
      >
        <LessonStepShell
          title={lesson.title}
          subtitle={`Schritt ${stepIndex + 1} von ${lesson.steps.length}`}
          progress={(stepIndex + 1) / lesson.steps.length}
          onBack={handleBack}
          onNext={advance}
          canNext={canAdvance}
          wrapCard={step.type !== "listen_repeat"}
        >
          {step.type === "image_audio_choice" ? (
            <ImageAudioChoiceStep
              prompt={step.prompt}
              ttsText={step.tts?.text}
              options={step.options.map((opt) => ({ ...opt, correct: opt.id === step.answerId }))}
              selectedId={selected}
              reveal={reveal}
              onSelect={onChoice}
            />
          ) : null}

          {step.type === "image_choice" ? (
            <ImageChoiceStep
              prompt={step.prompt}
              options={step.choices.map((opt) => ({ ...opt, correct: opt.id === step.answer }))}
              selectedId={selected}
              reveal={reveal}
              onSelect={onChoice}
            />
          ) : null}

          {step.type === "choice" ? (
            <ChoiceStep
              prompt={step.prompt}
              text={step.text}
              options={step.choices.map((opt) => ({ ...opt, correct: opt.id === step.answer }))}
              selectedId={selected}
              reveal={reveal}
              onSelect={onChoice}
            />
          ) : null}

          {step.type === "cloze_choice" ? (
            <ClozeChoiceStep
              prompt={step.prompt}
              text={step.text}
              options={step.choices.map((opt) => ({ ...opt, correct: opt.id === step.answer }))}
              selectedId={selected}
              reveal={reveal}
              onSelect={onChoice}
            />
          ) : null}

          {step.type === "listen_repeat" ? (
            <ListenRepeatStep
              prompt={step.prompt}
              text={step.ttsText}
              onSolved={(ok) => setCanAdvance(ok)}
            />
          ) : null}

          {step.type === "word_build" ? (
            <ChoiceStep
              prompt={step.prompt}
              text={step.text}
              options={step.choices.map((opt) => ({ ...opt, correct: opt.id === step.answer }))}
              selectedId={selected}
              reveal={reveal}
              onSelect={onChoice}
            />
          ) : null}

          {step.type === "dialogue_choice" ? (
            <ChoiceStep
              prompt={step.prompt}
              text={step.text}
              options={step.choices.map((opt) => ({ ...opt, correct: opt.id === step.answer }))}
              selectedId={selected}
              reveal={reveal}
              onSelect={onChoice}
            />
          ) : null}

          {step.type === "cloze_audio_choice" ? (
            <ClozeAudioChoiceStep
              prompt={step.prompt}
              ttsText={step.tts?.text}
              imageKey={step.imageKey}
              sentence={step.sentence}
              translation={step.translation}
              choices={step.choices.map((c) => ({ ...c, correct: c.id === step.answerId }))}
              selectedId={selected}
              reveal={reveal}
              onSelect={onChoice}
            />
          ) : null}
        </LessonStepShell>

      </ScrollView>
      <ConfirmModal
        open={confirmMode !== "none"}
        onClose={() => setConfirmMode("none")}
        title={confirmMode === "exit" ? "Lektion abbrechen?" : "Fortsetzen?"}
        description={
          confirmMode === "exit"
            ? "Dein Fortschritt bleibt gespeichert. Du kannst später weitermachen."
            : resumeStep !== null
            ? `Du warst bei Schritt ${resumeStep + 1} von ${lesson.steps.length}.`
            : "Du kannst fortsetzen oder neu starten."
        }
        primaryLabel={confirmMode === "exit" ? "Erinnern (1h)" : "Fortsetzen"}
        secondaryLabel="Neu starten"
        onPrimary={() => {
          if (confirmMode === "exit") {
            remindLater();
            return;
          }
          if (resumeStep !== null) {
            setStepIndex(resumeStep);
            setResumeStep(null);
          }
          setConfirmMode("none");
        }}
        onSecondary={() => {
          resetLessonProgress();
          setConfirmMode("none");
        }}
      />
    </YStack>
  );
}
