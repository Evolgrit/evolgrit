import React from "react";
import { Text, YStack } from "tamagui";
import { ScreenShell } from "../../components/system/ScreenShell";
import { NavBackButton } from "../../components/system/NavBackButton";

export default function ComingSoonScreen() {
  return (
    <ScreenShell title="Kommt bald" leftContent={<NavBackButton fallbackRoute="/learn" />}>
      <YStack padding="$4" gap="$2">
        <Text fontSize="$6" fontWeight="800" color="$text">
          Kommt bald
        </Text>
        <Text color="$textSecondary">Dieses Modul ist noch nicht verfuegbar.</Text>
      </YStack>
    </ScreenShell>
  );
}
