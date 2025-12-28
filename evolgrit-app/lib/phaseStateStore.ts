import AsyncStorage from "@react-native-async-storage/async-storage";

export type PhaseKey = "A1" | "A2" | "B1";

export type PhaseState = {
  phase: PhaseKey; // current phase
  week: number; // current week in phase (1..)
  maxUnlockedWeek: number; // highest unlocked week in current phase
};

const KEY = "evolgrit.phaseState";

const DEFAULT_STATE: PhaseState = {
  phase: "A1",
  week: 1,
  maxUnlockedWeek: 1,
};

export async function loadPhaseState(): Promise<PhaseState> {
  const raw = await AsyncStorage.getItem(KEY);
  return raw ? JSON.parse(raw) : DEFAULT_STATE;
}

export async function savePhaseState(state: PhaseState) {
  await AsyncStorage.setItem(KEY, JSON.stringify(state));
}

export async function markCurrentWeekComplete(): Promise<PhaseState> {
  const s = await loadPhaseState();
  const nextWeek = s.week + 1;

  const updated: PhaseState = {
    ...s,
    week: nextWeek,
    maxUnlockedWeek: Math.max(s.maxUnlockedWeek, nextWeek),
  };

  await savePhaseState(updated);
  return updated;
}

export async function resetPhaseState(): Promise<void> {
  await AsyncStorage.removeItem(KEY);
}

export async function unlockAllWeeksForCurrentPhase(): Promise<PhaseState> {
  const s = await loadPhaseState();
  const updated: PhaseState = { ...s, maxUnlockedWeek: 99 };
  await savePhaseState(updated);
  return updated;
}
