import React, { useState } from "react";
import { Pressable } from "react-native";
import { Image, Stack, Text, XStack, YStack } from "tamagui";
import Animated, { useAnimatedStyle, useSharedValue, withSequence, withTiming } from "react-native-reanimated";
import { Ionicons } from "@expo/vector-icons";
import { getLessonImage } from "../../../assets/lesson-images";
import { playTtsText } from "../../../lib/tts/playText";
import { stopTts } from "../../../lib/tts/ttsPlayer";

type Option = {
  id: string;
  label: string;
  imageKey?: string | null;
  correct?: boolean;
  ttsText?: string;
  audioText?: string;
};

export function ImageAudioChoiceStep({
  prompt,
  ttsText,
  options,
  selectedId,
  reveal,
  onSelect,
}: {
  prompt: string;
  ttsText?: string;
  options: Option[];
  selectedId?: string | null;
  reveal?: boolean;
  onSelect: (id: string, correct: boolean) => void;
}) {
  const sidePad = 16;
  const gap = 12;
  const outerGapY = 14;
  const cardRadius = 18;

  const shake = useSharedValue(0);
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

  const [audioBusy, setAudioBusy] = useState(false);
  const [containerW, setContainerW] = useState(0);

  const playAudio = async (text?: string) => {
    if (!text) return;
    try {
      setAudioBusy(true);
      await playTtsText(text, "normal");
    } finally {
      setAudioBusy(false);
    }
  };

  const usableW = Math.max(0, containerW);
  const tentativeW = Math.floor((usableW - gap) / 2);
  const columns = tentativeW >= 150 ? 2 : 1;
  const cardW = columns === 2 ? tentativeW : usableW;
  const imageH = Math.round(cardW * 0.72);
  const labelH = 52;

  return (
    <YStack gap="$3" paddingHorizontal={sidePad} paddingVertical={outerGapY} backgroundColor="transparent">
      <Text fontWeight="900" color="$text" textAlign="center" fontSize={19}>
        {prompt}
      </Text>

      {ttsText ? (
        <Pressable accessibilityRole="button" onPress={() => playAudio(ttsText)} disabled={audioBusy}>
          <XStack
            alignSelf="center"
            alignItems="center"
            gap="$2"
            paddingHorizontal="$3"
            paddingVertical="$2"
            borderRadius="$5"
            backgroundColor="#F4F4F2"
          >
            <Ionicons name="volume-high" size={18} color="#111827" />
            <Text fontWeight="800" color="$text">
              Anhören
            </Text>
          </XStack>
        </Pressable>
      ) : null}

      <YStack width="100%" onLayout={(e) => setContainerW(e.nativeEvent.layout.width)} alignItems="center">
        <XStack
          width="100%"
          maxWidth={520}
          flexWrap="wrap"
          justifyContent="center"
          alignItems="center"
          columnGap={gap}
          rowGap={gap}
        >
          {options.map((opt) => {
            const isSelected = selectedId === opt.id;
            const isCorrect = !!opt.correct;
            const bg = isSelected && reveal ? (isCorrect ? "rgba(52,199,89,0.10)" : "rgba(255,59,48,0.10)") : "$background";
            const borderColor = isSelected && reveal ? (isCorrect ? "#34C759" : "#FF3B30") : "transparent";
            const source = getLessonImage(opt.imageKey);
            const optionAudio = opt.audioText ?? opt.ttsText ?? ttsText ?? opt.label;

            return (
              <Animated.View key={opt.id} style={shakeStyle}>
                <Pressable
                  accessibilityRole="button"
                  onPress={async () => {
                    await stopTts().catch(() => {});
                    onSelect(opt.id, isCorrect);
                    if (!isCorrect) triggerShake();
                  }}
                >
                  <YStack
                    width={cardW}
                    minWidth={0}
                    borderRadius={cardRadius}
                    overflow="hidden"
                    backgroundColor={bg as any}
                  borderWidth={isSelected && reveal ? 1 : 0}
                  borderColor={borderColor as any}
                  >
                    <Stack height={imageH} backgroundColor="$color2">
                      <Image source={source} width="100%" height="100%" resizeMode="cover" />
                      <Pressable
                        accessibilityRole="button"
                        onPress={(e) => {
                          e.stopPropagation?.();
                          playAudio(optionAudio);
                        }}
                        style={{ position: "absolute", right: 10, bottom: 10 }}
                      >
                        <Stack
                          width={32}
                          height={32}
                          borderRadius={16}
                          backgroundColor="rgba(255,255,255,0.9)"
                          alignItems="center"
                          justifyContent="center"
                        >
                          <Ionicons name="volume-high" size={18} color="#111827" />
                        </Stack>
                      </Pressable>
                    </Stack>
                    <YStack
                      height={labelH}
                      backgroundColor="rgba(17,24,39,0.06)"
                      alignItems="center"
                      justifyContent="center"
                      paddingHorizontal="$3"
                    >
                      <Text fontWeight="800" color="$text" textAlign="center" numberOfLines={2} ellipsizeMode="tail">
                        {opt.label}
                      </Text>
                    </YStack>
                  </YStack>
                </Pressable>
              </Animated.View>
            );
          })}
        </XStack>
      </YStack>
    </YStack>
  );
}
