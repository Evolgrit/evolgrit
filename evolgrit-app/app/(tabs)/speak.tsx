import React from "react";
import { useRouter } from "expo-router";
import { Stack, Text } from "tamagui";

import { GlassCard } from "../../components/system/GlassCard";
import { PrimaryButton } from "../../components/system/PrimaryButton";
import { ScreenShell } from "../../components/system/ScreenShell";

export default function SpeakTab() {
  const router = useRouter();

  return (
    <ScreenShell title="Speak">
      <Stack flex={1} gap={12}>
        <Stack gap={4}>
          <Text fontSize={22} fontWeight="900" color="$text">
            Speak
          </Text>
          <Text color="$muted">High-frequency practice. Short drills. No scores.</Text>
        </Stack>

        <GlassCard>
          <Text fontWeight="800" color="$text" marginBottom={8}>
            Next drill
          </Text>
          <Text color="$muted" marginBottom={12}>
            Quick speaking exercise to build confidence.
          </Text>
          <PrimaryButton label="Start speaking drill" onPress={() => router.push("/speak-task")} />
        </GlassCard>
      </Stack>
    </ScreenShell>
  );
}
