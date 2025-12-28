import type { Lesson } from "./a1_goodbye_evening";

export const lesson: Lesson = {
  id: "a1_ask_direction",
  level: "A1",
  title: "Ask for direction",
  steps: [
    { type: "context", text: "You are looking for a place in town." },
    { type: "speak_free", prompt: "What do you say now?" },
    {
      type: "feedback",
      ok: "You can ask for directions politely.",
      retry: "Try again with a clearer “Where is…?”",
    },
    { type: "hint", text: "Tip: Start with “Excuse me” for a polite question." },
    { type: "speak_guided", sentence: "Excuse me, where is the station?" },
    { type: "done", identity: "You can now ask for directions politely." },
  ],
};
