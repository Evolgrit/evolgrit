import { StackProps } from "tamagui";

export const cardProps: StackProps = {
  backgroundColor: "$card",
  borderRadius: "$r24",
  borderWidth: 0,
  padding: "$s16",
  shadowColor: "rgba(17,24,39,0.12)",
  shadowOffset: { width: 0, height: 6 },
  shadowRadius: 10,
  shadowOpacity: 0.08,
};

export const pillProps: StackProps = {
  borderRadius: 999,
  paddingVertical: "$s12",
  paddingHorizontal: "$s16",
  borderWidth: 1,
  borderColor: "$border",
  shadowColor: "rgba(17,24,39,0.10)",
  shadowOffset: { width: 0, height: 3 },
  shadowRadius: 6,
  shadowOpacity: 0.04,
};
