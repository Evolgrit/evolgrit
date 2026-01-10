import React, { useEffect, useMemo, useState } from "react";
import { LayoutChangeEvent, Pressable, StyleSheet, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import * as Haptics from "expo-haptics";
import Animated, {
  Extrapolation,
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { Ionicons } from "@expo/vector-icons";
import { Text } from "tamagui";

type AnyTabBarProps = {
  state: { index: number; routes: { key: string; name: string }[] };
  navigation: any;
};

type TabItem = { name: string; label: string; icon: keyof typeof Ionicons.glyphMap; activeIcon: keyof typeof Ionicons.glyphMap };

const ACTIVE = "#111827";
const INACTIVE = "rgba(17,24,39,0.45)";
const BORDER = "rgba(17,24,39,0.06)";
const HEIGHT = 64;
const RADIUS = 32;
const CAP_HEIGHT = 48;
const CAP_RADIUS = 24;
const PADDING_H = 12;
const TAB_COUNT = 4;

export default function LiquidSegmentedTabBar({ state, navigation }: AnyTabBarProps) {
  const insets = useSafeAreaInsets();
  const [barWidth, setBarWidth] = useState(0);

  const tabs: TabItem[] = useMemo(
    () => [
      { name: "home", label: "Home", icon: "home-outline", activeIcon: "home" },
      { name: "learn", label: "Learn", icon: "book-outline", activeIcon: "book" },
      { name: "speak", label: "Speak", icon: "mic-outline", activeIcon: "mic" },
      { name: "progress", label: "Progress", icon: "stats-chart-outline", activeIcon: "stats-chart" },
    ],
    []
  );

  const activeIndex = useMemo(() => {
    const name = state.routes[state.index]?.name;
    const idx = tabs.findIndex((t) => t.name === name);
    return Math.max(0, idx);
  }, [state.index, state.routes, tabs]);

  const capX = useSharedValue(0);
  const capScale = useSharedValue(1);

  const onLayout = (e: LayoutChangeEvent) => setBarWidth(e.nativeEvent.layout.width);

  useEffect(() => {
    if (!barWidth) return;
    const segmentWidth = barWidth / TAB_COUNT;
    const targetX = activeIndex * segmentWidth;
    capX.value = withTiming(targetX, { duration: 240 });
    capScale.value = withTiming(1.03, { duration: 140 }, () => {
      capScale.value = withTiming(1, { duration: 180 });
    });
  }, [activeIndex, barWidth, capX, capScale]);

  const capsuleStyle = useAnimatedStyle(() => {
    const segmentWidth = barWidth / TAB_COUNT;
    const width = Math.max(segmentWidth - PADDING_H * 2, 0);
    return {
      width,
      transform: [{ translateX: capX.value + PADDING_H }, { scale: capScale.value }],
    };
  }, [barWidth]);

  return (
    <View pointerEvents="box-none" style={[styles.wrap, { paddingBottom: Math.max(insets.bottom + 12, 12) }]}>
      <View style={styles.shadowWrap}>
        <View onLayout={onLayout} style={styles.bar}>
          {barWidth > 0 && (
            <Animated.View style={[styles.capsule, capsuleStyle]}>
            </Animated.View>
          )}

          <View style={styles.row}>
            {tabs.map((tab, idx) => {
              const active = idx === activeIndex;
              return (
                <TabButton
                  key={tab.name}
                  active={active}
                  label={tab.label}
                  icon={active ? tab.activeIcon : tab.icon}
                  onPress={() => {
                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
                    navigation.navigate(tab.name);
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
  active,
  icon,
  label,
  onPress,
}: {
  active: boolean;
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  onPress: () => void;
}) {
  const press = useSharedValue(0);

  const aStyle = useAnimatedStyle(() => {
    const scale = interpolate(press.value, [0, 1], [1, 0.96], Extrapolation.CLAMP);
    const ty = interpolate(active ? 1 : 0, [0, 1], [0, -1.5]);
    const opacity = interpolate(active ? 1 : 0, [0, 1], [0.65, 1]);
    return { transform: [{ scale }, { translateY: ty }], opacity };
  }, [active]);

  return (
    <Pressable
      onPress={onPress}
      onPressIn={() => (press.value = withTiming(1, { duration: 120 }))}
      onPressOut={() => (press.value = withTiming(0, { duration: 160 }))}
      style={styles.tabBtn}
    >
      <Animated.View style={[styles.item, aStyle]}>
        <Ionicons name={icon} size={20} color={active ? ACTIVE : INACTIVE} />
        <Text fontSize={11} fontWeight="700" color={active ? ACTIVE : INACTIVE} marginTop={2}>
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
    height: HEIGHT,
    borderRadius: RADIUS,
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
    top: (HEIGHT - CAP_HEIGHT) / 2,
    height: CAP_HEIGHT,
    borderRadius: CAP_RADIUS,
    left: 0,
    backgroundColor: "rgba(0,0,0,0.04)",
  },
  row: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: PADDING_H,
  },
  tabBtn: {
    flex: 1,
    height: HEIGHT,
    alignItems: "center",
    justifyContent: "center",
  },
  item: {
    height: HEIGHT,
    alignItems: "center",
    justifyContent: "center",
  },
});
