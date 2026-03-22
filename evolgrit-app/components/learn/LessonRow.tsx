import React from "react";
import { Pressable } from "react-native";
import { XStack, YStack, Text } from "tamagui";
import * as Haptics from "expo-haptics";
import { StatusIcon, type LessonStatus } from "./StatusIcon";

export function LessonRow({
  title,
  minutes,
  kindLabel,
  status,
  onPress,
}: {
  title: string;
  minutes: number;
  kindLabel?: string;
  status: LessonStatus;
  onPress: () => void;
}) {
  const locked = status === "locked";
  return (
    <Pressable
      accessibilityRole="button"
      onPress={() => {
        if (locked) return;
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
        onPress();
      }}
      style={({ pressed }) => ({
        width: "100%",
        transform: [{ scale: pressed ? 0.98 : 1 }],
        opacity: locked ? 0.6 : 1,
      })}
    >
      <XStack
        alignItems="center"
        justifyContent="space-between"
        paddingVertical="$3"
        paddingHorizontal="$3"
        borderRadius="$6"
        backgroundColor="$bgSurface"
      >
        <YStack flex={1} gap="$1" minWidth={0}>
          <Text fontSize="$4" fontWeight="700" color="$text" numberOfLines={1}>
            {title}
          </Text>
          <Text fontSize="$3" color="$textSecondary">
            {minutes} Min{kindLabel ? ` · ${kindLabel}` : ""}
          </Text>
        </YStack>
        <StatusIcon status={status} />
      </XStack>
    </Pressable>
  );
}
