export const A1_LESSON_IMAGES = {
  // Greeting / Hallo
  greet_hallo_correct: require("../images/lessons/A1/greeting/a1_greeting_hello_correct_01.jpg"),
  greet_hallo_distract: require("../images/lessons/A1/yesno/a1_yesno_hallo_distract_01.jpg"),

  // Formal greeting (Guten Tag)
  greet_formal: require("../images/lessons/A1/market/a1_greeting_gutentag_correct_01.jpg"),

  // Simple hello/yes fallbacks
  hello: require("../images/lessons/A1/greeting/a1_greeting_hello_correct_01.jpg"),
  yes: require("../images/lessons/A1/yesno/a1_yesno_ja_correct_01.jpg"),

  // Additional greeting variants
  greet_hallo_correct_02: require("../images/lessons/A1/market/a1_greeting_hallo_correct_02.jpg"),
  greet_gutenabend_correct: require("../images/lessons/A1/greeting/a1_greeting_gutenabend_correct_01.jpg"),
  greet_gutenabend_distract: require("../images/lessons/A1/greeting/a1_greeting_gutenabend_correct_01.jpg"),
} as const;

export type A1LessonImageKey = keyof typeof A1_LESSON_IMAGES;
