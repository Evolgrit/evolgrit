import React, { useEffect, useMemo, useRef, useState } from "react";
import { Pressable, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useLocalSearchParams, useRouter } from "expo-router";
import { AudioModule, RecordingPresets, setAudioModeAsync, useAudioRecorder, useAudioRecorderState } from "expo-audio";
import { Stack, Text, XStack } from "tamagui";
import { Ionicons } from "@expo/vector-icons";

import { getLessonById, LESSON_CATALOG } from "../lessons/catalog";
import b1Seed from "../content/b1/b1_seed.json";
import { appendEvent } from "../lib/eventsStore";
import { RecordingIndicator } from "../components/RecordingIndicator";
import { GlassCard } from "../components/system/GlassCard";
import { PillButton } from "../components/system/PillButton";
import { PrimaryButton } from "../components/system/PrimaryButton";
import { supabase } from "../lib/supabaseClient";
import { TasksPill } from "../components/speak/TasksPill";
import { DialogList } from "../components/speak/DialogList";
import { useSpeakingFlow } from "../hooks/useSpeakingFlow";

const C = {
  bg: "#F7F8FA",
  text: "#111827",
  sub: "#6B7280",
  dark: "#111827",
  hintBg: "#0B1220",
  userBubble: "rgba(17,24,39,0.08)",
};

function Card({ children }: { children: React.ReactNode }) {
  return <GlassCard marginBottom={12}>{children}</GlassCard>;
}

