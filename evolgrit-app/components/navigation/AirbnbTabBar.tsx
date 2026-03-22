import React, { useMemo } from "react";
import { Pressable, StyleSheet, Animated } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import type { BottomTabBarProps } from "@react-navigation/bottom-tabs";
import { Feather } from "@expo/vector-icons";
import { XStack, Text } from "tamagui";

const ACTIVE = "#111827";
const INACTIVE = "#9CA3AF";
const CONTAINER_HEIGHT = 64;

const iconMap: Record<string, keyof typeof Feather.glyphMap> = {
  home: "home",
  learn: "book-open",
  speak: "mic",
  focus: "target",
  progress: "bar-chart-2",
};

export function AirbnbTabBar({ state, descriptors, navigation }: BottomTabBarProps) {
  const insets = useSafeAreaInsets();
  const paddingBottom = Math.max(insets.bottom, 10);

  const routes = useMemo(() => state.routes, [state.routes]);

  return (
    <XStack
      style={[
        styles.container,
        {
          paddingBottom,
          height: CONTAINER_HEIGHT + paddingBottom,
        },
      ]}
      alignItems="flex-start"
      paddingHorizontal={12}
      paddingTop={8}
      backgroundColor="#FFFFFF"
      borderTopWidth={StyleSheet.hairlineWidth}
      borderTopColor="rgba(17,24,39,0.08)"
      gap="$0"
    >
      {routes.map((route, index) => {
        const { options } = descriptors[route.key];
        const label =
          options.tabBarLabel !== undefined
            ? options.tabBarLabel
            : options.title !== undefined
            ? options.title
            : route.name;

        const isFocused = state.index === index;
        const iconName = iconMap[route.name] ?? "home";

        const onPress = () => {
          const event = navigation.emit({
            type: "tabPress",
            target: route.key,
            canPreventDefault: true,
          });

          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(route.name);
          }
        };

        const scale = new Animated.Value(1);

        const handlePressIn = () => {
          Animated.spring(scale, { toValue: 0.98, useNativeDriver: true, speed: 20, bounciness: 0 }).start();
        };

        const handlePressOut = () => {
          Animated.spring(scale, { toValue: 1, useNativeDriver: true, speed: 20, bounciness: 6 }).start();
        };

        return (
          <Pressable
            key={route.key}
            accessibilityRole="button"
            accessibilityState={isFocused ? { selected: true } : {}}
            accessibilityLabel={options.tabBarAccessibilityLabel}
            onPress={onPress}
            onPressIn={handlePressIn}
            onPressOut={handlePressOut}
            style={styles.item}
          >
            <Animated.View style={{ alignItems: "center", justifyContent: "center", transform: [{ scale }] }}>
              <Feather name={iconName} size={24} color={isFocused ? ACTIVE : INACTIVE} />
              <Text
                fontSize={11}
                lineHeight={13}
                marginTop={3}
                fontWeight="700"
                color={isFocused ? ACTIVE : INACTIVE}
              >
                {String(label)}
              </Text>
            </Animated.View>
          </Pressable>
        );
      })}
    </XStack>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
  },
  item: {
    flex: 1,
    minHeight: 52,
    alignItems: "center",
    justifyContent: "center",
  },
});
