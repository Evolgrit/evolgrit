import React, { useMemo, useState } from "react";
import { TextInput } from "react-native";
import Animated, {
  Easing,
  interpolate,
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { Avatar, Button, SizableText, Spacer, XStack, YStack, Sheet, useTheme } from "tamagui";
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export type Mentor = {
  id: string;
  name: string;
  role?: string;
  avatarUrl?: string;
};

export type ChatMessage = {
  id: string;
  threadId: string;
  text: string;
  createdAt: number;
};

export type ChatThread = {
  id: string;
  mentorId: string;
  subject: string;
  lastMessage?: string;
  updatedAt: number;
};

export type ChatTopBarIOS26Props = {
  title?: string;
  profileImageUrl?: string;
  onPressProfile?: () => void;
  onPressFilter?: () => void;
  mentors: Mentor[];
  threads: ChatThread[];
  messages: ChatMessage[];
  onSearchResults?: (threadIds: string[], query: string) => void;
  onCreateThread?: (payload: { mentorId: string; threadId?: string }) => Promise<void> | void;
};

const GlassPill = ({
  children,
  height = 40,
}: {
  children: React.ReactNode;
  height?: number;
}) => {
  return (
    <XStack
      height={height}
      alignItems="center"
      borderRadius={999}
      backgroundColor="$bgInput"
      borderWidth={0}
    >
      <XStack paddingHorizontal={10} gap={6} alignItems="center">
        {children}
      </XStack>
    </XStack>
  );
};

export function ChatTopBarIOS26(props: ChatTopBarIOS26Props) {
  const theme = useTheme();
  const iconColor = theme.text?.val ?? theme.color?.val ?? "#111111";
  const muted = theme.textSecondary?.val ?? theme.colorMuted?.val ?? "#6B7280";
  const {
    title = "Chat",
    profileImageUrl,
    onPressProfile,
    onPressFilter,
    mentors,
    threads,
    messages,
    onSearchResults,
    onCreateThread,
  } = props;

  const [isSearch, setIsSearch] = useState(false);
  const [query, setQuery] = useState("");
  const searchAnim = useSharedValue(0);

  const [isSelectOpen, setIsSelectOpen] = useState(false);
  const insets = useSafeAreaInsets();

  const openSearch = () => {
    setIsSearch(true);
    searchAnim.value = withTiming(1, { duration: 240, easing: Easing.out(Easing.cubic) });
  };

  const closeSearch = () => {
    searchAnim.value = withTiming(
      0,
      { duration: 200, easing: Easing.out(Easing.cubic) },
      (finished) => {
        if (finished) runOnJS(setIsSearch)(false);
      }
    );
    setQuery("");
    onSearchResults?.(threads.map((t) => t.id), "");
  };

  const filteredThreadIds = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return threads.map((t) => t.id);

    const mentorById = new Map(mentors.map((m) => [m.id, m]));
    const msgsByThread = new Map<string, ChatMessage[]>();
    for (const m of messages) {
      const arr = msgsByThread.get(m.threadId) ?? [];
      arr.push(m);
      msgsByThread.set(m.threadId, arr);
    }

    const hits: string[] = [];
    for (const t of threads) {
      const mentor = mentorById.get(t.mentorId);
      const hayTitle = (t.subject ?? "").toLowerCase();
      const hayMentor = (mentor?.name ?? "").toLowerCase();
      const hayLast = (t.lastMessage ?? "").toLowerCase();

      let ok = hayTitle.includes(q) || hayMentor.includes(q) || hayLast.includes(q);
      if (!ok) {
        const arr = msgsByThread.get(t.id) ?? [];
        ok = arr.some((mm) => (mm.text ?? "").toLowerCase().includes(q));
      }
      if (ok) hits.push(t.id);
    }
    return hits;
  }, [query, threads, messages, mentors]);

  React.useEffect(() => {
    onSearchResults?.(filteredThreadIds, query);
  }, [filteredThreadIds, query, onSearchResults]);

  const titleStyle = useAnimatedStyle(() => {
    const opacity = interpolate(searchAnim.value, [0, 1], [1, 0]);
    const translateY = interpolate(searchAnim.value, [0, 1], [0, -6]);
    return { opacity, transform: [{ translateY }] };
  });

  const searchRowStyle = useAnimatedStyle(() => {
    const opacity = interpolate(searchAnim.value, [0, 1], [0, 1]);
    const translateY = interpolate(searchAnim.value, [0, 1], [6, 0]);
    return { opacity, transform: [{ translateY }] };
  });

  const titleLeftNudge = -10;

  return (
    <YStack
      paddingTop={insets.top + 6}
      paddingHorizontal={16}
      paddingBottom={8}
      backgroundColor="#F6F7F8"
    >
      <XStack alignItems="center" justifyContent="space-between">
        <Button
          unstyled
          onPress={onPressProfile}
          pressStyle={{ opacity: 0.85 }}
          accessibilityLabel="Open profile"
        >
          <Avatar circular size="$3.5" borderWidth={1} borderColor="rgba(0,0,0,0.06)">
            <Avatar.Image src={profileImageUrl} />
            <Avatar.Fallback backgroundColor="rgba(0,0,0,0.06)" />
          </Avatar>
        </Button>

        <Animated.View style={titleStyle}>
          <XStack alignItems="center" justifyContent="center" width={180}>
            <YStack marginLeft={titleLeftNudge}>
              <SizableText fontSize={20} fontWeight="700" letterSpacing={-0.3}>
                {title}
              </SizableText>
            </YStack>
          </XStack>
        </Animated.View>

        <GlassPill>
          <Button
            size="$3"
            circular
            chromeless
            onPress={onPressFilter}
            icon={<Ionicons name="filter-outline" size={18} color={iconColor} />}
            accessibilityLabel="Filter chats"
          />
          <Button
            size="$3"
            circular
            chromeless
            onPress={() => (isSearch ? closeSearch() : openSearch())}
            icon={<Ionicons name="search-outline" size={18} color={iconColor} />}
            accessibilityLabel="Search chats"
          />
          <Button
            size="$3"
            circular
            chromeless
            onPress={() => setIsSelectOpen(true)}
            icon={<Ionicons name="add-outline" size={20} color={iconColor} />}
            accessibilityLabel="New mentor chat"
          />
        </GlassPill>
      </XStack>

      <Animated.View style={searchRowStyle}>
        <XStack marginTop={10} alignItems="center" gap={10}>
          <GlassPill height={44}>
            <XStack alignItems="center" gap={8} flex={1} width={260}>
              <Ionicons name="search-outline" size={18} color={muted} />
              <TextInput
                value={query}
                onChangeText={(t) => setQuery(t)}
                placeholder="Search messages"
                placeholderTextColor={muted}
                style={{
                  flex: 1,
                  fontSize: 16,
                  paddingVertical: 8,
                  color: iconColor,
                }}
                returnKeyType="search"
              />
              {query.length > 0 ? (
                <Button
                  size="$2.5"
                  circular
                  chromeless
                  icon={<Ionicons name="close-outline" size={18} color={muted} />}
                  onPress={() => setQuery("")}
                  accessibilityLabel="Clear search"
                />
              ) : null}
            </XStack>
          </GlassPill>

          <Button chromeless onPress={closeSearch} accessibilityLabel="Cancel search" paddingHorizontal={6}>
            <SizableText fontSize={16} fontWeight="600">
              Cancel
            </SizableText>
          </Button>
        </XStack>
      </Animated.View>

      <Spacer size="$2" />

      <Sheet modal open={isSelectOpen} onOpenChange={setIsSelectOpen} snapPoints={[40]} dismissOnSnapToBottom zIndex={100000}>
        <Sheet.Overlay opacity={0.25} />
        <Sheet.Handle />
        <Sheet.Frame padding="$4" gap="$3">
          <SizableText fontSize={18} fontWeight="800">
            New Chat
          </SizableText>
          <XStack flexWrap="wrap" gap="$2">
            {mentors.map((m) => (
              <Button
                key={m.id}
                onPress={async () => {
                  await onCreateThread?.({ mentorId: m.id });
                  setIsSelectOpen(false);
                }}
                borderRadius={999}
                backgroundColor="rgba(0,0,0,0.06)"
                pressStyle={{ opacity: 0.9 }}
              >
                <XStack alignItems="center" gap="$2">
                  <Avatar circular size="$2.5">
                    <Avatar.Image src={m.avatarUrl} />
                    <Avatar.Fallback backgroundColor="rgba(0,0,0,0.08)" />
                  </Avatar>
                  <YStack>
                    <SizableText fontSize={14} fontWeight="700" color="rgba(0,0,0,0.92)">
                      {m.name}
                    </SizableText>
                    {m.role ? (
                      <SizableText fontSize={12} opacity={0.55} color="rgba(0,0,0,0.92)">
                        {m.role}
                      </SizableText>
                    ) : null}
                  </YStack>
                </XStack>
              </Button>
            ))}
          </XStack>
          <XStack justifyContent="flex-end">
            <Button chromeless onPress={() => setIsSelectOpen(false)} borderRadius={999}>
              Cancel
            </Button>
          </XStack>
        </Sheet.Frame>
      </Sheet>
    </YStack>
  );
}
