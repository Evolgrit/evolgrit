import AsyncStorage from "@react-native-async-storage/async-storage";

export type TrackCategory = "language" | "job" | "life" | "focus" | "speak";
export type TrackAction =
  | "lesson_complete"
  | "module_complete"
  | "live_dialogue_complete"
  | "focus_session_complete"
  | "speak_minutes"
  | "lesson_minutes";

export type TrackEvent = {
  ts: number;
  category: TrackCategory;
  action: TrackAction;
  durationSec?: number;
  level?: "A1" | "A2" | "B1" | "B2" | "JOB_PFLEGE" | "JOB_HANDWERK";
  id?: string;
};

export type ProgressSummary = {
  minutesTotal: number;
  minutesSpeak: number;
  completedTotal: number;
  streakDays: number;
  categoryBreakdown: Record<TrackCategory, { minutes: number; completes: number }>;
};

export type MonthBuckets = {
  labels: string[];
  languageLessons: number[];
  jobCompletes: number[];
  focusMinutes: number[];
};

const KEY = "evolgrit:track:v1";
const MAX_EVENTS = 2000;

function dayKey(ts: number) {
  return new Date(ts).toISOString().slice(0, 10);
}

function monthKey(ts: number) {
  const d = new Date(ts);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
}

function monthLabel(key: string) {
  const [y, m] = key.split("-");
  const names = ["Jan", "Feb", "Mär", "Apr", "Mai", "Juni", "Juli", "Aug", "Sep", "Okt", "Nov", "Dez"];
  const idx = Number(m) - 1;
  return names[idx] ?? `${m}.${y}`;
}

async function loadEvents(): Promise<TrackEvent[]> {
  const raw = await AsyncStorage.getItem(KEY);
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

async function saveEvents(events: TrackEvent[]) {
  const next = events.slice(-MAX_EVENTS);
  await AsyncStorage.setItem(KEY, JSON.stringify(next));
}

export async function track(event: TrackEvent): Promise<void> {
  try {
    const events = await loadEvents();
    events.push(event);
    await saveEvents(events);
  } catch {
    // ignore
  }
}

export async function getEvents(sinceMs?: number): Promise<TrackEvent[]> {
  const events = await loadEvents();
  if (!sinceMs) return events;
  return events.filter((e) => e.ts >= sinceMs);
}

export async function getSummary(days: 7 | 30 | 90): Promise<ProgressSummary> {
  const since = Date.now() - days * 24 * 60 * 60 * 1000;
  const events = await getEvents(since);

  const categoryBreakdown: ProgressSummary["categoryBreakdown"] = {
    language: { minutes: 0, completes: 0 },
    job: { minutes: 0, completes: 0 },
    life: { minutes: 0, completes: 0 },
    focus: { minutes: 0, completes: 0 },
    speak: { minutes: 0, completes: 0 },
  };

  let minutesTotal = 0;
  let minutesSpeak = 0;
  let completedTotal = 0;

  const perDay: Record<string, number> = {};

  events.forEach((e) => {
    const mins = e.durationSec ? e.durationSec / 60 : 0;
    if (mins) {
      minutesTotal += mins;
      categoryBreakdown[e.category].minutes += mins;
      perDay[dayKey(e.ts)] = (perDay[dayKey(e.ts)] ?? 0) + mins;
    }
    if (e.action.endsWith("_complete")) {
      completedTotal += 1;
      categoryBreakdown[e.category].completes += 1;
    }
    if (e.category === "speak" || e.category === "focus") {
      minutesSpeak += mins;
    }
  });

  const today = dayKey(Date.now());
  let streakDays = 0;
  for (let i = 0; i < days; i++) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const key = dayKey(d.getTime());
    const mins = perDay[key] ?? 0;
    if (mins >= 3) {
      streakDays += 1;
    } else {
      if (key !== today) break;
      if (i === 0) break;
    }
  }

  return {
    minutesTotal: Math.round(minutesTotal),
    minutesSpeak: Math.round(minutesSpeak),
    completedTotal,
    streakDays,
    categoryBreakdown,
  };
}

export async function getMonthBuckets(monthsBack: 3): Promise<MonthBuckets> {
  const events = await getEvents();
  const now = new Date();
  const keys: string[] = [];
  for (let i = monthsBack - 1; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    keys.push(`${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`);
  }

  const languageLessons = keys.map(() => 0);
  const jobCompletes = keys.map(() => 0);
  const focusMinutes = keys.map(() => 0);

  events.forEach((e) => {
    const key = monthKey(e.ts);
    const idx = keys.indexOf(key);
    if (idx === -1) return;
    if (e.category === "language" && e.action === "lesson_complete") {
      languageLessons[idx] += 1;
    }
    if (e.category === "job" && e.action.endsWith("_complete")) {
      jobCompletes[idx] += 1;
    }
    if (e.category === "focus" && e.durationSec) {
      focusMinutes[idx] += Math.round(e.durationSec / 60);
    }
  });

  return {
    labels: keys.map(monthLabel),
    languageLessons,
    jobCompletes,
    focusMinutes,
  };
}
