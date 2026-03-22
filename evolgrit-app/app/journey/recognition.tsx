import React from "react";
import { ScrollView } from "react-native";
import { Text, YStack } from "tamagui";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function JourneyRecognition() {
  const insets = useSafeAreaInsets();
  return (
    <ScrollView contentContainerStyle={{ paddingBottom: 24 }}>
      <YStack padding="$4" gap="$3" paddingTop={insets.top + 12}>
        <Text fontSize={24} fontWeight="800" color="$text">Recognition</Text>
        <Text color="$muted">Coming soon.</Text>
      </YStack>
    </ScrollView>
  );
}
