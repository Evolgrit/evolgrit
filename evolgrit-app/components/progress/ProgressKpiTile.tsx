import React from "react";
import { Stack, Text, XStack } from "tamagui";
import { PressableIconButton } from "../system/PressableIconButton";
import { progressCardShadow } from "../../design/progressTokens";

type Props = {
  title: string;
  value: string;
  bgColor: string;
  onPress?: () => void;
  icon?: React.ReactNode;
};

export function ProgressKpiTile({ title, value, bgColor, onPress, icon }: Props) {
  return (
    <Stack
      backgroundColor={bgColor}
      borderRadius="$r16"
      padding="$s16"
      minHeight={110}
      {...progressCardShadow}
    >
      <XStack alignItems="center" justifyContent="space-between">
        <XStack gap="$2" alignItems="center">
          {icon ? <Stack opacity={0.9}>{icon}</Stack> : null}
          <Text color="$progressInk" fontSize={14} fontWeight="600">
            {title}
          </Text>
        </XStack>

        <PressableIconButton icon="arrowUpRight" size={36} onPress={onPress} ariaLabel={`${title} öffnen`} />
      </XStack>

      <Text marginTop="$s16" color="$progressInk" fontSize={40} fontWeight="800" lineHeight={44}>
        {value}
      </Text>
    </Stack>
  );
}
