import React from "react";
import { Button, type ButtonProps } from "tamagui";
import { pillProps } from "./recipes";

export function PrimaryButton({
  label,
  children,
  ...props
}: ButtonProps & { label?: string }) {
  const content = label ?? children;

  return (
    <Button
      {...props}
      {...pillProps}
      backgroundColor="$primary"
      minHeight={48}
      pressStyle={{ scale: 0.98, opacity: 0.92 }}
    >
      <Button.Text color="$textOnDark" fontWeight="800" fontSize={15}>
        {typeof content === "string" ? content : " "}
      </Button.Text>

      {/* If someone passes custom JSX children, render it AFTER the text safely */}
      {typeof content !== "string" ? content : null}
    </Button>
  );
}
