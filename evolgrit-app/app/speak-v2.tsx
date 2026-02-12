import React, { useMemo, useState } from "react";
import { Alert, ScrollView } from "react-native";
import { useRouter } from "expo-router";
import { Stack, Text } from "tamagui";

import { applyERSDelta } from "../lib/readinessService";
import { completeNextActionAndRecompute } from "../lib/nextActionService";
import { appendEvent } from "../lib/eventsStore";
import { GlassCard } from "../components/system/GlassCard";
import { PrimaryButton } from "../components/system/PrimaryButton";
import { PillButton } from "../components/system/PillButton";
import { ScreenShell } from "../components/system/ScreenShell";
import { PronunciationGuide } from "../components/speaking/PronunciationGuide";
import { matchGuidesForSentence } from "../lib/pronunciation";
import type { PronunciationGuideItem } from "../components/speaking/PronunciationGuide";
import { AudioHelpRow } from "@/components/speaking/AudioHelpRow";
import { getTtsBase64 } from "@/lib/tts/azureTtsClient";
import { playBase64Tts } from "@/lib/tts/ttsPlayer";

function Card({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <GlassCard marginBottom={12}>
      <Text fontSize={12} fontWeight="800" color="$muted" marginBottom={10}>
        {title.toUpperCase()}
      </Text>
      {children}
    </GlassCard>
  );
}

export default function SpeakV2() {
  const router = useRouter();
  const [stage, setStage] = useState<"prompt" | "speaking" | "result">("prompt");
  const [showTip, setShowTip] = useState(false);
  const [loadingRate, setLoadingRate] = useState<"normal" | "slow" | null>(null);
  const TTS_DEBUG = __DEV__ && false;

  const prompt = useMemo(
    () => ({
      context: "Im Supermarkt",
      sentence: "Entschuldigung, wo finde ich Reis? Ich brauche zwei Kilo.",
      englishHint: "Excuse me, where can I find rice? I need two kilos.",
      tip: "Tipp: Sag „Entschuldigung“ klar und langsam. Betone „zwei Kilo“ deutlich.",
      expected: "Du fragst höflich nach einem Produkt und einer Menge.",
      pronunciation_guides: undefined as undefined | PronunciationGuideItem[],
    }),
    []
  );

  const [transcript, setTranscript] = useState<string>("");
  const [reply, setReply] = useState<string>("");
  const pronunciationGuides = useMemo(
    () => matchGuidesForSentence(prompt.sentence, prompt.pronunciation_guides as any),
    [prompt.sentence, prompt.pronunciation_guides]
  );

  async function onDone() {
    await appendEvent("task_completed", { task: "speak_v2" });
    await applyERSDelta({ L: 2, A: 3 });
    await completeNextActionAndRecompute();
    router.replace("/(tabs)/home");
  }

  async function handlePlay(rate: "normal" | "slow") {
    try {
      setLoadingRate(rate);
      const cleanText = prompt.sentence
        .replace(/^\s*(Say:|Sag:)\s*/i, "")
        .replace(/^['\"„‚]+/, "")
        .replace(/['\"”’]+$/, "")
        .trim();
      if (!cleanText) {
        console.warn("[tts] missing text - skipping speak");
        return;
      }
      if (cleanText.toLowerCase().includes("daniel")) {
        console.warn("[tts] blocked debug phrase");
        return;
      }
      if (TTS_DEBUG) console.log("[tts] request", { rate, textPreview: cleanText.slice(0, 40) });
      const res = await getTtsBase64({ text: cleanText, rate });
      if (TTS_DEBUG) console.log("[tts] response ok", { base64Len: res.base64.length });
      const uri = await playBase64Tts({
        base64: res.base64,
        mime: res.mime,
        text: cleanText,
        rate,
      });
      if (TTS_DEBUG) console.log("[tts] resolvedUri", uri);
    } catch (err) {
      console.error("[tts] play error", err);
      Alert.alert("Audio konnte nicht geladen werden");
    } finally {
      setLoadingRate(null);
    }
  }

  return (
    <ScreenShell title="Speaking" showBack>
      <ScrollView contentContainerStyle={{ paddingBottom: 40 }}>
        <Card title="Context">
          <Text fontSize={18} fontWeight="900" color="$text">
            {prompt.context}
          </Text>
          <Text marginTop={6} color="$muted">
            {prompt.expected}
          </Text>
        </Card>

        <Card title="Say this">
          <Text fontSize={20} fontWeight="900" color="$text">
            {prompt.sentence}
          </Text>
          {prompt.englishHint ? (
            <Text marginTop={6} color="$muted" fontSize={13}>
              {prompt.englishHint}
            </Text>
          ) : null}
          <AudioHelpRow
            loading={!!loadingRate}
            normalDisabled={!!loadingRate}
            slowDisabled={!!loadingRate}
            onPressNormal={() => handlePlay("normal")}
            onPressSlow={() => handlePlay("slow")}
          />
          <PronunciationGuide items={pronunciationGuides} />

          <Stack flexDirection="row" gap={10} marginTop={12}>
            <PillButton label={showTip ? "Hide tip" : "Tip"} onPress={() => setShowTip((s) => !s)} />
          </Stack>

          {showTip ? (
            <Stack marginTop={12} padding={12} borderRadius={14} backgroundColor="$glassDark">
              <Text color="$textOnDark" fontWeight="800">
                {prompt.tip}
              </Text>
            </Stack>
          ) : null}
        </Card>

        {stage === "prompt" && (
          <PrimaryButton
            label="Hold to speak"
            onPressIn={() => setStage("speaking")}
            onPressOut={() => {
              setTranscript("Entschuldigung… wo finde ich Reis? Ich brauche zwei Kilo.");
              setReply("Super. Du kannst jetzt im Supermarkt höflich nach einem Produkt fragen.");
              setStage("result");
            }}
          />
        )}

        {stage === "speaking" && (
          <PrimaryButton
            label="Listening… release"
            onPressOut={() => {
              setTranscript("Entschuldigung… wo finde ich Reis? Ich brauche zwei Kilo.");
              setReply("Super. Du kannst jetzt im Supermarkt höflich nach einem Produkt fragen.");
              setStage("result");
            }}
          />
        )}

        {stage === "result" && (
          <>
            <Card title="What you said">
              <Text color="$text" fontWeight="900">
                {transcript}
              </Text>
            </Card>

            <Card title="Response">
              <Text color="$text" fontWeight="900">
                {reply}
              </Text>
            </Card>

            <PrimaryButton label="Done → Next Action" onPress={onDone} />
          </>
        )}

        <Text marginTop={12} color="$muted" fontSize={12}>
          ASR + real audio playback comes next. UI/flow is ready.
        </Text>
      </ScrollView>
    </ScreenShell>
  );
}
