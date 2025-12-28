import React from "react";
import { View } from "react-native";
import { Tabs } from "expo-router";
import { FloatingTabBar } from "../../components/FloatingTabBar";

export default function TabLayout() {
  return (
    <View style={{ flex: 1 }}>
      <Tabs
        screenOptions={{
          headerShown: false,
          tabBarStyle: { display: "none" },
        }}
      >
        <Tabs.Screen name="home" />
        <Tabs.Screen name="learn" />
        <Tabs.Screen name="speak" />
        <Tabs.Screen name="progress" />
      </Tabs>

      <FloatingTabBar />
    </View>
  );
}
