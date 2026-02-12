import React from "react";
import { Stack, type StackProps } from "tamagui";
import { cardProps } from "./recipes";

type Variant = "default" | "language" | "life" | "job" | "focus";

const variantBg: Record<Variant, string> = {
  default: "$bgSurface",
  language: "$surfaceLanguage",
  life: "$surfaceLife",
  job: "$surfaceJob",
  focus: "$surfaceFocus",
};

export function GlassCard({ children, ...props }: StackProps & { variant?: Variant }) {
  const { variant = "default", ...rest } = props;
  return (
    <Stack
      {...cardProps}
      backgroundColor={variantBg[variant]}
      {...rest}
    >
      {children}
    </Stack>
  );
}
