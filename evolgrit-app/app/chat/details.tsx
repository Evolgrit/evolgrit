import React, { useEffect, useMemo, useState } from "react";
import { Image } from "react-native";
import { ScreenShell } from "../../components/system/ScreenShell";
import { GlassCard } from "../../components/system/GlassCard";
import { loadThread, type MentorThread } from "../../lib/mentorStore";
import { YStack, Text, XStack } from "tamagui";

export default function ChatDetails() {
  const [thread, setThread] = useState<MentorThread | null>(null);

  useEffect(() => {
    (async () => {
      setThread(await loadThread());
    })();
  }, []);

  const images = useMemo(() => {
    if (!thread?.messages) return [];
    return thread.messages.filter((m) => !!m.imageUri).slice(0, 6);
  }, [thread]);

  return (
    <ScreenShell title="Chat-Details" showBack>
      <YStack gap="$4" paddingBottom="$4">
        <GlassCard>
          <YStack alignItems="center" gap="$2">
            <Image
              source={{ uri: "https://placekitten.com/240/240" }}
              style={{ width: 96, height: 96, borderRadius: 48, marginBottom: 6 }}
            />
            <Text fontSize={18} fontWeight="800" color="$text">
              Stanley
            </Text>
            <Text fontSize={14} color="$muted">
              Mentor · Evolgrit
            </Text>
          </YStack>
        </GlassCard>

        <GlassCard>
          <Text fontWeight="700" color="$text" marginBottom={10}>
            Medien, Links, Doks
          </Text>
          {images.length === 0 ? (
            <Text color="$muted">Noch keine Medien.</Text>
          ) : (
            <XStack flexWrap="wrap" gap="$2">
              {images.map((m) => (
                <Image
                  key={m.id}
                  source={{ uri: m.imageUri! }}
                  style={{ width: "30%", aspectRatio: 1, borderRadius: 12 }}
                />
              ))}
            </XStack>
          )}
        </GlassCard>
      </YStack>
    </ScreenShell>
  );
}
