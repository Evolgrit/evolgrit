import { A1_LESSON_IMAGES } from "./a1";
import { A2_LESSON_IMAGES, getA2LessonImage } from "./a2";

export const LESSON_IMAGES: Record<string, any> = {
  ...A1_LESSON_IMAGES,
  ...A2_LESSON_IMAGES,
};

export const PLACEHOLDER_IMAGE = require("../images/icon.png");

export function getLessonImage(key?: string | null) {
  if (!key) return PLACEHOLDER_IMAGE;
  return LESSON_IMAGES[key] ?? PLACEHOLDER_IMAGE;
}

export { A2_LESSON_IMAGES, getA2LessonImage };
