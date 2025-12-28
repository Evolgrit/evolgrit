import React, { useEffect, useMemo, useState } from "react";
import { View, Text, Pressable, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { loadLangPrefs } from "../lib/languagePrefs";
import { applyERSDelta } from "../lib/readinessService";
import { completeNextActionAndRecompute } from "../lib/nextActionService";
import { appendEvent } from "../lib/eventsStore";

const C = {
  bg: "#F6F7FB",
  card: "#FFFFFF",
  border: "#E5E7EB",
  text: "#111827",
  sub: "#6B7280",
  dark: "#111827",
  hint: "#0B1220",
};

function Card({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <View style={{ backgroundColor: C.card, borderRadius: 16, padding: 16, borderWidth: 1, borderColor: C.border, marginBottom: 12 }}>
      <Text style={{ fontSize: 12, fontWeight: "800", color: C.sub, marginBottom: 10 }}>{title.toUpperCase()}</Text>
      {children}
    </View>
  );
}

export default function SpeakV2() {
  const router = useRouter();
  const [nativeLang, setNativeLang] = useState("en");

  const [stage, setStage] = useState<"prompt" | "speaking" | "result">("prompt");
  const [showTip, setShowTip] = useState(false);

  const prompt = useMemo(() => {
    return {
      context: "Im Supermarkt",
      sentence: "Entschuldigung, wo finde ich Reis? Ich brauche zwei Kilo.",
      tip: "Tipp: Sag ‚Entschuldigung‘ klar und langsam. Betone ‚zwei Kilo‘ deutlich.",
      expected: "Du fragst höflich nach einem Produkt und einer Menge.",
    };
  }, []);

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
    <SafeAreaView style={{ flex: 1, backgroundColor: C.bg }}>
      <View style={{ paddingHorizontal: 16, paddingTop: 10, paddingBottom: 10 }}>
        <Text style={{ fontSize: 22, fontWeight: "900", color: C.text }}>Speaking</Text>
        <Text style={{ marginTop: 4, color: C.sub }}>One task. One improvement. One next step.</Text>
      </View>

      <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 40 }}>
        <Card title="Context">
          <Text style={{ fontSize: 18, fontWeight: "900", color: C.text }}>{prompt.context}</Text>
          <Text style={{ marginTop: 6, color: C.sub }}>{prompt.expected}</Text>
        </Card>

        <Card title="Say this">
          <Text style={{ fontSize: 20, fontWeight: "900", color: C.text }}>{prompt.sentence}</Text>

          <View style={{ flexDirection: "row", gap: 10, marginTop: 12 }}>
            <Pressable
              onPress={() => setShowTip((s) => !s)}
              style={{
                borderWidth: 1,
                borderColor: C.border,
                backgroundColor: "#fff",
                paddingVertical: 10,
                paddingHorizontal: 12,
                borderRadius: 14,
              }}
            >
              <Text style={{ fontWeight: "900", color: C.text }}>{showTip ? "Hide tip" : "Tip"}</Text>
            </Pressable>

            <Pressable
              onPress={() => {}}
              style={{
                borderWidth: 1,
                borderColor: C.border,
                backgroundColor: "#fff",
                paddingVertical: 10,
                paddingHorizontal: 12,
                borderRadius: 14,
              }}
            >
              <Text style={{ fontWeight: "900", color: C.text }}>Audio</Text>
            </Pressable>

            <Pressable
              onPress={() => {}}
              style={{
                borderWidth: 1,
                borderColor: C.border,
                backgroundColor: "#fff",
                paddingVertical: 10,
                paddingHorizontal: 12,
                borderRadius: 14,
              }}
            >
              <Text style={{ fontWeight: "900", color: C.text }}>{translateLabel}</Text>
            </Pressable>
          </View>

          {showTip ? (
            <View style={{ marginTop: 12, padding: 12, borderRadius: 14, backgroundColor: "#0B1220" }}>
              <Text style={{ color: "#fff", fontWeight: "800" }}>{prompt.tip}</Text>
            </View>
          ) : null}
        </Card>

        {stage === "prompt" && (
          <Pressable
            onPressIn={async () => {
              await appendEvent("task_started", { task: "speak_v2" });
              setStage("speaking");
            }}
            onPressOut={() => {
              // MVP simulate result
              setTranscript("Entschuldigung… wo finde ich Reis? Ich brauche zwei Kilo.");
              setReply("Super. Du kannst jetzt im Supermarkt höflich nach einem Produkt fragen.");
              setStage("result");
            }}
            style={{
              backgroundColor: C.dark,
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
            onPressOut={() => {
              setTranscript("Entschuldigung… wo finde ich Reis? Ich brauche zwei Kilo.");
              setReply("Super. Du kannst jetzt im Supermarkt höflich nach einem Produkt fragen.");
              setStage("result");
            }}
            style={{
              backgroundColor: "#111827",
              paddingVertical: 14,
              borderRadius: 16,
              alignItems: "center",
              marginBottom: 12,
            }}
          >
            <Text style={{ color: "#fff", fontWeight: "900" }}>Listening… release</Text>
          </Pressable>
        )}

        {stage === "result" && (
          <>
            <Card title="What you said">
              <Text style={{ color: C.text, fontWeight: "900" }}>{transcript}</Text>
            </Card>

            <Card title="Response">
              <Text style={{ color: C.text, fontWeight: "900" }}>{reply}</Text>
            </Card>

            <Pressable
              onPress={onDone}
              style={{
                backgroundColor: C.dark,
                paddingVertical: 14,
                borderRadius: 16,
                alignItems: "center",
              }}
            >
              <Text style={{ color: "#fff", fontWeight: "900" }}>Done → Next Action</Text>
            </Pressable>
          </>
        )}

        <Text style={{ marginTop: 12, color: "#9CA3AF", fontSize: 12 }}>
          ASR + real audio playback comes next. UI/flow is already correct.
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
}
