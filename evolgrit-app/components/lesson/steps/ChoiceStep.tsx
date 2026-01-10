import React from "react";
import { YStack, Text } from "tamagui";
import Animated, { useAnimatedStyle, useSharedValue, withSequence, withTiming } from "react-native-reanimated";
import { SoftButton } from "../../system/SoftButton";
import { lessonType } from "@/design/typography";

type Option = { id: string; label: string; correct?: boolean };

export function ChoiceStep({
  prompt,
  text,
  options,
  onSelect,
  selectedId,
  reveal,
}: {
  prompt: string;
  text?: string;
  options: Option[];
  selectedId?: string | null;
  reveal?: boolean;
  onSelect: (id: string, correct: boolean) => void;
}) {
  const dangerBg = "rgba(231,76,60,0.12)";
  const successBg = "rgba(46,204,113,0.12)";
  const shake = useSharedValue(0);

  const shakeStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: shake.value }],
  }));

  const triggerShake = () => {
    shake.value = 0;
    shake.value = withSequence(
      withTiming(-6, { duration: 60 }),
      withTiming(6, { duration: 60 }),
      withTiming(-4, { duration: 60 }),
      withTiming(0, { duration: 60 })
    );
  };

  return (
    <YStack gap="$3">
      <Text {...lessonType.section} color="$text">
        {prompt}
      </Text>
      {text ? (
        <Text
          color="$muted"
          numberOfLines={3}
          {...lessonType.muted}
          flexShrink={1}
          ellipsizeMode="tail"
        >
          {text}
        </Text>
      ) : null}
      <YStack gap="$2">
        {options.map((opt) => {
          const isSelected = selectedId === opt.id;
          const isCorrect = !!opt.correct;
          const bg = isSelected && reveal ? (isCorrect ? successBg : dangerBg) : "rgba(0,0,0,0.04)";

          return (
            <Animated.View key={opt.id} style={shakeStyle}>
              <SoftButton
                label={opt.label}
                onPress={() => {
                  onSelect(opt.id, isCorrect);
                  if (!isCorrect) triggerShake();
                }}
                backgroundColor={bg as any}
              />
            </Animated.View>
          );
        })}
      </YStack>
    </YStack>
  );
}
