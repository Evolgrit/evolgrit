export type RankedTag = { name: string; confidence: number };

const CAN_TAGS = new Set(["tin_can", "aluminum_can", "can"]);
const SOFT_DRINK_TAGS = new Set(["soft_drink", "soda", "cola", "beverage"]);

function norm(s: string) {
  return s.trim().toLowerCase().replace(/\s+/g, "_");
}

export function resolveConceptKey(tags: RankedTag[]) {
  const names = tags.map((t) => norm(t.name));
  const hasCan = names.some((n) => CAN_TAGS.has(n));
  const hasSoftDrink = names.some((n) => SOFT_DRINK_TAGS.has(n));
  if (hasCan && hasSoftDrink) return "cola_can";
  if (hasCan) return "can";
  if (hasSoftDrink) return "soft_drink";

  if (names.some((n) => ["phone", "mobile_phone", "cell_phone"].includes(n))) return "phone";
  if (names.some((n) => n.includes("plant"))) return "plant";
  if (names.some((n) => ["laptop", "computer"].includes(n))) return "laptop";
  if (names.some((n) => n.includes("bottle"))) return "bottle";
  if (names.some((n) => ["cup", "mug"].includes(n))) return "cup";

  return "unknown";
}
