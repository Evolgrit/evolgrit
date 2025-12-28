import { Stack } from "expo-router";
import { TamaguiProvider } from "tamagui";
import config from "../tamagui.config";

export default function RootLayout() {
  return (
    <TamaguiProvider config={config}>
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="speak-v2" options={{ title: "Speaking" }} />
        <Stack.Screen name="speak-task" options={{ title: "Speaking" }} />
        <Stack.Screen name="language" options={{ title: "Language" }} />
        <Stack.Screen name="lesson" options={{ title: "Lesson" }} />
        <Stack.Screen name="mentor" options={{ headerShown: false }} />
        <Stack.Screen name="profile" options={{ title: "Profile" }} />
      </Stack>
    </TamaguiProvider>
  );
}
