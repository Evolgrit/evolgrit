import React from "react";
import { Stack, Text, XStack, YStack } from "tamagui";

type Props = {
  align: "left" | "right";
  avatar?: React.ReactNode;
  children: React.ReactNode;
  footer?: React.ReactNode;
};

export function DialogueBubble({ align, avatar, children, footer }: Props) {
  const isRight = align === "right";

  return (
    <XStack justifyContent={isRight ? "flex-end" : "flex-start"} marginBottom="$3" gap="$2" alignItems="flex-end">
      {!isRight && avatar ? avatar : null}

      <YStack maxWidth="78%" alignItems={isRight ? "flex-end" : "flex-start"}>
        <Stack
          padding="$3"
          borderRadius="$4"
          backgroundColor={isRight ? "$primary" : "$card"}
          borderWidth={1}
          borderColor={isRight ? "rgba(28,36,51,0.6)" : "rgba(17,24,39,0.08)"}
        >
          <Text color={isRight ? "$onPrimary" : "$text"}>{children}</Text>
        </Stack>
        {footer ? (
          <Text color="$muted" fontSize="$2" marginTop="$1">
            {footer}
          </Text>
        ) : null}
      </YStack>

      {isRight && avatar ? avatar : null}
    </XStack>
  );
}
