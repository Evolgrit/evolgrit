import { getEntry, normalizeKey } from "./objectLexicon";

export type SnapCardContent = {
  targetWord: string;
  nativeWord: string;
  targetSentence: string;
  nativeSentence: string;
  targetWordDef: string;
  targetWordIndef: string;
  examplesB1: string[];
  examplesC1: string[];
};

function normalizeCode(code?: string) {
  return (code ?? "en").toLowerCase().split("-")[0];
}

function sentenceFor(code: string, word: string) {
  switch (code) {
    case "de":
      return `Ich habe ${word}.`;
    case "fr":
      return `J'ai ${word}.`;
    case "nl":
      return `Ik heb ${word}.`;
    case "en":
    default:
      return `I have ${word}.`;
  }
}

export function generateCard({
  objectLabel,
  nativeLanguageCode,
  targetLanguageCode,
}: {
  objectLabel: string;
  nativeLanguageCode?: string;
  targetLanguageCode?: string;
}): SnapCardContent {
  const key = normalizeKey(objectLabel);
  const match = getEntry(key);
  const targetCode = normalizeCode(targetLanguageCode);
  const nativeCode = normalizeCode(nativeLanguageCode);

  if (!match) {
    const fallbackWord = objectLabel.trim() || "Sache";
    return {
      targetWord: fallbackWord,
      nativeWord: fallbackWord,
      targetSentence: sentenceFor(targetCode, fallbackWord),
      nativeSentence: sentenceFor(nativeCode, fallbackWord),
      targetWordDef: fallbackWord,
      targetWordIndef: fallbackWord,
      examplesB1: [
        `Ich arbeite gerade mit ${fallbackWord}.`,
        `Wo ist ${fallbackWord}?`,
      ],
      examplesC1: [
        `Ich benutze ${fallbackWord} täglich bei der Arbeit.`,
        `Ich brauche ${fallbackWord} heute.`,
      ],
    };
  }

  const targetWord = match.target.de?.def?.replace(/^der |^die |^das /, "") ?? match.target.en;
  const targetSentence = match.examples.b1?.[0] ?? sentenceFor(targetCode, match.target.en);

  const nativeWord =
    nativeCode === "de"
      ? match.target.de.def
      : ((match.target as any)[nativeCode] ?? match.target.en ?? targetWord);
  const nativeSentence = sentenceFor(nativeCode, nativeWord);

  return {
    targetWord,
    nativeWord,
    targetSentence,
    nativeSentence,
    targetWordDef: match.target.de.def,
    targetWordIndef: match.target.de.indef,
    examplesB1: match.examples.b1,
    examplesC1: match.examples.c1,
  };
}

export const SNAP_OBJECTS = ["phone", "key", "cup", "table", "chair", "bag", "plant"];
