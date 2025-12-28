import React, { useEffect, useMemo, useRef, useState } from "react";
import { Pressable, TextInput, ScrollView, KeyboardAvoidingView, Platform, Keyboard } from "react-native";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import { useRouter, useFocusEffect } from "expo-router";
import { Stack, Text } from "tamagui";

import { addMentorMessage, addUserMessage, loadThread, type MentorThread } from "../../lib/mentorStore";
import { setMentorNextAction } from "../../lib/nextActionService";
import { loadLangPrefs } from "../../lib/languagePrefs";
import { setMentorUnreadCount } from "../../lib/mentorUnreadStore";
import { GlassCard } from "../../components/system/GlassCard";
import { PrimaryButton } from "../../components/system/PrimaryButton";

const TOKENS = {
  bg: "#F7F8FA",
  card: "rgba(255,255,255,0.85)",
  glassDark: "rgba(28,36,51,0.78)",
  primary: "#1C2433",
  text: "#111827",
  textOnDark: "#F9FAFB",
  muted: "#6B7280",
  border: "rgba(17,24,39,0.08)",
};

function mentorReply(question: string) {
  return `Thanks. Let's make it smaller.\nToday: one 3-minute speaking drill about your current situation.`;
}

export default function MentorTab() {
  const [thread, setThread] = useState<MentorThread | null>(null);
  const [text, setText] = useState("");
  const [busy, setBusy] = useState(false);
  const [nativeLang, setNativeLang] = useState("en");
  const insets = useSafeAreaInsets();
  const TAB_BAR_H = 58;
  const [kbH, setKbH] = useState(0);
  const router = useRouter();

  const scrollRef = useRef<ScrollView>(null);

  useEffect(() => {
    (async () => {
      setThread(await loadThread());
      const prefs = await loadLangPrefs();
      if (prefs?.nativeLang) setNativeLang(prefs.nativeLang);
    })();
  }, []);

  useFocusEffect(
    React.useCallback(() => {
      setMentorUnreadCount(0);
    }, [])
  );

  useEffect(() => {
    const show = Keyboard.addListener("keyboardDidShow", (e) => {
      setKbH(e.endCoordinates?.height ?? 0);
    });
    const hide = Keyboard.addListener("keyboardDidHide", () => setKbH(0));
    return () => {
      show.remove();
      hide.remove();
    };
  }, []);

  const placeholder = useMemo(() => {
    const map: Record<string, string> = {
      en: "Ask your mentor…",
      pl: "Napisz do mentora…",
      ar: "اسأل مرشدك…",
      tr: "Mentoruna sor…",
      ro: "Întreabă mentorul…",
      uk: "Запитай ментора…",
      ru: "Спроси ментора…",
    };
    return map[nativeLang] ?? map.en;
  }, [nativeLang]);

  // Auto scroll when messages change
  useEffect(() => {
    const t = setTimeout(() => {
      scrollRef.current?.scrollToEnd({ animated: true });
    }, 50);
    return () => clearTimeout(t);
  }, [thread?.messages.length]);

  // Auto scroll when keyboard opens
  useEffect(() => {
    const sub = Keyboard.addListener("keyboardDidShow", () => {
      setTimeout(() => scrollRef.current?.scrollToEnd({ animated: true }), 50);
    });
    return () => sub.remove();
  }, []);

  async function onSend() {
    if (!text.trim()) return;
    setBusy(true);
    try {
      const q = text.trim();
      setText("");

      const t1 = await addUserMessage(q);
      setThread(t1);

      const reply = mentorReply(q);
      const t2 = await addMentorMessage(reply);
      setThread(t2);

      await setMentorNextAction("Do a 3-minute speaking drill");

      // scroll after send
      setTimeout(() => scrollRef.current?.scrollToEnd({ animated: true }), 60);
    } finally {
      setBusy(false);
    }
  }

  if (!thread) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: TOKENS.bg, alignItems: "center", justifyContent: "center" }}>
        <Text color={TOKENS.muted}>Loading…</Text>
      </SafeAreaView>
    );
  }

  const messages = thread.messages.slice().reverse(); // oldest -> newest
  const effectiveKb = Math.max(0, kbH - insets.bottom);
  const listPadBottom = effectiveKb > 0 ? effectiveKb + 120 : TAB_BAR_H + 120;

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: TOKENS.bg }}>
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === "ios" ? "padding" : undefined}>
        <Stack paddingHorizontal={16} paddingTop={10} paddingBottom={10}>
          <Text fontSize={22} fontWeight="900" color="$text">
            Mentor
          </Text>
          <Text marginTop={4} color="$muted">
            Ask when stuck. Replies become your next action.
          </Text>
        </Stack>

        <ScrollView
          ref={scrollRef}
          contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: listPadBottom, paddingTop: 8 }}
          keyboardShouldPersistTaps="handled"
        >
          {messages.length === 0 ? (
            <GlassCard>
              <Text color="$muted">No messages yet. Ask one question — short and honest.</Text>
            </GlassCard>
          ) : (
            messages.map((m) => (
              <Stack
                key={m.id}
                style={{
                  alignSelf: m.role === "user" ? "flex-end" : "flex-start",
                  maxWidth: "88%",
                  marginBottom: 10,
                  backgroundColor: m.role === "user" ? TOKENS.primary : TOKENS.glassDark,
                  borderWidth: 1,
                  borderColor: TOKENS.border,
                  borderRadius: 16,
                  padding: 12,
                }}
              >
                <Text color="$textOnDark" fontWeight="800" marginBottom={6}>
                  {m.role === "user" ? "You" : "Mentor"}
                </Text>
                <Text color="$textOnDark">{m.text}</Text>
                {m.ctaLabel && m.ctaRoute ? (
                  <Pressable
                    onPress={() => router.push(m.ctaRoute as any)}
                    style={{
                      marginTop: 10,
                      backgroundColor: "rgba(255,255,255,0.10)",
                      borderWidth: 1,
                      borderColor: "rgba(255,255,255,0.14)",
                      paddingVertical: 10,
                      borderRadius: 14,
                      alignItems: "center",
                    }}
                  >
                    <Text color="$textOnDark" fontWeight="900">
                      {m.ctaLabel}
                    </Text>
                  </Pressable>
                ) : null}
              </Stack>
            ))
          )}
        </ScrollView>

        <Stack
          style={{
            position: "absolute",
            left: 16,
            right: 16,
            bottom: effectiveKb > 0 ? effectiveKb + 4 : TAB_BAR_H + 10,
          }}
        >
          <Stack
            style={{
              backgroundColor: TOKENS.card,
              borderWidth: 1,
              borderColor: TOKENS.border,
              borderRadius: 18,
              padding: 10,
              flexDirection: "row",
              gap: 10,
              alignItems: "center",
            }}
          >
            <TextInput
              value={text}
              onChangeText={setText}
              placeholder={placeholder}
              placeholderTextColor="rgba(17,24,39,0.35)"
              style={{
                flex: 1,
                color: TOKENS.text,
                paddingVertical: 10,
                paddingHorizontal: 12,
                borderRadius: 14,
                backgroundColor: "rgba(255,255,255,0.45)",
              }}
              onFocus={() => setTimeout(() => scrollRef.current?.scrollToEnd({ animated: true }), 50)}
            />
            <PrimaryButton
              height={48}
              width={94}
              disabled={busy}
              label={busy ? "…" : "Send"}
              onPress={onSend}
            />
          </Stack>
        </Stack>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
