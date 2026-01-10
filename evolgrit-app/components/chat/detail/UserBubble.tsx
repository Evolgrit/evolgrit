import React from "react";
import { YStack, Text, Image, Stack } from "tamagui";
import { ActivityIndicator, Pressable, StyleSheet } from "react-native";

export function UserBubble({
  text,
  imageUri,
  localUri,
  status,
  timestamp,
  onRetry,
}: {
  text: string;
  imageUri?: string | null;
  localUri?: string | null;
  status?: "pending" | "sent" | "failed";
  timestamp?: string;
  onRetry?: () => void;
}) {
  const isImage = !!imageUri || !!localUri;
  const showText = !!text;
  const uri = imageUri || localUri || undefined;

  if (isImage) {
    return (
      <YStack alignSelf="flex-end" maxWidth={280} gap="$1" marginVertical={6} marginHorizontal={16}>
        <Pressable onPress={status === "failed" ? onRetry : undefined}>
          <Stack
            position="relative"
            opacity={status === "pending" ? 0.86 : 1}
            borderRadius={18}
            overflow="hidden"
            backgroundColor="#F2F2F7"
            borderWidth={StyleSheet.hairlineWidth}
            borderColor="rgba(17,24,39,0.10)"
            shadowColor="transparent"
            shadowOpacity={0}
            shadowRadius={0}
            shadowOffset={{ width: 0, height: 0 }}
          >
            {uri ? (
              <Image
                source={{ uri }}
                width={280}
                height={180}
                resizeMode="cover"
                backgroundColor="#F2F2F7"
              />
            ) : null}
            {status === "pending" ? (
              <Stack
                position="absolute"
                top={8}
                right={8}
                padding={6}
                borderRadius={12}
                backgroundColor="rgba(0,0,0,0.35)"
                alignItems="center"
                justifyContent="center"
              >
                <ActivityIndicator size="small" color="#fff" />
              </Stack>
            ) : null}
            {status === "failed" ? (
              <Stack position="absolute" bottom={6} left={0} right={0} alignItems="center" justifyContent="center">
                <Text color="#fff" fontSize={12}>
                  Upload fehlgeschlagen · tippen zum Retry
                </Text>
              </Stack>
            ) : null}
            {timestamp ? (
              <Stack
                position="absolute"
                bottom={8}
                right={8}
                paddingHorizontal={8}
                paddingVertical={4}
                borderRadius={10}
                backgroundColor="rgba(0,0,0,0.22)"
              >
                <Text fontSize={12} lineHeight={14} fontWeight="500" color="rgba(255,255,255,0.92)">
                  {timestamp}
                </Text>
              </Stack>
            ) : null}
          </Stack>
        </Pressable>
      </YStack>
    );
  }

  return (
    <YStack
      alignSelf="flex-end"
      maxWidth="64%"
      borderRadius={20}
      padding={12}
      backgroundColor="#1C1C1E"
    >
      {showText ? (
        <Text fontSize={14} color="#FFFFFF">
          {text}
        </Text>
      ) : null}
      {timestamp ? (
        <Text fontSize={11} color="rgba(255,255,255,0.65)" textAlign="right" marginTop={6}>
          {timestamp}
        </Text>
      ) : null}
    </YStack>
  );
}
