import React from "react";
import { Button, type ButtonProps } from "tamagui";

export function SoftButton({
  label,
  children,
  backgroundColor,
  textColor,
  tone = "default",
  ...props
}: ButtonProps & { label?: string; textColor?: string; tone?: "default" | "strong" }) {
  const content = label ?? children;
  const bg = backgroundColor ?? (tone === "strong" ? "rgba(0,0,0,0.08)" : "rgba(0,0,0,0.04)");
  const pressBg = tone === "strong" ? "rgba(0,0,0,0.12)" : "rgba(0,0,0,0.06)";

  return (
    <Button
      {...props}
      height={44}
      borderRadius="$6"
      borderWidth={0}
      backgroundColor={bg}
      pressStyle={{ backgroundColor: pressBg, scale: 0.98 }}
      elevation={0}
    >
      <Button.Text color={textColor ?? "$text"} fontWeight="700" fontSize={15} lineHeight={20}>
        {typeof content === "string" ? content : " "}
      </Button.Text>
      {typeof content !== "string" ? content : null}
    </Button>
  );
}
