import React from "react";
import { Pressable, StyleSheet, Image } from "react-native";
import Animated, { SharedValue } from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Stack, XStack, Button } from "tamagui";
import { Feather } from "@expo/vector-icons";

type Props = {
  scrollY: SharedValue<number>;
  avatarUri?: string | null;
  onPressAvatar?: () => void;
  onPressChat?: () => void;
};

const AnimatedStack = Animated.createAnimatedComponent(Stack);

export default function CollapsingGlassHeaderTamagui({
  scrollY,
  avatarUri,
  onPressAvatar,
  onPressChat,
}: Props) {
  const insets = useSafeAreaInsets();
  const topPad = insets.top + 6;

  return (
    <AnimatedStack
      style={[styles.headerAbs, { top: 0, left: 0, right: 0, height: insets.top + 44, backgroundColor: "transparent", borderWidth: 0 }]}
      pointerEvents="box-none"
    >
      <XStack
        position="absolute"
        top={topPad}
        left={16}
        right={16}
        alignItems="center"
        height={44}
        pointerEvents="box-none"
      >
        <Pressable onPress={onPressAvatar} hitSlop={12} style={styles.avatarWrap}>
          {avatarUri ? (
            <Image source={{ uri: avatarUri }} style={styles.avatarImg} />
          ) : (
            <Stack style={styles.avatarFallback} />
          )}
        </Pressable>

        <Stack flex={1} />

        <Button
          size="$3"
          circular
          unstyled
          onPress={onPressChat}
          pressStyle={{ opacity: 0.9 }}
          backgroundColor="transparent"
          borderWidth={0}
          padding={6}
          opacity={0.75}
        >
          <Feather name="message-square" size={20} color="#111827" />
        </Button>
      </XStack>
    </AnimatedStack>
  );
}

const styles = StyleSheet.create({
  headerAbs: {
    position: "absolute",
    left: 0,
    right: 0,
    top: 0,
    zIndex: 50,
    backgroundColor: "transparent",
    borderWidth: 0,
  },
  avatarWrap: {
    width: 36,
    height: 36,
    borderRadius: 999,
    overflow: "hidden",
    backgroundColor: "rgba(255,255,255,0.9)",
    borderWidth: 1,
    borderColor: "rgba(0,0,0,0.06)",
  },
  avatarImg: {
    width: 36,
    height: 36,
    borderRadius: 999,
  },
  avatarFallback: {
    width: 36,
    height: 36,
    borderRadius: 999,
    backgroundColor: "rgba(17,24,39,0.10)",
    borderWidth: 1,
    borderColor: "rgba(17,24,39,0.06)",
  },
  pillIcon: {
    width: 40,
    height: 36,
    borderRadius: 999,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "transparent",
  },
});
