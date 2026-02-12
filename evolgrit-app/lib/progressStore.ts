import AsyncStorage from "@react-native-async-storage/async-storage";

export type LevelId = "A1" | "A2" | "B1" | "B2";

export type ProgressState = {
  levelUnlocked: Record<LevelId, boolean>;
  completedLessons: Record<LevelId, Record<string, boolean>>;
  lastSeenAt: Record<string, number>;
  wrongCount: Record<string, number>;
  successStreak: Record<string, number>;
};

const STORAGE_KEY = "@evolgrit/progress";

const defaultState: ProgressState = {
  levelUnlocked: {
    A1: true,
    A2: false,
    B1: false,
    B2: false,
  },
  completedLessons: {
    A1: {},
    A2: {},
    B1: {},
    B2: {},
  },
  lastSeenAt: {},
  wrongCount: {},
  successStreak: {},
};

const readState = async () => {
  try {
    const raw = await AsyncStorage.getItem(STORAGE_KEY);
    if (!raw) return { ...defaultState };
    const parsed = JSON.parse(raw) as Partial<ProgressState>;
    return {
      ...defaultState,
      ...parsed,
      levelUnlocked: { ...defaultState.levelUnlocked, ...parsed.levelUnlocked },
      completedLessons: { ...defaultState.completedLessons, ...parsed.completedLessons },
      lastSeenAt: { ...defaultState.lastSeenAt, ...parsed.lastSeenAt },
      wrongCount: { ...defaultState.wrongCount, ...parsed.wrongCount },
      successStreak: { ...defaultState.successStreak, ...parsed.successStreak },
    };
  } catch {
    return { ...defaultState };
  }
};

const writeState = async (state: ProgressState) => {
  try {
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    // ignore
  }
};

export async function isLevelUnlocked(level: LevelId) {
  const state = await readState();
  return !!state.levelUnlocked[level];
}

export async function unlockLevel(level: LevelId) {
  const state = await readState();
  if (state.levelUnlocked[level]) return;
  const next: ProgressState = {
    ...state,
    levelUnlocked: { ...state.levelUnlocked, [level]: true },
  };
  await writeState(next);
}

export async function markLessonCompleted(level: LevelId, lessonId: string) {
  const state = await readState();
  const next: ProgressState = {
    ...state,
    completedLessons: {
      ...state.completedLessons,
      [level]: {
        ...state.completedLessons[level],
        [lessonId]: true,
      },
    },
  };
  await writeState(next);
}

export async function getCompletedCount(level: LevelId) {
  const state = await readState();
  return Object.keys(state.completedLessons[level]).length;
}

export async function setLastSeen(level: LevelId, itemId: string) {
  const state = await readState();
  const key = `${level}:${itemId}`;
  const next: ProgressState = {
    ...state,
    lastSeenAt: { ...state.lastSeenAt, [key]: Date.now() },
  };
  await writeState(next);
}

export async function bumpWrong(level: LevelId, itemId: string) {
  const state = await readState();
  const key = `${level}:${itemId}`;
  const current = state.wrongCount[key] ?? 0;
  const next: ProgressState = {
    ...state,
    wrongCount: { ...state.wrongCount, [key]: current + 1 },
  };
  await writeState(next);
}

export async function setWrongCount(level: LevelId, itemId: string, nextCount: number) {
  const state = await readState();
  const key = `${level}:${itemId}`;
  const next: ProgressState = {
    ...state,
    wrongCount: { ...state.wrongCount, [key]: nextCount },
  };
  await writeState(next);
}

export async function getItemProgress(level: LevelId, itemId: string) {
  const state = await readState();
  const key = `${level}:${itemId}`;
  return {
    lastSeenAt: state.lastSeenAt[key] ?? 0,
    wrongCount: state.wrongCount[key] ?? 0,
    successStreak: state.successStreak[key] ?? 0,
  };
}

export async function setSuccessStreak(level: LevelId, itemId: string, nextStreak: number) {
  const state = await readState();
  const key = `${level}:${itemId}`;
  const next: ProgressState = {
    ...state,
    successStreak: { ...state.successStreak, [key]: nextStreak },
  };
  await writeState(next);
}

export async function getProgressState() {
  return readState();
}

export async function resetA1Progress() {
  const state = await readState();
  const next: ProgressState = {
    ...state,
    levelUnlocked: { ...state.levelUnlocked, A2: false },
    completedLessons: { ...state.completedLessons, A1: {} },
    successStreak: {},
    wrongCount: {},
    lastSeenAt: {},
  };
  await writeState(next);
}
