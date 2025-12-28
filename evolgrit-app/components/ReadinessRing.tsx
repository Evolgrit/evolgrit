import React from "react";
import { View, Text, Pressable } from "react-native";
import Svg, { Circle } from "react-native-svg";

const COLORS = {
  green: "#2ECC71",
  yellow: "#F1C40F",
  red: "#E74C3C",
  bg: "#E5E7EB",
  text: "#111827",
};

function zoneColor(value: number) {
  if (value >= 70) return COLORS.green;
  if (value >= 40) return COLORS.yellow;
  return COLORS.red;
}

export function ReadinessRing({
  value,
  size = 200,
  strokeWidth = 14,
  onPress,
}: {
  value: number;
  size?: number;
  strokeWidth?: number;
  onPress?: () => void;
}) {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const progress = Math.min(100, Math.max(0, Math.round(value)));
  const strokeDashoffset = circumference - (progress / 100) * circumference;
  const color = zoneColor(progress);

  return (
    <Pressable onPress={onPress}>
      <View style={{ width: size, height: size, alignItems: "center", justifyContent: "center" }}>
        <Svg width={size} height={size}>
          <Circle
            stroke={COLORS.bg}
            fill="none"
            cx={size / 2}
            cy={size / 2}
            r={radius}
            strokeWidth={strokeWidth}
          />
          <Circle
            stroke={color}
            fill="none"
            cx={size / 2}
            cy={size / 2}
            r={radius}
            strokeWidth={strokeWidth}
            strokeDasharray={`${circumference} ${circumference}`}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            rotation="-90"
            origin={`${size / 2}, ${size / 2}`}
          />
        </Svg>

        <View style={{ position: "absolute", alignItems: "center" }}>
          <Text style={{ fontSize: 52, fontWeight: "600", color: COLORS.text }}>
            {progress}
          </Text>
        </View>
      </View>
    </Pressable>
  );
}
