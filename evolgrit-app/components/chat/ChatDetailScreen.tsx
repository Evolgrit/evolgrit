import React, { useEffect, useMemo, useRef, useState } from "react";
import { Alert } from "react-native";
import * as ImagePicker from "expo-image-picker";
import { useRouter } from "expo-router";
import {
  RecordingPresets,
  requestRecordingPermissionsAsync,
  setAudioModeAsync,
  useAudioRecorder,
  useAudioRecorderState,
} from "expo-audio";
import { Text, YStack } from "tamagui";

import { ChatScreenShell } from "./ChatScreenShell";
import { MentorHeader } from "./detail/MentorHeader";
import { MentorCard } from "./detail/MentorCard";
import { UserBubble } from "./detail/UserBubble";
import { TimeDivider } from "./detail/TimeDivider";
import { ChatComposer } from "./detail/ChatComposer";
import { AudioMessageBubble } from "./detail/AudioMessageBubble";
import {
  addMentorMessage,
  addUserMessage,
  loadThread,
  updateMessage,
  type MentorMessage,
  type MentorThread,
} from "../../lib/mentorStore";
import { loadLangPrefs } from "../../lib/languagePrefs";
import { getAvatarUri } from "../../lib/avatarStore";
import { setMentorNextAction } from "../../lib/nextActionService";
import { shouldShowSpeakerLabel, shouldShowTimeDivider } from "../../lib/chatUx";
import { getChatPlaceholder, getNextActionSuggestion } from "../../lib/mentorPromptSystem";
import { uploadChatImage } from "../../lib/chatMedia";
import { uploadChatAudio } from "../../lib/chatAudio";
import type { ListRenderItem } from "react-native";

type ChatMsg = {
  id: string;
  role: "user" | "mentor";
  text: string;
  createdAt: number;
  kind?: MentorMessage["kind"];
  imageUri?: string | null;
  localImageUri?: string | null;
  uploadStatus?: UploadStatus;
  audioUri?: string | null;
  durationMs?: number;
};
type UploadStatus = "pending" | "sent" | "failed";

function formatDateLabel(ts: number) {
  const d = new Date(ts);
  const now = new Date();
  const yesterday = new Date();
  yesterday.setDate(now.getDate() - 1);

  const sameDay = (a: Date, b: Date) =>
    a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();

  if (sameDay(d, now)) return "Heute";
  if (sameDay(d, yesterday)) return "Gestern";

  return d.toLocaleDateString(undefined, { weekday: "long", hour: "2-digit", minute: "2-digit" });
}

type Props = {
  threadId?: string;
};

