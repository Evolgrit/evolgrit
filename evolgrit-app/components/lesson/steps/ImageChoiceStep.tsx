import React, { useMemo, useState } from "react";
import { LayoutChangeEvent, Pressable } from "react-native";
import { YStack, Text, XStack, Image } from "tamagui";
import { lessonType } from "@/design/typography";
import Animated, { useAnimatedStyle, useSharedValue, withSequence, withTiming } from "react-native-reanimated";
import { LESSON_IMAGES } from "../../../assets/lesson-images";

type Option = { id: string; label: string; imageKey?: string | null; correct?: boolean };

export function ImageChoiceStep({
  prompt,
  options,
  onSelect,
  selectedId,
  reveal,
}: {
  prompt: string;
  options: Option[];
  selectedId?: string | null;
  reveal?: boolean;
  onSelect: (id: string, correct: boolean) => void;
}) {
  const dangerBg = "rgba(255,59,48,0.10)";
  const dangerBorder = "#FF3B30";
  const successBg = "rgba(52,199,89,0.10)";
  const successBorder = "#34C759";
  const shake = useSharedValue(0);
  const shakeStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: shake.value }],
  }));
  const triggerShake = () => {
    shake.value = 0;
    shake.value = withSequence(
      withTiming(-6, { duration: 60 }),
      withTiming(6, { duration: 60 }),
      withTiming(-4, { duration: 60 }),
      withTiming(0, { duration: 60 })
    );
  };
  const sidePad = 16;
  const gap = 12;
  const outerGapY = 14;
  const cardRadius = 18;

  const [containerW, setContainerW] = useState(0);

  const { cardW, imageH } = useMemo(() => {
    const usableW = Math.max(0, containerW);
    const tentativeW = Math.floor((usableW - gap) / 2);
    const cols = tentativeW >= 150 ? 2 : 1;
    const widthPerCard = cols === 2 ? tentativeW : usableW;
    return {
      cardW: widthPerCard,
      imageH: Math.round(widthPerCard * 0.72),
    };
  }, [containerW, gap]);

  const getImageSource = (key?: string | null) => {
    if (!key) return null;
    const source = LESSON_IMAGES[key];
    if (!source) {
      console.warn(`[lesson] Missing image for key=${key}`);
      return null;
    }
    return source;
  };

  return (
    <YStack gap={outerGapY} flex={1} alignItems="center" paddingHorizontal={sidePad} backgroundColor="transparent">
      <Text {...lessonType.prompt} color="$text" textAlign="center">
        {prompt}
      </Text>
      <YStack width="100%" maxWidth={520} alignItems="center" onLayout={(e: LayoutChangeEvent) => setContainerW(e.nativeEvent.layout.width)}>
        <XStack flexWrap="wrap" gap={gap} justifyContent="center" alignItems="center">
        {options.map((opt) => {
          const isSelected = selectedId === opt.id;
          const isCorrect = !!opt.correct;
          const bg = isSelected && reveal ? (isCorrect ? successBg : dangerBg) : "$background";
          const border = isSelected && reveal ? (isCorrect ? successBorder : dangerBorder) : "transparent";
          const source = getImageSource(opt.imageKey);

          return (
            <Animated.View key={opt.id} style={shakeStyle}>
              <Pressable
                accessibilityRole="button"
                onPress={() => {
                  onSelect(opt.id, isCorrect);
                  if (!isCorrect) triggerShake();
                }}
              >
                <YStack
                  width={cardW}
                  borderRadius={cardRadius}
                  backgroundColor={bg as any}
                  borderWidth={isSelected && reveal ? 1 : 0}
                  borderColor={border as any}
                  overflow="hidden"
                >
                  <YStack height={imageH} backgroundColor="$color2">
                    {source ? (
                      <Image source={source} width="100%" height="100%" resizeMode="cover" />
                    ) : (
                      <YStack flex={1} alignItems="center" justifyContent="center" backgroundColor="$color3">
                        <Text color="$muted" fontSize={lessonType.muted.fontSize} lineHeight={lessonType.muted.lineHeight} fontWeight={lessonType.muted.fontWeight}>
                          Bild fehlt
                        </Text>
                      </YStack>
                    )}
                  </YStack>
                    <YStack
                      minHeight={52}
                      paddingVertical={12}
                      paddingHorizontal="$3"
                      alignItems="center"
                      justifyContent="center"
                      backgroundColor="rgba(17,24,39,0.06)"
                    >
                    <Text
                      {...lessonType.button}
                      color="$text"
                      textAlign="center"
                      numberOfLines={2}
                      ellipsizeMode="tail"
                      flexShrink={1}
                    >
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
