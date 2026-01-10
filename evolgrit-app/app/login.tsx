import React, { useState } from "react";
import { Alert, KeyboardAvoidingView, Platform } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { YStack, Stack, Input, Button, Text } from "tamagui";
import { useRouter } from "expo-router";
import { supabase } from "../lib/supabaseClient";

export default function Login() {
  const router = useRouter();
  const [email, setEmail] = useState<string>("");
  const [code, setCode] = useState<string>("");
  const [sent, setSent] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function sendCode() {
    const normalizedEmail = email.trim().toLowerCase();
    if (!normalizedEmail) return;
    setIsSubmitting(true);
    if (!supabase) {
      Alert.alert("Fehler", "Supabase Client fehlt.");
      setIsSubmitting(false);
      return;
    }
    const { error } = await supabase.auth.signInWithOtp({
      email: normalizedEmail,
      options: { shouldCreateUser: true },
    });
    if (error) {
      Alert.alert("Fehler", error.message ?? "Konnte Code nicht senden.");
    } else {
      setSent(true);
      Alert.alert("Code gesendet", "Bitte prüfe deine E-Mail.");
    }
    setIsSubmitting(false);
  }

  async function verifyCode() {
    const normalizedEmail = email.trim().toLowerCase();
    if (!normalizedEmail || !code.trim()) return;
    setIsSubmitting(true);
    if (!supabase) {
      Alert.alert("Fehler", "Supabase Client fehlt.");
      setIsSubmitting(false);
      return;
    }
    const { error } = await supabase.auth.verifyOtp({
      email: normalizedEmail,
      token: code.trim(),
      type: "email",
    });
    if (error) {
      Alert.alert("Fehler", error.message ?? "Code konnte nicht verifiziert werden.");
    } else {
      router.replace("/(tabs)/home");
    }
    setIsSubmitting(false);
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#F7F8FA" }}>
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === "ios" ? "padding" : undefined}>
        <YStack flex={1} justifyContent="center" padding="$4" gap="$3">
          <Stack gap="$2">
            <Text fontSize={20} fontWeight="900" color="$text">
              Melde dich an
            </Text>
            <Text color="$muted">Mentor-Chat & Medien uploads benötigen eine Anmeldung.</Text>
          </Stack>

          <Stack gap="$2">
            <Text color="$muted" fontWeight="700">
              E-Mail
            </Text>
            <Input
              value={email}
              onChange={(e) => {
                const t = (e.nativeEvent as any)?.text ?? "";
                console.log("[login] email change", t);
                setEmail(t);
              }}
              placeholder="deine@email.de"
              autoCapitalize="none"
              keyboardType="email-address"
              editable={!isSubmitting}
              pointerEvents="auto"
            />
            <Button onPress={sendCode} backgroundColor="$primary" color="$textOnDark">
              {isSubmitting ? "Sendet…" : "Code senden"}
            </Button>
          </Stack>

          {sent ? (
            <Stack gap="$2">
              <Text color="$muted" fontWeight="700">
                Code
              </Text>
              <Input
                value={code}
                onChange={(e) => {
                  const t = (e.nativeEvent as any)?.text ?? "";
                  console.log("[login] code change", t);
                  setCode(t);
                }}
                placeholder="123456"
                keyboardType="number-pad"
                maxLength={6}
                editable={!isSubmitting}
                pointerEvents="auto"
              />
              <Button onPress={verifyCode} backgroundColor="$primary" color="$textOnDark">
                {isSubmitting ? "Prüft…" : "Bestätigen"}
              </Button>
            </Stack>
          ) : null}
        </YStack>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
