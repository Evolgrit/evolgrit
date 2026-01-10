import React from "react";
import { YStack, Text } from "tamagui";

type Props = {
  limiter: "L" | "A" | "S" | "C";
  firstName?: string | null;
};

function greeting() {
  const hour = new Date().getHours();
  if (hour < 12) return "Guten Morgen";
  if (hour < 18) return "Guten Tag";
  return "Guten Abend";
}

function focusLine(limiter: Props["limiter"]) {
  switch (limiter) {
    case "L":
      return "Heute zählt ein klarer Satz.";
    case "A":
      return "Heute üben wir Anwendung im Alltag.";
    case "S":
      return "Heute stabilisieren wir zuerst.";
    case "C":
      return "Heute reichen 3 Minuten.";
    default:
      return "Ein ruhiger Schritt reicht.";
  }
}

export function TodayFocus({ limiter, firstName }: Props) {
  const hello = greeting();
  const name = firstName ? `${hello}, ${firstName}` : `${hello}`;

  return (
    <YStack gap="$1" paddingHorizontal="$1" paddingVertical="$1">
      <Text fontSize={22} fontWeight="800" color="$text">
        {name}
      </Text>
      <Text fontSize={15} color="$muted">
        {focusLine(limiter)}
      </Text>
    </YStack>
  );
}
