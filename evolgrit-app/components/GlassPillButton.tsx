import React, { useRef } from "react";
import { View, Text, Pressable, Animated, StyleSheet } from "react-native";
import * as Haptics from "expo-haptics";

export function GlassPillButton({
  title,
  onPress,
  leftIcon,
}: {
  title: string;
  onPress: () => void | Promise<void>;
  leftIcon?: React.ReactNode;
}) {
  const scale = useRef(new Animated.Value(1)).current;
  const opacity = useRef(new Animated.Value(1)).current;

  const pressIn = () => {
    Animated.parallel([
      Animated.spring(scale, {
        toValue: 0.96,
        useNativeDriver: true,
        speed: 30,
        bounciness: 0,
      }),
      Animated.timing(opacity, { toValue: 0.92, duration: 120, useNativeDriver: true }),
    ]).start();
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
  };

  const pressOut = () => {
    Animated.parallel([
      Animated.spring(scale, {
        toValue: 1,
        useNativeDriver: true,
        speed: 30,
        bounciness: 8,
      }),
      Animated.timing(opacity, { toValue: 1, duration: 160, useNativeDriver: true }),
    ]).start();
  };

  return (
    <Pressable
      onPress={onPress}
      onPressIn={pressIn}
      onPressOut={pressOut}
      style={{ alignSelf: "flex-start" }}
      hitSlop={8}
    >
      <Animated.View
        style={[
          styles.wrap,
          {
            transform: [{ scale }],
            opacity,
          },
        ]}
      >
        <View style={styles.overlay} />

        <View style={styles.content}>
          {leftIcon ? <View style={{ marginRight: 8 }}>{leftIcon}</View> : null}
          <Text style={styles.title}>{title}</Text>
        </View>
      </Animated.View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  wrap: {
    minHeight: 38,
    paddingHorizontal: 14,
    borderRadius: 999,
    justifyContent: "center",
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "#ffffff",
    borderRadius: 999,
    borderWidth: 1,
    borderColor: "rgba(17,24,39,0.08)",
  },
  content: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 8,
  },
  title: {
    fontWeight: "900",
    color: "#111827",
  },
});
