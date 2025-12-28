import AsyncStorage from "@react-native-async-storage/async-storage";
import { uuid } from "./uuid";

export type EventName =
  | "next_action_shown"
  | "next_action_completed"
  | "task_started"
  | "task_completed"
  | "checkin_submitted";

export type AppEvent = {
  id: string;
  name: EventName;
  createdAt: string; // ISO
  payload?: Record<string, any>;
};

const KEY = "evolgrit.events";

export async function loadEvents(): Promise<AppEvent[]> {
  const raw = await AsyncStorage.getItem(KEY);
  return raw ? JSON.parse(raw) : [];
}

export async function appendEvent(name: EventName, payload?: Record<string, any>) {
  const events = await loadEvents();
  const e: AppEvent = {
    id: uuid(),
    name,
    createdAt: new Date().toISOString(),
    payload,
  };
  const next = [e, ...events].slice(0, 200); // keep last 200
  await AsyncStorage.setItem(KEY, JSON.stringify(next));
  return next;
}

export async function lastEvent(name: EventName): Promise<AppEvent | null> {
  const events = await loadEvents();
  return events.find((e) => e.name === name) ?? null;
}

export async function appendEventAt(
  name: EventName,
  createdAtISO: string,
  payload?: Record<string, any>
) {
  const events = await loadEvents();
  const e: AppEvent = {
    id: uuid(),
    name,
    createdAt: createdAtISO,
    payload,
  };
  const next = [e, ...events].slice(0, 200);
  await AsyncStorage.setItem(KEY, JSON.stringify(next));
  return next;
}
