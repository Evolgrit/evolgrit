import React from "react";
import { Button } from "tamagui";
import { useRouter } from "expo-router";
import { useNavigationState, type NavigationState } from "@react-navigation/native";
import { Feather } from "@expo/vector-icons";

type Props = {
  onPress?: () => void;
  fallbackRoute?: string;
};

/**
 * Consistent header back button (light-only, Tamagui).
 * - Circular, subtle background using tokens.
 * - Uses smart back: router.back() if possible, else replace to fallbackRoute.
 */
export function NavBackButton({ onPress, fallbackRoute = "/(tabs)/home" }: Props) {
  const router = useRouter();
  const canGoBack = useNavigationState((state: NavigationState | undefined) => (state?.routes?.length ?? 0) > 1);

  const handlePress = () => {
    if (onPress) {
      onPress();
      return;
    }
    if (canGoBack) {
      router.back();
    } else {
      router.replace(fallbackRoute as any);
    }
  };

  return (
    <Button
      unstyled
      width={40}
      height={40}
      borderRadius={999}
      backgroundColor="$card"
      borderColor="$border"
      borderWidth={1}
      alignItems="center"
      justifyContent="center"
      shadowColor="rgba(0,0,0,0.08)"
      shadowRadius={10}
      shadowOffset={{ width: 0, height: 4 }}
      pressStyle={{ scale: 0.97, opacity: 0.9 }}
      onPress={handlePress}
      accessibilityLabel="Zurück"
    >
      <Feather name="chevron-left" size={18} color="#111827" />
    </Button>
  );
}
