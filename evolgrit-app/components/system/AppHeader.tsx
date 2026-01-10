import React from "react";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Stack, XStack, Text } from "tamagui";

type Props = {
  title?: string;
  left?: React.ReactNode;
  right?: React.ReactNode;
};

export function AppHeader({ title, left, right }: Props) {
  const insets = useSafeAreaInsets();
  const padTop = insets.top + 8;

  return (
    <Stack paddingTop={padTop} paddingHorizontal={16} paddingBottom={10} backgroundColor="$background">
      <XStack alignItems="center" justifyContent="space-between" minHeight={44}>
        <Stack width={44} alignItems="flex-start">
          {left ?? null}
        </Stack>

        <Stack flex={1} alignItems="center" justifyContent="center">
          {title ? (
            <Text fontSize={18} fontWeight="900" color="$text">
              {title}
            </Text>
          ) : null}
        </Stack>

        <Stack width={44} alignItems="flex-end">
          {right ?? null}
        </Stack>
      </XStack>
    </Stack>
  );
}
