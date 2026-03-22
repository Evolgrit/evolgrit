import { getLastJobFocus, getLastResumeLesson, type NextAction } from "./nextActionStore";

function inferAccent(route: string): NextAction["accent"] {
  const lower = route.toLowerCase();
  if (lower.includes("/lesson-runner/a1") || lower.includes("a1_")) return "blue";
  if (lower.includes("/lesson-runner/a2") || lower.includes("a2_")) return "blue";
  if (lower.includes("/lesson-runner/b1") || lower.includes("b1_")) return "indigo";
  if (lower.includes("/lesson-runner/b2") || lower.includes("b2_")) return "indigo";
  if (lower.includes("/learn/job") || lower.includes("pflege")) return "green";
  return "gray";
}

function jobTitle(jobKey: string | null) {
  if (!jobKey) return "3 Minuten Sprechen";
  const map: Record<string, string> = {
    pflege: "3 Minuten: Pflege",
    handwerk: "3 Minuten: Handwerk",
    gastro: "3 Minuten: Gastro",
    logistik: "3 Minuten: Logistik",
    reinigung: "3 Minuten: Reinigung",
    lager: "3 Minuten: Lager",
    kueche: "3 Minuten: Küche",
  };
  return map[jobKey] ?? "3 Minuten Sprechen";
}

export async function deriveNextAction(): Promise<NextAction> {
  const resumeRoute = await getLastResumeLesson();
  if (resumeRoute) {
    return {
      type: "resume_lesson",
      title: "3 Minuten Sprechen",
      subtitle: "Kurze Übung. Ruhiger Fortschritt.",
      cta: "Jetzt starten · 3 Min",
      route: resumeRoute,
      durationMin: 3,
      accent: inferAccent(resumeRoute),
    };
  }

  const jobKey = await getLastJobFocus();
  if (jobKey) {
    const route = jobKey === "pflege" ? "/learn/job/pflege" : "/learn/job/track";
    return {
      type: "job_drill",
      title: jobTitle(jobKey),
      subtitle: "Kurze Übung. Ruhiger Fortschritt.",
      cta: "Jetzt starten · 3 Min",
      route,
      durationMin: 3,
      accent: "green",
    };
  }

  return {
    type: "speak_drill",
    title: "3 Minuten Sprechen",
    subtitle: "Kurze Übung. Ruhiger Fortschritt.",
    cta: "Jetzt starten · 3 Min",
    route: "/speak-task",
    durationMin: 3,
    accent: "gray",
  };
}
