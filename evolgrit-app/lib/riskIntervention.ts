import { triggerMentorIntervention } from "./mentorService";

export async function evaluateRiskAndIntervene(riskLevel: "green" | "yellow" | "red") {
  if (riskLevel === "red") {
    await triggerMentorIntervention("high_risk");
  }
}
