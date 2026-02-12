import React from "react";
import { Stack, Text } from "tamagui";

type Props = {
  title?: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
};

export function AppCard({ title, children, footer }: Props) {
  return (
    <Stack
      backgroundColor="$card"
      borderRadius={18}
      padding={16}
      gap="$2"
      borderWidth={0}
    >
      {title ? (
        <Text fontSize={14} fontWeight="800" color="$text">
          {title}
        </Text>
      ) : null}
      {children}
      {footer}
    </Stack>
  );
}
