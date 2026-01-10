import React from "react";
import type { ImageSourcePropType } from "react-native";
import { Pressable } from "react-native";
import { YStack, Text, Image, XStack } from "tamagui";

type Props = {
  image: ImageSourcePropType;
  title: string;
  subtitle: string;
  onPress: () => void;
};

export function LearnTrackCard({ image, title, subtitle, onPress }: Props) {
  return (
    <Pressable onPress={onPress} style={({ pressed }) => ({ opacity: pressed ? 0.92 : 1 })}>
      <XStack
        borderRadius="$6"
        height={112}
        backgroundColor="rgba(255,255,255,0.94)"
        padding={0}
        alignItems="stretch"
        overflow="hidden"
        shadowColor="#000"
        shadowOpacity={0.03}
        shadowRadius={6}
        shadowOffset={{ width: 0, height: 2 }}
        elevation={0}
      >
        <YStack width={132} height="100%" overflow="hidden" backgroundColor="$color2">
          <Image
            source={image}
            width="100%"
            height="100%"
            resizeMode="cover"
          />
        </YStack>

        <YStack
          flex={1}
          minWidth={0}
          paddingHorizontal={14}
          paddingVertical={12}
          justifyContent="center"
          gap="$1"
        >
          <Text fontSize={18} fontWeight="600" color="$text" numberOfLines={1}>
            {title}
          </Text>
          <Text fontSize={14} color="$muted" numberOfLines={2} ellipsizeMode="tail">
            {subtitle}
          </Text>
        </YStack>
      </XStack>
    </Pressable>
  );
}
