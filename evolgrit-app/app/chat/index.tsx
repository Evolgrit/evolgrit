import React, { useEffect } from "react";
import { YStack, Text } from "tamagui";
import { useRouter } from "expo-router";

export default function ChatRedirect() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/chat/mentor-default");
  }, [router]);

  return (
    <YStack flex={1} alignItems="center" justifyContent="center" backgroundColor="$background">
      <Text color="$muted">Opening chat…</Text>
    </YStack>
  );
}