export function ChatDetailScreen({ threadId }: Props) {
  const router = useRouter();
  const [avatarUri, setAvatarUri] = useState<string | null>(null);
  const [thread, setThread] = useState<MentorThread | null>(null);
  const [text, setText] = useState("");
  const [pendingAttachment, setPendingAttachment] = useState<string | null>(null);
  const [isTyping, setIsTyping] = useState(false);
  const [typingDots, setTypingDots] = useState("...");
  const typingTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);
  const typingDotsInterval = useRef<ReturnType<typeof setInterval> | null>(null);
  const recorder = useAudioRecorder(RecordingPresets.HIGH_QUALITY);
  const recState = useAudioRecorderState(recorder);
  const isRecording = recState?.isRecording ?? false;

  useEffect(() => {
    (async () => {
      setThread(await loadThread());
      await loadLangPrefs();
      setAvatarUri(await getAvatarUri());
    })();
  }, [threadId]);

  const placeholder = useMemo(() => getChatPlaceholder({}), []);

  const messages: ChatMsg[] = useMemo(() => {
    const base = thread?.messages
      ? thread.messages.slice().reverse().map((m) => ({
          id: m.id,
          role: m.role,
          text: m.text,
          createdAt: new Date(m.createdAt ?? Date.now()).getTime(),
          kind: m.kind,
          imageUri: m.remoteUri ?? null,
          localImageUri: m.imageUri ?? null,
          audioUri: m.remoteUri ?? m.audioUri,
          durationMs: m.durationMs ?? undefined,
          uploadStatus: (m.uploadStatus as UploadStatus | undefined) ?? "sent",
        }))
      : [];
    if (base.length === 0) {
      return [
        {
          id: "seed-1",
          role: "mentor",
          text: "Hi, I’m Stanley from Evolgrit. Tell me what’s blocking you today.",
          createdAt: Date.now() - 1000 * 60 * 60,
        },
      ];
    }
    return base;
  }, [thread]);

  const listWithDividers = useMemo(() => {
    const items: (
      | { type: "date"; id: string; label: string }
      | { type: "msg"; msg: ChatMsg; showLabel: boolean; compact: boolean }
      | { type: "typing"; id: string }
    )[] = [];
    let lastTs: number | null = null;
    messages.forEach((m, idx) => {
      const addDate = shouldShowTimeDivider(lastTs, m.createdAt);
      if (addDate) {
        const label = formatDateLabel(m.createdAt);
        items.push({ type: "date", id: `d-${m.id}`, label });
        lastTs = null;
      }
      const prev = idx > 0 ? messages[idx - 1] : null;
      const compact = !!prev && prev.role === m.role && !shouldShowSpeakerLabel(prev.createdAt, m.createdAt);
      const showLabel = shouldShowSpeakerLabel(lastTs, m.createdAt);
      items.push({ type: "msg", msg: m, showLabel, compact });
      lastTs = m.createdAt;
    });
    if (isTyping) {
      items.push({ type: "typing", id: "typing" });
    }
    return items;
  }, [messages, isTyping]);

  const onSend = async () => {
    const content = text.trim();
    if (!content && !pendingAttachment) return;
    try {
      setText("");
      const attachmentToSend = pendingAttachment;
      setPendingAttachment(null);

      const t1 = await addUserMessage(content, attachmentToSend ? { imageUri: attachmentToSend, uploadStatus: "pending" } : undefined);
      setThread(t1);

      if (attachmentToSend) {
        const messageId = t1.messages[0]?.id;
        if (messageId) {
          uploadAndAttach(t1.id, messageId, attachmentToSend);
        }
      }

      triggerTyping();

      const reply = getNextActionSuggestion({});
      const t2 = await addMentorMessage(reply, { kind: "next_action" });
      setThread(t2);

      await setMentorNextAction("Do a 3-minute speaking drill");
    } finally {
      // noop
    }
  };

  async function uploadAndAttach(currentThreadId: string, messageId: string, uri: string) {
    try {
      const res = await uploadChatImage({ threadId: currentThreadId, messageId, localUri: uri });
      const updated = await updateMessage(messageId, { remoteUri: res.signedUrl, uploadStatus: "sent" });
      if (updated) setThread(updated);
    } catch (err: any) {
      console.error("[chat-thread] upload image failed", err);
      const updated = await updateMessage(messageId, { uploadStatus: "failed" });
      if (updated) setThread(updated);
    }
  }

  async function handlePickImage() {
    const perm = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!perm.granted) {
      Alert.alert("Kein Zugriff", "Bitte erlaube den Zugriff auf Fotos in den Einstellungen.");
      return;
    }
    const res = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      quality: 0.85,
    });
    if (res.canceled) return;
    if (!res.assets?.length) {
      Alert.alert("Keine Fotos", "Simulator hat ggf. keine Fotos. Ziehe ein Bild in die Fotos-App.");
      return;
    }
    const uri = res.assets[0]?.uri;
    if (!uri) return;
    setPendingAttachment(uri);
  }

  async function handleTakePhoto() {
    const perm = await ImagePicker.requestCameraPermissionsAsync();
    if (!perm.granted) {
      Alert.alert("Kein Kamerazugriff", "Bitte erlaube den Kamerazugriff in den Einstellungen.");
      return;
    }
    const res = await ImagePicker.launchCameraAsync({
      mediaTypes: ["images"],
      quality: 0.85,
    });
    if (res.canceled) return;
    if (!res.assets?.length) {
      Alert.alert("Keine Aufnahme", "Keine Datei gefunden.");
      return;
    }
    const uri = res.assets[0]?.uri;
    if (!uri) return;
    setPendingAttachment(uri);
  }

  async function uploadAudio(currentThreadId: string, messageId: string, uri: string, durationMs?: number | null) {
    try {
      const res = await uploadChatAudio({ threadId: currentThreadId, messageId, localUri: uri });
      const updated = await updateMessage(messageId, {
        remoteUri: res.signedUrl,
        uploadStatus: "sent",
        durationMs: durationMs ?? null,
      });
      if (updated) setThread(updated);
    } catch (err: any) {
      console.error("[chat-thread] upload audio failed", err);
      const updated = await updateMessage(messageId, { uploadStatus: "failed" });
      if (updated) setThread(updated);
    }
  }

  async function retryImageUpload(msg: ChatMsg) {
    const retryUri = msg.localImageUri ?? msg.imageUri;
    if (!retryUri) return;
    const updated = await updateMessage(msg.id, { uploadStatus: "pending" });
    if (updated) setThread(updated);
    uploadAndAttach(thread?.id ?? "local-thread", msg.id, retryUri);
  }

  async function startRecording() {
    if (isRecording) return;
    const perm = await requestRecordingPermissionsAsync();
    if (!perm.granted) {
      Alert.alert("Kein Mikrofonzugriff", "Bitte erlaube den Mikrofonzugriff in den Einstellungen.");
      return;
    }
    await setAudioModeAsync({ allowsRecording: true, playsInSilentMode: true });
    await recorder.prepareToRecordAsync();
    recorder.record();
  }

  async function stopRecording() {
    if (!isRecording) return;
    try {
      await recorder.stop();
    } catch {
      // ignore
    }

    const status = recState;
    const uri = status?.url;
    const durationMs = status?.durationMillis ?? null;
    if (!uri) return;

    const pendingThread = await addUserMessage("", { audioUri: uri, durationMs, uploadStatus: "pending" });
    setThread(pendingThread);
    const messageId = pendingThread.messages[0]?.id;
    if (messageId) {
      uploadAudio(pendingThread.id, messageId, uri, durationMs);
    }
  }

  const triggerTyping = () => {
    setIsTyping(true);
    if (typingTimeout.current) clearTimeout(typingTimeout.current);
    typingTimeout.current = setTimeout(() => setIsTyping(false), 1200);
  };

  useEffect(() => {
    return () => {
      if (typingTimeout.current) clearTimeout(typingTimeout.current);
      if (typingDotsInterval.current) clearInterval(typingDotsInterval.current);
    };
  }, []);

  useEffect(() => {
    if (!isTyping) {
      if (typingDotsInterval.current) clearInterval(typingDotsInterval.current);
      setTypingDots("...");
      return;
    }
    typingDotsInterval.current = setInterval(() => {
      setTypingDots((prev) => {
        if (prev === ".") return "..";
        if (prev === "..") return "...";
        return ".";
      });
    }, 300);
    return () => {
      if (typingDotsInterval.current) clearInterval(typingDotsInterval.current);
    };
  }, [isTyping]);

  const renderItem: ListRenderItem<(typeof listWithDividers)[number]> = ({ item }) => {
    if (item.type === "date") {
      return <TimeDivider label={item.label} />;
    }
    if (item.type === "typing") {
      return (
        <YStack alignItems="flex-start">
          <MentorCard text={`Mentor schreibt ${typingDots}`} muted />
        </YStack>
      );
    }
    const timeLabel = new Date(item.msg.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    return (
      <YStack alignItems={item.msg.role === "user" ? "flex-end" : "flex-start"} gap={item.compact ? 6 : 10}>
        {item.showLabel ? (
          <Text fontSize={12} color="rgba(0,0,0,0.55)">
            {item.msg.role === "user" ? "You" : "Stanley"}
          </Text>
        ) : null}
        {item.msg.audioUri ? (
          <AudioMessageBubble
            role={item.msg.role}
            uri={item.msg.audioUri}
            durationMs={item.msg.durationMs}
            status={item.msg.uploadStatus}
            timestamp={timeLabel}
          />
        ) : item.msg.role === "mentor" ? (
          <MentorCard
            text={item.msg.text}
            muted={item.msg.kind === "system" || item.msg.kind === "next_action"}
            imageUri={item.msg.imageUri ?? item.msg.localImageUri}
            status={item.msg.uploadStatus}
            timestamp={timeLabel}
          />
        ) : (
          <UserBubble
            text={item.msg.text}
            imageUri={item.msg.imageUri ?? undefined}
            localUri={item.msg.localImageUri ?? undefined}
            status={item.msg.uploadStatus}
            timestamp={timeLabel}
            onRetry={() => retryImageUpload(item.msg)}
          />
        )}
      </YStack>
    );
  };

  return (
    <ChatScreenShell
      header={
        <MentorHeader
          avatarUri={avatarUri}
          title="Stanley"
          subtitle="from Evolgrit"
          onPressDetails={() => router.push("/chat/details")}
        />
      }
      data={listWithDividers}
      renderItem={renderItem}
      keyExtractor={(item) => ("msg" in item ? item.msg.id : item.id)}
      contentGap={12}
      composer={
        <ChatComposer
          value={text}
          onChange={setText}
          onSend={onSend}
          placeholder={placeholder}
          onOpenAttachments={handlePickImage}
          onOpenCamera={handleTakePhoto}
          onStartRecording={startRecording}
          onStopRecording={stopRecording}
          isRecording={isRecording}
          attachmentUri={pendingAttachment}
          onRemoveAttachment={() => setPendingAttachment(null)}
        />
      }
    />
  );
}
