import React, { useState } from "react";
import { Pressable } from "react-native";
import { Image, Stack, Text, YStack } from "tamagui";
import Animated, { useAnimatedStyle, useSharedValue, withSequence, withTiming } from "react-native-reanimated";
import Ionicons from "@expo/vector-icons/Ionicons";
import { LESSON_IMAGES } from "../../../assets/lesson-images";
import { playTtsText } from "../../../lib/tts/playText";
import { stopTts } from "../../../lib/tts/ttsPlayer";
import { SoftButton } from "../../system/SoftButton";

type Choice = { id: string; label: string; correct?: boolean };

export function ClozeAudioChoiceStep({
  prompt,
  ttsText,
  sentence,
  translation,
  imageKey,
  choices,
  selectedId,
  reveal,
  onSelect,
}: {
  prompt: string;
  ttsText?: string;
  sentence: { before?: string; after?: string };
  translation?: string;
  imageKey?: string | null;
  choices: Choice[];
  selectedId?: string | null;
  reveal?: boolean;
  onSelect: (id: string, correct: boolean) => void;
}) {
  const dangerBg = "rgba(255,59,48,0.10)";
  const successBg = "rgba(52,199,89,0.10)";
  const shake = useSharedValue(0);
  const [audioBusy, setAudioBusy] = useState(false);

  const shakeStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: shake.value }],
  }));
  const triggerShake = () => {
    shake.value = 0;
    shake.value = withSequence(
      withTiming(-8, { duration: 60 }),
      withTiming(8, { duration: 60 }),
      withTiming(-4, { duration: 60 }),
      withTiming(0, { duration: 60 })
    );
  };

  const playAudio = async () => {
    if (!ttsText) return;
    try {
      setAudioBusy(true);
      await playTtsText(ttsText, "normal");
    } finally {
      setAudioBusy(false);
    }
  };

  const source = imageKey ? LESSON_IMAGES[imageKey] : null;
  if (imageKey && !source) {
    console.warn(`[lesson] Missing image key ${imageKey}`);
  }

  return (
    <YStack gap="$3" backgroundColor="$background">
      <Text fontWeight="900" color="$text" textAlign="center">
        {prompt}
      </Text>

      {ttsText ? (
        <Pressable accessibilityRole="button" onPress={playAudio} disabled={audioBusy}>
          <Stack
            alignSelf="center"
            paddingHorizontal="$3"
            paddingVertical="$2"
            borderRadius="$5"
            backgroundColor="#F4F4F2"
            alignItems="center"
            justifyContent="center"
            gap="$2"
            flexDirection="row"
          >
            <Ionicons name="volume-medium-outline" size={18} color="#111827" />
            <Text fontWeight="800" color="$text">
              Anhören
            </Text>
          </Stack>
        </Pressable>
      ) : null}

      {source ? (
        <Stack
          height={180}
          borderRadius={18}
          overflow="hidden"
        >
          <Image source={source} width="100%" height="100%" resizeMode="cover" />
        </Stack>
      ) : imageKey ? (
        <Stack
          height={180}
          borderRadius={18}
          overflow="hidden"
          alignItems="center"
          justifyContent="center"
          backgroundColor="$color3"
        >
          <Text color="$muted">Bild fehlt</Text>
        </Stack>
      ) : null}

      <YStack gap="$2" padding="$3" backgroundColor="$background" borderRadius="$5">
        <Text color="$text" fontSize={18} fontWeight="800" textAlign="center">
          {sentence.before ?? ""}{" "}
          <Text
            color={reveal ? (choices.find((c) => c.id === selectedId && c.correct)?.id ? "#34C759" : "#FF3B30") : "$muted"}
            fontWeight="900"
          >
            {reveal && selectedId
              ? choices.find((c) => c.id === selectedId)?.label ?? "____"
              : "____"}
          </Text>{" "}
          {sentence.after ?? ""}
        </Text>
        {translation ? (
          <Text color="$muted" textAlign="center">
            {translation}
          </Text>
        ) : null}
      </YStack>

      <YStack gap="$2">
        {choices.map((c) => {
          const isSelected = selectedId === c.id;
          const isCorrect = !!c.correct;
          const bg = isSelected && reveal ? (isCorrect ? successBg : dangerBg) : "rgba(0,0,0,0.04)";
          return (
            <Animated.View key={c.id} style={shakeStyle}>
              <SoftButton
                label={c.label}
                onPress={async () => {
                  await stopTts().catch(() => {});
                  onSelect(c.id, isCorrect);
                  if (!isCorrect) triggerShake();
                }}
                backgroundColor={bg as any}
                minHeight={48}
                paddingHorizontal="$4"
              />
            </Animated.View>
          );
        })}
      </YStack>
    </YStack>
  );
}
