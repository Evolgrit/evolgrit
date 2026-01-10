import React from "react";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Text, View, XStack, YStack } from "tamagui";
import { NavBackButton } from "../system/NavBackButton";
import { PressableIconButton } from "../system/PressableIconButton";

type Props = {
  children: React.ReactNode;
  maxWidth?: number;
  backgroundColor?: string;
  title?: string;
  subtitle?: string;
  progress?: number;
  onBack?: () => void;
  onNext?: () => void;
  canNext?: boolean;
  wrapCard?: boolean;
};

/**
 * Consistent lesson step shell:
 * - Safe-area aware header with back + title + optional progress bar
 * - Centers content with a max width and light card background
 */
export function LessonStepShell({
  children,
  maxWidth = 420,
  backgroundColor = "#F3F4F6",
  title,
  subtitle,
  progress,
  onBack,
  onNext,
  canNext = true,
  wrapCard = true,
}: Props) {
  const insets = useSafeAreaInsets();
  const topPad = Math.round(insets.top + 12);

  return (
    <YStack width="100%" alignItems="center" paddingHorizontal="$4" backgroundColor="#FFFFFF">
      <YStack width="100%" maxWidth={maxWidth} paddingTop={topPad} gap="$3">
        <XStack alignItems="center" justifyContent="space-between" gap="$3">
          <NavBackButton onPress={onBack} fallbackRoute="/learn/a1" />
          <YStack flex={1} gap="$1" alignItems="center">
            {title ? (
              <Text fontWeight="700" fontSize={17} color="$text">
                {title}
              </Text>
            ) : null}
            {subtitle ? (
              <Text fontSize={13} color="$muted">
                {subtitle}
              </Text>
            ) : null}
          </YStack>
          {onNext ? (
            <PressableIconButton
              size={44}
              icon="chevron-right"
              disabled={!canNext}
              accessibilityLabel="Weiter"
              onPress={onNext}
            />
          ) : (
            <View width={44} />
          )}
        </XStack>
        {typeof progress === "number" ? (
          <View
            height={8}
            borderRadius={99}
            backgroundColor="rgba(0,0,0,0.06)"
            overflow="hidden"
          >
            <View
              width={`${Math.max(0, Math.min(1, progress)) * 100}%`}
              height="100%"
              backgroundColor="#111827"
            />
          </View>
        ) : null}
        {wrapCard ? (
          <YStack
            width="100%"
            maxWidth={maxWidth}
            borderRadius={24}
            backgroundColor={backgroundColor}
            padding="$4"
            gap="$3"
            marginTop="$3"
          >
            {children}
          </YStack>
        ) : (
          <YStack width="100%" maxWidth={maxWidth} marginTop="$3" gap="$3" alignSelf="center">
            {children}
          </YStack>
        )}
      </YStack>
    </YStack>
  );
}
