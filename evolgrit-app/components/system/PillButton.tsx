import React from "react";
import { Button, type ButtonProps } from "tamagui";
import { pillProps } from "./recipes";

export function PillButton({
  label,
  children,
  ...props
}: ButtonProps & { label?: string }) {
  const content = label ?? children;

  return (
    <Button
      {...props}
      {...pillProps}
      backgroundColor="$card"
      color="$text"
      alignItems="center"
      justifyContent="center"
      minHeight={44}
      paddingHorizontal={16}
      paddingVertical={10}
      borderRadius="$6"
      flexShrink={0}
      alignSelf="flex-start"
      width="auto"
      pressStyle={{ scale: 0.97, opacity: 0.92 }}
    >
      <Button.Text
        color="$text"
        fontWeight="800"
        fontSize={15}
        lineHeight={20}
        textAlign="center"
        flexShrink={0}
        allowFontScaling={false}
        includeFontPadding={false}
      >
        {typeof content === "string" ? content : " "}
      </Button.Text>
      {typeof content !== "string" ? content : null}
    </Button>
  );
}
