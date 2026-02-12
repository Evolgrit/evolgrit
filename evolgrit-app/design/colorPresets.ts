export type LevelKey = "a1" | "a2" | "b1" | "b2" | "job" | "focus";

export const levelToToken = (k: LevelKey) => {
  switch (k) {
    case "a1":
      return "$a1";
    case "a2":
      return "$a2";
    case "b1":
      return "$b1";
    case "b2":
      return "$b2";
    case "job":
      return "$job";
    case "focus":
      return "$focus";
  }
};

export const levelToSoftGradient = (k: LevelKey) => {
  switch (k) {
    case "a1":
      return ["$a1Soft1", "$a1Soft2"] as const;
    case "a2":
      return ["$a2Soft1", "$a2Soft2"] as const;
    case "b1":
      return ["$b1Soft1", "$b1Soft2"] as const;
    case "b2":
      return ["$b2Soft1", "$b2Soft2"] as const;
    case "job":
      return ["$jobSoft1", "$jobSoft2"] as const;
    case "focus":
      return ["$focusSoft1", "$focusSoft2"] as const;
  }
};
