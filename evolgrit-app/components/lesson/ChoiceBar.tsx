import React, { useEffect } from "react";
import Animated, { useAnimatedStyle, useSharedValue, withSequence, withTiming } from "react-native-reanimated";
import { Button, Stack, Text, YStack } from "tamagui";

type Props = {
  options: string[];
  disabled?: boolean;
  onPick: (opt: string) => void;
  selected?: string;
  correctAnswer?: string;
  reveal?: boolean;
};

export function ChoiceBar({ options, disabled, onPick, selected, correctAnswer, reveal }: Props) {
  return (
    <YStack gap="$2">
      {options.map((opt) => (
        <ChoiceItem
          key={opt}
          label={opt}
          disabled={disabled}
          onPick={() => onPick(opt)}
          isSelected={selected === opt}
          isCorrect={correctAnswer === opt}
          reveal={reveal}
        />
      ))}
    </YStack>
  );
}

function ChoiceItem({
  label,
  disabled,
  onPick,
  isSelected,
  isCorrect,
  reveal,
}: {
  label: string;
  disabled?: boolean;
  onPick: () => void;
  isSelected: boolean;
  isCorrect: boolean;
  reveal?: boolean;
}) {
  const showCorrect = !!reveal && isCorrect;
  const showWrong = !!reveal && isSelected && !isCorrect;

  let bg = "$card";
  let border = "$borderColor";
  let text = "$text";
  if (showCorrect) {
    bg = "rgba(46,204,113,0.14)";
    border = "rgba(46,204,113,0.8)";
  } else if (showWrong) {
    bg = "rgba(231,76,60,0.14)";
    border = "rgba(231,76,60,0.8)";
  } else if (isSelected) {
    bg = "rgba(17,24,39,0.06)";
  }

  const scale = useSharedValue(1);
  const translateX = useSharedValue(0);

  useEffect(() => {
    if (isSelected && reveal && isCorrect) {
      scale.value = withSequence(withTiming(1.03, { duration: 120 }), withTiming(1, { duration: 120 }));
    }
    if (isSelected && reveal && !isCorrect) {
      translateX.value = withSequence(
        withTiming(6, { duration: 80 }),
        withTiming(-6, { duration: 80 }),
        withTiming(4, { duration: 70 }),
        withTiming(0, { duration: 70 })
      );
    }
  }, [isSelected, reveal, isCorrect, scale, translateX]);

  const animStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }, { translateX: translateX.value }],
  }));

  return (
    <Animated.View style={animStyle}>
      <Button
        unstyled
        disabled={disabled}
        backgroundColor={bg}
        borderWidth={1}
        borderColor={border}
        borderRadius="$4"
        paddingVertical="$3"
        paddingHorizontal="$3"
        onPress={onPick}
        pressStyle={{ opacity: 0.92, scale: 0.99 }}
      >
        <Stack>
          <Text color={text} fontWeight="700" numberOfLines={2}>
            {label}
          </Text>
        </Stack>
      </Button>
    </Animated.View>
  );
}
