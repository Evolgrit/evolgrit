import React, { useEffect } from "react";
import { Pressable, StyleSheet } from "react-native";
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from "react-native-reanimated";
import { Stack } from "tamagui";

type Props = {
  size?: number;
  isRecording: boolean;
  isCoachSpeaking: boolean;
  onPressIn?: () => void;
  onPressOut?: () => void;
  children?: React.ReactNode;
};

export function MicRing({
  size = 72,
  isRecording,
  isCoachSpeaking,
  onPressIn,
  onPressOut,
  children,
}: Props) {
  const pulse = useSharedValue(0);

  useEffect(() => {
    if (isRecording || isCoachSpeaking) {
      pulse.value = 0;
      pulse.value = withRepeat(
        withTiming(1, {
          duration: isRecording ? 900 : 1600,
          easing: Easing.inOut(Easing.quad),
        }),
        -1,
        true
      );
    } else {
      pulse.value = withTiming(0, { duration: 200 });
    }
  }, [isRecording, isCoachSpeaking, pulse]);

  const ringStyle = useAnimatedStyle(() => {
    const baseOpacity = isRecording ? 0.35 : 0.1;
    const extraOpacity = isRecording ? 0.25 : 0.08;
    const scale = isRecording ? 1 + pulse.value * 0.18 : 1 + pulse.value * 0.06;

    return {
      opacity: isRecording || isCoachSpeaking ? baseOpacity + pulse.value * extraOpacity : 0,
      transform: [{ scale }],
    };
  }, [isRecording, isCoachSpeaking]);

  const ringColor = isRecording ? "rgba(34, 197, 94, 1)" : "rgba(17, 24, 39, 1)";

  return (
    <Pressable
      onPressIn={onPressIn}
      onPressOut={onPressOut}
      style={{
        width: size + 34,
        height: size + 34,
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Animated.View
        style={[
          styles.ring,
          {
            width: size + 28,
            height: size + 28,
            borderRadius: (size + 28) / 2,
            borderColor: ringColor,
          },
          ringStyle,
        ]}
      />
      <Stack
        width={size}
        height={size}
        borderRadius={size / 2}
        backgroundColor="$backgroundStrong"
        alignItems="center"
        justifyContent="center"
      >
        {children}
      </Stack>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  ring: {
    position: "absolute",
    borderWidth: 3,
  },
});
