import React, { useMemo } from "react";
import { StatusBar } from "expo-status-bar";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { YStack, useThemeName } from "tamagui";
import { AppHeader } from "./AppHeader";
import { NavBackButton } from "./NavBackButton";

type Props = {
  title?: string;
  showBack?: boolean;
  leftContent?: React.ReactNode;
  rightActions?: React.ReactNode;
  children: React.ReactNode;
  backgroundColor?: string;
  header?: React.ReactNode;
  scroll?: boolean;
};

export function ScreenShell({
  title,
  showBack,
  leftContent,
  rightActions,
  children,
  backgroundColor = "$bgApp",
  header,
  scroll = false,
}: Props) {
  const insets = useSafeAreaInsets();
  const theme = useThemeName();
  const headerHeight = useMemo(() => insets.top + 56, [insets.top]);

  return (
    <YStack flex={1} backgroundColor={backgroundColor}>
      <StatusBar style={theme === "dark" ? "light" : "dark"} translucent />
      {header ? (
        header
      ) : (
        <AppHeader
          title={title}
          left={
            leftContent ??
            (showBack ? (
              <NavBackButton />
            ) : undefined)
          }
          right={rightActions}
        />
      )}

      <YStack
        flex={1}
        paddingHorizontal={16}
        paddingTop={scroll ? 0 : 0}
        marginTop={scroll ? 0 : 0}
        backgroundColor="$bgApp"
      >
        {scroll ? (
          <YStack flex={1} paddingTop={headerHeight - insets.top - 8}>
            {children}
          </YStack>
        ) : (
          children
        )}
      </YStack>
    </YStack>
  );
}
