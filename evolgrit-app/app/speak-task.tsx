import React, { useEffect, useMemo, useState } from "react";
import { Alert, ScrollView } from "react-native";
import { useRouter } from "expo-router";
import { Text } from "tamagui";

import { loadLangPrefs } from "../lib/languagePrefs";
import { applyERSDelta } from "../lib/readinessService";
import { completeNextActionAndRecompute } from "../lib/nextActionService";
import { GlassCard } from "../components/system/GlassCard";
import { PrimaryButton } from "../components/system/PrimaryButton";
import { ScreenShell } from "../components/system/ScreenShell";
import { PronunciationGuide } from "@/components/speaking/PronunciationGuide";
import { AudioHelpRow } from "@/components/speaking/AudioHelpRow";
import { matchGuidesForSentence } from "@/lib/pronunciation";
import { getTtsBase64 } from "@/lib/tts/azureTtsClient";
import { playBase64Tts } from "@/lib/tts/ttsPlayer";

type Feedback = {
  hint1: string;
  hint2?: string;
  identity: string;
};

function helperLine(nativeLang: string) {
  const map: Record<string, string> = {
    en: "Use this sentence to ask politely in a shop.",
    pl: "Użyj tego zdania, aby grzecznie zapytać w sklepie.",
    ar: "استخدم هذه الجملة لتسأل بأدب في المتجر.",
    tr: "Mağazada kibarca sormak için bu cümleyi kullan.",
    ro: "Folosește această propoziție ca să întrebi politicos în magazin.",
    uk: "Використай це речення, щоб ввічливо запитати в магазині.",
    ru: "Используй это предложение, чтобы вежливо спросить в магазине.",
  };
  return map[nativeLang] ?? map.en;
}

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

export default function SpeakTaskA1() {
  const router = useRouter();
  const [stage, setStage] = useState<"ready" | "speaking" | "feedback">("ready");
  const [saving, setSaving] = useState(false);
  const [nativeLang, setNativeLang] = useState<string>("en");
  const [loadingRate, setLoadingRate] = useState<"normal" | "slow" | null>(null);
  const TTS_DEBUG = __DEV__ && false;

  useEffect(() => {
    (async () => {
      const prefs = await loadLangPrefs();
      if (prefs?.nativeLang) setNativeLang(prefs.nativeLang);
    })();
  }, []);

  const context = useMemo(
    () => ({
      oneLiner: "Im Supermarkt",
      situation: "Du fragst höflich nach einem Produkt und einer Menge.",
      prompt: "Entschuldigung, wo finde ich Reis? Ich brauche zwei Kilo.",
      englishHint: "Excuse me, where can I find rice? I need two kilos.",
      difficultWord: "Entschuldigung",
    }),
    []
  );
  const guides = useMemo(() => matchGuidesForSentence(context.prompt, undefined), [context.prompt]);

  const feedback: Feedback = useMemo(
    () => ({
      hint1: 'Try a clearer "Excuse me" at the start.',
      hint2: 'Say "two kilos" slowly and clearly.',
      identity: "You can now ask for a product and quantity in a shop.",
    }),
    []
  );

  async function onComplete() {
    setSaving(true);
    try {
      await applyERSDelta({ L: 2, A: 3 });
      await completeNextActionAndRecompute(); // writes a fresh next action to storage
      router.replace("/(tabs)/home"); // back to Home
    } finally {
      setSaving(false);
    }
  }

  async function handlePlay(rate: "normal" | "slow") {
    try {
      setLoadingRate(rate);
      const cleanText = context.prompt
        .replace(/^\s*(Say:|Sag:)\s*/i, "")
        .replace(/^['"„‚]+/, "")
        .replace(/['"”’]+$/, "")
        .trim();
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
          <Text fontSize={18} fontWeight="800" color="$text" marginBottom={6}>
            {context.oneLiner}
          </Text>
          <Text color="$muted">{context.situation}</Text>
        </Card>

        <Card title="Your line">
          <Text fontSize={18} fontWeight="800" color="$text">
            {context.prompt}
          </Text>
          {context.englishHint ? (
            <Text marginTop={6} color="$muted" fontSize={13}>
              {context.englishHint}
            </Text>
          ) : null}
          <AudioHelpRow
            loading={!!loadingRate}
            normalDisabled={!!loadingRate || !context.prompt}
            slowDisabled={!!loadingRate || !context.prompt}
            onPressNormal={() => handlePlay("normal")}
            onPressSlow={() => handlePlay("slow")}
          />
          <PronunciationGuide items={guides} />
          <Text marginTop={10} color="$muted">
            {helperLine(nativeLang)}
          </Text>
          <Text color="$muted" marginTop={6}>
            {{
              en: "Sag den Satz laut und deutlich.",
              pl: "Powiedz to zdanie głośno i wyraźnie.",
              ar: "قل الجملة بصوت واضح وببطء.",
              tr: "Cümleyi yüksek ve net söyle.",
              ro: "Spune fraza clar și rar.",
              uk: "Скажи фразу вголос і чітко.",
              ru: "Скажи фразу громко и четко.",
            }[nativeLang] ?? "Sag den Satz laut und deutlich."}
          </Text>
        </Card>

        {stage === "ready" && (
          <PrimaryButton label="Hold to speak" onPress={() => setStage("speaking")} />
        )}

        {stage === "speaking" && (
          <PrimaryButton label="Release to get feedback" onPressOut={() => setStage("feedback")} />
        )}

        {stage === "feedback" && (
          <>
            <Card title="Feedback">
              <Text color="$text" fontWeight="800" marginBottom={6}>
                {feedback.hint1}
              </Text>
              {feedback.hint2 ? (
                <Text color="$text" fontWeight="800">
                  {feedback.hint2}
                </Text>
              ) : null}
            </Card>

            <Card title="You gained">
              <Text color="$text" fontWeight="900">
                {feedback.identity}
              </Text>
            </Card>

            <PrimaryButton label={saving ? "Saving…" : "Done → Next Action"} disabled={saving} onPress={onComplete} />
          </>
        )}

        <Text marginTop={12} color="$muted" fontSize={12}>
          This screen simulates speaking. Next step: microphone + ASR + internal scoring.
        </Text>
      </ScrollView>
    </ScreenShell>
  );
}
