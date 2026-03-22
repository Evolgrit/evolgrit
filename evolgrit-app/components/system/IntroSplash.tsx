import React, { useEffect, useRef } from "react";
import { Animated, StyleSheet, View } from "react-native";
import { Text } from "tamagui";
import { useSafeAreaInsets } from "react-native-safe-area-context";

type Props = {
  onDone?: () => void;
  durationMs?: number;
};

export function IntroSplash({ onDone, durationMs = 1050 }: Props) {
  const insets = useSafeAreaInsets();
  const opacity = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(14)).current;
  const scale = useRef(new Animated.Value(0.96)).current;

  useEffect(() => {
    const inAnim = Animated.parallel([
      Animated.timing(opacity, { toValue: 1, duration: 180, useNativeDriver: true }),
      Animated.timing(translateY, { toValue: 0, duration: 220, useNativeDriver: true }),
      Animated.timing(scale, { toValue: 1, duration: 220, useNativeDriver: true }),
    ]);

    const outAnim = Animated.parallel([
      Animated.timing(opacity, { toValue: 0, duration: 220, useNativeDriver: true }),
      Animated.timing(translateY, { toValue: -8, duration: 220, useNativeDriver: true }),
      Animated.timing(scale, { toValue: 0.98, duration: 220, useNativeDriver: true }),
    ]);

    const hold = Math.max(0, durationMs - 180 - 220);

    const seq = Animated.sequence([inAnim, Animated.delay(hold), outAnim]);

    seq.start(({ finished }) => {
      if (finished) onDone?.();
    });

    return () => {
      opacity.stopAnimation();
      translateY.stopAnimation();
      scale.stopAnimation();
    };
  }, [durationMs, onDone, opacity, translateY, scale]);

  return (
    <View
      style={[
        styles.overlay,
        { paddingTop: insets.top, paddingBottom: insets.bottom },
      ]}
      pointerEvents="none"
    >
      <Animated.View
        style={[
          styles.center,
          {
            opacity,
            transform: [{ translateY }, { scale }],
          },
        ]}
      >
        <Text
          fontSize={42}
          fontWeight="800"
          letterSpacing={2}
          color="$color"
          textAlign="center"
        >
          EVOLGRIT
        </Text>

        <Text
          marginTop="$2"
          fontSize={18}
          fontWeight="600"
          color="$gray10"
          textAlign="center"
        >
          your future
        </Text>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "white",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 9999,
  },
  center: {
    alignItems: "center",
    paddingHorizontal: 24,
  },
});
