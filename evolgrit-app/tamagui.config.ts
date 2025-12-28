import { createTamagui } from "@tamagui/core";
import { config as baseConfig } from "@tamagui/config";

const config = createTamagui({
  ...baseConfig,
  themes: {
    light: {
      bg: "#F7F8FA",
      card: "rgba(255,255,255,0.85)",
      glassDark: "rgba(28,36,51,0.78)",
      primary: "#1C2433",
      text: "#111827",
      textOnDark: "#F9FAFB",
      muted: "#6B7280",
      border: "rgba(17,24,39,0.08)",
      background: "#F7F8FA",
      color: "#111827",
      borderColor: "rgba(17,24,39,0.08)",
    },
  },
  tokens: {
    ...baseConfig.tokens,
    radius: {
      ...baseConfig.tokens.radius,
      12: 12,
      18: 18,
      26: 26,
    },
    space: {
      ...baseConfig.tokens.space,
      8: 8,
      16: 16,
      24: 24,
      32: 32,
    },
  },
});

export default config;
