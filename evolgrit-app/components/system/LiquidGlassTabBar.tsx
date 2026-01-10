import React, { useEffect, useMemo, useState } from "react";
import { LayoutChangeEvent, Pressable, StyleSheet, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import * as Haptics from "expo-haptics";
import Animated, {
  Extrapolation,
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from "react-native-reanimated";
import type { SharedValue } from "react-native-reanimated";
import { Ionicons } from "@expo/vector-icons";
import { Text } from "tamagui";

type TabKey = "home" | "learn" | "speak" | "progress";

type TabItem = { key: TabKey; label: string; icon: keyof typeof Ionicons.glyphMap };

type AnyTabBarProps = {
  state: { index: number; routes: { key: string; name: string }[] };
  navigation: any;
};

const ACTIVE = "#111827";
const INACTIVE = "rgba(17,24,39,0.45)";
const BORDER = "rgba(17,24,39,0.08)";
const TAB_COUNT = 4;
const PADDING_H = 14;
const CAPSULE_INSET = 6;

export default function LiquidGlassTabBar({ state, navigation }: AnyTabBarProps) {
  const insets = useSafeAreaInsets();
  const [barWidth, setBarWidth] = useState(0);

  const tabs: TabItem[] = useMemo(
    () => [
      { key: "home", label: "Home", icon: "home-outline" },
      { key: "learn", label: "Learn", icon: "book-outline" },
      { key: "speak", label: "Speak", icon: "mic-outline" },
      { key: "progress", label: "Progress", icon: "trending-up-outline" },
    ],
    []
  );

  const activeIndex = useMemo(() => {
    const name = state.routes[state.index]?.name as TabKey | undefined;
    const idx = tabs.findIndex((t) => t.key === name);
    return Math.max(0, idx);
  }, [state.index, state.routes, tabs]);

  const capsuleX: SharedValue<number> = useSharedValue(0);
  const capsuleScale: SharedValue<number> = useSharedValue(1);

  const onLayout = (e: LayoutChangeEvent) => setBarWidth(e.nativeEvent.layout.width);

  useEffect(() => {
    if (!barWidth) return;
    const innerW = barWidth - PADDING_H * 2;
    const segmentW = innerW / TAB_COUNT;
    const target = PADDING_H + activeIndex * segmentW + CAPSULE_INSET;
    capsuleX.value = withSpring(target, { damping: 16, stiffness: 200, mass: 0.9 });
    capsuleScale.value = withTiming(1.03, { duration: 140 }, () => {
      capsuleScale.value = withTiming(1, { duration: 140 });
    });
  }, [activeIndex, barWidth, capsuleX, capsuleScale]);

  const capsuleStyle = useAnimatedStyle(() => {
    const innerW = barWidth - PADDING_H * 2;
    const segmentW = innerW / TAB_COUNT;
    const width = Math.max(segmentW - CAPSULE_INSET * 2, 0);
    return {
      width,
      transform: [{ translateX: capsuleX.value }, { scale: capsuleScale.value }],
    };
  }, [barWidth]);

  return (
    <View pointerEvents="box-none" style={[styles.wrap, { paddingBottom: Math.max(insets.bottom, 12) }]}>
      <View style={styles.shadowWrap}>
        <View onLayout={onLayout} style={styles.bar}>
          {barWidth > 0 && <Animated.View style={[styles.capsule, capsuleStyle]} />}

          <View style={[styles.row, { paddingHorizontal: PADDING_H }]}>
            {tabs.map((tab, idx) => {
              const isActive = idx === activeIndex;
              return (
                <TabButton
                  key={tab.key}
                  icon={tab.icon}
                  label={tab.label}
                  active={isActive}
                  onPress={() => {
                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
                    navigation.navigate(tab.key);
                  }}
                />
              );
            })}
          </View>
        </View>
      </View>
    </View>
  );
}

function TabButton({
  icon,
  label,
  active,
  onPress,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  active: boolean;
  onPress: () => void;
}) {
  const pressSV = useSharedValue(0);

  const aStyle = useAnimatedStyle(() => {
    const scale = interpolate(pressSV.value, [0, 1], [1, 0.97], Extrapolation.CLAMP);
    const ty = interpolate(active ? 1 : 0, [0, 1], [0, -1.5]);
    const opacity = interpolate(active ? 1 : 0, [0, 1], [0.65, 1]);
    return { transform: [{ scale }, { translateY: ty }], opacity };
  }, [active]);

  return (
    <Pressable
      onPress={onPress}
      onPressIn={() => (pressSV.value = withTiming(1, { duration: 120 }))}
      onPressOut={() => (pressSV.value = withTiming(0, { duration: 160 }))}
      style={styles.tabBtn}
    >
      <Animated.View style={[styles.item, aStyle]}>
        <Ionicons name={icon} size={22} color={active ? ACTIVE : INACTIVE} />
        <Text fontSize={11} fontWeight="700" color={active ? ACTIVE : INACTIVE} marginTop={3}>
          {label}
        </Text>
      </Animated.View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  wrap: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    paddingHorizontal: 16,
    backgroundColor: "transparent",
  },
  shadowWrap: {
    shadowColor: "#111827",
    shadowOpacity: 0.08,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 8 },
  },
  bar: {
    height: 68,
    borderRadius: 26,
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: BORDER,
    shadowColor: "#111827",
    shadowOpacity: 0.06,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
  },
  capsule: {
    position: "absolute",
    top: 8,
    bottom: 8,
    left: PADDING_H + CAPSULE_INSET,
    borderRadius: 18,
    backgroundColor: "rgba(0,0,0,0.05)",
  },
  row: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 6,
  },
  tabBtn: {
    flex: 1,
    height: 56,
    alignItems: "center",
    justifyContent: "center",
  },
  item: {
    height: 56,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
  },
});
