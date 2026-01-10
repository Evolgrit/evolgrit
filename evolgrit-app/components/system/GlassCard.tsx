import React from "react";
import { Stack, type StackProps } from "tamagui";
import { cardProps } from "./recipes";

export function GlassCard({ children, ...props }: StackProps) {
  return (
    <Stack
      {...cardProps}
      {...props}
    >
      {children}
    </Stack>
  );
}
