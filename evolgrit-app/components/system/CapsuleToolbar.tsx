import React from "react";
import { Pressable, ViewStyle } from "react-native";
import { XStack } from "tamagui";

export type CapsuleToolbarAction = {
  key: string;
  icon: React.ReactNode;
  onPress?: () => void;
  disabled?: boolean;
  accessibilityLabel?: string;
};

type CapsuleToolbarProps = {
  actions: CapsuleToolbarAction[];
  height?: number;
  px?: number;
  gap?: number;
  style?: ViewStyle;
};

export function CapsuleToolbar({
  actions,
  height = 40,
  px = 10,
  gap = 8,
  style,
}: CapsuleToolbarProps) {
  return (
    <XStack
      height={height}
      borderRadius={999}
      borderWidth={1}
      borderColor="rgba(0,0,0,0.06)"
      backgroundColor="#fff"
      alignItems="center"
      paddingHorizontal={px}
      gap={gap}
      {...(style as any)}
    >
      {actions.map((a) => (
        <Pressable
          key={a.key}
          onPress={a.disabled ? undefined : a.onPress}
          accessibilityLabel={a.accessibilityLabel}
          style={{
            width: 34,
            height: 34,
            borderRadius: 17,
            alignItems: "center",
            justifyContent: "center",
            opacity: a.disabled ? 0.45 : 1,
          }}
        >
          {a.icon}
        </Pressable>
      ))}
    </XStack>
  );
}
