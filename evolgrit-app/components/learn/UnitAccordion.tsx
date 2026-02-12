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
};

export function UnitAccordion({ title, subtitle, open, onToggle, children }: Props) {
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
        <XStack padding="$4" alignItems="center" justifyContent="space-between">
          <YStack flex={1} gap="$1">
            <Text fontSize="$5" fontWeight="800" color="$text">
              {title}
            </Text>
            <Text fontSize="$3" color="$textSecondary">
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
