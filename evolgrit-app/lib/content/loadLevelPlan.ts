export type LevelPlan = any;

export function loadLevelPlan(level: "A2" | "B1" | "B2"): LevelPlan {
  switch (level) {
    case "A2":
      const plan = require("../../content/a2/a2_index.json");
      const unitMap: Record<string, any> = {
        a2_u01: require("../../content/a2/units/a2_u01.json"),
        a2_u02: require("../../content/a2/units/a2_u02.json"),
        a2_u03: require("../../content/a2/units/a2_u03.json"),
        a2_u04: require("../../content/a2/units/a2_u04.json"),
        a2_u05: require("../../content/a2/units/a2_u05.json"),
        a2_u06: require("../../content/a2/units/a2_u06.json"),
        a2_u07: require("../../content/a2/units/a2_u07.json"),
        a2_u08: require("../../content/a2/units/a2_u08.json"),
        a2_u09: require("../../content/a2/units/a2_u09.json"),
        a2_u10: require("../../content/a2/units/a2_u10.json"),
        a2_u11: require("../../content/a2/units/a2_u11.json"),
        a2_u12: require("../../content/a2/units/a2_u12.json"),
        a2_u13: require("../../content/a2/units/a2_u13.json"),
        a2_u14: require("../../content/a2/units/a2_u14.json"),
        a2_u15: require("../../content/a2/units/a2_u15.json"),
        a2_u16: require("../../content/a2/units/a2_u16.json"),
      };
      return {
        ...plan,
        units: (plan.units ?? []).map((u: any) => {
          const unitData = unitMap[u.id] ?? {};
          const items = unitData.items ?? unitData.lessons ?? [];
          const normalizedItems = items.map((item: any) => {
            if (item.route) return item;
            if (item.kind === "lesson" || item.kind === "mini" || item.kind === "quiz") {
              return { ...item, route: { type: "lesson_runner", lessonId: item.id } };
            }
            return { ...item, route: { type: "stub" } };
          });
          return { ...u, items: normalizedItems };
        }),
      };
    case "B1":
      return require("../../content/b1/plan.json");
    case "B2":
      return require("../../content/b2/plan.json");
  }
}
