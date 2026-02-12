import type { ReviewItem } from "./spaced";

type LessonStep =
  | {
      type: "listen_repeat";
      ttsText: string;
      prompt: string;
    }
  | {
      type: "cloze_choice";
      text: string;
      prompt: string;
      choices: { id: string; label: string }[];
      answer: string;
    }
  | { type: string };

type Lesson = {
  id: string;
  level?: string;
  steps: LessonStep[];
};

export function makeReviewItemsFromLesson(lesson: Lesson) {
  const now = Date.now();
  const items: ReviewItem[] = [];
  lesson.steps.forEach((step, index) => {
    if (step.type === "listen_repeat" && "ttsText" in step) {
      items.push({
        id: `${lesson.id}:listen:${index}`,
        level: "A1",
        prompt: `Sprich: ${step.ttsText}`,
        answer: step.ttsText,
        nextDueAt: now,
        intervalDays: 1,
        ease: 2.5,
        reps: 0,
      });
    }
    if (step.type === "cloze_choice" && "choices" in step && "answer" in step) {
      const answerLabel = step.choices.find((choice: { id: string; label: string }) => choice.id === step.answer)?.label;
      if (!answerLabel) return;
      items.push({
        id: `${lesson.id}:cloze:${index}`,
        level: "A1",
        prompt: step.text,
        answer: answerLabel,
        nextDueAt: now,
        intervalDays: 1,
        ease: 2.5,
        reps: 0,
      });
    }
  });
  return items;
}
