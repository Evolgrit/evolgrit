import React from "react";
import { Tabs } from "expo-router";
import { AirbnbTabBar } from "../../components/navigation/AirbnbTabBar";
import { useI18n } from "../../lib/i18n";

export default function TabLayout() {
  const { t } = useI18n();
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
      }}
      tabBar={(props) => <AirbnbTabBar {...(props as any)} />}
    >
      {/* Tabs */}
      <Tabs.Screen name="home" options={{ title: t("nav.home") }} />
      <Tabs.Screen name="learn" options={{ title: t("nav.learn") }} />
      <Tabs.Screen name="speak" options={{ title: t("nav.speak") }} />
      <Tabs.Screen name="focus" options={{ title: t("nav.focus") }} />
      <Tabs.Screen name="progress" options={{ title: t("nav.progress") }} />
    </Tabs>
  );
}
