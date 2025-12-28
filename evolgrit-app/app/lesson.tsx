import React, { useEffect, useMemo, useState } from "react";
import { Pressable, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useLocalSearchParams, useRouter } from "expo-router";
import { AudioModule, RecordingPresets, setAudioModeAsync, useAudioRecorder, useAudioRecorderState } from "expo-audio";
import { Stack, Text } from "tamagui";
import { Ionicons } from "@expo/vector-icons";

import { getLessonById, LESSON_CATALOG } from "../lessons/catalog";
import { appendEvent } from "../lib/eventsStore";
import { RecordingIndicator } from "../components/RecordingIndicator";
import { GlassCard } from "../components/system/GlassCard";
import { PillButton } from "../components/system/PillButton";

const C = {
  bg: "#F7F8FA",
  text: "#111827",
  sub: "#6B7280",
  dark: "#111827",
  hintBg: "#0B1220",
};

function Card({ children }: { children: React.ReactNode }) {
  return <GlassCard marginBottom={12}>{children}</GlassCard>;
}

export default function LessonScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const paramLessonId = Array.isArray(params.lessonId) ? params.lessonId[0] : params.lessonId;
  const fallbackLesson = LESSON_CATALOG.find((l) => l.level === "A1") ?? LESSON_CATALOG[0];
  const lesson = useMemo(() => getLessonById(paramLessonId || "") ?? fallbackLesson, [paramLessonId, fallbackLesson]);
  const steps = lesson?.steps ?? [];

  const [i, setI] = useState(0);
  const step = steps[i];

  const [lastWasOk, setLastWasOk] = useState(true);
  const [transcript, setTranscript] = useState("");
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [choiceStatus, setChoiceStatus] = useState<"correct" | "wrong" | null>(null);
  const [showHintBanner, setShowHintBanner] = useState(true);
  const recorder = useAudioRecorder(RecordingPresets.HIGH_QUALITY);
  const recState = useAudioRecorderState(recorder);

  const title = useMemo(() => "Lesson", []);
  const isRecording = recState?.isRecording ?? false;

  async function next() {
    const nextIndex = Math.min(i + 1, steps.length - 1);
    setI(nextIndex);
  }

  async function startRec(stepName: string) {
    const perm = await AudioModule.requestRecordingPermissionsAsync();
    if (!perm.granted) return;

    await setAudioModeAsync({
      allowsRecording: true,
      playsInSilentMode: true,
    });

    await appendEvent("task_started", { task: stepName, lessonId: lesson.id });
    await recorder.prepareToRecordAsync();
    await recorder.record();
  }

  async function stopRec(stepName: string) {
    try {
      await recorder.stop();
    } catch {
      // ignore
    }

    await appendEvent("task_completed", { task: stepName, lessonId: lesson.id, ok: true });
    setTranscript(stepName === "speak_guided" ? (step as any)?.sentence ?? "" : (step as any)?.prompt ?? "");
    setLastWasOk(true);
    next();
  }

  useEffect(() => {
    setSelectedOption(null);
    setChoiceStatus(null);
    setShowHintBanner(true);
    setTranscript("");
    setLastWasOk(true);
  }, [i, step]);

  if (!lesson || !step) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: C.bg, alignItems: "center", justifyContent: "center" }}>
        <Text color={C.sub}>Loading…</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: C.bg }}>
      <Stack paddingHorizontal={16} paddingTop={12} paddingBottom={12} flexDirection="row" alignItems="center" justifyContent="space-between">
        <Pressable onPress={() => router.back()} hitSlop={10} style={{ padding: 6 }}>
          <Ionicons name="chevron-back" size={22} color={C.text} />
        </Pressable>
        <Stack alignItems="center" flex={1}>
          <Text fontSize={16} fontWeight="900" color={C.text}>
            {title}
          </Text>
          <Text marginTop={2} color={C.sub} fontSize={12}>
            {lesson.level} · {lesson.title}
          </Text>
        </Stack>
        <Pressable onPress={() => router.replace("/(tabs)/home")} hitSlop={10} style={{ padding: 6 }}>
          <Ionicons name="close" size={22} color={C.text} />
        </Pressable>
      </Stack>

      <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 40 }}>
        {step.type === "context" && (
          <>
            <Card>
              <Text fontSize={20} fontWeight="900" color={C.text}>
                {step.text}
              </Text>
            </Card>
            <PillButton label="Continue" onPress={next} />
          </>
        )}

        {step.type === "speak_free" && (
          <>
            <Card>
              <Text fontSize={20} fontWeight="900" color={C.text}>
                {step.prompt}
              </Text>
            </Card>
            <RecordingIndicator isRecording={isRecording} />

            <Pressable
              onPressIn={async () => {
                await startRec("speak_free");
              }}
              onPressOut={async () => {
                await stopRec("speak_free");
              }}
              style={{
                backgroundColor: C.dark,
                paddingVertical: 12,
                borderRadius: 14,
                alignItems: "center",
              }}
            >
              <Text style={{ color: "#fff", fontWeight: "900" }}>Hold to speak</Text>
            </Pressable>
          </>
        )}

        {step.type === "feedback" && (
          <>
            <Card>
              <Text fontSize={18} fontWeight="900" color={C.text}>
                {lastWasOk ? "✓" : "Try again"}
              </Text>
              <Text marginTop={10} fontSize={18} fontWeight="800" color={C.text}>
                {lastWasOk ? step.ok : step.retry}
              </Text>

              {transcript ? (
                <Text marginTop={10} color={C.sub}>
                  &quot;{transcript}&quot;
                </Text>
              ) : null}
            </Card>

            <PillButton label="Continue" onPress={next} />
          </>
        )}

        {step.type === "hint" && (
          <>
            <Card>
              <Stack backgroundColor={C.hintBg} borderRadius={14} padding={12}>
                <Text color="#fff" fontWeight="900">
                  Tip
                </Text>
                <Text color="rgba(255,255,255,0.85)" marginTop={6}>
                  {step.text}
                </Text>
              </Stack>
            </Card>
            <PillButton label="Continue" onPress={next} />
          </>
        )}

        {step.type === "speak_guided" && (
          <>
            <Card>
              <Text fontSize={22} fontWeight="900" color={C.text}>
                {step.sentence}
              </Text>
            </Card>
            <RecordingIndicator isRecording={isRecording} />

            <Pressable
              onPressIn={async () => {
                await startRec("speak_guided");
              }}
              onPressOut={async () => {
                await stopRec("speak_guided");
              }}
              style={{
                backgroundColor: C.dark,
                paddingVertical: 12,
                borderRadius: 14,
                alignItems: "center",
              }}
            >
              <Text style={{ color: "#fff", fontWeight: "900" }}>Hold to speak</Text>
            </Pressable>
          </>
        )}

        {step.type === "listen_card" && (
          <Card>
            <Stack flexDirection="row" gap={12} alignItems="center" marginBottom={12}>
              <Stack width={58} height={58} borderRadius={14} backgroundColor="rgba(17,24,39,0.06)" alignItems="center" justifyContent="center">
                <Ionicons name="image-outline" size={26} color="#9CA3AF" />
              </Stack>
              <Pressable
                style={{
                  width: 42,
                  height: 42,
                  borderRadius: 14,
                  backgroundColor: "#111827",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Ionicons name="volume-high-outline" size={22} color="#fff" />
              </Pressable>
            </Stack>
            <Text fontSize={20} fontWeight="900" color={C.text}>
              {step.phrase}
            </Text>
            <Text marginTop={6} color={C.sub}>
              {step.translation}
            </Text>
          </Card>
        )}

        {step.type === "speak_repeat" && (
          <>
            <Card>
              <Text fontSize={20} fontWeight="900" color={C.text}>
                {step.prompt}
              </Text>
              <Text marginTop={6} color={C.sub}>
                {step.target}
              </Text>
            </Card>
            <RecordingIndicator isRecording={isRecording} />
            <Pressable
              onPressIn={async () => {
                await startRec("speak_repeat");
              }}
              onPressOut={async () => {
                await stopRec("speak_repeat");
              }}
              style={{
                backgroundColor: C.dark,
                paddingVertical: 12,
                borderRadius: 14,
                alignItems: "center",
              }}
            >
              <Text style={{ color: "#fff", fontWeight: "900" }}>{isRecording ? "Recording…" : "Hold to speak"}</Text>
            </Pressable>
          </>
        )}

        {step.type === "choice_fill" && (
          <Card>
            <Text fontSize={18} fontWeight="900" color={C.text} marginBottom={10}>
              {step.sentencePrefix} {selectedOption ?? "____"} {step.sentenceSuffix}
            </Text>
            <Text color={C.sub} marginBottom={10}>
              {step.translation}
            </Text>
            <Stack flexDirection="row" gap={10}>
              {step.options.map((opt) => {
                const isSelected = selectedOption === opt;
                const isCorrect = choiceStatus === "correct" && isSelected;
                return (
                  <Pressable
                    key={opt}
                    onPress={() => {
                      setSelectedOption(opt);
                      const correct = opt === step.correct;
                      setChoiceStatus(correct ? "correct" : "wrong");
                      if (correct) {
                        setTimeout(() => next(), 500);
                      }
                    }}
                    style={{
                      flex: 1,
                      borderRadius: 14,
                      paddingVertical: 10,
                      borderWidth: 1,
                      borderColor: isCorrect
                        ? "#10B981"
                        : isSelected
                        ? "rgba(17,24,39,0.12)"
                        : "rgba(17,24,39,0.08)",
                      backgroundColor: isCorrect ? "rgba(16,185,129,0.12)" : "#fff",
                      alignItems: "center",
                    }}
                  >
                    <Text fontWeight="800" color={C.text}>
                      {opt}
                    </Text>
                  </Pressable>
                );
              })}
            </Stack>
          </Card>
        )}

        {step.type === "dialogue" && (
          <Card>
            <Stack
              alignSelf={step.speaker === "you" ? "flex-end" : "flex-start"}
              maxWidth="90%"
              backgroundColor={step.speaker === "you" ? "rgba(17,24,39,0.08)" : "#fff"}
              borderRadius={14}
              padding={12}
              borderWidth={1}
              borderColor="rgba(17,24,39,0.06)"
            >
              <Text fontWeight="800" color={C.text} marginBottom={4}>
                {step.speaker === "you" ? "You" : "Mentor"}
              </Text>
              <Text color={C.text}>{step.text}</Text>
              {step.translation ? <Text color={C.sub} marginTop={6}>{step.translation}</Text> : null}
            </Stack>
          </Card>
        )}

        {step.type === "hint_banner" && showHintBanner ? (
          <Pressable
            onPress={() => {
              setShowHintBanner(false);
              next();
            }}
            style={{
              backgroundColor: "rgba(255,181,143,0.18)",
              borderRadius: 12,
              padding: 12,
              borderWidth: 1,
              borderColor: "rgba(255,181,143,0.35)",
            }}
          >
            <Text fontWeight="800" color={C.text}>
              Tip
            </Text>
            <Text color={C.sub} marginTop={4}>
              {step.text}
            </Text>
          </Pressable>
        ) : null}
      </ScrollView>
    </SafeAreaView>
  );
}
