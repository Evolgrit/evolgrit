export type VisionTag = { name: string; confidence: number };

const GENERIC_BLACKLIST = new Set([
  "object",
  "thing",
  "item",
  "stuff",
  "beverage",
  "soft drink",
  "drink",
  "food",
  "product",
  "indoor",
  "outdoor",
  "sky",
  "building",
  "clothing",
  "person",
  "human",
  "street",
  "city",
  "landscape",
  "nature",
  "ground",
  "wall",
  "tableware",
  "container",
]);

const CONCRETE_BOOST: Record<string, number> = {
  "can": 0.25,
  "tin can": 0.25,
  "aluminum can": 0.25,
  "bottle": 0.22,
  "glass": 0.22,
  "cup": 0.22,
  "mug": 0.22,
  "box": 0.18,
  "bag": 0.18,
  "phone": 0.25,
  "mobile phone": 0.25,
  "cell phone": 0.25,
  "key": 0.22,
  "laptop": 0.22,
  "computer": 0.18,
  "plant": 0.22,
  "chair": 0.18,
  "table": 0.18,
};

export function norm(s: string) {
  return s.trim().toLowerCase();
}

export function rankVisionTags(tags: VisionTag[]) {
  const scored = tags
    .map((t) => {
      const n = norm(t.name);
      let score = t.confidence;

      if (GENERIC_BLACKLIST.has(n)) score -= 0.6;

      if (n.includes("indoor") || n.includes("outdoor")) score -= 0.4;
      if (n.includes("beverage") || n.includes("soft drink")) score -= 0.6;
      if (n === "drink" || n === "food" || n === "product") score -= 0.5;

      if (CONCRETE_BOOST[n] !== undefined) score += CONCRETE_BOOST[n];

      if (n.split(" ").length >= 2 && !GENERIC_BLACKLIST.has(n)) score += 0.05;

      return { ...t, name: n, score };
    })
    .filter((t) => t.score > 0.05)
    .sort((a, b) => b.score - a.score);

  return scored;
}

export function isStillGeneric(best: { name: string; score: number } | undefined) {
  if (!best) return true;
  const n = best.name;
  return (
    GENERIC_BLACKLIST.has(n) ||
    n.includes("beverage") ||
    n.includes("soft drink") ||
    n === "drink" ||
    n === "food" ||
    n === "object" ||
    n === "container"
  );
}
