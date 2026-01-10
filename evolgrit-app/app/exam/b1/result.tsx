import React, { useEffect, useState } from "react";
import { useRouter } from "expo-router";
import { Text, YStack, XStack } from "tamagui";

import { ScreenShell } from "../../../components/system/ScreenShell";
import { GlassCard } from "../../../components/system/GlassCard";
import { PrimaryButton } from "../../../components/system/PrimaryButton";
import { getExamB1State, resetExamB1 } from "../../../lib/examB1Store";

type ChecklistRowProps = {
  label: string;
  done: boolean;
};

function ChecklistRow({ label, done }: ChecklistRowProps) {
  return (
    <XStack alignItems="center" justifyContent="space-between" paddingVertical={8} borderBottomWidth={1} borderBottomColor="rgba(0,0,0,0.06)">
      <Text color="#111827">{label}</Text>
      <Text color={done ? "#16A34A" : "#9CA3AF"}>{done ? "✅" : "⬜"}</Text>
    </XStack>
  );
}

export default function ExamResult() {
  const router = useRouter();
  const [state, setState] = useState({
    speaking1Done: false,
    speaking2Done: false,
    writingDone: false,
  });

  useEffect(() => {
    (async () => {
      const s = await getExamB1State();
      setState({
        speaking1Done: s.speaking1Done,
        speaking2Done: s.speaking2Done,
        writingDone: s.writingDone,
      });
    })();
  }, []);

  return (
    <ScreenShell title="Ergebnis">
      <YStack gap="$3">
        <GlassCard>
          <Text fontSize={18} fontWeight="900" color="#111827">
            Prüfungsstatus
          </Text>
          <YStack marginTop="$3" gap="$1">
            <ChecklistRow label="Sprechen Teil 1" done={state.speaking1Done} />
            <ChecklistRow label="Sprechen Teil 2" done={state.speaking2Done} />
            <ChecklistRow label="Schreiben" done={state.writingDone} />
          </YStack>
        </GlassCard>

        <GlassCard>
          <Text fontSize={18} fontWeight="900" color="#111827">
            Next Action
          </Text>
          <Text marginTop={6} color="#6B7280">
            Heute: 3 Minuten – wiederhole Teil 2 mit einem neuen Thema.
          </Text>
          <YStack gap="$2" marginTop="$3">
            <PrimaryButton
              label="Reset"
              onPress={async () => {
                await resetExamB1();
                const s = await getExamB1State();
                setState({
                  speaking1Done: s.speaking1Done,
                  speaking2Done: s.speaking2Done,
                  writingDone: s.writingDone,
                });
              }}
            />
            <PrimaryButton label="Zurück zu Learn" onPress={() => router.replace("/(tabs)/learn")} />
          </YStack>
        </GlassCard>
      </YStack>
    </ScreenShell>
  );
}
