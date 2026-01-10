import React, { type ReactNode } from "react";
import { StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import Animated, {
  Extrapolation,
  interpolate,
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";
import { Gesture, GestureDetector } from "react-native-gesture-handler";

type Props = {
  children: ReactNode;
  enabled?: boolean;
  threshold?: number;
};

/**
 * Simple pull-down-to-dismiss wrapper for stack screens.
 * Dismisses when pulled down far enough or with fast velocity.
 */
export function PullDownToDismiss({ children, enabled = true, threshold = 120 }: Props) {
  const router = useRouter();
  const translateY = useSharedValue(0);

  const pan = Gesture.Pan()
    .enabled(enabled)
    .onUpdate((e) => {
      if (!enabled) return;
      translateY.value = Math.max(e.translationY, 0);
    })
    .onEnd((e) => {
      if (!enabled) return;
      const shouldDismiss = e.translationY > threshold || e.velocityY > 900;
      if (shouldDismiss) {
        runOnJS(router.back)();
      } else {
        translateY.value = withSpring(0, { damping: 18, stiffness: 180 });
      }
    });

  const contentStyle = useAnimatedStyle(() => {
    const scale = interpolate(translateY.value, [0, 200], [1, 0.98], Extrapolation.CLAMP);
    return {
      transform: [{ translateY: translateY.value }, { scale }],
    };
  });

  const overlayStyle = useAnimatedStyle(() => {
    const opacity = interpolate(translateY.value, [0, 200], [0, 0.15], Extrapolation.CLAMP);
    return { opacity };
  });

  return (
    <GestureDetector gesture={pan}>
      <Animated.View style={styles.container}>
        <Animated.View pointerEvents="none" style={[styles.overlay, overlayStyle]} />
        <Animated.View style={contentStyle}>{children}</Animated.View>
      </Animated.View>
    </GestureDetector>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "black",
  },
});
