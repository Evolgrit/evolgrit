import React from "react";
import { Stack, Text, type StackProps } from "tamagui";
import { Ionicons } from "@expo/vector-icons";

export function ListRow({
  title,
  subtitle,
  value,
  icon,
  onPress,
  ...props
}: {
  title: string;
  subtitle?: string;
  value?: string;
  icon?: React.ReactNode;
  onPress?: () => void;
} & StackProps) {
  return (
    <Stack
      {...props}
      pressStyle={{ opacity: 0.9 }}
      backgroundColor="$card"
      borderRadius={16}
      paddingHorizontal={14}
      paddingVertical={12}
      flexDirection="row"
      alignItems="center"
      gap="$3"
      onPress={onPress}
    >
      <Stack
        width={38}
        height={38}
        borderRadius={12}
        alignItems="center"
        justifyContent="center"
        backgroundColor="$card"
        borderWidth={1}
        borderColor="$border"
      >
        {icon ?? <Ionicons name="ellipse-outline" size={18} color="#111827" />}
      </Stack>
      <Stack flex={1} gap="$1">
        <Text fontWeight="800" color="$text">
          {title}
        </Text>
        {subtitle ? (
          <Text color="$muted" fontSize={13}>
            {subtitle}
          </Text>
        ) : null}
      </Stack>
      {value ? (
        <Text color="$muted" marginRight={6} fontSize={13}>
          {value}
        </Text>
      ) : null}
      <Ionicons name="chevron-forward" size={18} color="rgba(17,24,39,0.30)" />
    </Stack>
  );
}
