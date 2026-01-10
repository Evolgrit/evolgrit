import React from "react";
import { Pressable, type StyleProp, type ViewStyle } from "react-native";
import { SizableText, XStack } from "tamagui";

import { GlassSurface } from "./GlassSurface";

type Props = {
  label?: string;
  icon?: React.ReactNode;
  onPress?: () => void;
  disabled?: boolean;
  height?: number;
  style?: StyleProp<ViewStyle>;
};

export function GlassButton({ label, icon, onPress, disabled, height = 44, style }: Props) {
  return (
    <Pressable onPress={disabled ? undefined : onPress} style={{ opacity: disabled ? 0.45 : 1 }}>
      <GlassSurface padding={0} radius={999} style={[{ height, justifyContent: "center" } as ViewStyle, style]}>
        <XStack alignItems="center" justifyContent="center" gap="$2" paddingHorizontal="$3" height="100%">
          {icon}
          {label ? (
            <SizableText fontSize={15} fontWeight="800" color="rgba(0,0,0,0.92)">
              {label}
            </SizableText>
          ) : null}
        </XStack>
      </GlassSurface>
    </Pressable>
  );
}
