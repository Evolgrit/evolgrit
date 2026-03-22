import React, { useState } from "react";
import { ScrollView, TextInput } from "react-native";
import { Stack, Text, XStack, YStack } from "tamagui";

import { ScreenShell } from "../../components/system/ScreenShell";
import { PillButton } from "../../components/system/PillButton";
import { useI18n } from "../../lib/i18n";
import { supabase } from "../../lib/supabaseClient";

const NATIVE_CODES = ["en", "ar", "uk", "tr", "pl", "ro", "vi", "ur", "bn", "hi", "id"];
const TARGET_CODES = ["de", "en", "fr", "nl", "sv", "no", "da", "fi", "ja", "ko"];

export default function SnapLanguageTest() {
  const { t } = useI18n();
  const [nativeCode, setNativeCode] = useState("en");
  const [targetCode, setTargetCode] = useState("de");
  const [conceptKey, setConceptKey] = useState("cola_can");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);

  async function runTest() {
    setLoading(true);
    setResult(null);
    const { data, error } = await supabase.functions.invoke("snap-generate-text", {
      body: {
        conceptKey,
        targetLanguageCode: targetCode,
        nativeLanguageCode: nativeCode,
      },
    });
    if (error) {
      setResult({ error: error.message ?? "error" });
    } else {
      setResult(data);
    }
    setLoading(false);
  }

  return (
    <ScreenShell title={t("dev.snap_language_test") } showBack>
      <ScrollView contentContainerStyle={{ paddingBottom: 24 }}>
        <YStack padding="$4" gap="$4">
          <Stack>
            <Text fontSize={12} fontWeight="800" color="$muted" marginBottom={8}>
              {t("dev.native_language")}
            </Text>
            <XStack flexWrap="wrap" gap="$2">
              {NATIVE_CODES.map((code) => (
                <PillButton
                  key={code}
                  label={code}
                  backgroundColor={nativeCode === code ? "$green3" : "$cardSubtle"}
                  onPress={() => setNativeCode(code)}
                />
              ))}
            </XStack>
          </Stack>

          <Stack>
            <Text fontSize={12} fontWeight="800" color="$muted" marginBottom={8}>
              {t("dev.target_language")}
            </Text>
            <XStack flexWrap="wrap" gap="$2">
              {TARGET_CODES.map((code) => (
                <PillButton
                  key={code}
                  label={code}
                  backgroundColor={targetCode === code ? "$green3" : "$cardSubtle"}
                  onPress={() => setTargetCode(code)}
                />
              ))}
            </XStack>
          </Stack>

          <Stack>
            <Text fontSize={12} fontWeight="800" color="$muted" marginBottom={8}>
              {t("dev.concept_hint")}
            </Text>
            <TextInput
              value={conceptKey}
              onChangeText={setConceptKey}
              placeholder="cola_can / plant / phone"
              style={{
                marginTop: 6,
                paddingHorizontal: 12,
                paddingVertical: 10,
                borderRadius: 12,
                borderWidth: 1,
                borderColor: "rgba(0,0,0,0.1)",
                backgroundColor: "white",
              }}
            />
          </Stack>

          <PillButton
            label={loading ? t("dev.loading") : t("dev.call_snap_generate")}
            backgroundColor="$cardSubtle"
            onPress={runTest}
          />

          {result ? (
            <Stack gap="$2">
              <Text fontWeight="800" color="$text">
                {result?.target?.wordDef} / {result?.target?.wordIndef}
              </Text>
              <Text color="$muted">{result?.native?.word}</Text>

              <Text fontWeight="800" color="$text" marginTop="$2">
                B1
              </Text>
              {(result?.examples?.b1 ?? []).map((s: string) => (
                <Text key={s} color="$text">
                  {s}
                </Text>
              ))}

              <Text fontWeight="800" color="$text" marginTop="$2">
                C1
              </Text>
              {(result?.examples?.c1 ?? []).map((s: string) => (
                <Text key={s} color="$text">
                  {s}
                </Text>
              ))}

              <Text color="$muted" marginTop="$2">
                usedGpt: {String(result?.meta?.usedGpt ?? false)}
              </Text>
            </Stack>
          ) : null}
        </YStack>
      </ScrollView>
    </ScreenShell>
  );
}
