import AsyncStorage from "@react-native-async-storage/async-storage";
import { uuid } from "./uuid";
import { incMentorUnreadCount } from "./mentorUnreadStore";

export type MentorMessage = {
  id: string;
  role: "user" | "mentor";
  text: string;
  createdAt: string;
  ctaLabel?: string;
  ctaRoute?: string;
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

export async function addUserMessage(text: string): Promise<MentorThread> {
  const t = await loadThread();
  const next: MentorThread = {
    ...t,
    messages: [
      {
        id: uuid(),
        role: "user",
        text,
        createdAt: new Date().toISOString(),
      },
      ...t.messages,
    ],
  };
  await saveThread(next);
  return next;
}

export async function addMentorMessage(
  text: string,
  extras?: { ctaLabel?: string; ctaRoute?: string }
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
