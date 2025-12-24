import { Phase } from "./phaseMeta";

export type PhaseSignals = {
  onboardingPercent: number;
  modulesCompletedPercent: number;
  weeksInJourney?: number;
  readinessScore?: number;
};

export function computePhase(signals: PhaseSignals): Phase {
  const readiness = signals.readinessScore ?? signals.modulesCompletedPercent;

  if (readiness >= 85 && (signals.onboardingPercent ?? 0) >= 80) {
    return "matching";
  }
  if (readiness >= 60) {
    return "job_readiness";
  }
  if (readiness >= 30) {
    return "language_life";
  }
  return "orientation";
}
