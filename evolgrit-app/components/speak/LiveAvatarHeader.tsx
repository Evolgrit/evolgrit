import React, { useEffect, useMemo, useRef } from "react";
import { Animated } from "react-native";
import { XStack, YStack, Text } from "tamagui";

type LiveStage = "intro" | "mentor" | "user" | "feedback";

export function LiveAvatarHeader({
  name,
  stage,
  isRecording,
  isThinking,
  isSpeaking,
}: {
  name: string;
  stage: LiveStage;
  isRecording: boolean;
  isThinking?: boolean;
  isSpeaking?: boolean;
}) {
  const pulse = useRef(new Animated.Value(1)).current;
  const opacity = useRef(new Animated.Value(0)).current;

  const statusLabel = useMemo(() => {
    if (stage === "intro") return "Bereit";
    if (stage === "mentor") return isSpeaking ? "Spricht…" : "Bereit";
    if (stage === "user") return isRecording ? "Aufnahme…" : "Du bist dran";
    if (stage === "feedback") return "Feedback";
    return "Bereit";
  }, [stage, isRecording, isSpeaking]);

  const ringMode = useMemo(() => {
    if (isSpeaking) {
      return { scale: 1.06, start: 0.22, end: 0.05, duration: 900 };
    }
    return null;
  }, [isSpeaking]);

  useEffect(() => {
    if (!ringMode) {
      pulse.stopAnimation();
      opacity.stopAnimation();
      pulse.setValue(1);
      opacity.setValue(0);
      return;
    }
    const loop = Animated.loop(
      Animated.parallel([
        Animated.sequence([
          Animated.timing(pulse, { toValue: ringMode.scale, duration: ringMode.duration, useNativeDriver: true }),
          Animated.timing(pulse, { toValue: 1, duration: ringMode.duration, useNativeDriver: true }),
        ]),
        Animated.sequence([
          Animated.timing(opacity, { toValue: ringMode.end, duration: ringMode.duration, useNativeDriver: true }),
          Animated.timing(opacity, { toValue: ringMode.start, duration: ringMode.duration, useNativeDriver: true }),
        ]),
      ])
    );
    loop.start();
    return () => loop.stop();
  }, [ringMode, pulse, opacity]);

  const initials = name?.trim()?.[0]?.toUpperCase?.() ?? "C";

  return (
    <XStack alignItems="center" gap="$3">
      <YStack width={56} height={56} alignItems="center" justifyContent="center">
        <Animated.View
          style={{
            position: "absolute",
            width: 62,
            height: 62,
            borderRadius: 31,
            borderWidth: 4,
            borderColor: "rgba(99, 102, 241, 0.55)",
            transform: [{ scale: pulse }],
            opacity,
          }}
        />
        <YStack
          width={56}
          height={56}
          borderRadius={28}
          backgroundColor="rgba(0,0,0,0.08)"
          alignItems="center"
          justifyContent="center"
          style={{
          }}
        >
          <Text fontSize={18} fontWeight="800" color="$text">
            {initials}
          </Text>
        </YStack>
      </YStack>
      <YStack gap="$0.5">
        <Text fontWeight="800" color="$text">
          {name}
        </Text>
        <Text color="$muted" fontSize={12}>
          {statusLabel}
        </Text>
      </YStack>
    </XStack>
  );
}
