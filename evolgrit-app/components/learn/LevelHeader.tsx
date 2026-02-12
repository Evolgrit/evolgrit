import React from "react";
import { XStack, YStack, Text } from "tamagui";
import { NavBackButton } from "../system/NavBackButton";

export function LevelHeader({
  title,
  subtitle,
  onBack,
}: {
  title: string;
  subtitle: string;
  onBack?: () => void;
}) {
  return (
    <YStack gap="$2" paddingHorizontal="$4" paddingTop="$2">
      <XStack alignItems="center" justifyContent="space-between">
        <NavBackButton onPress={onBack} />
        <Text fontSize="$6" fontWeight="800" color="$text">
          {title}
        </Text>
        <XStack width={32} />
      </XStack>
      <Text color="$textSecondary">{subtitle}</Text>
    </YStack>
  );
}
