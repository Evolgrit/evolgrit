import React, { useEffect, useMemo, useState } from "react";
import { ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { Stack, Text } from "tamagui";

import { loadLangPrefs } from "../lib/languagePrefs";
import { applyERSDelta } from "../lib/readinessService";
import { completeNextActionAndRecompute } from "../lib/nextActionService";
import { appendEvent } from "../lib/eventsStore";
import { GlassCard } from "../components/system/GlassCard";
import { PrimaryButton } from "../components/system/PrimaryButton";
import { PillButton } from "../components/system/PillButton";

const TOKENS = {
  bg: "#F7F8FA",
};

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
  const [nativeLang, setNativeLang] = useState("en");
  const [stage, setStage] = useState<"prompt" | "speaking" | "result">("prompt");
  const [showTip, setShowTip] = useState(false);

  const prompt = useMemo(
    () => ({
      context: "Im Supermarkt",
      sentence: "Entschuldigung, wo finde ich Reis? Ich brauche zwei Kilo.",
      tip: "Tipp: Sag ‚Entschuldigung‘ klar und langsam. Betone ‚zwei Kilo‘ deutlich.",
      expected: "Du fragst höflich nach einem Produkt und einer Menge.",
    }),
    []
  );

  const [transcript, setTranscript] = useState<string>("");
  const [reply, setReply] = useState<string>("");

  useEffect(() => {
    (async () => {
      const prefs = await loadLangPrefs();
      if (prefs?.nativeLang) setNativeLang(prefs.nativeLang);
    })();
  }, []);

  const translateLabel = useMemo(() => {
    const map: Record<string, string> = {
      en: "Translate",
      pl: "Tłumacz",
      ar: "ترجمة",
      tr: "Çevir",
      ro: "Tradu",
      uk: "Переклад",
      ru: "Перевод",
    };
    return map[nativeLang] ?? "Translate";
  }, [nativeLang]);

  async function onDone() {
    await appendEvent("task_completed", { task: "speak_v2" });
    await applyERSDelta({ L: 2, A: 3 });
    await completeNextActionAndRecompute();
    router.replace("/(tabs)/home");
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: TOKENS.bg }}>
      <Stack paddingHorizontal={16} paddingTop={10} paddingBottom={10}>
        <Text fontSize={22} fontWeight="900" color="$text">
          Speaking
        </Text>
        <Text marginTop={4} color="$muted">
          One task. One improvement. One next step.
        </Text>
      </Stack>

      <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 40 }}>
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

          <Stack flexDirection="row" gap={10} marginTop={12}>
            <PillButton label={showTip ? "Hide tip" : "Tip"} onPress={() => setShowTip((s) => !s)} />
            <PillButton label="Audio" onPress={() => {}} />
            <PillButton label={translateLabel} onPress={() => {}} />
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
    </SafeAreaView>
  );
}
