import React from "react";
import { Stack, Text, XStack, YStack } from "tamagui";
import { progressCardShadow } from "../../design/progressTokens";

type Props = {
  labels: string[];
  values: number[];
  colors: string[];
  valueLabel?: string;
};

export function ProgressPillChart({ labels, values, colors, valueLabel = "Lektionen" }: Props) {
  const max = Math.max(1, ...values);

  return (
    <XStack gap="$3" paddingTop="$s16" justifyContent="space-between">
      {values.map((v, i) => {
        const fillPct = Math.max(0.12, v / max);
        return (
          <YStack key={`${labels[i]}-${i}`} alignItems="center" flex={1} gap="$2">
            <Stack
              width="100%"
              height={150}
              borderRadius="$r16"
              backgroundColor="$progressCard"
              overflow="hidden"
              justifyContent="flex-end"
              {...progressCardShadow}
            >
              <Stack
                height={Math.round(150 * fillPct)}
                backgroundColor={colors[i]}
                borderRadius="$r16"
                margin="$s8"
              />
              <Stack
                position="absolute"
                top="$s8"
                right="$s8"
                backgroundColor="$progressInk"
                borderRadius="$r16"
                paddingHorizontal="$s8"
                paddingVertical="$s8"
                opacity={0.9}
              >
                <Text color="$progressBg" fontSize={12} fontWeight="700">
                  {v}
                </Text>
              </Stack>
            </Stack>

            <Text color="$progressMuted" fontSize={14} fontWeight="600">
              {labels[i]}
            </Text>
            <Text color="$progressMuted" fontSize={12}>
              {v} {valueLabel}
            </Text>
          </YStack>
        );
      })}
    </XStack>
  );
}
