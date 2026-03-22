import { deriveNextAction } from "./deriveNextAction";
import {
  getUsageStats,
  getLastJobFocus,
  type NextActionType,
} from "./nextActionStore";
import { getDailyQueue } from "./storage/cards";
import { getDocuments } from "./migration/storage";

export type HomeCard =
  | {
      kind: "next_action";
      actionType: NextActionType;
      title: string;
      subtitle: string;
      cta: string;
      route: string;
      accent: "blue" | "indigo" | "green" | "gray";
      durationMin: number;
    }
  | { kind: "daily_training"; count: number; route: string }
  | { kind: "migration_plan"; progress: number; missing: number; route: string }
  | { kind: "resume"; title: string; subtitle: string; cta: string; route: string }
  | { kind: "job"; title: string; subtitle: string; cta: string; route: string }
  | { kind: "focus"; title: string; subtitle: string; cta: string; route: string };

export async function buildHomeCards(): Promise<{ cards: HomeCard[]; todayMinutes: number }> {
  const [next, stats, jobKey, docs] = await Promise.all([
    deriveNextAction(),
    getUsageStats(),
    getLastJobFocus(),
    getDocuments(),
  ]);
  const dailyQueue = await getDailyQueue();
  const missing = docs.filter((d) => d.status === "missing").length;
  const uploaded = docs.filter((d) => d.status === "uploaded").length;
  const progress = docs.length ? Math.round((uploaded / docs.length) * 100) : 0;

  const cards: HomeCard[] = [];

  cards.push({
    kind: "next_action",
    actionType: next.type,
    title: next.title,
    subtitle: next.subtitle,
    cta: next.cta,
    route: next.route,
    accent: next.accent,
    durationMin: next.durationMin,
  });

  cards.push({
    kind: "daily_training",
    count: dailyQueue.length,
    route: "/practice/daily",
  });

  cards.push({
    kind: "migration_plan",
    progress,
    missing,
    route: "/journey",
  });

  if (jobKey && next.type !== "job_drill") {
    const jobRoute = jobKey === "pflege" ? "/learn/job/pflege" : `/learn/job/${jobKey}`;
    const jobLabel = jobKey === "pflege" ? "Pflege" : jobKey;
    cards.push({
      kind: "job",
      title: `Job-Fokus: ${jobLabel}`,
      subtitle: "Weiter im Modul-Training.",
      cta: "Öffnen",
      route: jobRoute,
    });
  }

  if ((stats?.todayMinutes ?? 0) === 0) {
    cards.push({
      kind: "focus",
      title: "2 Minuten Ruhe",
      subtitle: "Kurz ankommen, dann lernen.",
      cta: "Starten",
      route: "/focus",
    });
  }

  return { cards: cards.slice(0, 4), todayMinutes: stats?.todayMinutes ?? 0 };
}
