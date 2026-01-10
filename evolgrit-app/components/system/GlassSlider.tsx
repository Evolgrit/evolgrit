import React, { useCallback, useState } from "react";
import { LayoutChangeEvent, Pressable, View } from "react-native";
import { GlassSurface } from "./GlassSurface";

type Props = {
  value: number; // 0..1
  onChange: (v: number) => void;
  disabled?: boolean;
};

export function GlassSlider({ value, onChange, disabled }: Props) {
  const [width, setWidth] = useState(0);

  const handleLayout = useCallback((e: LayoutChangeEvent) => {
    setWidth(e.nativeEvent.layout.width);
  }, []);

  const handlePress = useCallback(
    (e: any) => {
      if (!width) return;
      const x = e.nativeEvent.locationX;
      const next = Math.min(1, Math.max(0, x / width));
      onChange(next);
    },
    [onChange, width]
  );

  const knobX = width * Math.min(1, Math.max(0, value));

  return (
    <Pressable onPress={handlePress} disabled={disabled} style={{ opacity: disabled ? 0.45 : 1 }}>
      <GlassSurface padding={10} radius={12}>
        <View onLayout={handleLayout} style={{ height: 14, justifyContent: "center" }}>
          <View
            style={{
              position: "absolute",
              left: 0,
              right: 0,
              height: 4,
              borderRadius: 2,
              backgroundColor: "rgba(0,0,0,0.12)",
            }}
          />
          <View
            style={{
              position: "absolute",
              left: 0,
              width: knobX,
              height: 4,
              borderRadius: 2,
              backgroundColor: "rgba(0,0,0,0.45)",
            }}
          />
          <View
            style={{
              position: "absolute",
              width: 18,
              height: 18,
              borderRadius: 9,
              backgroundColor: "#fff",
              left: Math.max(0, knobX - 9),
              borderWidth: 1,
              borderColor: "rgba(0,0,0,0.08)",
              shadowColor: "rgba(0,0,0,0.18)",
              shadowOpacity: 1,
              shadowRadius: 8,
              shadowOffset: { width: 0, height: 4 },
            }}
          />
        </View>
      </GlassSurface>
    </Pressable>
  );
}
