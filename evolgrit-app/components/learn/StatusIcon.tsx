import React from "react";
import { YStack, useTheme } from "tamagui";
import { Check, Lock, Play, Star } from "lucide-react-native";

export type LessonStatus = "available" | "locked" | "done" | "recommended";

export function StatusIcon({ status }: { status: LessonStatus }) {
  const theme = useTheme();
  const size = 18;
  const color = theme.textSecondary?.val ?? theme.text?.val ?? "black";

  if (status === "locked") {
    return (
      <YStack alignItems="center" justifyContent="center">
        <Lock size={size} color={color} />
      </YStack>
    );
  }
  if (status === "done") {
    return (
      <YStack alignItems="center" justifyContent="center">
        <Check size={size} color={color} />
      </YStack>
    );
  }
  if (status === "recommended") {
    return (
      <YStack alignItems="center" justifyContent="center">
        <Star size={size} color={color} />
      </YStack>
    );
  }
  return (
    <YStack alignItems="center" justifyContent="center">
      <Play size={size} color={color} />
    </YStack>
  );
}
