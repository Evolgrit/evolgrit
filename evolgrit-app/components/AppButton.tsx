import React, { useRef } from "react";
import { Pressable, Animated, Text, ViewStyle, TextStyle } from "react-native";
import * as Haptics from "expo-haptics";

type Variant = "primary" | "secondary";

export function AppButton({
  label,
  onPress,
  variant = "primary",
  disabled = false,
  style,
}: {
  label: string;
  onPress: () => void | Promise<void>;
  variant?: Variant;
  disabled?: boolean;
  style?: ViewStyle;
}) {
  const scale = useRef(new Animated.Value(1)).current;

  const pressIn = () => {
    Animated.spring(scale, {
      toValue: 0.98,
      useNativeDriver: true,
      speed: 30,
      bounciness: 0,
    }).start();
  };

  const pressOut = () => {
    Animated.spring(scale, {
      toValue: 1,
      useNativeDriver: true,
      speed: 30,
      bounciness: 8,
    }).start();
  };

  const base: ViewStyle = {
    paddingVertical: 12,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    opacity: disabled ? 0.6 : 1,
  };

  const primary: ViewStyle = {
    backgroundColor: "#111827",
  };

  const secondary: ViewStyle = {
    backgroundColor: "rgba(255,255,255,0.75)",
    borderWidth: 1,
    borderColor: "rgba(17,24,39,0.08)",
  };

  const textBase: TextStyle = { fontWeight: "900" };
  const textPrimary: TextStyle = { color: "#FFFFFF" };
  const textSecondary: TextStyle = { color: "#111827" };

  return (
    <Pressable
      disabled={disabled}
      onPress={async () => {
        if (disabled) return;
        try {
          await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        } catch {}
        await onPress();
      }}
      onPressIn={pressIn}
      onPressOut={pressOut}
      style={{ width: "100%" }}
    >
      <Animated.View
        style={[
          base,
          variant === "primary" ? primary : secondary,
          style,
          { transform: [{ scale }] },
        ]}
      >
        <Text style={[textBase, variant === "primary" ? textPrimary : textSecondary]}>
          {label}
        </Text>
      </Animated.View>
    </Pressable>
  );
}
