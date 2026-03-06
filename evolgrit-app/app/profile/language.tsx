import React from "react";
import { ScrollView, Pressable } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Text, XStack, YStack } from "tamagui";
import { ScreenShell } from "../../components/system/ScreenShell";
import { useI18n } from "../../lib/i18n";
import { LANGUAGES, getLanguage } from "../../lib/data/languages";
import { TARGET_LANGUAGE_CODES } from "../../lib/data/targetLanguages";
import { setNativeLanguageCode, setTargetLanguageCode, setUiLocale } from "../../lib/userSettings";
import { useUserSettings } from "../../lib/userSettings";

export default function ProfileLanguageScreen() {
  const router = useRouter();
  const { t } = useI18n();
  const params = useLocalSearchParams<{ mode?: string }>();
  const mode = params.mode === "target" ? "target" : "native";
  const title = mode === "target" ? t("profile.select_target") : t("profile.select_native");
  const { nativeLanguageCode, targetLanguageCode } = useUserSettings();
  const selectedCode = mode === "target" ? targetLanguageCode : nativeLanguageCode;

  const list =
    mode === "target"
      ? TARGET_LANGUAGE_CODES.map((code) => getLanguage(code)).filter((l) => l.code)
      : LANGUAGES;

  async function onPick(code: string) {
    if (mode === "target") {
      await setTargetLanguageCode(code);
    } else {
      await setNativeLanguageCode(code);
      await setUiLocale(code);
    }
    router.back();
  }

  return (
    <ScreenShell title={title} showBack>
      <ScrollView contentContainerStyle={{ paddingBottom: 24 }}>
        <YStack padding="$4" gap="$3">
          {list.map((lang) => {
            const isSelected = lang.code === selectedCode;
            return (
            <Pressable key={lang.code} accessibilityRole="button" onPress={() => onPick(lang.code)}>
              <XStack
                padding="$4"
                borderRadius="$6"
                backgroundColor={isSelected ? "$cardSubtle" : "$card"}
                alignItems="center"
                justifyContent="space-between"
              >
                <YStack gap="$1" flex={1} minWidth={0}>
                  <Text fontWeight="800" color="$text">
                    {lang.flag} {lang.nativeName} ({lang.englishName})
                  </Text>
                </YStack>
              </XStack>
            </Pressable>
            );
          })}
        </YStack>
      </ScrollView>
    </ScreenShell>
  );
}
