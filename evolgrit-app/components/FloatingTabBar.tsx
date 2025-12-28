import React, { useMemo, useRef } from "react";
import { View, Pressable, Animated, Text, StyleSheet } from "react-native";
import { BlurView } from "expo-blur";
import { Ionicons } from "@expo/vector-icons";
import { usePathname, useRouter } from "expo-router";
import * as Haptics from "expo-haptics";
import { useSafeAreaInsets } from "react-native-safe-area-context";

type Item = {
  route: "/(tabs)/home" | "/(tabs)/learn" | "/(tabs)/speak" | "/(tabs)/progress";
  icon: any;
  label: string;
};

function TabIcon({
  active,
  icon,
  label,
  onPress,
}: {
  active: boolean;
  icon: any;
  onPress: () => void;
  label: string;
}) {
  const s = useRef(new Animated.Value(1)).current;

  const pressIn = () => {
    Animated.spring(s, { toValue: 0.92, useNativeDriver: true, speed: 30, bounciness: 0 }).start();
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
  };

  const pressOut = () => {
    Animated.spring(s, { toValue: 1, useNativeDriver: true, speed: 30, bounciness: 8 }).start();
  };

  return (
    <Pressable onPress={onPress} onPressIn={pressIn} onPressOut={pressOut} hitSlop={10}>
      <Animated.View
        style={{
          transform: [{ scale: s }],
          minWidth: 60,
          paddingHorizontal: 10,
          height: 44,
          borderRadius: 18,
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: active ? "rgba(17,24,39,0.08)" : "transparent",
          borderWidth: active ? 1 : 0,
          borderColor: active ? "rgba(17,24,39,0.10)" : "transparent",
        }}
      >
        <Ionicons name={icon} size={22} color={active ? "#111827" : "rgba(17,24,39,0.40)"} />
        <Text style={{ marginTop: 2, fontSize: 11, fontWeight: "700", color: active ? "#111827" : "rgba(17,24,39,0.55)" }}>
          {label}
        </Text>
      </Animated.View>
    </Pressable>
  );
}

export function FloatingTabBar() {
  const router = useRouter();
  const path = usePathname();
  const insets = useSafeAreaInsets();

  const items: Item[] = useMemo(
    () => [
      { route: "/(tabs)/home", icon: "home-outline", label: "Home" },
      { route: "/(tabs)/learn", icon: "book-outline", label: "Learn" },
      { route: "/(tabs)/speak", icon: "mic-outline", label: "Speak" },
      { route: "/(tabs)/progress", icon: "analytics-outline", label: "Progress" },
    ],
    []
  );

  return (
    <View
      pointerEvents="box-none"
      style={{
        position: "absolute",
        left: 0,
        right: 0,
        bottom: 0,
        alignItems: "center",
      }}
    >
      <View
        style={{
          position: "absolute",
          left: 24,
          right: 24,
          bottom: Math.max(12, insets.bottom + 6),
          height: 52,
          borderRadius: 26,
          overflow: "hidden",
          shadowColor: "#000",
          shadowOpacity: 0.06,
          shadowRadius: 16,
          shadowOffset: { width: 0, height: 10 },
        }}
      >
        <BlurView intensity={24} tint="light" style={StyleSheet.absoluteFill} />
        <View style={[StyleSheet.absoluteFill, { backgroundColor: "rgba(255,255,255,0.70)" }]} />
        <View style={[StyleSheet.absoluteFill, { borderWidth: 1, borderColor: "rgba(17,24,39,0.04)", borderRadius: 26 }]} />

        <View style={{ flex: 1, flexDirection: "row", justifyContent: "space-between", paddingHorizontal: 14, alignItems: "center" }}>
          {items.map((it) => {
            const active = path === it.route;
            return (
              <TabIcon
                key={it.route}
                active={active}
                icon={it.icon}
                label={it.label}
                onPress={() => {
                  if (!active) router.push(it.route);
                }}
              />
            );
          })}
        </View>
      </View>
    </View>
  );
}
