import React from "react";
import { Tabs } from "expo-router";
import { AirbnbTabBar } from "../../components/navigation/AirbnbTabBar";

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
      }}
      tabBar={(props) => <AirbnbTabBar {...(props as any)} />}
    >
      {/* Tabs */}
      <Tabs.Screen name="home" options={{ title: "Home" }} />
      <Tabs.Screen name="learn" options={{ title: "Learn" }} />
      <Tabs.Screen name="speak" options={{ title: "Speak" }} />
      <Tabs.Screen name="focus" options={{ title: "Focus" }} />
      <Tabs.Screen name="progress" options={{ title: "Progress" }} />
    </Tabs>
  );
}
