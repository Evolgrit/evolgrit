import React, { useEffect, useMemo, useState } from "react";
import { View, Text, Pressable, ScrollView } from "react-native";
import { useRouter } from "expo-router";
import { loadLangPrefs } from "../lib/languagePrefs";
import { applyERSDelta } from "../lib/readinessService";
import { completeNextActionAndRecompute } from "../lib/nextActionService";
import { SafeAreaView } from "react-native-safe-area-context";

type Feedback = {
  hint1: string;
  hint2?: string;
  identity: string;
};

const CARD = {
  bg: "#ffffff",
  border: "#E5E7EB",
  text: "#111827",
  sub: "#6B7280",
  dark: "#111827",
  soft: "#F6F7FB",
};

function helperLine(nativeLang: string) {
  const map: Record<string, string> = {
    en: "Helper: Use this sentence to ask politely in a shop.",
    pl: "Wskazówka: Użyj tego zdania, aby grzecznie zapytać w sklepie.",
    ar: "مساعدة: استخدم هذه الجملة لتسأل بأدب في المتجر.",
    tr: "İpucu: Mağazada kibarca sormak için bu cümleyi kullan.",
    ro: "Ajutor: Folosește această propoziție ca să întrebi politicos în magazin.",
    uk: "Підказка: Використай це речення, щоб ввічливо запитати в магазині.",
    ru: "Подсказка: Используй это предложение, чтобы вежливо спросить в магазине.",
  };
  return map[nativeLang] ?? map.en;
}

function Card({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <View
      style={{
        backgroundColor: CARD.bg,
        borderRadius: 16,
        padding: 16,
        borderWidth: 1,
        borderColor: CARD.border,
        marginBottom: 12,
      }}
    >
      <Text style={{ fontSize: 12, fontWeight: "800", color: CARD.sub, marginBottom: 10 }}>
        {title.toUpperCase()}
      </Text>
      {children}
    </View>
  );
}

export default function SpeakTaskA1() {
  const router = useRouter();
  const [stage, setStage] = useState<"ready" | "speaking" | "feedback">("ready");
  const [saving, setSaving] = useState(false);
  const [nativeLang, setNativeLang] = useState<string>("en");

  useEffect(() => {
    (async () => {
      const prefs = await loadLangPrefs();
      if (prefs?.nativeLang) setNativeLang(prefs.nativeLang);
    })();
  }, []);

  const context = useMemo(
    () => ({
      oneLiner: "At the supermarket",
      situation: "You want to ask for a product and quantity.",
      prompt: 'Say: "Excuse me, where can I find rice? I need two kilos."',
    }),
    []
  );

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

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: CARD.soft }}>
      <View style={{ paddingHorizontal: 16, paddingBottom: 10 }}>
        <Text style={{ fontSize: 22, fontWeight: "900", color: CARD.text }}>Speaking</Text>
        <Text style={{ marginTop: 4, color: CARD.sub }}>One task. One improvement. One next step.</Text>
      </View>

      <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 40 }}>
        <Card title="Context">
          <Text style={{ fontSize: 18, fontWeight: "800", color: CARD.text, marginBottom: 6 }}>
            {context.oneLiner}
          </Text>
          <Text style={{ color: CARD.sub }}>{context.situation}</Text>
        </Card>

        <Card title="Your line">
          <Text style={{ fontSize: 18, fontWeight: "800", color: CARD.text }}>{context.prompt}</Text>
          <Text style={{ marginTop: 10, color: CARD.sub }}>
            {helperLine(nativeLang)}
          </Text>
          <Text style={{ color: CARD.sub, marginTop: 6 }}>
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
          <Pressable
            onPress={() => setStage("speaking")}
            style={{
              backgroundColor: CARD.dark,
              paddingVertical: 14,
              borderRadius: 16,
              alignItems: "center",
              marginBottom: 12,
            }}
          >
            <Text style={{ color: "#fff", fontWeight: "900" }}>Hold to speak</Text>
          </Pressable>
        )}

        {stage === "speaking" && (
          <Pressable
            onPressOut={() => setStage("feedback")}
            style={{
              backgroundColor: "#ffffff",
              borderWidth: 1,
              borderColor: CARD.border,
              paddingVertical: 14,
              borderRadius: 16,
              alignItems: "center",
              marginBottom: 12,
            }}
          >
            <Text style={{ color: CARD.text, fontWeight: "900" }}>Release to get feedback</Text>
          </Pressable>
        )}

        {stage === "feedback" && (
          <>
            <Card title="Feedback">
              <Text style={{ color: CARD.text, fontWeight: "800", marginBottom: 6 }}>{feedback.hint1}</Text>
              {feedback.hint2 ? <Text style={{ color: CARD.text, fontWeight: "800" }}>{feedback.hint2}</Text> : null}
            </Card>

            <Card title="You gained">
              <Text style={{ color: CARD.text, fontWeight: "900" }}>{feedback.identity}</Text>
            </Card>

            <Pressable
              onPress={onComplete}
              disabled={saving}
              style={{
                backgroundColor: CARD.dark,
                paddingVertical: 14,
                borderRadius: 16,
                alignItems: "center",
              }}
            >
              <Text style={{ color: "#fff", fontWeight: "900" }}>
                {saving ? "Saving…" : "Done → Next Action"}
              </Text>
            </Pressable>
          </>
        )}

        <Text style={{ marginTop: 12, color: "#9CA3AF", fontSize: 12 }}>
          This screen simulates speaking. Next step: microphone + ASR + internal scoring.
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
}
