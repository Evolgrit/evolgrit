import React from "react";
import { type StyleProp, type ViewStyle } from "react-native";
import { XStack } from "tamagui";

type GlassSurfaceProps = {
  children?: React.ReactNode;
  height?: number;
  radius?: number;
  padding?: number;
  paddingHorizontal?: number;
  paddingVertical?: number;
  style?: StyleProp<ViewStyle>;
};

export function GlassSurface({
  children,
  height,
  radius = 999,
  padding,
  paddingHorizontal = 12,
  paddingVertical = 10,
  style,
}: GlassSurfaceProps) {
  const padH = padding ?? paddingHorizontal;
  const padV = padding ?? paddingVertical;
  return (
    <XStack
      alignItems="center"
      justifyContent="center"
      borderRadius={radius}
      height={height}
      paddingHorizontal={padH}
      paddingVertical={padV}
      backgroundColor="$bgSurface"
      borderWidth={0}
      {...(style as any)}
    >
      {children}
    </XStack>
  );
}
