import type { PronunciationGuideItem } from "../components/system/PronunciationGuide";

const GUIDE_MAP: Record<string, PronunciationGuideItem> = {
  entschuldigung: {
    word: "Entschuldigung",
    guide: "ent·SCHUL·di·gung",
    note: "Betone SCHUL klar und langsam.",
  },
  versicherung: {
    word: "Versicherung",
    guide: "ver·SI·che·rung",
    note: "Betone SI, nicht ver.",
  },
  bewerbung: {
    word: "Bewerbung",
    guide: "be·WER·bung",
    note: "Betone WER als Kern.",
  },
};

function normalize(s: string) {
  return s
    .toLowerCase()
    .replace(/[.,!?;:()\"“”„]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

export function getPronunciationGuidesForSentence(sentence: string) {
  const norm = normalize(sentence);
  const words = new Set(norm.split(" ").filter(Boolean));

  const items: PronunciationGuideItem[] = [];
  for (const key of Object.keys(GUIDE_MAP)) {
    if (words.has(key)) items.push(GUIDE_MAP[key]);
  }
  return items;
}
