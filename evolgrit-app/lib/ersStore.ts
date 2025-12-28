import AsyncStorage from "@react-native-async-storage/async-storage";

export type ERS = { L: number; A: number; S: number; C: number };

export type ERSSnapshot = {
  id: string;
  createdAt: string; // ISO
  phase: "A1" | "A2" | "B1";
  week: number;
  ers: ERS;
  limiter: keyof ERS;
};

const KEY = "evolgrit.ersSnapshots";

const clamp0to100 = (n: number) => Math.max(0, Math.min(100, n));

export function ersMin(e: ERS) {
  return Math.min(e.L, e.A, e.S, e.C);
}

export function readinessState(score: number): "green" | "yellow" | "red" {
  if (score >= 70) return "green";
  if (score >= 40) return "yellow";
  return "red";
}

export function limiterOf(e: ERS): keyof ERS {
  const m = ersMin(e);
  // WHOOP priority: A > C > L > S
  if (e.A === m) return "A";
  if (e.C === m) return "C";
  if (e.L === m) return "L";
  return "S";
}

function uuid() {
  return `${Date.now()}-${Math.random().toString(16).slice(2)}-${Math.random().toString(16).slice(2)}`;
}

export async function loadSnapshots(): Promise<ERSSnapshot[]> {
  const raw = await AsyncStorage.getItem(KEY);
  return raw ? JSON.parse(raw) : [];
}

export async function saveSnapshots(items: ERSSnapshot[]) {
  await AsyncStorage.setItem(KEY, JSON.stringify(items));
}

export async function addWeeklySnapshot(params: {
  phase: "A1" | "A2" | "B1";
  week: number;
  ers: ERS;
}): Promise<ERSSnapshot[]> {
  const current = await loadSnapshots();
  const snap: ERSSnapshot = {
    id: uuid(),
    createdAt: new Date().toISOString(),
    phase: params.phase,
    week: params.week,
    ers: {
      L: clamp0to100(params.ers.L),
      A: clamp0to100(params.ers.A),
      S: clamp0to100(params.ers.S),
      C: clamp0to100(params.ers.C),
    },
    limiter: limiterOf(params.ers),
  };
  const next = [snap, ...current];
  await saveSnapshots(next);
  return next;
}

export async function clearSnapshots() {
  await AsyncStorage.removeItem(KEY);
}
