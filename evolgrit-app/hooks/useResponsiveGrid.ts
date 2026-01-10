import { useWindowDimensions } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export function useResponsiveGrid() {
  const { width } = useWindowDimensions();
  const insets = useSafeAreaInsets();

  const sidePadding = 16 + Math.max(insets.left, insets.right, 0);
  const gap = 12;
  const contentW = width - sidePadding * 2;
  const columns = contentW < 360 ? 1 : 2;
  const cardW = columns === 1 ? contentW : (contentW - gap) / 2;
  const imageH = Math.round(cardW * 0.72);
  const radius = 18;

  return { columns, cardW, imageH, gap, sidePadding, radius };
}
