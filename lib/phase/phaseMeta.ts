export type Phase =
  | "orientation"
  | "language_life"
  | "job_readiness"
  | "matching";

export const phaseMeta: Record<Phase, {
  label: string;
  title: string;
  description: string;
}> = {
  orientation: {
    label: "Phase 1",
    title: "Arrival & foundations",
    description: "Orientation, onboarding basics and settling safely in Germany.",
  },
  language_life: {
    label: "Phase 2",
    title: "Language & everyday life",
    description: "Everyday German plus cultural confidence for transport, housing and offices.",
  },
  job_readiness: {
    label: "Phase 3",
    title: "Job readiness",
    description: "Role-specific language, mentor guidance and clear next steps into work.",
  },
  matching: {
    label: "Phase 4",
    title: "Matching & onboarding",
    description: "Learner is ready for employers – matching, documents and onboarding support.",
  },
};
