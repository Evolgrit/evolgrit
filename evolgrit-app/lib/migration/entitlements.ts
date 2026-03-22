export type PlanTier = "free" | "pro" | "premium";

export type Entitlements = {
  plan: PlanTier;
};

export function getEntitlements(): Entitlements {
  return { plan: "free" };
}

export function canStoreMoreDocuments(plan: PlanTier, currentCount: number) {
  if (plan === "free") return currentCount < 3;
  return true;
}

export function canRequestTranslation(plan: PlanTier) {
  return plan === "premium";
}
