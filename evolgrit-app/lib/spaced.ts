const DAY_MS = 24 * 60 * 60 * 1000;

type DueResult = {
  isDue: boolean;
  nextDueAt: number;
};

export function getDueStatus({
  lastSeenAt,
  wrongCount,
  successStreak,
  now,
}: {
  lastSeenAt: number;
  wrongCount: number;
  successStreak: number;
  now: number;
}): DueResult {
  if (!lastSeenAt) {
    return { isDue: true, nextDueAt: now };
  }

  if (wrongCount >= 2) {
    const nextDueAt = lastSeenAt + 2 * 60 * 60 * 1000;
    return { isDue: nextDueAt <= now, nextDueAt };
  }

  const intervals = [0, 1 * DAY_MS, 3 * DAY_MS, 7 * DAY_MS];
  const idx = Math.min(successStreak, intervals.length - 1);
  const nextDueAt = lastSeenAt + intervals[idx];
  return { isDue: nextDueAt <= now, nextDueAt };
}
