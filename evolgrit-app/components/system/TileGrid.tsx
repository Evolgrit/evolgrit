import React from "react";
import { Stack } from "tamagui";

type Props = {
  children: React.ReactNode;
  gap?: string | number;
};

/**
 * Simple 2-column grid helper using Tamagui Stack with wrap.
 */
export function TileGrid({ children, gap = "$3" }: Props) {
  return (
    <Stack flexDirection="row" flexWrap="wrap" gap={gap}>
      {React.Children.map(children, (child, idx) => (
        <Stack key={idx} width="48%">
          {child}
        </Stack>
      ))}
    </Stack>
  );
}
