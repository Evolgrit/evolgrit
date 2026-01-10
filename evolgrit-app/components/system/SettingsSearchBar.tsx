import React from "react";
import { TextInput } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Stack, XStack } from "tamagui";

type Props = {
  value: string;
  onChangeText: (v: string) => void;
  placeholder?: string;
};

export function SettingsSearchBar({ value, onChangeText, placeholder = "Suchen" }: Props) {
  return (
    <Stack
      backgroundColor="$surface"
      borderRadius={14}
      borderWidth={1}
      borderColor="$border"
      paddingHorizontal={12}
      paddingVertical={10}
      marginBottom={12}
      shadowColor="rgba(0,0,0,0.08)"
      shadowOpacity={0.08}
      shadowRadius={12}
      shadowOffset={{ width: 0, height: 6 }}
    >
      <XStack alignItems="center" gap="$2">
        <Ionicons name="search" size={18} color="rgba(0,0,0,0.45)" />
        <TextInput
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor="rgba(0,0,0,0.45)"
          style={{ flex: 1, fontSize: 16, color: "rgba(0,0,0,0.92)" }}
        />
      </XStack>
    </Stack>
  );
}
