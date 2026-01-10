import React from "react";
import { TextInput, type TextInputProps } from "react-native";
import { GlassSurface } from "./GlassSurface";

type Props = TextInputProps & {
  height?: number;
};

export function GlassTextField({ height = 48, style, ...rest }: Props) {
  return (
    <GlassSurface padding={0} radius={14}>
      <TextInput
        {...rest}
        style={[
          {
            height,
            paddingHorizontal: 14,
            fontSize: 16,
            color: "rgba(0,0,0,0.92)",
          },
          style as any,
        ]}
        placeholderTextColor="rgba(0,0,0,0.45)"
      />
    </GlassSurface>
  );
}
