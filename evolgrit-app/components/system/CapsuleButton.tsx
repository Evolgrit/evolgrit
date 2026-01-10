import React from "react";
import { Pressable, ViewStyle } from "react-native";
import { SizableText, XStack } from "tamagui";

type CapsuleButtonProps = {
  label?: string;
  icon?: React.ReactNode;
  onPress?: () => void;
  disabled?: boolean;
  height?: number;
  px?: number;
  circular?: boolean;
  style?: ViewStyle;
};

export function CapsuleButton({
  label,
  icon,
  onPress,
  disabled,
  height = 40,
  px = 14,
  circular = false,
  style,
}: CapsuleButtonProps) {
  const radius = circular ? height / 2 : 999;

  return (
    <Pressable
      onPress={disabled ? undefined : onPress}
      style={[
        {
          height,
          borderRadius: radius,
          borderWidth: 1,
          borderColor: "rgba(0,0,0,0.06)",
          backgroundColor: "#fff",
          opacity: disabled ? 0.45 : 1,
          shadowColor: "rgba(0,0,0,0.06)",
          shadowOpacity: 1,
          shadowRadius: 8,
          shadowOffset: { width: 0, height: 4 },
        },
        style,
      ]}
    >
      <XStack
        height="100%"
        alignItems="center"
        justifyContent="center"
        gap={8}
        paddingHorizontal={circular ? 0 : px}
      >
        {icon}
        {label ? (
          <SizableText fontSize={16} fontWeight="700" color="rgba(0,0,0,0.92)">
            {label}
          </SizableText>
        ) : null}
      </XStack>
    </Pressable>
  );
}
