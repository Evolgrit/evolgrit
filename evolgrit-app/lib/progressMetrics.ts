import { getCompletedCount } from "./progressStore";
import { getUsageStats } from "./nextActionStore";
import { getFocusMinutesToday } from "./focusStore";

export type ProgressMetrics = {
  lessonsTotal: number;
  hoursTotal: number;
  monthLabels: string[];
  monthLessonCounts: number[];
};

function lastThreeMonths() {
  const months = ["Jan", "Feb", "Mär", "Apr", "Mai", "Juni", "Juli", "Aug", "Sep", "Okt", "Nov", "Dez"];
  const now = new Date();
  const labels: string[] = [];
  for (let i = 2; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    labels.push(months[d.getMonth()]);
  }
  return labels;
}

export async function loadProgressMetrics(): Promise<ProgressMetrics> {
  const [a1, a2, b1, b2] = await Promise.all([
    getCompletedCount("A1"),
    getCompletedCount("A2"),
    getCompletedCount("B1"),
    getCompletedCount("B2"),
  ]);

  const lessonsTotal = a1 + a2 + b1 + b2;

  const [usage, focusMinutes] = await Promise.all([getUsageStats(), getFocusMinutesToday()]);
  const totalMinutes = (usage?.todayMinutes ?? 0) + (focusMinutes ?? 0);
  const hoursTotal = Math.round((totalMinutes / 60) * 10) / 10;

  const monthLabels = lastThreeMonths();
  const monthLessonCounts = [0, 0, lessonsTotal];

  return { lessonsTotal, hoursTotal, monthLabels, monthLessonCounts };
}
