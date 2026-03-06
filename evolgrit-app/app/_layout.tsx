// app/_layout.tsx
// Wrap the app with I18nProvider using uiLocale from user settings

import React from "react";
import { Stack } from "expo-router";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { TamaguiProvider } from "tamagui";
import config from "../tamagui.config";
import { PortalProvider } from "@tamagui/portal";
import { Text, View } from "react-native";
import { useFonts } from "expo-font";
import {
  Inter_400Regular,
  Inter_500Medium,
  Inter_600SemiBold,
  Inter_700Bold,
} from "@expo-google-fonts/inter";
import { Fraunces_600SemiBold } from "@expo-google-fonts/fraunces";

import { I18nProvider } from "../lib/i18n";
import { useUserSettings } from "../lib/userSettings";
import { IntroSplash } from "../components/system/IntroSplash";

export default function RootLayout() {
  const { uiLocale } = useUserSettings();
  const [showIntro, setShowIntro] = React.useState(true);
  const [fontsLoaded] = useFonts({
    Inter_400Regular,
    Inter_500Medium,
    Inter_600SemiBold,
    Inter_700Bold,
    Fraunces_600SemiBold,
  });

  if (!fontsLoaded) {
    return (
      <GestureHandlerRootView style={{ flex: 1 }}>
        <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
          <Text>Loading…</Text>
        </View>
      </GestureHandlerRootView>
    );
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <TamaguiProvider config={config} defaultTheme="light">
        <PortalProvider>
          <I18nProvider uiLocale={uiLocale}>
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
          </I18nProvider>
        </PortalProvider>
      </TamaguiProvider>
    </GestureHandlerRootView>
  );
}
