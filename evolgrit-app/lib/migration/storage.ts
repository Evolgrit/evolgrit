import AsyncStorage from "@react-native-async-storage/async-storage";
import type { DocumentItem, MigrationProfile, ProcessStatus } from "./types";
import { defaultDocuments, defaultProcessStatus, defaultProfile } from "./templates";

const PROFILE_KEY = "evolgrit.migration.profile";
const DOCS_KEY = "evolgrit.migration.documents";
const STATUS_KEY = "evolgrit.migration.status";

function safeParse<T>(raw: string | null, fallback: T): T {
  if (!raw) return fallback;
  try {
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

export async function getMigrationProfile(): Promise<MigrationProfile> {
  const raw = await AsyncStorage.getItem(PROFILE_KEY);
  return safeParse(raw, defaultProfile());
}

export async function setMigrationProfile(profile: MigrationProfile) {
  await AsyncStorage.setItem(PROFILE_KEY, JSON.stringify(profile));
}

export async function getDocuments(): Promise<DocumentItem[]> {
  const raw = await AsyncStorage.getItem(DOCS_KEY);
  if (raw) return safeParse(raw, []);
  const defaults = defaultDocuments();
  await AsyncStorage.setItem(DOCS_KEY, JSON.stringify(defaults));
  return defaults;
}

export async function upsertDocument(item: DocumentItem) {
  const docs = await getDocuments();
  const idx = docs.findIndex((d) => d.id === item.id);
  const next = [...docs];
  if (idx >= 0) next[idx] = item;
  else next.push(item);
  await AsyncStorage.setItem(DOCS_KEY, JSON.stringify(next));
}

export async function deleteDocument(id: string) {
  const docs = await getDocuments();
  const next = docs.filter((d) => d.id !== id);
  await AsyncStorage.setItem(DOCS_KEY, JSON.stringify(next));
}

export async function getProcessStatus(): Promise<ProcessStatus> {
  const raw = await AsyncStorage.getItem(STATUS_KEY);
  if (raw) return safeParse(raw, defaultProcessStatus());
  const defaults = defaultProcessStatus();
  await AsyncStorage.setItem(STATUS_KEY, JSON.stringify(defaults));
  return defaults;
}

export async function setProcessStatus(status: ProcessStatus) {
  await AsyncStorage.setItem(STATUS_KEY, JSON.stringify(status));
}
