export type Locale = "de" | "en";

export type A1TaskType =
  | "speak_repeat"
  | "speak_fill_gap"
  | "listen_understand"
  | "read_understand"
  | "choice_select";

export type Hint = {
  id: string;
  title: string; // e.g. "Mini-Tipp"
  body: string; // short, non-grammar-y
  optional?: boolean; // default true
};

export type DialogueLine = {
  id: string;
  speaker: "mentor" | "learner" | "other";
  de: string; // target text (German)
  en?: string; // helper text (English) - MVP only
  pronunciation?: string; // optional syllable/stress guide
  tts?: {
    rate: "normal" | "slow";
  };
};

export type Gap = {
  id: string;
  de_template: string; // e.g. "Hallo, ich heiße ___."
  en?: string; // helper
  correct: string; // e.g. "Daniel"
  placeholder?: string; // e.g. "Name"
};

export type Choice = {
  id: string;
  label: string; // option label (can be DE or EN depending on task)
  correct?: boolean;
};

export type A1Task = {
  id: string; // stable id
  slug: string; // route-friendly
  week: number; // 1..8
  order: number; // display order within week
  duration_min: 2 | 3; // MVP
  title: string; // short
  situation: {
    title: string; // 1 line
    de: string; // 1-2 lines
    en?: string; // helper
  };
  observe?: {
    kind: "dialogue" | "single_line";
    lines: DialogueLine[];
  };
  do: {
    type: A1TaskType;
    prompt_de: string;
    prompt_en?: string;
    speak_target?: string; // what user should say (DE)
    gap?: Gap;
    choices?: Choice[];
  };
  hint?: Hint;
  success: {
    title: string; // e.g. "Erledigt"
    de: string; // short reinforcement
    en?: string;
  };
};

export type A1Week = {
  level: "A1";
  week: number;
  theme: string; // e.g. "Ankommen"
  story: {
    de: string;
    en?: string;
  };
  tasks: A1Task[];
};
