import type { Lesson } from "./schema";

export const lesson: Lesson = {
  id: "a1_tour_tickets_photos",
  level: "A1",
  title: "Tour tickets & photos",
  capability: "tour_questions",
  tags: ["tour", "tickets", "politeness"],
  steps: [
    { type: "context", text: "You are buying tickets for a tour." },
    {
      type: "listen_card",
      phrase: "Is there a discount for children?",
      translation: "Gibt es eine Ermäßigung für Kinder?",
    },
    {
      type: "speak_repeat",
      prompt: "Repeat the question",
      target: "Is there a discount for children?",
    },
    {
      type: "choice_fill",
      sentencePrefix: "The",
      sentenceSuffix: "is so cheap!",
      options: ["admission fee", "audio guide"],
      correct: "admission fee",
      translation: "Der Eintritt ist so günstig!",
    },
    {
      type: "dialogue",
      speaker: "mentor",
      text: "Kids under 12 get in free.",
      translation: "Kinder unter 12 kommen kostenlos rein.",
    },
    {
      type: "listen_card",
      phrase: "Can we take pictures?",
      translation: "Können wir Fotos machen?",
    },
    {
      type: "speak_repeat",
      prompt: "Repeat the question",
      target: "Can we take pictures?",
    },
    {
      type: "hint_banner",
      text: "Tip: “Can we…?” is a polite question.",
    },
    {
      type: "done",
      identity: "You can now ask simple questions on a tour.",
    },
  ],
};
