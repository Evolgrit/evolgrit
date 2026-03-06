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
        <Text fontFamily="$body" fontSize="$meta" fontWeight="700" color="$muted">
          {label.toUpperCase()}
        </Text>
      ) : null}
      <Text fontFamily="$heading" fontSize="$screenTitle" lineHeight="$screenTitle" fontWeight="700" color="$text">
        {title}
      </Text>
      {subtext ? (
        <Text fontFamily="$body" fontSize="$meta" color="$muted">
          {subtext}
        </Text>
      ) : null}
    </Stack>
  );
}
