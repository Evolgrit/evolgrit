import React, { useState } from "react";
import { Stack } from "expo-router";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { TamaguiProvider } from "tamagui";
import { PortalProvider } from "@tamagui/portal";
import config from "../tamagui.config";
import { IntroSplash } from "../components/system/IntroSplash";

export default function RootLayout() {
  const [showIntro, setShowIntro] = useState(true);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <TamaguiProvider config={config} defaultTheme="light">
        <PortalProvider>
          <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen name="(tabs)" />
            <Stack.Screen
              name="chat/index"
              options={{
                headerShown: false,
                presentation: "card",
                gestureEnabled: true,
              }}
            />
            <Stack.Screen
              name="chat/[threadId]"
              options={{
                headerShown: false,
                presentation: "card",
                gestureEnabled: true,
              }}
            />
            <Stack.Screen name="chat/details" />
          </Stack>
          {showIntro ? (
            <IntroSplash durationMs={1050} onDone={() => setShowIntro(false)} />
          ) : null}
        </PortalProvider>
      </TamaguiProvider>
    </GestureHandlerRootView>
  );
}
