import type { Lesson } from "./a1_goodbye_evening";

export const lesson: Lesson = {
  id: "a1_introduce",
  level: "A1",
  title: "Introduce yourself",
  steps: [
    { type: "context", text: "You meet someone for the first time." },
    { type: "speak_free", prompt: "What do you say now?" },
    {
      type: "feedback",
      ok: "You can introduce yourself politely.",
      retry: "Try again with a clearer “My name is…”",
    },
    { type: "hint", text: "Tip: Keep it short: name + nice to meet you." },
    { type: "speak_guided", sentence: "Hi, my name is Daniel. Nice to meet you." },
    { type: "done", identity: "You can now introduce yourself politely." },
  ],
};
