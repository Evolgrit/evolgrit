import React from "react";
import { useRouter } from "expo-router";
import { Text, YStack } from "tamagui";

import { ScreenShell } from "../../../components/system/ScreenShell";
import { GlassCard } from "../../../components/system/GlassCard";
import { PrimaryButton } from "../../../components/system/PrimaryButton";

export default function ExamHome() {
  const router = useRouter();

  return (
    <ScreenShell title="B1 Prüfungsmodus">
      <YStack gap="$3">
        <GlassCard>
          <Text fontSize={18} fontWeight="900" color="#111827">
            B1 Prüfungsmodus
          </Text>
          <Text marginTop={6} color="#6B7280">
            Ruhig. Kurz. Proof-only.
          </Text>
          <YStack gap="$2" marginTop="$3">
            <PrimaryButton label="Sprechen Teil 1 (3 Min)" onPress={() => router.push("/exam/b1/speaking-1")} />
            <PrimaryButton label="Sprechen Teil 2 (3 Min)" onPress={() => router.push("/exam/b1/speaking-2")} />
            <PrimaryButton label="Schreiben (10 Min)" onPress={() => router.push("/exam/b1/writing")} />
          </YStack>
        </GlassCard>
      </YStack>
    </ScreenShell>
  );
}
