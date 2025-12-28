import React, { useEffect, useMemo, useState } from "react";
import { View, Text, Pressable, TextInput, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { addMentorMessage, addUserMessage, loadThread, type MentorThread } from "../lib/mentorStore";
import { saveNextAction } from "../lib/nextActionStore";
import { applyERSDelta } from "../lib/readinessService";
import { loadLangPrefs } from "../lib/languagePrefs";
import { uuid } from "../lib/uuid";

const C = {
  bg: "#F6F7FB",
  card: "#ffffff",
  border: "#E5E7EB",
  text: "#111827",
  sub: "#6B7280",
  dark: "#111827",
};

function Card({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <View style={{ backgroundColor: C.card, borderRadius: 16, padding: 16, borderWidth: 1, borderColor: C.border, marginBottom: 12 }}>
      <Text style={{ fontSize: 12, fontWeight: "800", color: C.sub, marginBottom: 10 }}>{title.toUpperCase()}</Text>
      {children}
    </View>
  );
}

// MVP: simple canned mentor logic → becomes Next Action
function mentorReply(question: string) {
  return `Thanks. Let's make it smaller.\nToday: Do one 3-minute speaking drill about your current situation.`;
}

export default function MentorInbox() {
  const router = useRouter();
  const [thread, setThread] = useState<MentorThread | null>(null);
  const [text, setText] = useState("");
  const [busy, setBusy] = useState(false);
  const [nativeLang, setNativeLang] = useState("en");

  useEffect(() => {
    (async () => {
      setThread(await loadThread());
      const prefs = await loadLangPrefs();
      if (prefs?.nativeLang) setNativeLang(prefs.nativeLang);
    })();
  }, []);

  const placeholder = useMemo(() => {
    const map: Record<string, string> = {
      en: "Ask your mentor… (what is blocking you?)",
      pl: "Napisz do mentora… (co Cię blokuje?)",
      ar: "اكتب سؤالك للمرشد…",
      tr: "Mentoruna yaz… (seni ne zorluyor?)",
      ro: "Scrie mentorului… (ce te blochează?)",
      uk: "Напиши ментору… (що блокує?)",
      ru: "Напиши ментору… (что мешает?)",
    };
    return map[nativeLang] ?? map.en;
  }, [nativeLang]);

  if (!thread) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: C.bg, alignItems: "center", justifyContent: "center" }}>
        <Text style={{ color: C.sub }}>Loading…</Text>
      </SafeAreaView>
    );
  }

  async function onSend() {
    if (!text.trim()) return;
    setBusy(true);
    try {
      const q = text.trim();
      setText("");
      const t1 = await addUserMessage(q);
      setThread(t1);

      // MVP mentor reply
      const reply = mentorReply(q);
      const t2 = await addMentorMessage(reply);
      setThread(t2);

      // mentor reply writes Next Action (no promises, no scores)
      await saveNextAction({
        id: uuid(),
        title: "Next Action",
        subtitle: "From mentor: one small step today.",
        cta: "Do a 3-minute speaking drill",
        etaMin: 3,
      });
      await applyERSDelta({ L: 2, A: 3 });
    } finally {
      setBusy(false);
    }
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: C.bg }}>
      <View style={{ paddingHorizontal: 16, paddingTop: 22, paddingBottom: 10 }}>
        <Text style={{ fontSize: 22, fontWeight: "900", color: C.text }}>Mentor</Text>
        <Text style={{ marginTop: 4, color: C.sub }}>Ask when stuck. Replies become your next action.</Text>
      </View>

      <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 24 }}>
        <Card title="Ask a question">
          <TextInput
            value={text}
            onChangeText={setText}
            placeholder={placeholder}
            placeholderTextColor="#9CA3AF"
            style={{
              borderWidth: 1,
              borderColor: C.border,
              borderRadius: 14,
              padding: 12,
              minHeight: 44,
              color: C.text,
              backgroundColor: "#fff",
            }}
          />

          <Pressable
            onPress={onSend}
            disabled={busy}
            style={{
              marginTop: 12,
              backgroundColor: C.dark,
              paddingVertical: 12,
              borderRadius: 14,
              alignItems: "center",
              opacity: busy ? 0.7 : 1,
            }}
          >
            <Text style={{ color: "#fff", fontWeight: "900" }}>{busy ? "Sending…" : "Send"}</Text>
          </Pressable>
        </Card>

        <Card title="Latest messages">
          {thread.messages.length === 0 ? (
            <Text style={{ color: C.sub }}>No messages yet.</Text>
          ) : (
            thread.messages.slice(0, 6).map((m) => (
              <View
                key={m.id}
                style={{
                  borderWidth: 1,
                  borderColor: C.border,
                  backgroundColor: "#fff",
                  borderRadius: 14,
                  padding: 12,
                  marginBottom: 10,
                }}
              >
                <Text style={{ fontWeight: "900", color: C.text, marginBottom: 6 }}>
                  {m.role === "mentor" ? "Mentor" : "You"}
                </Text>
                <Text style={{ color: C.text }}>{m.text}</Text>
                <Text style={{ marginTop: 6, color: "#9CA3AF", fontSize: 12 }}>
                  {new Date(m.createdAt).toLocaleString()}
                </Text>
              </View>
            ))
          )}
        </Card>

        <Pressable
          onPress={() => router.replace("/(tabs)/home")}
          style={{ backgroundColor: "#fff", borderWidth: 1, borderColor: C.border, paddingVertical: 12, borderRadius: 14, alignItems: "center" }}
        >
          <Text style={{ color: C.text, fontWeight: "900" }}>Done → Home</Text>
        </Pressable>

        <Text style={{ marginTop: 12, color: "#9CA3AF", fontSize: 12 }}>
          Local thread only. Later: real async messaging + mentor SLA.
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
}
