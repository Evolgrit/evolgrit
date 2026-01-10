import React from "react";
import { XStack, Text } from "tamagui";

export function ScreenHeaderRow({
  title,
  left,
  right,
}: {
  title?: string;
  left?: React.ReactNode;
  right?: React.ReactNode;
}) {
  return (
    <XStack alignItems="center" justifyContent="space-between" paddingBottom={10}>
      {left ?? <Text />}
      {title ? (
        <Text fontSize={18} fontWeight="900" color="#111827">
          {title}
        </Text>
      ) : (
        <Text />
      )}
      {right ?? <Text />}
    </XStack>
  );
}
