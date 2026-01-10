import React from "react";
import { useLocalSearchParams } from "expo-router";

import { ChatDetailScreen } from "../../components/chat/ChatDetailScreen";

export default function ChatDetailRoute() {
  const params = useLocalSearchParams<{ threadId?: string }>();
  const threadId = typeof params.threadId === "string" ? params.threadId : "mentor-default";

  return <ChatDetailScreen threadId={threadId} />;
}
