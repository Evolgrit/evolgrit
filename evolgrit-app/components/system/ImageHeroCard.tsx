import React from "react";
import { Pressable } from "react-native";
import { Stack, Text } from "tamagui";

type Props = {
  title: string;
  subtitle: string;
  onPress?: () => void;
  pill?: string;
};

export function ImageHeroCard({ title, subtitle, onPress, pill }: Props) {
  return (
    <Pressable onPress={onPress}>
      <Stack
        backgroundColor="$card"
        borderRadius={18}
        padding="$4"
        gap="$3"
      >
        {pill ? (
          <Stack
            alignSelf="flex-start"
            paddingHorizontal="$3"
            paddingVertical="$1"
            borderRadius={999}
            backgroundColor="rgba(0,0,0,0.05)"
          >
            <Text fontSize={12} fontWeight="700" color="$text">
              {pill}
            </Text>
          </Stack>
        ) : null}
        <Text fontSize={18} fontWeight="900" color="$text">
          {title}
        </Text>
        <Text fontSize={14} color="$muted">
          {subtitle}
        </Text>
      </Stack>
    </Pressable>
  );
}
