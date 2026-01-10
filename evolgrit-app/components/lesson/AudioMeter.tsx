import React, { useMemo } from "react";
import { XStack, YStack } from "tamagui";

// Simple vertical bar meter driven by amplitude 0..1
export function AudioMeter({ amplitude }: { amplitude: number }) {
  const bars = useMemo(() => {
    const base = Math.min(1, Math.max(0, amplitude));
    const multipliers = [
      0.48, 0.62, 0.78, 0.92, 1, 0.96, 0.82, 0.68, 0.54, 0.62, 0.74, 0.88,
      1, 0.9, 0.76, 0.64, 0.52, 0.58, 0.7, 0.84, 0.96, 0.82, 0.66, 0.52,
    ];
    return multipliers.map((m) => Math.min(1, base * (0.85 + m * 0.25)));
  }, [amplitude]);

  return (
    <XStack gap="$1.5" alignItems="flex-end" height={58} width="100%" justifyContent="center">
      {bars.map((h, idx) => (
        <YStack
          key={idx}
          width={5}
          height="100%"
          alignItems="center"
          justifyContent="flex-end"
          backgroundColor="transparent"
        >
          <YStack
            width={5}
            height={`${Math.round(h * 100)}%`}
            borderRadius={2.5}
            backgroundColor="#111827"
          />
        </YStack>
      ))}
    </XStack>
  );
}
