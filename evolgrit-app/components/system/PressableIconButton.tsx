import React from "react";
import { Pressable } from "react-native";
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from "react-native-reanimated";
import * as Haptics from "expo-haptics";
import { Feather } from "@expo/vector-icons";
import { Stack } from "tamagui";

type Props = {
  size?: number;
  bg?: string;
  backgroundColor?: string;
  icon: React.ReactNode | string;
  disabled?: boolean;
  onPress?: () => void | Promise<void>;
  accessibilityLabel?: string;
};

export function PressableIconButton({
  size = 48,
  bg = "$color2",
  backgroundColor,
  icon,
  disabled,
  onPress,
  accessibilityLabel,
}: Props) {
  const scale = useSharedValue(1);

  const style = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    opacity: disabled ? 0.35 : 1,
  }));

  const handlePressIn = () => {
    if (disabled) return;
    scale.value = withSpring(0.97, { damping: 18, stiffness: 240 });
  };

  const handlePressOut = () => {
    scale.value = withSpring(1, { damping: 18, stiffness: 240 });
  };

  const handlePress = async () => {
    if (disabled) return;
    try {
      await Haptics.selectionAsync();
    } catch {
      // ignore
    }
    await onPress?.();
  };

  const iconColor = "#111827";
  const iconSize = Math.round(size * 0.5);

  const renderIcon = () => {
    if (!icon) return null;
    if (typeof icon !== "string") return icon;
    return <Feather name={icon as any} color={iconColor} size={iconSize} />;
  };

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      onPress={handlePress}
    >
      <Animated.View style={style}>
        <Stack
          width={size}
          height={size}
          borderRadius={size / 2}
          backgroundColor={backgroundColor ?? bg}
          alignItems="center"
          justifyContent="center"
        >
          {renderIcon()}
        </Stack>
      </Animated.View>
    </Pressable>
  );
}
