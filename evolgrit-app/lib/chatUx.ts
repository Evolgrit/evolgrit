// Pure helpers for chat rendering logic
export const THREE_HOURS_MS = 1000 * 60 * 60 * 3;

export function shouldShowTimeDivider(prevTs: number | null, nextTs: number): boolean {
  if (!prevTs) return true;
  const prev = new Date(prevTs);
  const next = new Date(nextTs);
  const dayChanged =
    prev.getFullYear() !== next.getFullYear() ||
    prev.getMonth() !== next.getMonth() ||
    prev.getDate() !== next.getDate();
  if (dayChanged) return true;
  return nextTs - prevTs > THREE_HOURS_MS;
}

export function shouldShowSpeakerLabel(prevTs: number | null, nextTs: number): boolean {
  if (!prevTs) return true;
  return nextTs - prevTs > THREE_HOURS_MS;
}
