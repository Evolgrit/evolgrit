import React, { useCallback } from "react";
import { LayoutAnimation, Platform, Pressable, UIManager } from "react-native";
import { XStack, YStack, Text, useTheme } from "tamagui";
import * as Haptics from "expo-haptics";
import { ChevronDown, ChevronRight } from "lucide-react-native";

type Props = {
  title: string;
  subtitle: string;
  open: boolean;
  onToggle: () => void;
  children: React.ReactNode;
  titleFontSize?: number | string;
  titleFontWeight?: string;
  titleLineHeight?: number;
  subtitleFontSize?: number | string;
  subtitleFontWeight?: string;
  subtitleLineHeight?: number;
  subtitleOpacity?: number;
  headerPaddingVertical?: number | string;
  headerPaddingHorizontal?: number | string;
};

export function UnitAccordion({
  title,
  subtitle,
  open,
  onToggle,
  children,
  titleFontSize = "$5",
  titleFontWeight = "800",
  titleLineHeight,
  subtitleFontSize = "$3",
  subtitleFontWeight,
  subtitleLineHeight,
  subtitleOpacity,
  headerPaddingVertical = "$4",
  headerPaddingHorizontal = "$4",
}: Props) {
  const theme = useTheme();
  const iconColor = theme.textSecondary?.val ?? theme.text?.val ?? "black";
  const handleToggle = useCallback(() => {
    if (Platform.OS === "android" && UIManager.setLayoutAnimationEnabledExperimental) {
      UIManager.setLayoutAnimationEnabledExperimental(true);
    }
    LayoutAnimation.configureNext(
      LayoutAnimation.create(220, LayoutAnimation.Types.easeInEaseOut, LayoutAnimation.Properties.opacity)
    );
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
    onToggle();
  }, [onToggle]);

  return (
    <YStack backgroundColor="$bgSurface" borderRadius="$6" overflow="hidden">
      <Pressable
        accessibilityRole="button"
        onPress={handleToggle}
        style={({ pressed }) => ({
          transform: [{ scale: pressed ? 0.98 : 1 }],
        })}
      >
        <XStack
          paddingVertical={headerPaddingVertical}
          paddingHorizontal={headerPaddingHorizontal}
          alignItems="center"
          justifyContent="space-between"
        >
          <YStack flex={1} gap="$1">
            <Text fontSize={titleFontSize} fontWeight={titleFontWeight} lineHeight={titleLineHeight} color="$text">
              {title}
            </Text>
            <Text
              fontSize={subtitleFontSize}
              fontWeight={subtitleFontWeight}
              lineHeight={subtitleLineHeight}
              opacity={subtitleOpacity}
              color="$textSecondary"
            >
              {subtitle}
            </Text>
          </YStack>
          {open ? <ChevronDown size={18} color={iconColor} /> : <ChevronRight size={18} color={iconColor} />}
        </XStack>
      </Pressable>
      {open ? <YStack paddingHorizontal="$3" paddingBottom="$3" gap="$2">{children}</YStack> : null}
    </YStack>
  );
}
