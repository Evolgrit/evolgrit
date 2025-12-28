import React, { useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { Stack, Text } from "tamagui";
import { useRouter } from "expo-router";

import { loadLangPrefs, saveLangPrefs, type LangPrefs } from "../lib/languagePrefs";
import { GlassCard } from "../components/system/GlassCard";
import { PrimaryButton } from "../components/system/PrimaryButton";
import { PillButton } from "../components/system/PillButton";

const LANGS = [
  { code: "en", label: "English" },
  { code: "pl", label: "Polski" },
  { code: "ar", label: "العربية" },
  { code: "tr", label: "Türkçe" },
  { code: "ro", label: "Română" },
  { code: "uk", label: "Українська" },
  { code: "ru", label: "Русский" },
];

export default function LanguageSelect() {
  const router = useRouter();
  const [nativeLang, setNativeLang] = useState<string>("en");

  useEffect(() => {
    (async () => {
      const existing = await loadLangPrefs();
      if (existing?.nativeLang) setNativeLang(existing.nativeLang);
    })();
  }, []);

  async function onContinue() {
    const prefs: LangPrefs = { nativeLang, targetLang: "de" };
    await saveLangPrefs(prefs);
    router.replace("/(tabs)/home");
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#F7F8FA" }}>
      <Stack flex={1} padding={16} gap={12}>
        <Stack gap={4}>
          <Text fontSize={24} fontWeight="900" color="$text">
            Choose your language
          </Text>
          <Text color="$muted">You will learn German (Deutsch).</Text>
        </Stack>

        <GlassCard>
          <Stack gap={10}>
            {LANGS.map((l) => (
              <PillButton
                key={l.code}
                label={`${l.label} (${l.code})`}
                borderColor={nativeLang === l.code ? "$primary" : "$border"}
                onPress={() => setNativeLang(l.code)}
              />
            ))}
          </Stack>
        </GlassCard>

        <PrimaryButton label="Continue" onPress={onContinue} />
      </Stack>
    </SafeAreaView>
  );
}
