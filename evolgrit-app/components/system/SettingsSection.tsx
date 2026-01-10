import React from "react";
import { Stack, Text } from "tamagui";

type Props = {
  title?: string;
  children: React.ReactNode;
};

export function SettingsSection({ title, children }: Props) {
  const kids = React.Children.toArray(children).filter(Boolean);

  return (
    <Stack gap="$2">
      {title ? (
        <Text fontSize={12} color="$colorMuted" paddingHorizontal="$1" marginBottom={4} fontWeight="700">
          {title}
        </Text>
      ) : null}

      <Stack backgroundColor="$surface" borderRadius={18} overflow="hidden" borderWidth={1} borderColor="$border">
        {kids.map((child, idx) => (
          <Stack key={idx}>
            {child}
            {idx < kids.length - 1 ? (
              <Stack
                position="absolute"
                left={56}
                right={0}
                bottom={0}
                height={1}
                backgroundColor="$border"
              />
            ) : null}
          </Stack>
        ))}
      </Stack>
    </Stack>
  );
}
