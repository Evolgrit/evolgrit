import type { LifeModule, LifeModuleSummary } from "../../types/lifeContent";

const modules: Record<string, LifeModule> = {
  life_01_time: require("../../content/life/modules/life_module_01_time.json"),
  life_02_directness: require("../../content/life/modules/life_module_02_directness.json"),
  life_03_neighbors: require("../../content/life/modules/life_module_03_neighbors.json"),
  life_04_rules: require("../../content/life/modules/life_module_04_rules.json"),
  life_05_money: require("../../content/life/modules/life_module_05_money.json"),
  life_06_help: require("../../content/life/modules/life_module_06_help.json"),
};

export function loadLifeModule(moduleId: string): LifeModule {
  const m = modules[moduleId];
  if (!m) {
    return {
      moduleId,
      title: "Leben",
      subtitle: "Modul nicht gefunden",
      durationMin: 5,
      sections: [
        {
          type: "info",
          title: "Hinweis",
          text: "Dieses Modul ist noch nicht verfuegbar.",
        },
      ],
    };
  }
  return m;
}

export function loadLifeModules(): LifeModuleSummary[] {
  return Object.values(modules).map((m) => ({
    moduleId: m.moduleId,
    title: m.title,
    subtitle: m.subtitle,
    durationMin: m.durationMin,
  }));
}
