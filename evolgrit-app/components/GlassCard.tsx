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
          backgroundColor: "rgba(255,255,255,0.78)",
          borderRadius: 18,
          padding: 16,
          shadowColor: "#000",
          shadowOpacity: 0.08,
          shadowRadius: 18,
          shadowOffset: { width: 0, height: 10 },
          position: "relative",
          overflow: "hidden",
        },
        style,
      ]}
    >
      {/* subtle highlight */}
      <View
        pointerEvents="none"
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          top: 0,
          height: 44,
          backgroundColor: "rgba(255,255,255,0.55)",
          opacity: 0.18,
        }}
      />
      <View
        pointerEvents="none"
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          top: 44,
          height: 80,
          backgroundColor: "rgba(255,255,255,0.25)",
          opacity: 0.1,
        }}
      />

      {children}
    </View>
  );
}
