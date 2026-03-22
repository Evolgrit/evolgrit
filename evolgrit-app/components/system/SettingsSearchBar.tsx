import React from "react";
import { TextInput } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Stack, XStack, useTheme } from "tamagui";

type Props = {
  value: string;
  onChangeText: (v: string) => void;
  placeholder?: string;
};

export function SettingsSearchBar({ value, onChangeText, placeholder = "Suchen" }: Props) {
  const theme = useTheme();
  const textColor = theme.text?.val ?? theme.color?.val ?? "#111111";
  const muted = theme.textSecondary?.val ?? theme.colorMuted?.val ?? "#6B7280";
  return (
    <Stack
      backgroundColor="$bgInput"
      borderRadius={14}
      borderWidth={0}
      paddingHorizontal={12}
      paddingVertical={10}
      marginBottom={12}
    >
      <XStack alignItems="center" gap="$2">
        <Ionicons name="search" size={18} color={muted} />
        <TextInput
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor={muted}
          style={{ flex: 1, fontSize: 16, color: textColor }}
        />
      </XStack>
    </Stack>
  );
}
