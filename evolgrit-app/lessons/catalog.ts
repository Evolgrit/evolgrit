import type { Lesson } from "./schema";
import { A1_COURSE } from "./a1_course";
import { A2_COURSE } from "./a2_course";
import { lesson as a1TourTicketsPhotos } from "./a1_tour_tickets_photos";

export const LESSON_CATALOG: Lesson[] = [a1TourTicketsPhotos, ...A1_COURSE, ...A2_COURSE];

export function getLessonsByLevel(level: "A1" | "A2") {
  return LESSON_CATALOG.filter((l) => l.level === level);
}

export function getLessonById(id: string) {
  return LESSON_CATALOG.find((l) => l.id === id) ?? null;
}
