import AsyncStorage from "@react-native-async-storage/async-storage";

const KEY_S1 = "@evolgrit/exam/b1/speaking1_done";
const KEY_S2 = "@evolgrit/exam/b1/speaking2_done";
const KEY_W = "@evolgrit/exam/b1/writing_done";
const KEY_W_TEXT = "@evolgrit/exam/b1/writing_text";

export type ExamB1State = {
  speaking1Done: boolean;
  speaking2Done: boolean;
  writingDone: boolean;
  writingText: string;
};

async function getBool(key: string) {
  const v = await AsyncStorage.getItem(key);
  return v === "true";
}

export async function getExamB1State(): Promise<ExamB1State> {
  const [s1, s2, w, wText] = await Promise.all([
    getBool(KEY_S1),
    getBool(KEY_S2),
    getBool(KEY_W),
    AsyncStorage.getItem(KEY_W_TEXT),
  ]);
  return {
    speaking1Done: s1,
    speaking2Done: s2,
    writingDone: w,
    writingText: wText ?? "",
  };
}

export async function setSpeaking1Done(done: boolean) {
  await AsyncStorage.setItem(KEY_S1, done ? "true" : "false");
}

export async function setSpeaking2Done(done: boolean) {
  await AsyncStorage.setItem(KEY_S2, done ? "true" : "false");
}

export async function setWritingDone(done: boolean) {
  await AsyncStorage.setItem(KEY_W, done ? "true" : "false");
}

export async function setWritingText(text: string) {
  await AsyncStorage.setItem(KEY_W_TEXT, text);
}

export async function resetExamB1() {
  await Promise.all([
    AsyncStorage.removeItem(KEY_S1),
    AsyncStorage.removeItem(KEY_S2),
    AsyncStorage.removeItem(KEY_W),
    AsyncStorage.removeItem(KEY_W_TEXT),
  ]);
}
