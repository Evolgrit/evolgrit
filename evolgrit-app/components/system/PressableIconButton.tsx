import React from "react";
import { Pressable } from "react-native";
import { ArrowUpRight, ChevronRight } from "lucide-react-native";
import { Stack, useTheme } from "tamagui";

type Props = {
  icon: "arrowUpRight" | "chevron-right";
  size?: number;
  onPress?: () => void;
  ariaLabel?: string;
  disabled?: boolean;
};

export function PressableIconButton({ icon, size = 36, onPress, ariaLabel, disabled }: Props) {
  const theme = useTheme();
  const ink = theme.progressInk?.val ?? theme.color?.val ?? "black";
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={ariaLabel}
      onPress={disabled ? undefined : onPress}
      style={disabled ? { opacity: 0.5 } : undefined}
    >
      <Stack
        width={size}
        height={size}
        borderRadius={size / 2}
        backgroundColor="$progressCard"
        alignItems="center"
        justifyContent="center"
        pressStyle={{ scale: 0.97, opacity: 0.9 }}
      >
        {icon === "arrowUpRight" ? <ArrowUpRight size={18} color={ink} /> : null}
        {icon === "chevron-right" ? <ChevronRight size={20} color={ink} /> : null}
      </Stack>
    </Pressable>
  );
}