export default function LessonScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const paramLessonId = Array.isArray(params.lessonId) ? params.lessonId[0] : params.lessonId;
  const paramDrillId = Array.isArray(params.drill_id) ? params.drill_id[0] : params.drill_id;
  const fallbackLesson = LESSON_CATALOG.find((l) => l.level === "A1") ?? LESSON_CATALOG[0];

  const b1Lessons = useMemo(() => {
    return (b1Seed as any[]).flatMap((w: any) =>
      w.lessons.map((l: any) => ({
        ...l,
        week: w.week,
        level: w.level,
      }))
    );
  }, []);

  const b1Match = useMemo(
    () => b1Lessons.find((l: any) => l.slug === paramLessonId),
    [b1Lessons, paramLessonId]
  );

  const derivedB1Lesson = useMemo(() => {
    if (!b1Match) return null;
    return {
      id: b1Match.slug,
      level: b1Match.level,
      title: b1Match.title,
      steps: [
        { type: "context", text: b1Match.context },
        { type: "speak_free", prompt: b1Match.context },
        { type: "feedback", ok: "Gut gemacht.", retry: "Versuche es noch einmal." },
        { type: "speak_guided", sentence: b1Match.target_text },
        { type: "done", identity: b1Match.target_text },
      ],
    };
  }, [b1Match]);

  const lesson = useMemo(
    () => getLessonById(paramLessonId || "") ?? derivedB1Lesson ?? fallbackLesson,
    [paramLessonId, derivedB1Lesson, fallbackLesson]
  );
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
  const [drillLines, setDrillLines] = useState<any[]>([]);
  const [drillTitle, setDrillTitle] = useState<string | null>(null);
  const [drillMeta, setDrillMeta] = useState<{ level?: string; slug?: string } | null>(null);
  const [guidesByLine, setGuidesByLine] = useState<Record<string, any[]>>({});
  const [tasksCompleted, setTasksCompleted] = useState<Record<string, boolean>>({});

  const isRecording = recState?.isRecording ?? false;

  // load drill lines from Supabase for B1 speak lessons
  useEffect(() => {
    const slugOrId = paramDrillId || paramLessonId;
    if (!slugOrId || !supabase) return;
    (async () => {
      let drill: any = null;
      let drillErr: any = null;
      if (paramDrillId) {
        const { data, error } = await supabase
          .from("drills")
          .select("id,slug,level,topic")
          .eq("id", slugOrId)
          .maybeSingle();
        drill = data;
        drillErr = error;
      } else {
        const { data, error } = await supabase
          .from("drills")
          .select("id,slug,level,topic")
          .eq("slug", slugOrId)
          .maybeSingle();
        drill = data;
        drillErr = error;
      }
      if (drillErr || !drill?.id) {
        setDrillLines([]);
        return;
      }
      setDrillMeta({ level: drill.level, slug: drill.slug });

      const { data: lines, error: linesErr } = await supabase
        .from("drill_lines")
        .select("id,order_index,role,text,target_text,context_title,context_hint,mentor_tip,audio_url,audio_slow_url")
        .eq("drill_id", drill.id)
        .order("order_index", { ascending: true });

      if (linesErr || !lines) {
        setDrillLines([]);
      } else {
        setDrillLines(lines);
        setDrillTitle(lines[0]?.context_title ?? lesson?.title ?? slugOrId);

        const lineIds = lines.map((l) => l.id);
        if (lineIds.length) {
          const { data: guides, error: guidesErr } = await supabase
            .from("pronunciation_guides")
            .select("line_id,word,guide,note")
            .in("line_id", lineIds);
          if (!guidesErr && guides) {
            const map: Record<string, any[]> = {};
            guides.forEach((g) => {
              if (!map[g.line_id]) map[g.line_id] = [];
              map[g.line_id].push(g);
            });
            setGuidesByLine(map);
          }

        }
      }
    })();
  }, [paramLessonId, paramDrillId, lesson?.title]);

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

  const usingSupabaseDialog = drillLines.length > 0;

  async function onCompleteNextAction() {
    await appendEvent("task_completed", {
      task: "speak_dialog_done",
      lessonId: lesson?.id ?? paramLessonId ?? "lesson",
      drillSlug: drillMeta?.slug,
    });
    router.replace("/(tabs)/home");
  }

  // prepare dialog items with computed roles (for Supabase drills)
  const dialogItems = useMemo(() => {
    if (!usingSupabaseDialog) return [];
    let lastRole: "mentor" | "user" = "mentor";
    return drillLines.map((line) => {
      const roleRaw = (line.role ?? "").toLowerCase();
      const text = (line.target_text ?? line.text ?? "").trim();
      const looksSystem =
        text.startsWith("SYSTEM:") ||
        (line.context_title || line.context_hint || line.mentor_tip);
      let role: "system" | "mentor" | "user";
      if (roleRaw === "system" || roleRaw === "meta" || looksSystem) role = "system";
      else if (roleRaw === "user") role = "user";
      else if (roleRaw === "mentor") role = "mentor";
      else {
        role = lastRole === "mentor" ? "user" : "mentor";
        lastRole = role;
      }
      return { ...line, role, displayText: text.replace(/^SYSTEM:\s*/i, "") };
    });
  }, [drillLines, usingSupabaseDialog]);

  const speakingFlow = useSpeakingFlow(dialogItems);
  const holdTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Auto-complete tasks based on completed user lines
  useEffect(() => {
    const userLines = speakingFlow.dialogLines.filter((l) => l.role === "user");
    const completedCount = userLines.filter((l) => speakingFlow.completed[l.id]).length;
    setTasksCompleted((prev) => ({
      ...prev,
      task1: completedCount >= 1 || prev.task1,
      task2: completedCount >= 2 || prev.task2,
    }));
  }, [speakingFlow.completed, speakingFlow.dialogLines]);

  if (!lesson || (!step && !usingSupabaseDialog)) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: C.bg, alignItems: "center", justifyContent: "center" }}>
        <Text color={C.sub}>Loading…</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: C.bg }}>
      <Stack paddingHorizontal={16} paddingTop={12} paddingBottom={12} flexDirection="row" alignItems="center" justifyContent="space-between">
        <Pressable onPress={() => router.replace("/(tabs)/home")} hitSlop={10} style={{ padding: 6 }}>
          <Ionicons name="close" size={22} color={C.text} />
        </Pressable>
        <Stack flex={1} alignItems="center">
          <TasksPill
            storageKey={drillMeta?.slug ?? paramLessonId ?? "lesson"}
            tasks={[
              { id: "task1", title: "Frag nach dem Weg zum Zug" },
              { id: "task2", title: "Wiederhole die Wegbeschreibung" },
            ]}
            completed={tasksCompleted}
            onChangeCompleted={setTasksCompleted}
            onLoaded={(loaded) => setTasksCompleted(loaded)}
          />
        </Stack>
        <Stack alignItems="flex-end" minWidth={52}>
          <Text
            backgroundColor="rgba(17,24,39,0.06)"
            paddingVertical={4}
            paddingHorizontal={8}
            borderRadius={10}
            fontWeight="800"
            color={C.text}
            fontSize={11}
          >
            Beta
          </Text>
        </Stack>
      </Stack>

      {usingSupabaseDialog ? (
        <ScrollView contentContainerStyle={{ paddingBottom: 140 }}>
          <Stack paddingHorizontal={16} gap="$3" marginTop={8}>
            <Card>
              <Text fontSize={20} fontWeight="900" color={C.text} marginBottom={6}>
                {drillTitle ?? lesson.title}
              </Text>
              {drillLines[0]?.context_hint ? (
                <Text color={C.sub}>{drillLines[0].context_hint}</Text>
              ) : null}
            </Card>
            <DialogList
              items={dialogItems}
              activeId={speakingFlow.activeLineId}
              completed={speakingFlow.completed}
              guidesByLine={guidesByLine}
            />

            <GlassCard>
              <Text fontWeight="800" color={C.text} marginBottom={4}>
                {speakingFlow.phase === "mentor"
                  ? "Repeat after me"
                  : speakingFlow.phase === "user"
                  ? "Your turn"
                  : "Abgeschlossen"}
              </Text>
              <Text color={C.sub} marginBottom={12}>
                {speakingFlow.phase === "mentor"
                  ? "Lies den Satz und tippe Weiter."
                  : speakingFlow.phase === "user"
                  ? "Halte zum Sprechen und wiederhole den Satz."
                  : "Du hast alle Zeilen abgeschlossen."}
              </Text>

              {speakingFlow.phase === "mentor" && (
                <PrimaryButton label="Weiter" onPress={speakingFlow.advanceMentor} />
              )}

              {speakingFlow.phase === "user" && (
                <Stack gap="$3">
                  <XStack gap="$2">
                    <PillButton label="Bearbeiten" disabled />
                    <PillButton label="Wiederholen" disabled />
                  </XStack>
                  <Pressable
                    onPressIn={() => {
                      if (holdTimer.current) clearTimeout(holdTimer.current);
                      holdTimer.current = setTimeout(() => {
                        speakingFlow.completeUser();
                        holdTimer.current = null;
                      }, 800);
                    }}
                    onPressOut={() => {
                      if (holdTimer.current) {
                        clearTimeout(holdTimer.current);
                        holdTimer.current = null;
                      }
                    }}
                    style={{
                      borderRadius: 16,
                      borderWidth: 1,
                      borderColor: "rgba(17,24,39,0.08)",
                      paddingVertical: 14,
                      alignItems: "center",
                      backgroundColor: "#fff",
                    }}
                  >
                    <Text fontWeight="900" color={C.text}>
                      Halten zum Sprechen
                    </Text>
                  </Pressable>
                </Stack>
              )}

              {speakingFlow.phase === "done" && (
                <PrimaryButton label="Done → Next Action" onPress={onCompleteNextAction} />
              )}
            </GlassCard>
          </Stack>
        </ScrollView>
      ) : (
      <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 80 }}>
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

        {step.type === "listen_card" && (() => {
          const s = step as any;
          return (
          <Card>
            <Stack flexDirection="row" gap={12} alignItems="center" marginBottom={12}>
              <Stack width={58} height={58} borderRadius={14} backgroundColor="rgba(17,24,39,0.06)" alignItems="center" justifyContent="center">
                <Ionicons name="image-outline" size={26} color="#9CA3AF" />
              </Stack>
            </Stack>
            <Text fontSize={20} fontWeight="900" color={C.text}>
              {s.phrase}
            </Text>
            <Text marginTop={6} color={C.sub}>
              {s.translation}
            </Text>
          </Card>
          );
        })()}

        {step.type === "speak_repeat" && (() => {
          const s = step as any;
          return (
          <>
            <Card>
              <Text fontSize={20} fontWeight="900" color={C.text}>
                {s.prompt}
              </Text>
              <Text marginTop={6} color={C.sub}>
                {s.target}
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
          );
        })()}

        {step.type === "choice_fill" && (() => {
          const s = step as any;
          return (
          <Card>
            <Text fontSize={18} fontWeight="900" color={C.text} marginBottom={10}>
              {s.sentencePrefix} {selectedOption ?? "____"} {s.sentenceSuffix}
            </Text>
            <Text color={C.sub} marginBottom={10}>
              {s.translation}
            </Text>
            <Stack flexDirection="row" gap={10}>
              {s.options.map((opt: string) => {
                const isSelected = selectedOption === opt;
                const isCorrect = choiceStatus === "correct" && isSelected;
                return (
                  <Pressable
                    key={opt}
                    onPress={() => {
                      setSelectedOption(opt);
                      const correct = opt === s.correct;
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
          );
        })()}

        {step.type === "dialogue" && (() => {
          const s = step as any;
          return (
          <Card>
            <Stack
              alignSelf={s.speaker === "you" ? "flex-end" : "flex-start"}
              maxWidth="90%"
              backgroundColor={s.speaker === "you" ? "rgba(17,24,39,0.08)" : "#fff"}
              borderRadius={14}
              padding={12}
              borderWidth={1}
              borderColor="rgba(17,24,39,0.06)"
            >
              <Text fontWeight="800" color={C.text} marginBottom={4}>
                {s.speaker === "you" ? "You" : "Mentor"}
              </Text>
              <Text color={C.text}>{s.text}</Text>
              {s.translation ? <Text color={C.sub} marginTop={6}>{s.translation}</Text> : null}
            </Stack>
          </Card>
          );
        })()}

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
      )}
    </SafeAreaView>
  );
}
