import React from "react";
import { Stack, Text } from "tamagui";

type Props = {
  label?: string;
  title: string;
  subtext?: string;
  marginBottom?: number | string;
};

export function SectionHeader({ label, title, subtext, marginBottom = "$3" }: Props) {
  return (
    <Stack gap="$1" marginBottom={marginBottom}>
      {label ? (
        <Text fontSize={12} fontWeight="800" color="$muted">
          {label.toUpperCase()}
        </Text>
      ) : null}
      <Text fontSize={18} fontWeight="900" color="$text">
        {title}
      </Text>
      {subtext ? (
        <Text fontSize={13} color="$muted">
          {subtext}
        </Text>
      ) : null}
    </Stack>
  );
}
