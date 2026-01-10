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
      backgroundColor="#fff"
      borderWidth={1}
      borderColor="rgba(0,0,0,0.06)"
      shadowColor="rgba(0,0,0,0.06)"
      shadowOpacity={1}
      shadowRadius={8}
      shadowOffset={{ width: 0, height: 4 }}
      {...(style as any)}
    >
      {children}
    </XStack>
  );
}
