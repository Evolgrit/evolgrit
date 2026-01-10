import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  FlatList,
  Keyboard,
  KeyboardAvoidingView,
  ListRenderItem,
  Platform,
  View,
  ViewabilityConfig,
  ViewToken,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Stack } from "tamagui";

type Props<T> = {
  header?: React.ReactNode;
  data: T[];
  renderItem: ListRenderItem<T>;
  keyExtractor: (item: T, index: number) => string;
  composer: React.ReactNode;
  contentGap?: number;
  inverted?: boolean;
};

const DEFAULT_COMPOSER_H = 56;

export function ChatScreenShell<T>({
  header,
  data,
  renderItem,
  keyExtractor,
  composer,
  contentGap = 12,
  inverted = false,
}: Props<T>) {
  const insets = useSafeAreaInsets();
  const listRef = useRef<FlatList<T>>(null);
  const [keyboardVisible, setKeyboardVisible] = useState(false);

  const bottomPad = useMemo(() => (keyboardVisible ? 0 : Math.max(insets.bottom, 12)), [insets.bottom, keyboardVisible]);
  const paddingBottom = useMemo(() => DEFAULT_COMPOSER_H + bottomPad + 12, [bottomPad]);

  useEffect(() => {
    // scroll to bottom when data changes
    requestAnimationFrame(() => {
      listRef.current?.scrollToEnd?.({ animated: true });
    });
  }, [data.length]);

  useEffect(() => {
    const showSub = Keyboard.addListener("keyboardWillShow", () => {
      setKeyboardVisible(true);
      requestAnimationFrame(() => {
        listRef.current?.scrollToEnd?.({ animated: true });
      });
    });
    const hideSub = Keyboard.addListener("keyboardWillHide", () => {
      setKeyboardVisible(false);
    });
    return () => {
      showSub.remove();
      hideSub.remove();
    };
  }, []);

  const viewConfig: ViewabilityConfig = {
    viewAreaCoveragePercentThreshold: 10,
  };

  const onViewableItemsChanged = React.useRef((info: { viewableItems: ViewToken[] }) => {
    // placeholder for analytics; no-op
  });

  return (
    <View style={{ flex: 1 }}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        keyboardVerticalOffset={0}
      >
        <Stack flex={1} backgroundColor="$background">
          {header}

          <Stack flex={1}>
            <FlatList
              ref={listRef}
              data={data}
              renderItem={renderItem}
              keyExtractor={keyExtractor}
              inverted={inverted}
              contentContainerStyle={{
                paddingTop: 12,
                paddingBottom,
                paddingHorizontal: 12,
                gap: contentGap,
              }}
              keyboardShouldPersistTaps="handled"
              viewabilityConfig={viewConfig}
              onViewableItemsChanged={onViewableItemsChanged.current}
              showsVerticalScrollIndicator={false}
              maintainVisibleContentPosition={{ minIndexForVisible: 1 }}
            />
          </Stack>

          <Stack
            paddingHorizontal={16}
            paddingBottom={bottomPad}
            paddingTop={keyboardVisible ? 4 : 10}
            backgroundColor="$background"
          >
            {composer}
          </Stack>
        </Stack>
      </KeyboardAvoidingView>
    </View>
  );
}
