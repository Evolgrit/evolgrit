export type LessonStep =
  | { type: "context"; text: string }
  | { type: "speak_free"; prompt: string }
  | { type: "feedback"; ok: string; retry: string }
  | { type: "hint"; text: string }
  | { type: "speak_guided"; sentence: string }
  | { type: "done"; identity: string };

export type Lesson = {
  id: string;
  level: "A1" | "A2" | "B1";
  title: string;
  steps: LessonStep[];
};

export const lesson: Lesson = {
  id: "a1_goodbye_evening",
  level: "A1",
  title: "Goodbye in the evening",
  steps: [
    { type: "context", text: "You are leaving in the evening." },
    { type: "speak_free", prompt: "What do you say now?" },
    {
      type: "feedback",
      ok: "You can say this when you leave in the evening.",
      retry: "Try again with clearer “night”.",
    },
    { type: "hint", text: "“Good night” is used when you leave in the evening." },
    { type: "speak_guided", sentence: "Good night." },
    { type: "done", identity: "You can now say goodbye politely in the evening." },
  ],
};
