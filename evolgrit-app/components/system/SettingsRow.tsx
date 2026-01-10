import React from "react";
import { Pressable } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { SizableText, Stack, XStack, YStack } from "tamagui";

type Props = {
  icon: React.ReactNode;
  title: string;
  subtitle?: string;
  right?: React.ReactNode;
  onPress?: () => void;
  showChevron?: boolean;
};

export function SettingsRow({ icon, title, subtitle, right, onPress, showChevron = true }: Props) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => ({
        opacity: pressed ? 0.8 : 1,
      })}
    >
      <XStack alignItems="center" paddingHorizontal="$3" paddingVertical="$3" gap="$3">
        <Stack
          width={32}
          height={32}
          borderRadius={10}
          backgroundColor="rgba(0,0,0,0.04)"
          alignItems="center"
          justifyContent="center"
        >
          {icon}
        </Stack>

        <YStack flex={1} gap="$0.5">
          <SizableText fontSize={16} fontWeight="700" color="$text">
            {title}
          </SizableText>
          {subtitle ? (
            <SizableText fontSize={13} color="$colorMuted">
              {subtitle}
            </SizableText>
          ) : null}
        </YStack>

        {right ? <Stack marginLeft="$2">{right}</Stack> : null}

        {showChevron ? (
          <Ionicons name="chevron-forward" size={18} color="rgba(0,0,0,0.30)" />
        ) : null}
      </XStack>
    </Pressable>
  );
}
