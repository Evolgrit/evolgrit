export const motion = {
  easing: {
    smooth: "cubic-bezier(0.16, 1, 0.3, 1)",
    standard: "cubic-bezier(0.22, 1, 0.36, 1)",
  },
  page: {
    fadeMs: 520,
    baseDelayMs: 140,
  },
  reveal: {
    durationMs: 360,
    translateY: 10,
    baseDelayMs: 160,
    staggerMs: 180,
  },
} as const;
