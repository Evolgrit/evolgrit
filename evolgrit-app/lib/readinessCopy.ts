export type ReadinessState = "green" | "yellow" | "red";

export const READINESS_COPY: Record<
  ReadinessState,
  { title: string; status: string; limiter: string; action: string }
> = {
  green: {
    title: "You’re on track.",
    status: "Your readiness is stable today.",
    limiter: "No major blockers detected.",
    action: "Keep your routine. One short practice is enough.",
  },
  yellow: {
    title: "Focus needed.",
    status: "Your readiness can improve with one adjustment.",
    limiter: "Readiness is limited by Application.",
    action: "Do one real-life simulation today (shop / transport / work).",
  },
  red: {
    title: "Let’s stabilize first.",
    status: "Your readiness is low today. That’s okay.",
    limiter: "Multiple areas need attention. Start with Application.",
    action: "Do one simple speaking drill. Short and focused.",
  },
};
