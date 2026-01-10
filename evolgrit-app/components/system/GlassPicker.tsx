import React, { useMemo, useState } from "react";
import { Pressable } from "react-native";
import { SizableText, Stack, XStack, YStack } from "tamagui";
import { GlassSurface } from "./GlassSurface";

type Option = { label: string; value: string };

type Props = {
  options: Option[];
  value: string | null;
  placeholder?: string;
  onChange: (v: string) => void;
};

export function GlassPicker({ options, value, placeholder = "Select", onChange }: Props) {
  const [open, setOpen] = useState(false);
  const label = useMemo(
    () => options.find((o) => o.value === value)?.label ?? placeholder,
    [options, value, placeholder]
  );

  return (
    <Stack position="relative">
      <Pressable onPress={() => setOpen((s) => !s)}>
        <GlassSurface padding={0} radius={14}>
          <XStack alignItems="center" justifyContent="space-between" paddingHorizontal="$3" paddingVertical="$2.5">
            <SizableText fontSize={16} color="rgba(0,0,0,0.92)">
              {label}
            </SizableText>
            <SizableText fontSize={14} color="rgba(0,0,0,0.45)">
              ▼
            </SizableText>
          </XStack>
        </GlassSurface>
      </Pressable>

      {open ? (
        <GlassSurface
          padding={0}
          radius={14}
          style={{
            position: "absolute",
            top: 52,
            left: 0,
            right: 0,
            zIndex: 20,
          }}
        >
          <YStack>
            {options.map((opt) => (
              <Pressable
                key={opt.value}
                onPress={() => {
                  onChange(opt.value);
                  setOpen(false);
                }}
              >
                <XStack paddingHorizontal="$3" paddingVertical="$2.5" alignItems="center" justifyContent="space-between">
                  <SizableText fontSize={16} color="rgba(0,0,0,0.92)">
                    {opt.label}
                  </SizableText>
                  {opt.value === value ? <SizableText color="rgba(0,0,0,0.55)">✓</SizableText> : null}
                </XStack>
              </Pressable>
            ))}
          </YStack>
        </GlassSurface>
      ) : null}
    </Stack>
  );
}
