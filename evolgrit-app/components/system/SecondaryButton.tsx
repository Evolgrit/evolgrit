import React from "react";
import { Button, type ButtonProps } from "tamagui";
import { pillProps } from "./recipes";

export function SecondaryButton({
  label,
  children,
  backgroundColor,
  borderColor,
  textColor,
  ...props
}: ButtonProps & { label?: string; textColor?: string }) {
  const content = label ?? children;

  return (
    <Button
      {...pillProps}
      {...props}
      backgroundColor={backgroundColor ?? "$card"}
      borderColor={borderColor ?? pillProps.borderColor}
      color={textColor ?? "$text"}
      minHeight={48}
      pressStyle={{ scale: 0.98, opacity: 0.92 }}
    >
      <Button.Text color={textColor ?? "$text"} fontWeight="800" fontSize={15}>
        {typeof content === "string" ? content : " "}
      </Button.Text>
      {typeof content !== "string" ? content : null}
    </Button>
  );
}
