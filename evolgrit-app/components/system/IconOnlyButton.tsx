import React, { useRef } from "react";
import { Animated, Pressable } from "react-native";
import { YStack } from "tamagui";
import * as Haptics from "expo-haptics";

type Props = {
  icon: React.ReactNode;
  onPress?: () => void;
  onPressIn?: () => void;
  onPressOut?: () => void;
  disabled?: boolean;
  size?: number;
};

export function IconOnlyButton({
  icon,
  onPress,
  onPressIn,
  onPressOut,
  disabled,
  size = 44,
}: Props) {
  const scale = useRef(new Animated.Value(1)).current;

  const animateTo = (toValue: number) => {
    Animated.timing(scale, {
      toValue,
      duration: 120,
      useNativeDriver: true,
    }).start();
  };

  return (
    <Pressable
      accessibilityRole="button"
      disabled={disabled}
      onPress={() => {
        if (disabled) return;
        Haptics.selectionAsync().catch(() => {});
        onPress?.();
      }}
      onPressIn={() => {
        if (disabled) return;
        animateTo(0.98);
        onPressIn?.();
      }}
      onPressOut={() => {
        if (disabled) return;
        animateTo(1);
        onPressOut?.();
      }}
    >
      <Animated.View style={{ transform: [{ scale }] }}>
        <YStack
          width={size}
          height={size}
          borderRadius={size / 2}
          alignItems="center"
          justifyContent="center"
          backgroundColor={disabled ? "rgba(0,0,0,0.04)" : "rgba(0,0,0,0.06)"}
          style={{
          }}
        >
          {icon}
        </YStack>
      </Animated.View>
    </Pressable>
  );
}
