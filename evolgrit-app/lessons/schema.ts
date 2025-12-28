export type LessonStep =
  | { type: "context"; text: string }
  | { type: "speak_free"; prompt: string }
  | { type: "feedback"; ok: string; retry: string }
  | { type: "hint"; text: string }
  | { type: "speak_guided"; sentence: string }
  | { type: "listen_card"; image?: string; phrase: string; translation: string }
  | { type: "speak_repeat"; prompt: string; target: string }
  | {
      type: "choice_fill";
      sentencePrefix: string;
      sentenceSuffix: string;
      options: string[];
      correct: string;
      translation: string;
    }
  | { type: "dialogue"; speaker: "mentor" | "you"; text: string; translation?: string; highlight?: string }
  | { type: "hint_banner"; text: string }
  | { type: "done"; identity: string };

export type LessonLevel = "A1" | "A2" | "B1";

export type Lesson = {
  id: string;
  level: LessonLevel;
  title: string;
  capability: string; // e.g. "ask_directions"
  tags: string[]; // e.g. ["transport","politeness"]
  steps: LessonStep[];
};
