export type LessonStatus = "not_started" | "in_progress" | "completed";

export function getLessonStatus({
  completed,
  resumeStep,
  totalSteps,
}: {
  completed?: boolean;
  resumeStep?: number | null;
  totalSteps?: number | null;
}): LessonStatus {
  if (completed) return "completed";
  const step = typeof resumeStep === "number" ? resumeStep : 0;
  const total = typeof totalSteps === "number" ? totalSteps : 0;
  if (total > 0 && step >= total - 1) return "completed";
  if (step > 0) return "in_progress";
  return "not_started";
}

export function getCardStatusStyle(status: LessonStatus) {
  switch (status) {
    case "completed":
      return {
        bg: "$successSoft",
        subtleTextColor: "$textSecondary",
        accentLeftBarColor: "$success",
      };
    case "in_progress":
      return {
        bg: "$infoSoft",
        subtleTextColor: "$textSecondary",
        accentLeftBarColor: "$info",
      };
    default:
      return {
        bg: "$gray2",
        subtleTextColor: "$textSecondary",
        accentLeftBarColor: "$gray6",
      };
  }
}

export function aggregateStatus(statuses: LessonStatus[]): LessonStatus {
  if (!statuses.length) return "not_started";
  if (statuses.every((s) => s === "completed")) return "completed";
  if (statuses.some((s) => s === "completed" || s === "in_progress")) return "in_progress";
  return "not_started";
}
