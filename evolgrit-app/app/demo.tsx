import React, { useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { ScrollView } from "react-native";
import { Stack, Text } from "tamagui";
import { useRouter } from "expo-router";

import { GlassCard } from "../components/system/GlassCard";
import { PrimaryButton } from "../components/system/PrimaryButton";
import { SecondaryButton } from "../components/system/SecondaryButton";
import { PillButton } from "../components/system/PillButton";
import { ReadinessRing } from "../components/ReadinessRing";
import { loadLangPrefs, saveLangPrefs, type LangPrefs } from "../lib/languagePrefs";
import { loadCurrentERS, DEFAULT_ERS } from "../lib/readinessService";
import { getNextAction, type NextAction } from "../lib/nextActionService";
import { lesson as tourLesson } from "../lessons/a1_tour_tickets_photos";

type Step = 0 | 1 | 2 | 3 | 4;

const LANGS = [
  { code: "en", label: "English" },
  { code: "pl", label: "Polski" },
  { code: "ar", label: "العربية" },
  { code: "tr", label: "Türkçe" },
  { code: "ro", label: "Română" },
  { code: "uk", label: "Українська" },
  { code: "ru", label: "Русский" },
];

export default function DemoScreen() {
  const router = useRouter();
  const [step, setStep] = useState<Step>(0);
  const [prefs, setPrefs] = useState<LangPrefs>({ nativeLang: "en", targetLang: "de" });
  const [ers, setErs] = useState(DEFAULT_ERS);
  const [nextAction, setNextAction] = useState<NextAction | null>(null);

  useEffect(() => {
    (async () => {
      const saved = await loadLangPrefs();
      if (saved) setPrefs(saved);
      else await saveLangPrefs(prefs);
      const currentErs = await loadCurrentERS();
      setErs(currentErs);
      const na = await getNextAction();
      setNextAction(na.action);
    })();
    // prefs only sets defaults; safe to ignore exhaustive-deps for demo
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function updateLang(code: string) {
    const updated = { nativeLang: code, targetLang: "de" };
    setPrefs(updated);
    saveLangPrefs(updated);
  }

  function renderBadge() {
    return (
      <PillButton label="Demo" backgroundColor="$card" borderColor="$border" disabled height={34} paddingHorizontal={14} />
    );
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#F7F8FA" }}>
      <Stack paddingHorizontal={16} paddingTop={12} paddingBottom={6} flexDirection="row" alignItems="center" justifyContent="space-between">
        <Text fontSize={18} fontWeight="900" color="$text">
          Demo
        </Text>
        {renderBadge()}
      </Stack>

      <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 32 }}>
        {step === 0 && (
          <GlassCard>
            <Text fontWeight="800" color="$text" marginBottom={8}>
              Choose your language
            </Text>
            <Text color="$muted" marginBottom={12}>
              You will learn German (Deutsch). Pick your native language.
            </Text>
            <Stack gap={10}>
              {LANGS.map((l) => (
                <PillButton
                  key={l.code}
                  label={`${l.label} (${l.code})`}
                  backgroundColor={prefs.nativeLang === l.code ? "$card" : "$card"}
                  onPress={() => updateLang(l.code)}
                />
              ))}
            </Stack>
            <PrimaryButton marginTop={16} label="Continue" onPress={() => setStep(1)} />
          </GlassCard>
        )}

        {step === 1 && nextAction && (
          <>
            <GlassCard marginBottom={12}>
              <Text fontWeight="800" color="$text" marginBottom={6}>
                Next Action
              </Text>
              <Text color="$muted" marginBottom={4}>
                {nextAction.title}
              </Text>
              <Text color="$text" fontWeight="800" marginBottom={6}>
                {nextAction.cta}
              </Text>
              <Text color="$muted">{nextAction.subtitle}</Text>
              <PrimaryButton marginTop={12} label="Start" onPress={() => setStep(2)} />
            </GlassCard>

            <GlassCard>
              <Text fontWeight="800" color="$text" marginBottom={8}>
                Readiness
              </Text>
              <Stack alignItems="center">
                <ReadinessRing value={Math.min(100, Math.max(0, Math.round(Math.min(ers.L, ers.A, ers.S, ers.C))))} size={170} strokeWidth={12} />
              </Stack>
            </GlassCard>
          </>
        )}

        {step === 2 && (
          <GlassCard>
            <Text fontWeight="800" color="$text" marginBottom={8}>
              Tour tickets & photos
            </Text>
            <Text color="$muted" marginBottom={10}>
              Lesson: {tourLesson.title}
            </Text>
            <PrimaryButton label="Open lesson" onPress={() => setStep(3)} />
          </GlassCard>
        )}

        {step === 3 && (
          <GlassCard>
            <Text fontWeight="800" color="$text" marginBottom={8}>
              Completion
            </Text>
            <Text color="$muted" marginBottom={12}>
              You can now ask simple questions on a tour.
            </Text>
            <PrimaryButton label="View progress" onPress={() => setStep(4)} />
          </GlassCard>
        )}

        {step === 4 && (
          <GlassCard>
            <Text fontWeight="800" color="$text" marginBottom={8}>
              Progress
            </Text>
            <Stack alignItems="center" marginBottom={8}>
              <ReadinessRing value={Math.min(100, Math.max(0, Math.round(Math.min(ers.L, ers.A, ers.S, ers.C)) + 2))} size={170} strokeWidth={12} />
            </Stack>
            <Text color="$muted" marginBottom={12}>
              Focus: Application · Keep it practical today.
            </Text>
            <PrimaryButton label="Restart demo" onPress={() => setStep(0)} />
            <SecondaryButton marginTop={8} label="Back to app" onPress={() => router.replace("/(tabs)/home")} />
          </GlassCard>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
