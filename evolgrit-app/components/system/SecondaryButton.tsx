import React from "react";
import { Button, type ButtonProps } from "tamagui";

export function SecondaryButton({
  label,
  children,
  ...props
}: ButtonProps & { label?: string }) {
  const content = label ?? children;

  return (
    <Button
      {...props}
      backgroundColor="$card"
      color="$text"
      borderRadius={12}
      minHeight={48}
      paddingVertical={12}
      fontWeight="900"
      borderWidth={1}
      borderColor="$border"
      pressStyle={{ scale: 0.98, opacity: 0.92 }}
    >
      <Button.Text color="$text" fontWeight="800" fontSize={15}>
        {typeof content === "string" ? content : " "}
      </Button.Text>
      {typeof content !== "string" ? content : null}
    </Button>
  );
}
