import React from "react";
import { XStack, SizableText, YStack } from "tamagui";
import { CapsuleButton } from "../system/CapsuleButton";
import { Ionicons } from "@expo/vector-icons";

type Props = {
  locale?: "de" | "en";
  normalDisabled?: boolean;
  slowDisabled?: boolean;
  loading?: boolean;
  onPressNormal: () => void;
  onPressSlow: () => void;
};

const TEXT = {
  de: { listen: "Anhören", slow: "Langsam", loading: "Lädt…" },
  en: { listen: "Listen", slow: "Slow", loading: "Loading…" },
} as const;

export function AudioHelpRow({
  locale = "de",
  normalDisabled,
  slowDisabled,
  loading,
  onPressNormal,
  onPressSlow,
}: Props) {
  const t = TEXT[locale];

  return (
    <YStack gap="$2" marginTop="$3">
      <XStack alignItems="center" justifyContent="space-between">
        <SizableText fontSize={13} opacity={0.6} fontWeight="700" letterSpacing={0.3}>
          AUDIO
        </SizableText>

        {loading ? (
          <SizableText fontSize={13} opacity={0.6}>
            {t.loading}
          </SizableText>
        ) : null}
      </XStack>

      <XStack gap="$2">
        <CapsuleButton
          label={t.listen}
          icon={<Ionicons name="volume-high-outline" size={16} color="rgba(0,0,0,0.9)" />}
          onPress={onPressNormal}
          disabled={!!loading || !!normalDisabled}
          height={40}
        />
        <CapsuleButton
          label={t.slow}
          icon={<Ionicons name="walk-outline" size={16} color="rgba(0,0,0,0.9)" />}
          onPress={onPressSlow}
          disabled={!!loading || !!slowDisabled}
          height={40}
        />
      </XStack>
    </YStack>
  );
}
