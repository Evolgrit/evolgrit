import React from "react";
import { Button, type ButtonProps } from "tamagui";

export function PillButton({
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
      borderRadius={999}
      minHeight={42}
      paddingHorizontal={14}
      paddingVertical={10}
      fontWeight="800"
      borderWidth={1}
      borderColor="$border"
      pressStyle={{ scale: 0.97, opacity: 0.92 }}
      shadowColor="transparent"
    >
      <Button.Text color="$text" fontWeight="800" fontSize={14}>
        {typeof content === "string" ? content : " "}
      </Button.Text>
      {typeof content !== "string" ? content : null}
    </Button>
  );
}
