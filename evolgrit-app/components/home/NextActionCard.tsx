import React from "react";
import { YStack, XStack, Text } from "tamagui";
import { GlassCard } from "../system/GlassCard";
import { PrimaryButton } from "../system/PrimaryButton";
import type { NextAction, NextActionSource } from "../../lib/nextActionService";

type Props = {
  action: NextAction;
  source?: NextActionSource | null;
  onStart: () => void;
  showAdjusted?: boolean;
};

export function NextActionCard({ action, source, onStart, showAdjusted }: Props) {
  return (
    <GlassCard>
      <XStack justifyContent="space-between" alignItems="flex-start" marginBottom={10}>
        <YStack gap={4} maxWidth="80%">
          <Text color="$muted" fontSize={12} fontWeight="700">
            {action.title.toUpperCase()}
          </Text>
          <Text color="$text" fontSize={18} fontWeight="800">
            {action.cta}
          </Text>
          <Text color="$muted" marginTop={2}>
            {action.subtitle}
          </Text>
        </YStack>
        <YStack
          paddingHorizontal={10}
          paddingVertical={6}
          borderRadius={14}
          backgroundColor="rgba(17,24,39,0.06)"
        >
          <Text fontSize={12} fontWeight="700" color="$text">
            ⏱ {action.etaMin} min
          </Text>
        </YStack>
      </XStack>

      <PrimaryButton onPress={onStart} label={`Start now · ${action.etaMin} min`} marginTop={8} />
      {source === "risk" || showAdjusted ? (
        <Text color="$muted" fontSize={12} marginTop={8}>
          Adjusted for today.
        </Text>
      ) : null}

      <YStack marginTop={12} height={6} borderRadius={999} overflow="hidden" backgroundColor="rgba(17,24,39,0.08)">
        <YStack flex={1} width="35%" backgroundColor="rgba(17,24,39,0.16)" />
      </YStack>
    </GlassCard>
  );
}
