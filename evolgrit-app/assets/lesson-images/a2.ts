const PLACEHOLDER_IMAGE = require("../images/icon.png");

export const A2_LESSON_IMAGES = {
  smalltalk_wiegehts_correct: PLACEHOLDER_IMAGE,
  smalltalk_danke_distract: PLACEHOLDER_IMAGE,
} as const;

export type A2LessonImageKey = keyof typeof A2_LESSON_IMAGES;

export function getA2LessonImage(key?: string | null) {
  if (!key) return PLACEHOLDER_IMAGE;
  return A2_LESSON_IMAGES[key as A2LessonImageKey] ?? PLACEHOLDER_IMAGE;
}
