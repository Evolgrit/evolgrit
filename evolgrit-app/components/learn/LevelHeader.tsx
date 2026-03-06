import React from "react";
import { XStack, YStack, Text } from "tamagui";
import { NavBackButton } from "../system/NavBackButton";

export function LevelHeader({
  title,
  subtitle,
  onBack,
  titleFontSize = "$6",
  titleLineHeight,
  titleFontWeight = "800",
  subtitleFontSize,
  subtitleLineHeight,
  subtitleFontWeight,
  subtitleOpacity,
}: {
  title: string;
  subtitle: string;
  onBack?: () => void;
  titleFontSize?: string | number;
  titleLineHeight?: string | number;
  titleFontWeight?: string;
  subtitleFontSize?: string | number;
  subtitleLineHeight?: string | number;
  subtitleFontWeight?: string;
  subtitleOpacity?: number;
}) {
  return (
    <YStack gap="$2" paddingHorizontal="$4" paddingTop="$2">
      <XStack alignItems="center" justifyContent="space-between">
        <NavBackButton onPress={onBack} />
        <Text fontSize={titleFontSize} lineHeight={titleLineHeight} fontWeight={titleFontWeight} color="$text">
          {title}
        </Text>
        <XStack width={32} />
      </XStack>
      <Text
        fontSize={subtitleFontSize}
        lineHeight={subtitleLineHeight}
        fontWeight={subtitleFontWeight}
        opacity={subtitleOpacity}
        color="$textSecondary"
      >
        {subtitle}
      </Text>
    </YStack>
  );
}
