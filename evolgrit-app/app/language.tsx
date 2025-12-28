import React, { useEffect, useState } from "react";
import { View, Text, Pressable } from "react-native";
import { useRouter } from "expo-router";
import { loadLangPrefs, saveLangPrefs, type LangPrefs } from "../lib/languagePrefs";

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
    <View style={{ flex: 1, padding: 16, paddingTop: 24, backgroundColor: "#F6F7FB" }}>
      <Text style={{ fontSize: 24, fontWeight: "900", color: "#111827" }}>Choose your language</Text>
      <Text style={{ marginTop: 6, color: "#6B7280" }}>You will learn German (Deutsch).</Text>

      <View style={{ marginTop: 16, gap: 10 }}>
        {LANGS.map((l) => (
          <Pressable
            key={l.code}
            onPress={() => setNativeLang(l.code)}
            style={{
              paddingVertical: 14,
              paddingHorizontal: 14,
              borderRadius: 14,
              borderWidth: 1,
              borderColor: nativeLang === l.code ? "#111827" : "#E5E7EB",
              backgroundColor: "#fff",
            }}
          >
            <Text style={{ fontWeight: "800", color: "#111827" }}>{l.label}</Text>
            <Text style={{ color: "#6B7280" }}>{l.code} → de</Text>
          </Pressable>
        ))}
      </View>

      <Pressable
        onPress={onContinue}
        style={{
          marginTop: 16,
          backgroundColor: "#111827",
          paddingVertical: 14,
          borderRadius: 16,
          alignItems: "center",
        }}
      >
        <Text style={{ color: "#fff", fontWeight: "900" }}>Continue</Text>
      </Pressable>
    </View>
  );
}
