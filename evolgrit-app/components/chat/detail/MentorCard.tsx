import React from "react";
import { YStack, Text, Image, Stack } from "tamagui";
import { StyleSheet, ActivityIndicator } from "react-native";

export function MentorCard({
  text,
  muted,
  imageUri,
  status,
  timestamp,
}: {
  text: string;
  muted?: boolean;
  imageUri?: string | null;
  status?: "pending" | "sent" | "failed";
  timestamp?: string;
}) {
  const hasImage = !!imageUri;
  return (
    <YStack maxWidth="82%" gap="$1" marginVertical={6} marginHorizontal={16}>
      {hasImage ? (
        <Stack
          position="relative"
          opacity={status === "pending" ? 0.86 : 1}
          borderRadius={18}
          overflow="hidden"
          backgroundColor="#F2F2F7"
          borderWidth={StyleSheet.hairlineWidth}
          borderColor="rgba(17,24,39,0.10)"
        >
          {imageUri ? (
            <Image
              source={{ uri: imageUri }}
              width={280}
              height={180}
              resizeMode="cover"
              backgroundColor="#F2F2F7"
            />
          ) : (
            <Stack width={280} height={180} backgroundColor="#F2F2F7" alignItems="center" justifyContent="center">
              <Text color="#111827" fontSize={13}>
                Medien laden …
              </Text>
            </Stack>
          )}
          {status === "pending" ? (
            <Stack
              position="absolute"
              top={8}
              right={8}
              padding={6}
              borderRadius={12}
              backgroundColor="rgba(0,0,0,0.12)"
              alignItems="center"
              justifyContent="center"
            >
              <ActivityIndicator size="small" color="#111827" />
            </Stack>
            ) : null}
          {status === "failed" ? (
            <Stack position="absolute" bottom={6} left={0} right={0} alignItems="center" justifyContent="center">
              <Text color="#111827" fontSize={12}>
                Upload fehlgeschlagen · Tippen zum Wiederholen
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
      ) : (
        <YStack
          borderRadius={20}
          padding={14}
          backgroundColor="#FFFFFF"
          borderWidth={1}
          borderColor="rgba(0,0,0,0.06)"
          opacity={muted ? 0.9 : 1}
        >
          {text ? (
            <Text fontSize={15} lineHeight={22} color="rgba(0,0,0,0.92)">
              {text}
            </Text>
          ) : null}
        </YStack>
      )}
      {timestamp ? (
        <Text fontSize={11} color="rgba(0,0,0,0.45)" textAlign="right">
          {timestamp}
        </Text>
      ) : null}
    </YStack>
  );
}
