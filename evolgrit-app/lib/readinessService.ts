import AsyncStorage from "@react-native-async-storage/async-storage";
import type { ERS } from "./ersStore";

const KEY = "evolgrit.currentERS";

const clamp0to100 = (n: number) => Math.max(0, Math.min(100, Math.round(n)));

export const DEFAULT_ERS: ERS = { L: 32, A: 18, S: 55, C: 40 };

export async function loadCurrentERS(): Promise<ERS> {
  const raw = await AsyncStorage.getItem(KEY);
  return raw ? JSON.parse(raw) : DEFAULT_ERS;
}

export async function saveCurrentERS(ers: ERS) {
  const cleaned: ERS = {
    L: clamp0to100(ers.L),
    A: clamp0to100(ers.A),
    S: clamp0to100(ers.S),
    C: clamp0to100(ers.C),
  };
  await AsyncStorage.setItem(KEY, JSON.stringify(cleaned));
  return cleaned;
}

export async function applyERSDelta(delta: Partial<ERS>): Promise<ERS> {
  const cur = await loadCurrentERS();
  const next: ERS = {
    L: clamp0to100(cur.L + (delta.L ?? 0)),
    A: clamp0to100(cur.A + (delta.A ?? 0)),
    S: clamp0to100(cur.S + (delta.S ?? 0)),
    C: clamp0to100(cur.C + (delta.C ?? 0)),
  };
  await AsyncStorage.setItem(KEY, JSON.stringify(next));
  return next;
}
