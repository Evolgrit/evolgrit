import React from "react";
import { Input, XStack, useTheme } from "tamagui";
import { Feather } from "@expo/vector-icons";

type Props = {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
};

export function ChatSearchBar({ value, onChange, placeholder = "Nachrichten durchsuchen" }: Props) {
  const theme = useTheme();
  const muted = theme.textSecondary?.val ?? theme.colorMuted?.val ?? "#6B7280";
  return (
    <XStack
      alignItems="center"
      backgroundColor="$bgInput"
      borderRadius={22}
      paddingHorizontal={14}
      height={44}
      gap="$2"
    >
      <Feather name="search" size={18} color={muted} />
      <Input
        flex={1}
        unstyled
        value={value}
        onChangeText={onChange as any}
        placeholder={placeholder}
        placeholderTextColor={muted}
        autoCapitalize="none"
        borderWidth={0}
      />
    </XStack>
  );
}
