import React, { useEffect, useState } from "react";
import { TextInput } from "react-native";
import { useRouter } from "expo-router";
import { Text, YStack, Stack } from "tamagui";

import { ScreenShell } from "../../../components/system/ScreenShell";
import { GlassCard } from "../../../components/system/GlassCard";
import { PrimaryButton } from "../../../components/system/PrimaryButton";
import { getExamB1State, setWritingDone, setWritingText } from "../../../lib/examB1Store";

const HINTS = ["Grund nennen", "Neuen Termin vorschlagen", "Höflich schließen"];

export default function Writing() {
  const router = useRouter();
  const [text, setText] = useState("");

  useEffect(() => {
    (async () => {
      const state = await getExamB1State();
      setText(state.writingText ?? "");
    })();
  }, []);

  return (
    <ScreenShell title="Schreiben">
      <YStack gap="$3">
        <GlassCard>
          <Text fontSize={18} fontWeight="900" color="#111827">
            Schreiben
          </Text>
          <Text marginTop={6} color="#6B7280">
            Schreiben Sie eine kurze E-Mail (80–100 Wörter).
          </Text>
          <Text marginTop={10} fontWeight="800" color="#111827">
            Scenario
          </Text>
          <Text marginTop={4} color="#6B7280">
            Termin absagen und einen neuen vorschlagen.
          </Text>

          <Stack marginTop={10} gap="$2">
            {HINTS.map((h) => (
              <Text key={h} color="#6B7280">
                • {h}
              </Text>
            ))}
          </Stack>

          <TextInput
            value={text}
            onChangeText={setText}
            multiline
            placeholder="Schreiben Sie hier…"
            placeholderTextColor="rgba(0,0,0,0.35)"
            style={{
              marginTop: 12,
              minHeight: 140,
              borderRadius: 14,
              borderWidth: 1,
              borderColor: "rgba(0,0,0,0.08)",
              padding: 12,
              backgroundColor: "#fff",
              color: "#111827",
              fontSize: 16,
              textAlignVertical: "top",
            }}
          />

          <PrimaryButton
            marginTop="$3"
            label="Abgeben"
            onPress={async () => {
              await setWritingText(text);
              await setWritingDone(true);
              router.replace("/exam/b1/result");
            }}
          />
        </GlassCard>
      </YStack>
    </ScreenShell>
  );
}
