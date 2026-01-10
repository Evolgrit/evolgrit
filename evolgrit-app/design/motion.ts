import { Easing } from "react-native-reanimated";

export const motion = {
  duration: {
    fast: 120,
    normal: 200,
    slow: 320,
  },
  easing: {
    standard: Easing.out(Easing.cubic),
    soft: Easing.bezier(0.22, 0.61, 0.36, 1),
  },
  spring: {
    soft: {
      damping: 18,
      stiffness: 240,
      mass: 0.9,
    },
  },
};

export type MotionPreset = typeof motion;
