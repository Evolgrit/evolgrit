import { deriveNextAction } from "./deriveNextAction";
import {
  getUsageStats,
  getLastJobFocus,
  type NextActionType,
} from "./nextActionStore";

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
  | { kind: "resume"; title: string; subtitle: string; cta: string; route: string }
  | { kind: "job"; title: string; subtitle: string; cta: string; route: string }
  | { kind: "focus"; title: string; subtitle: string; cta: string; route: string };

export async function buildHomeCards(): Promise<{ cards: HomeCard[]; todayMinutes: number }> {
  const [next, stats, jobKey] = await Promise.all([
    deriveNextAction(),
    getUsageStats(),
    getLastJobFocus(),
  ]);

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
