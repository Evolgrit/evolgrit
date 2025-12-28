import React from "react";
import { Stack, type StackProps } from "tamagui";

export function GlassCard({ children, ...props }: StackProps) {
  return (
    <Stack
      borderRadius={18}
      padding={16}
      backgroundColor="$card"
      shadowColor="transparent"
      overflow="hidden"
      position="relative"
      {...props}
    >
      <Stack
        pointerEvents="none"
        position="absolute"
        top={0}
        left={0}
        right={0}
        height={44}
        backgroundColor="rgba(255,255,255,0.55)"
        opacity={0.18}
      />
      <Stack
        pointerEvents="none"
        position="absolute"
        top={44}
        left={0}
        right={0}
        height={80}
        backgroundColor="rgba(255,255,255,0.25)"
        opacity={0.1}
      />
      {children}
    </Stack>
  );
}
