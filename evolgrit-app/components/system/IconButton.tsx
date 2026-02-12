import React from "react";
import { Button } from "tamagui";

type Props = {
  icon: React.ReactNode;
  onPress?: () => void;
  disabled?: boolean;
};

export function IconButton({ icon, onPress, disabled }: Props) {
  return (
    <Button
      unstyled
      onPress={onPress}
      disabled={disabled}
      width={44}
      height={44}
      alignItems="center"
      justifyContent="center"
      borderRadius={22}
      backgroundColor="$card"
      borderWidth={1}
      borderColor="$border"
    >
      {icon}
    </Button>
  );
}
