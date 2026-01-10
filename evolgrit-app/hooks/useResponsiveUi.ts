import { useWindowDimensions } from "react-native";

/**
 * Responsive layout + type ramp helper for lesson UIs.
 */
export function useResponsiveUi() {
  const { width } = useWindowDimensions();

  const sidePadding = width < 360 ? 16 : 20;
  const gap = 12;
  const contentW = width - sidePadding * 2;
  const columns = contentW < 360 ? 1 : 2;
  const cardW = columns === 1 ? contentW : (contentW - gap) / 2;
  const imageH = Math.round(cardW * 0.72);

  const type =
    width < 360
      ? { title: 16, sub: 13, label: 14 }
      : width < 420
      ? { title: 18, sub: 14, label: 15 }
      : { title: 20, sub: 15, label: 16 };

  return { width, sidePadding, gap, contentW, columns, cardW, imageH, type };
}
