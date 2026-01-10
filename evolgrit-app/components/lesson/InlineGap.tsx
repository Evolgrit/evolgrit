import React from "react";
import { Text, YStack } from "tamagui";

type Props = {
  state: "idle" | "correct" | "wrong";
  label?: string;
};

export function InlineGap({ state, label }: Props) {
  const stylesByState = {
    idle: {
      borderRadius: 10,
      paddingHorizontal: 10,
      paddingVertical: 4,
      borderWidth: 1,
      borderColor: "rgba(17,24,39,0.14)",
      backgroundColor: "transparent",
    },
    correct: {
      borderRadius: 10,
      paddingHorizontal: 10,
      paddingVertical: 4,
      borderWidth: 1,
      borderColor: "rgba(46,204,113,0.6)",
      backgroundColor: "rgba(46,204,113,0.14)",
    },
    wrong: {
      borderRadius: 10,
      paddingHorizontal: 10,
      paddingVertical: 4,
      borderWidth: 1,
      borderColor: "rgba(231,76,60,0.6)",
      backgroundColor: "rgba(231,76,60,0.14)",
    },
  }[state];

  return (
    <YStack>
      <Text
        style={stylesByState}
        fontSize={15}
        lineHeight={20}
        fontWeight="700"
        color="$text"
        flexShrink={0}
      >
        {label ?? "___"}
      </Text>
    </YStack>
  );
}
