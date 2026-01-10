import React, { useMemo } from "react";
import { useWindowDimensions } from "react-native";
import { Image } from "tamagui";

export function HeroImage({
  source,
  borderRadius = "$8",
}: {
  source: any;
  borderRadius?: any;
}) {
  const { width } = useWindowDimensions();
  const { height } = useMemo(() => {
    const maxH = 280;
    const minH = 180;
    const h = Math.round(width * 0.56); // ~16:9 feel
    return { height: Math.min(Math.max(h, minH), maxH) };
  }, [width]);

  return (
    <Image
      source={source}
      width="100%"
      height={height}
      borderRadius={borderRadius}
      overflow="hidden"
      resizeMode="cover"
    />
  );
}
