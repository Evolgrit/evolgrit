import type { PronunciationGuideItem } from "../components/speaking/PronunciationGuide";

export type PronunciationGuide = {
  word: string;
  guide: string;
  note?: string;
};

export const DEFAULT_GUIDES: PronunciationGuideItem[] = [
  { word: "Entschuldigung", guide: "ent·SCHUL·di·gung", note: "Betone SCHUL klar und langsam." },
  { word: "Versicherung", guide: "ver·SI·che·rung", note: "Betone SI, nicht ver." },
  { word: "Bewerbung", guide: "be·WER·bung", note: "Betone WER als Kern." },
];

export function normalizeForWordMatch(input: string): string {
  return input
    .toLowerCase()
    .replace(/[()\"'“”„]/g, " ")
    .replace(/[.,!?;:]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

export function extractWords(sentence: string): Set<string> {
  const norm = normalizeForWordMatch(sentence);
  const parts = norm.split(" ").filter(Boolean);
  return new Set(parts);
}

export function matchGuidesForSentence(
  sentence: string,
  guides?: PronunciationGuideItem[]
): PronunciationGuideItem[] {
  const source = guides && guides.length ? guides : DEFAULT_GUIDES;
  if (!source.length) return [];

  const words = extractWords(sentence);

  const byKey = new Map<string, PronunciationGuideItem>();
  for (const g of source) {
    const key = normalizeForWordMatch(g.word);
    byKey.set(key, g);
  }

  const hits: PronunciationGuideItem[] = [];

  for (const [key, guide] of byKey.entries()) {
    if (key.includes(" ")) continue;
    if (words.has(key)) hits.push(guide);
  }

  const normSentence = normalizeForWordMatch(sentence);
  for (const [key, guide] of byKey.entries()) {
    if (!key.includes(" ")) continue;
    if (normSentence.includes(key)) hits.push(guide);
  }

  hits.sort((a, b) => b.word.length - a.word.length);
  return hits;
}
