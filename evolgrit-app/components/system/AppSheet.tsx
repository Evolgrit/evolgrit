import React from "react";
import { Sheet } from "tamagui";

type Props = {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  children: React.ReactNode;
};

export function AppSheet({ open, onOpenChange, children }: Props) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange} snapPointsMode="fit" modal dismissOnSnapToBottom>
      <Sheet.Overlay />
      <Sheet.Handle />
      <Sheet.Frame padding="$4" gap="$3">
        {children}
      </Sheet.Frame>
    </Sheet>
  );
}
