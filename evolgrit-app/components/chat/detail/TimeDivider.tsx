import React from "react";
import { YStack, Text } from "tamagui";

export function TimeDivider({ label }: { label: string }) {
  return (
    <YStack alignItems="center" marginVertical={24}>
      <Text fontSize={12} color="$text2">
        {label}
      </Text>
    </YStack>
  );
}
