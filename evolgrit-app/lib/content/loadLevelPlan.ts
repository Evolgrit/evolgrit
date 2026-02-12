export type LevelPlan = any;

export function loadLevelPlan(level: "A2" | "B1" | "B2"): LevelPlan {
  switch (level) {
    case "A2":
      return require("../../content/a2/plan.json");
    case "B1":
      return require("../../content/b1/plan.json");
    case "B2":
      return require("../../content/b2/plan.json");
  }
}
