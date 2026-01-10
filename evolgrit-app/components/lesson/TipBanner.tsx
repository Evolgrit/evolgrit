import React from "react";
import { Button, Text, XStack, YStack } from "tamagui";
import { Feather } from "@expo/vector-icons";

type Props = {
  text: string;
  onClose?: () => void;
};

export function TipBanner({ text, onClose }: Props) {
  return (
    <XStack
      backgroundColor="rgba(52,152,219,0.12)"
      borderColor="rgba(52,152,219,0.25)"
      borderWidth={1}
      borderRadius="$4"
      padding="$3"
      gap="$2"
      alignItems="flex-start"
    >
      <YStack flex={1} gap="$1">
        <Text fontWeight="800" color="$text">
          Tipp
        </Text>
        <Text color="$muted">{text}</Text>
      </YStack>

      {onClose ? (
        <Button
          unstyled
          width={32}
          height={32}
          borderRadius={999}
          alignItems="center"
          justifyContent="center"
          onPress={onClose}
        >
          <Feather name="x" size={16} color="#111827" />
        </Button>
      ) : null}
    </XStack>
  );
}
