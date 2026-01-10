import { createTamagui } from "@tamagui/core";
import { config as baseConfig } from "@tamagui/config";

const colors = {
  bgLight: "#F6F7F8",
  bgDark: "#000000",
  surfaceLight: "#FFFFFF",
  surfaceDark: "rgba(255,255,255,0.06)",
  surfaceDark2: "rgba(255,255,255,0.10)",
  textLight: "rgba(0,0,0,0.92)",
  textLight2: "rgba(0,0,0,0.62)",
  textDark: "rgba(255,255,255,0.92)",
  textDark2: "rgba(255,255,255,0.70)",
  borderLight: "rgba(0,0,0,0.06)",
  borderDark: "rgba(255,255,255,0.10)",
  glassLight: "rgba(255,255,255,0.72)",
  glassDark: "rgba(28,28,30,0.78)",
  bubbleUserDark: "#2C2C2E",
  bubbleUserLight: "#1C1C1E",
  accent: "#0A84FF",
};

const themes = {
  light: {
    bg: colors.bgLight,
    card: "rgba(255,255,255,0.88)",
    surface: colors.surfaceLight,
    surface2: "rgba(255,255,255,0.92)",
    glass: colors.glassLight,
    bubbleUser: "rgba(255,255,255,0.92)",
    bubbleMentor: "rgba(0,0,0,0.04)",
    dividerSoft: colors.borderLight,
    primary: "#1C2433",
    text: colors.textLight,
    text2: colors.textLight2,
    textDark: colors.textDark,
    textDark2: colors.textDark2,
    textOnDark: colors.textDark,
    muted: "#6B7280",
    border: colors.borderLight,
    background: colors.bgLight,
    color: colors.textLight,
    borderColor: colors.borderLight,
    colorMuted: colors.textLight2,
    glassDark: colors.glassDark,
  },
};

const config = createTamagui({
  ...baseConfig,
  themes,
  tokens: {
    ...baseConfig.tokens,
    radius: {
      ...baseConfig.tokens.radius,
      r0: 0,
      r12: 12,
      r16: 16,
      r20: 20,
      r24: 24,
      r28: 28,
      rCard: 18,
      rBubble: 16,
      rPill: 999,
    },
    space: {
      ...baseConfig.tokens.space,
      s0: 0,
      s8: 8,
      s12: 12,
      s14: 14,
      s16: 16,
      s20: 20,
      s24: 24,
    },
  },
});

export default config;
