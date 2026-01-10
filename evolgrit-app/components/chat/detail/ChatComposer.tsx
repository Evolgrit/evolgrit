import React from "react";
import { TextInput, Pressable, View, Image } from "react-native";
import { Stack, XStack } from "tamagui";
import { Feather, Ionicons } from "@expo/vector-icons";

type Props = {
  value: string;
  onChange: (t: string) => void;
  onSend: () => void;
  placeholder?: string;
  onOpenAttachments?: () => void;
  onOpenCamera?: () => void;
  onStartRecording?: () => void;
  onStopRecording?: () => void;
  isRecording?: boolean;
  attachmentUri?: string | null;
  onRemoveAttachment?: () => void;
};

/**
 * WhatsApp-like composer:
 * - Left + button
 * - Pill TextInput
 * - Right camera + mic/send
 */
export function ChatComposer({
  value,
  onChange,
  onSend,
  placeholder = "Nachricht …",
  onOpenAttachments,
  onOpenCamera,
  onStartRecording,
  onStopRecording,
  isRecording,
  attachmentUri,
  onRemoveAttachment,
}: Props) {
  const hasText = value.trim().length > 0;
  const hasAttachment = !!attachmentUri;
  const canSend = hasText || hasAttachment;

  return (
    <View style={{ paddingHorizontal: 0, justifyContent: "center" }}>
      {hasAttachment ? (
        <Stack
          marginBottom={8}
          padding={8}
          borderRadius={12}
          borderWidth={1}
          borderColor="rgba(0,0,0,0.08)"
          backgroundColor="rgba(255,255,255,0.9)"
          flexDirection="row"
          alignItems="center"
          gap={10}
        >
          <Image
            source={{ uri: attachmentUri }}
            style={{ width: 48, height: 48, borderRadius: 10, backgroundColor: "#F2F2F7" }}
            resizeMode="cover"
          />
          <Pressable onPress={onRemoveAttachment} hitSlop={10} style={{ padding: 6 }}>
            <Feather name="x" size={18} color="rgba(0,0,0,0.65)" />
          </Pressable>
        </Stack>
      ) : null}

      <XStack alignItems="center" gap={10} minHeight={56}>
        <Pressable onPress={onOpenAttachments} hitSlop={10} style={{ width: 32, height: 32, alignItems: "center", justifyContent: "center" }}>
          <Feather name="plus" size={22} color="rgba(0,0,0,0.7)" />
        </Pressable>

        <XStack
          flex={1}
          height={44}
          borderRadius={22}
          alignItems="center"
          paddingHorizontal={14}
          backgroundColor="rgba(255,255,255,0.9)"
          borderWidth={1}
          borderColor="rgba(0,0,0,0.06)"
          shadowColor="rgba(0,0,0,0.08)"
          shadowRadius={10}
          shadowOffset={{ width: 0, height: 4 }}
        >
          <TextInput
            value={value}
            onChangeText={onChange}
            placeholder={placeholder}
            placeholderTextColor="rgba(0,0,0,0.45)"
            style={{ flex: 1, paddingVertical: 10, fontSize: 15, color: "#111827" }}
            multiline
          />
        </XStack>

        <Pressable onPress={onOpenCamera} hitSlop={10} style={{ width: 32, height: 32, alignItems: "center", justifyContent: "center" }}>
          <Feather name="camera" size={20} color="rgba(0,0,0,0.7)" />
        </Pressable>

        <Pressable
          onPress={canSend ? onSend : undefined}
          onPressIn={!canSend ? onStartRecording : undefined}
          onPressOut={!canSend ? onStopRecording : undefined}
          hitSlop={10}
        >
          <XStack
            width={32}
            height={32}
            borderRadius={16}
            alignItems="center"
            justifyContent="center"
            backgroundColor={canSend ? "#1C1C1E" : isRecording ? "rgba(220,38,38,0.25)" : "rgba(0,0,0,0.08)"}
          >
            {canSend ? (
              <Ionicons name="arrow-up" size={16} color="#fff" />
            ) : (
              <Ionicons name="mic-outline" size={16} color={isRecording ? "#111827" : "rgba(0,0,0,0.45)"} />
            )}
          </XStack>
        </Pressable>
      </XStack>
    </View>
  );
}
