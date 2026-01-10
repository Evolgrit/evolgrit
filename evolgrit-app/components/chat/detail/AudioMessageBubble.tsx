import React, { useMemo } from "react";
import { Pressable, StyleSheet } from "react-native";
import { Feather } from "@expo/vector-icons";
import { useAudioPlayer } from "../../../hooks/useAudioPlayer";
import { Spinner, Stack, Text, XStack, YStack } from "tamagui";

type Props = {
  role: "user" | "mentor";
  uri?: string | null;
  localUri?: string | null;
  durationMs?: number;
  status?: "pending" | "sent" | "failed";
  timestamp?: string;
  onRetry?: () => void;
};

function formatDuration(ms?: number) {
  if (!ms || Number.isNaN(ms)) return "0:00";
  const totalSec = Math.max(0, Math.floor(ms / 1000));
  const min = Math.floor(totalSec / 60);
  const sec = totalSec % 60;
  return `${min}:${sec.toString().padStart(2, "0")}`;
}

export function AudioMessageBubble({
  role,
  uri,
  localUri,
  durationMs,
  status = "sent",
  timestamp,
  onRetry,
}: Props) {
  const source = uri ?? localUri;
  const isDisabled = !source;
  const player = useAudioPlayer();

  const progressWidth = useMemo(() => `${Math.round((player.progress ?? 0) * 100)}%`, [player.progress]);

  const isUser = role === "user";
  const bg = isUser ? "#1C1C1E" : "#FFFFFF";
  const textColor = isUser ? "#FFFFFF" : "rgba(0,0,0,0.9)";
  const borderColor = isUser ? "transparent" : "rgba(0,0,0,0.06)";

  return (
    <YStack
      alignSelf={isUser ? "flex-end" : "flex-start"}
      maxWidth="78%"
      borderRadius={20}
      padding={12}
      gap="$2"
      backgroundColor={bg}
      borderWidth={StyleSheet.hairlineWidth}
      borderColor={borderColor}
      opacity={status === "failed" ? 0.85 : 1}
    >
      <XStack alignItems="center" gap="$3">
        <Pressable
          onPress={
            status === "failed"
              ? onRetry
              : isDisabled
              ? undefined
              : () => player.play(source as any)
          }
          hitSlop={10}
        >
            <Stack
              width={40}
              height={40}
              borderRadius={20}
              backgroundColor={isUser ? "rgba(255,255,255,0.12)" : "rgba(0,0,0,0.06)"}
              alignItems="center"
              justifyContent="center"
            >
              {status === "pending" ? (
                <Spinner size="small" color={isUser ? "#fff" : "#111827"} />
              ) : (
              <Feather
                name={status === "failed" ? "alert-triangle" : player.isPlaying ? "pause" : "play"}
                size={18}
                color={isUser ? "#FFFFFF" : "#111827"}
              />
            )}
          </Stack>
        </Pressable>

        <YStack flex={1} gap="$1">
          <Stack height={6} borderRadius={999} backgroundColor={isUser ? "rgba(255,255,255,0.2)" : "rgba(0,0,0,0.08)"}>
            <Stack
              height="100%"
              borderRadius={999}
              width={progressWidth}
              backgroundColor={isUser ? "#FFFFFF" : "#111827"}
              opacity={0.35}
            />
          </Stack>
          <XStack alignItems="center" justifyContent="space-between">
            <Text fontSize={13} color={textColor}>
              {formatDuration(durationMs || player.durationMs || 0)}
            </Text>
            {status === "failed" ? (
              <Text fontSize={12} color={isUser ? "#FFD7D7" : "#B91C1C"}>
                Upload fehlgeschlagen
              </Text>
            ) : null}
          </XStack>
        </YStack>
      </XStack>

      {timestamp ? (
        <Text fontSize={11} color={isUser ? "rgba(255,255,255,0.65)" : "rgba(0,0,0,0.45)"} textAlign="right">
          {timestamp}
        </Text>
      ) : null}
    </YStack>
  );
}
