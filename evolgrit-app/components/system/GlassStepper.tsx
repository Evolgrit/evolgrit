import React from "react";
import { XStack, SizableText } from "tamagui";
import { GlassButton } from "./GlassButton";

type Props = {
  value: number;
  onChange: (v: number) => void;
  min?: number;
  max?: number;
  step?: number;
};

export function GlassStepper({ value, onChange, min = -Infinity, max = Infinity, step = 1 }: Props) {
  const dec = () => onChange(Math.max(min, value - step));
  const inc = () => onChange(Math.min(max, value + step));

  return (
    <XStack alignItems="center" gap="$2">
      <GlassButton label="-" onPress={dec} height={36} />
      <SizableText fontSize={16} fontWeight="800" color="rgba(0,0,0,0.92)">
        {value}
      </SizableText>
      <GlassButton label="+" onPress={inc} height={36} />
    </XStack>
  );
}
