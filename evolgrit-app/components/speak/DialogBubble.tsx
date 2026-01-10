import React from "react";
import { Ionicons } from "@expo/vector-icons";
import { Stack, Text, XStack } from "tamagui";

type Guide = { word?: string; guide: string; note?: string };

type Props = {
  role: "mentor" | "user" | "system";
  text: string;
  guides?: Guide[];
  active?: boolean;
  completed?: boolean;
};

export function DialogBubble({ role, text, guides, active, completed }: Props) {
  const isSystem = role === "system";
  const isMentor = role === "mentor";
  const bg = isSystem ? "rgba(17,24,39,0.04)" : isMentor ? "#fff" : "rgba(17,24,39,0.08)";
  const border = isSystem ? "rgba(17,24,39,0.04)" : "rgba(17,24,39,0.06)";

  return (
    <Stack
      alignSelf={isSystem ? "center" : isMentor ? "flex-start" : "flex-end"}
      maxWidth="92%"
      backgroundColor={bg}
      borderRadius={20}
      padding={14}
      borderWidth={1}
      borderColor={border}
      shadowColor={active ? "rgba(0,0,0,0.12)" : "rgba(0,0,0,0.05)"}
      shadowOpacity={1}
      shadowRadius={active ? 14 : 10}
      shadowOffset={{ width: 0, height: active ? 6 : 4 }}
      opacity={completed ? 0.92 : 1}
      gap="$2"
    >
      {!isSystem ? (
        <Text fontWeight="800" color="#111827">
          {isMentor ? "Mentor" : "You"}
        </Text>
      ) : null}

      <Stack>
        {active ? (
          <Stack
            position="absolute"
            left={isMentor ? -10 : undefined}
            right={isMentor ? undefined : -10}
            top={4}
            width={6}
            height={6}
            borderRadius={999}
            backgroundColor="#111827"
          />
        ) : null}
        <Text color="#111827">{text}</Text>
      </Stack>

      {guides?.length ? (
        <Stack gap="$1" marginTop={2}>
          {guides.map((g) => (
            <Text key={`${g.guide}-${g.word ?? ""}`} color="#6B7280" fontSize={13}>
              {g.guide}
            </Text>
          ))}
        </Stack>
      ) : null}

      {!isSystem ? (
        <XStack gap="$3" alignItems="center" opacity={0.35} marginTop={4}>
          <Ionicons name="volume-high-outline" size={18} color="#111827" />
          <Ionicons name="speedometer-outline" size={18} color="#111827" />
          <Ionicons name="language-outline" size={18} color="#111827" />
        </XStack>
      ) : null}
    </Stack>
  );
}
