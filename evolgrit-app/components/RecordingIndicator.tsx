import React, { useEffect, useMemo, useRef } from "react";
import { View, Animated } from "react-native";

export function RecordingIndicator({
  isRecording,
  size = 140,
}: {
  isRecording: boolean;
  size?: number;
}) {
  const pulse = useRef(new Animated.Value(1)).current;

  const bars = useMemo(() => Array.from({ length: 9 }, () => new Animated.Value(0.35)), []);

  useEffect(() => {
    let pulseAnim: Animated.CompositeAnimation | null = null;
    let barsAnim: Animated.CompositeAnimation | null = null;

    if (isRecording) {
      pulseAnim = Animated.loop(
        Animated.sequence([
          Animated.timing(pulse, { toValue: 1.06, duration: 420, useNativeDriver: true }),
          Animated.timing(pulse, { toValue: 1.0, duration: 420, useNativeDriver: true }),
        ])
      );
      pulseAnim.start();

      const makeBars = () =>
        Animated.stagger(
          60,
          bars.map((b) =>
            Animated.sequence([
              Animated.timing(b, { toValue: 1.0, duration: 220, useNativeDriver: true }),
              Animated.timing(b, { toValue: 0.35, duration: 260, useNativeDriver: true }),
            ])
          )
        );

      barsAnim = Animated.loop(makeBars());
      barsAnim.start();
    } else {
      pulse.setValue(1);
      bars.forEach((b) => b.setValue(0.35));
    }

    return () => {
      pulseAnim?.stop?.();
      barsAnim?.stop?.();
    };
  }, [isRecording, pulse, bars]);

  return (
    <View style={{ alignItems: "center", justifyContent: "center" }}>
      {/* Pulse ring */}
      <Animated.View
        style={{
          width: size,
          height: size,
          borderRadius: 999,
          borderWidth: 2,
          borderColor: isRecording ? "rgba(46, 204, 113, 0.9)" : "rgba(17, 24, 39, 0.25)",
          transform: [{ scale: pulse }],
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <View
          style={{
            width: size - 22,
            height: size - 22,
            borderRadius: 999,
            backgroundColor: isRecording ? "rgba(46, 204, 113, 0.08)" : "rgba(17, 24, 39, 0.03)",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {/* Bars */}
          <View style={{ flexDirection: "row", gap: 6, alignItems: "flex-end" }}>
            {bars.map((b, idx) => (
              <Animated.View
                key={idx}
                style={{
                  width: 6,
                  height: 34,
                  borderRadius: 99,
                  backgroundColor: isRecording ? "#2ECC71" : "rgba(17,24,39,0.25)",
                  transform: [{ scaleY: b }],
                }}
              />
            ))}
          </View>
        </View>
      </Animated.View>
    </View>
  );
}
