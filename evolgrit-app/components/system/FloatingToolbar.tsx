import React from "react";
import { ViewStyle } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { CapsuleToolbar, CapsuleToolbarAction } from "./CapsuleToolbar";

type FloatingToolbarProps = {
  actions: CapsuleToolbarAction[];
  bottomOffset?: number;
  right?: number;
  style?: ViewStyle;
};

export function FloatingToolbar({
  actions,
  bottomOffset = 12,
  right = 16,
  style,
}: FloatingToolbarProps) {
  const insets = useSafeAreaInsets();
  return (
    <CapsuleToolbar
      actions={actions}
      style={{
        position: "absolute",
        right,
        bottom: insets.bottom + bottomOffset,
        ...(style ?? {}),
      }}
    />
  );
}
