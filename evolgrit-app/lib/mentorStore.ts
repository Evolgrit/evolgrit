import AsyncStorage from "@react-native-async-storage/async-storage";
import { uuid } from "./uuid";
import { incMentorUnreadCount } from "./mentorUnreadStore";

export type MentorMessage = {
  id: string;
  role: "user" | "mentor";
  text: string;
  createdAt: string;
  kind?: "mentor" | "system" | "next_action";
  ctaLabel?: string;
  ctaRoute?: string;
  imageUri?: string | null;
  audioUri?: string | null;
  durationMs?: number | null;
  uploadStatus?: "pending" | "sent" | "failed";
  remoteUri?: string | null;
};

export type MentorThread = {
  id: string;
  title: string;
  messages: MentorMessage[];
};

const KEY = "evolgrit.mentorThread";

export async function loadThread(): Promise<MentorThread> {
  const raw = await AsyncStorage.getItem(KEY);
  if (raw) return JSON.parse(raw);

  const initial: MentorThread = {
    id: uuid(),
    title: "Mentor Inbox",
    messages: [],
  };
  await AsyncStorage.setItem(KEY, JSON.stringify(initial));
  return initial;
}

export async function saveThread(t: MentorThread) {
  await AsyncStorage.setItem(KEY, JSON.stringify(t));
}

export async function addUserMessage(
  text: string,
  extras?: {
    imageUri?: string | null;
    audioUri?: string | null;
    durationMs?: number | null;
    uploadStatus?: "pending" | "sent" | "failed";
    remoteUri?: string | null;
  }
): Promise<MentorThread> {
  const t = await loadThread();
  const next: MentorThread = {
    ...t,
    messages: [
      {
        id: uuid(),
        role: "user",
        text,
        createdAt: new Date().toISOString(),
        ...(extras?.imageUri ? { imageUri: extras.imageUri } : {}),
        ...(extras?.audioUri ? { audioUri: extras.audioUri } : {}),
        ...(extras?.durationMs ? { durationMs: extras.durationMs } : {}),
        ...(extras?.uploadStatus ? { uploadStatus: extras.uploadStatus } : {}),
        ...(extras?.remoteUri ? { remoteUri: extras.remoteUri } : {}),
      },
      ...t.messages,
    ],
  };
  await saveThread(next);
  return next;
}

export async function addMentorMessage(
  text: string,
  extras?: { ctaLabel?: string; ctaRoute?: string; kind?: MentorMessage["kind"] }
): Promise<MentorThread> {
  const t = await loadThread();
  const next: MentorThread = {
    ...t,
    messages: [
      {
        id: uuid(),
        role: "mentor",
        text,
        createdAt: new Date().toISOString(),
        ...(extras?.kind ? { kind: extras.kind } : {}),
        ...(extras?.ctaLabel ? { ctaLabel: extras.ctaLabel } : {}),
        ...(extras?.ctaRoute ? { ctaRoute: extras.ctaRoute } : {}),
      },
      ...t.messages,
    ],
  };
  await saveThread(next);
  await incMentorUnreadCount(1);
  return next;
}

export async function resetMentorThread() {
  await AsyncStorage.removeItem(KEY);
}

export async function updateMessage(messageId: string, patch: Partial<MentorMessage>): Promise<MentorThread | null> {
  const t = await loadThread();
  const idx = t.messages.findIndex((m) => m.id === messageId);
  if (idx === -1) return t;
  const updated = { ...t.messages[idx], ...patch };
  const next: MentorThread = {
    ...t,
    messages: [...t.messages.slice(0, idx), updated, ...t.messages.slice(idx + 1)],
  };
  await saveThread(next);
  return next;
}
