import React, { useEffect, useRef } from "react";
import { FlatList, ListRenderItem } from "react-native";
import { DialogBubble } from "./DialogBubble";

type Props = {
  items: any[];
  activeId: string | null;
  completed: Record<string, boolean>;
  guidesByLine: Record<string, any[]>;
};

export function DialogList({ items, activeId, completed, guidesByLine }: Props) {
  const ref = useRef<FlatList>(null);

  useEffect(() => {
    if (!activeId) return;
    const index = items.findIndex((x) => x.id === activeId);
    if (index === -1) return;
    ref.current?.scrollToIndex({ index, animated: true, viewPosition: 0.3 });
  }, [activeId, items]);

  const renderItem: ListRenderItem<any> = ({ item }) => (
    <DialogBubble
      role={item.role}
      text={item.displayText}
      guides={guidesByLine[item.id]}
      active={item.id === activeId}
      completed={!!completed[item.id]}
    />
  );

  return (
    <FlatList
      ref={ref}
      data={items}
      keyExtractor={(item) => item.id}
      renderItem={renderItem}
      contentContainerStyle={{ padding: 16, paddingBottom: 120, gap: 12 }}
      onScrollToIndexFailed={(info) => {
        setTimeout(() => {
          ref.current?.scrollToIndex({ index: info.index, animated: true, viewPosition: 0.3 });
        }, 200);
      }}
    />
  );
}
