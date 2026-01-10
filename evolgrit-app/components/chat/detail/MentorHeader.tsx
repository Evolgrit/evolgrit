import React from "react";
import { Alert, Image } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { XStack, YStack, Text, Button, Stack } from "tamagui";
import { Feather } from "@expo/vector-icons";
import { NavBackButton } from "../../system/NavBackButton";

type Props = {
  avatarUri?: string | null;
  title?: string;
  subtitle?: string;
  onPressDetails?: () => void;
};

export function MentorHeader({ avatarUri, title = "Stanley", subtitle = "from Evolgrit", onPressDetails }: Props) {
  const insets = useSafeAreaInsets();

  return (
    <XStack paddingTop={insets.top + 6} paddingHorizontal={16} paddingBottom={10} alignItems="center" justifyContent="space-between">
      <NavBackButton fallbackRoute="/(tabs)/home" />

      <Button
        unstyled
        flex={1}
        marginLeft={12}
        alignItems="center"
        justifyContent="flex-start"
        gap="$2"
        padding={0}
        onPress={onPressDetails}
      >
        <XStack alignItems="center" gap="$2">
          {avatarUri ? (
            <Image source={{ uri: avatarUri }} style={{ width: 36, height: 36, borderRadius: 18 }} />
          ) : (
            <Stack width={36} height={36} borderRadius={18} backgroundColor="rgba(0,0,0,0.08)" />
          )}
          <YStack>
            <Text fontSize={16} fontWeight="800" color="$text">
              {title}
            </Text>
            {subtitle ? (
              <Text fontSize={12} color="$muted">
                {subtitle}
              </Text>
            ) : null}
          </YStack>
        </XStack>
      </Button>

      <XStack gap="$2">
        <Button
          unstyled
          width={40}
          height={40}
          borderRadius={20}
          alignItems="center"
          justifyContent="center"
          onPress={() => Alert.alert("Coming soon", "Videoanruf folgt bald.")}
        >
          <Feather name="video" size={18} color="#111827" />
        </Button>
        <Button
          unstyled
          width={40}
          height={40}
          borderRadius={20}
          alignItems="center"
          justifyContent="center"
          onPress={() => Alert.alert("Coming soon", "Audioanruf folgt bald.")}
        >
          <Feather name="phone" size={18} color="#111827" />
        </Button>
        <Button unstyled width={40} height={40} borderRadius={20} alignItems="center" justifyContent="center" onPress={onPressDetails}>
          <Feather name="info" size={18} color="#111827" />
        </Button>
      </XStack>
    </XStack>
  );
}
