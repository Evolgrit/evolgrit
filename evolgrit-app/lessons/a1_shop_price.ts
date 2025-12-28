import type { Lesson } from "./a1_goodbye_evening";

export const lesson: Lesson = {
  id: "a1_shop_price",
  level: "A1",
  title: "Ask for the price",
  steps: [
    { type: "context", text: "You are in a shop." },
    { type: "speak_free", prompt: "What do you say now?" },
    {
      type: "feedback",
      ok: "You can ask for the price in a shop.",
      retry: "Try again with a clearer “How much…?”",
    },
    { type: "hint", text: "Tip: “How much is this?” is enough." },
    { type: "speak_guided", sentence: "How much is this?" },
    { type: "done", identity: "You can now ask for the price in a shop." },
  ],
};
