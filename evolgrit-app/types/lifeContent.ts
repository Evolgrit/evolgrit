export type LifeSection =
  | { type: "info"; title: string; text: string }
  | { type: "do_dont"; title: string; items: { kind: "do" | "dont"; text: string }[] }
  | {
      type: "skill_choice";
      title: string;
      question: string;
      options: string[];
      correctIndex: number;
      explain: string;
    }
  | { type: "examples"; title: string; items: string[] };

export type LifeModule = {
  moduleId: string;
  title: string;
  subtitle: string;
  durationMin: number;
  sections: LifeSection[];
};

export type LifeModuleSummary = Pick<LifeModule, "moduleId" | "title" | "subtitle" | "durationMin">;
