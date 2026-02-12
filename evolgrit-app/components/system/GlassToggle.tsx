import React from "react";
import { Pressable, Animated, Easing } from "react-native";
import { GlassSurface } from "./GlassSurface";

type Props = {
  value: boolean;
  onValueChange: (next: boolean) => void;
  disabled?: boolean;
};

export function GlassToggle({ value, onValueChange, disabled }: Props) {
  const translate = React.useRef(new Animated.Value(value ? 1 : 0)).current;

  React.useEffect(() => {
    Animated.timing(translate, {
      toValue: value ? 1 : 0,
      duration: 180,
      useNativeDriver: true,
      easing: Easing.out(Easing.cubic),
    }).start();
  }, [translate, value]);

  const knobTranslate = translate.interpolate({
    inputRange: [0, 1],
    outputRange: [2, 18],
  });

  const bgOn = "rgba(255,255,255,0.42)";
  const bgOff = "rgba(255,255,255,0.20)";
  const bg = value ? bgOn : bgOff;
  const glow = value ? "rgba(0,0,0,0.08)" : "rgba(0,0,0,0.04)";

  return (
    <Pressable
      onPress={() => onValueChange(!value)}
      disabled={disabled}
      style={{ opacity: disabled ? 0.45 : 1 }}
      hitSlop={8}
    >
      <GlassSurface padding={0} radius={999} style={{ width: 46, height: 28, justifyContent: "center" }}>
        <Animated.View
          style={{
            position: "absolute",
            inset: 0,
            borderRadius: 999,
            backgroundColor: bg,
          }}
        />
        <Animated.View
          style={{
            width: 22,
            height: 22,
            borderRadius: 11,
            backgroundColor: "rgba(255,255,255,0.96)",
            borderWidth: 1,
            borderColor: "rgba(0,0,0,0.05)",
            transform: [{ translateX: knobTranslate }],
          }}
        />
      </GlassSurface>
    </Pressable>
  );
}
