import React from "react";
import { View, ViewStyle } from "react-native";

export function GlassCard({
  children,
  style,
}: {
  children: React.ReactNode;
  style?: ViewStyle;
}) {
  return (
    <View
      style={[
        {
          backgroundColor: "#FFFFFF",
          borderRadius: 18,
          padding: 16,
          position: "relative",
          overflow: "hidden",
        },
        style,
      ]}
    >
      {children}
    </View>
  );
}
