import React from "react";
import { Input, XStack } from "tamagui";
import { Feather } from "@expo/vector-icons";

type Props = {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
};

export function ChatSearchBar({ value, onChange, placeholder = "Nachrichten durchsuchen" }: Props) {
  return (
    <XStack
      alignItems="center"
      backgroundColor="rgba(0,0,0,0.04)"
      borderRadius={22}
      paddingHorizontal={14}
      height={44}
      gap="$2"
    >
      <Feather name="search" size={18} color="rgba(17,24,39,0.55)" />
      <Input
        flex={1}
        unstyled
        value={value}
        onChangeText={onChange as any}
        placeholder={placeholder}
        placeholderTextColor="$muted"
        autoCapitalize="none"
        borderWidth={0}
      />
    </XStack>
  );
}
