import React from "react";
import type { ImageSourcePropType } from "react-native";
import { Pressable } from "react-native";
import { YStack, XStack, Text, Image } from "tamagui";

type Status = "completed" | "current" | "locked";

type Props = {
  level: string;
  title?: string;
  subtitle?: string;
  status: Status;
  imageSource: ImageSourcePropType;
  onPress?: () => void;
  disabled?: boolean;
  badgeText?: string;
  statusLabel?: string;
  statusBg?: string;
  statusColor?: string;
};

const STATUS_STYLES: Record<Status, { bg: string; color: string; label: string }> = {
  completed: { bg: "rgba(46, 204, 113, 0.14)", color: "#2ECC71", label: "Completed" },
  current: { bg: "rgba(52, 152, 219, 0.14)", color: "#3498DB", label: "Ready" },
  locked: { bg: "rgba(231, 76, 60, 0.14)", color: "#E74C3C", label: "Locked" },
};

/**
  * Stateless Airbnb-like level card:
  * - Large image on top
  * - Text + status pill below
  * - No shadow, no border
  */
export function LevelCard({
  level,
  title,
  subtitle,
  status,
  imageSource,
  onPress,
  disabled,
  badgeText,
  statusLabel,
  statusBg,
  statusColor,
}: Props) {
  const styles = STATUS_STYLES[status];
  const label = statusLabel ?? styles.label;
  const bg = statusBg ?? styles.bg;
  const color = statusColor ?? styles.color;

  return (
    <Pressable
      onPress={disabled ? undefined : onPress}
      style={({ pressed }) => ({
        opacity: pressed ? 0.9 : disabled ? 0.7 : 1,
      })}
    >
      <YStack gap="$2">
        <YStack
          borderRadius="$6"
          overflow="hidden"
          height={220}
          backgroundColor="$color2"
        >
          <Image
            source={imageSource}
            width="100%"
            height="100%"
            resizeMode="cover"
          />
        </YStack>

        <YStack gap="$1">
          <Text fontSize={18} fontWeight="700" color="$text" numberOfLines={1}>
            {title ?? level}
          </Text>
          {subtitle ? (
            <Text fontSize={14} color="$muted" numberOfLines={1}>
              {subtitle}
            </Text>
          ) : null}

          <XStack gap="$2" flexWrap="wrap">
            <XStack
              alignItems="center"
              paddingHorizontal={10}
              paddingVertical={6}
              borderRadius={999}
              backgroundColor={bg}
              maxWidth={140}
            >
              <Text fontSize={12} fontWeight="600" color={color}>
                {label}
              </Text>
            </XStack>
            {badgeText ? (
              <XStack
                alignItems="center"
                paddingHorizontal={10}
                paddingVertical={6}
                borderRadius={999}
                backgroundColor="rgba(0,0,0,0.06)"
                maxWidth={180}
              >
                <Text fontSize={12} fontWeight="600" color="$text">
                  {badgeText}
                </Text>
              </XStack>
            ) : null}
          </XStack>
        </YStack>
      </YStack>
    </Pressable>
  );
}
