import React, { useEffect, useState } from "react";
import { Text, YStack, XStack } from "tamagui";
import { useRouter } from "expo-router";

import { ScreenShell } from "../../../components/system/ScreenShell";
import { GlassCard } from "../../../components/system/GlassCard";
import { PrimaryButton } from "../../../components/system/PrimaryButton";
import { setSpeaking2Done } from "../../../lib/examB1Store";

const PROMPT = "Sagen Sie Ihre Meinung und nennen Sie zwei Gründe.";
const EXAMPLE = "Ich finde ___ gut, weil ___. Außerdem ___.";

function formatTimer(seconds: number) {
  const m = Math.floor(seconds / 60)
    .toString()
    .padStart(2, "0");
  const s = (seconds % 60).toString().padStart(2, "0");
  return `${m}:${s}`;
}

export default function Speaking2() {
  const router = useRouter();
  const [remaining, setRemaining] = useState(180);
  const [running, setRunning] = useState(false);

  useEffect(() => {
    if (!running) return;
    const id = setInterval(() => {
      setRemaining((r) => {
        if (r <= 1) {
          setRunning(false);
          return 0;
        }
        return r - 1;
      });
    }, 1000);
    return () => clearInterval(id);
  }, [running]);

  return (
    <ScreenShell title="Sprechen Teil 2">
      <YStack gap="$3">
        <GlassCard>
          <Text fontSize={18} fontWeight="900" color="#111827">
            Sprechen Teil 2
          </Text>
          <Text marginTop={6} color="#6B7280">
            {PROMPT}
          </Text>
          <GlassCard marginTop="$3">
            <Text fontWeight="800" color="#111827">
              Beispiel
            </Text>
            <Text marginTop={6} color="#6B7280">
              {EXAMPLE}
            </Text>
          </GlassCard>

          <XStack marginTop="$3" alignItems="center" justifyContent="space-between">
            <Text fontWeight="800" color="#111827">
              Timer
            </Text>
            <Text fontWeight="900" fontSize={18} color="#111827">
              {formatTimer(remaining)}
            </Text>
          </XStack>

          <YStack gap="$2" marginTop="$3">
            <PrimaryButton
              label={running ? "Läuft…" : "Start"}
              onPress={() => {
                setRemaining(180);
                setRunning(true);
              }}
            />
            <PrimaryButton
              label="Fertig"
              onPress={async () => {
                await setSpeaking2Done(true);
                router.replace("/exam/b1/writing");
              }}
            />
          </YStack>
        </GlassCard>
      </YStack>
    </ScreenShell>
  );
}
