export type LexiconEntry = {
  key: string;
  gender: "m" | "f" | "n";
  target: {
    de: { def: string; indef: string };
    en: string;
    fr?: string;
    nl?: string;
  };
  examples: {
    b1: string[];
    c1: string[];
  };
};

const ENTRIES: LexiconEntry[] = [
  {
    key: "plant",
    gender: "f",
    target: {
      de: { def: "die Pflanze", indef: "eine Pflanze" },
      en: "plant",
    },
    examples: {
      b1: [
        "Ich gieße die Pflanze jeden Morgen.",
        "Die Pflanze steht neben dem Fenster.",
      ],
      c1: [
        "Die Pflanze braucht mehr Licht, sonst werden die Blaetter gelb.",
        "Ich stelle die Pflanze ins Wohnzimmer, damit sie genug Sonne bekommt.",
      ],
    },
  },
  {
    key: "phone",
    gender: "n",
    target: {
      de: { def: "das Handy", indef: "ein Handy" },
      en: "phone",
    },
    examples: {
      b1: ["Ich brauche mein Handy.", "Ruf mich bitte auf dem Handy an."],
      c1: [
        "Ich lege das Handy auf den Tisch, damit ich mich konzentrieren kann.",
        "Ich schreibe dir eine Nachricht vom Handy aus.",
      ],
    },
  },
  {
    key: "key",
    gender: "m",
    target: {
      de: { def: "der Schluessel", indef: "ein Schluessel" },
      en: "key",
    },
    examples: {
      b1: ["Hast du den Schluessel?", "Ich suche den Schluessel."],
      c1: [
        "Ich oeffne die Tuer mit dem Schluessel.",
        "Gib mir bitte den Schluessel.",
      ],
    },
  },
  {
    key: "cup",
    gender: "f",
    target: {
      de: { def: "die Tasse", indef: "eine Tasse" },
      en: "cup",
    },
    examples: {
      b1: ["Ich nehme eine Tasse Tee.", "Die Tasse steht auf dem Tisch."],
      c1: [
        "Kannst du mir eine Tasse bringen?",
        "Ich trinke aus einer Tasse ohne Henkel.",
      ],
    },
  },
  {
    key: "table",
    gender: "m",
    target: {
      de: { def: "der Tisch", indef: "ein Tisch" },
      en: "table",
    },
    examples: {
      b1: ["Der Tisch ist frei.", "Stell das Glas auf den Tisch."],
      c1: ["Ich setze mich an den Tisch.", "Die Lampe steht auf dem Tisch."],
    },
  },
  {
    key: "chair",
    gender: "m",
    target: {
      de: { def: "der Stuhl", indef: "ein Stuhl" },
      en: "chair",
    },
    examples: {
      b1: ["Der Stuhl ist kaputt.", "Stell den Stuhl an den Tisch."],
      c1: ["Bitte setz dich auf den Stuhl.", "Der Stuhl steht neben dem Fenster."],
    },
  },
  {
    key: "bag",
    gender: "f",
    target: {
      de: { def: "die Tasche", indef: "eine Tasche" },
      en: "bag",
    },
    examples: {
      b1: ["Die Tasche ist leer.", "Ich trage die Tasche."],
      c1: [
        "Ich packe die Tasche fuer die Arbeit.",
        "In der Tasche sind die Unterlagen.",
      ],
    },
  },
  {
    key: "laptop",
    gender: "m",
    target: {
      de: { def: "der Laptop", indef: "ein Laptop" },
      en: "laptop",
    },
    examples: {
      b1: ["Ich arbeite am Laptop.", "Der Laptop ist leer."],
      c1: ["Ich benutze den Laptop jeden Tag bei der Arbeit.", "Der Laptop steht neben dem Bildschirm."],
    },
  },
  {
    key: "computer",
    gender: "m",
    target: {
      de: { def: "der Computer", indef: "ein Computer" },
      en: "computer",
    },
    examples: {
      b1: ["Der Computer ist an.", "Ich arbeite am Computer."],
      c1: ["Ich benutze den Computer täglich für die Arbeit.", "Der Computer ist gerade langsam."],
    },
  },
  {
    key: "bottle",
    gender: "f",
    target: {
      de: { def: "die Flasche", indef: "eine Flasche" },
      en: "bottle",
    },
    examples: {
      b1: ["Die Flasche ist leer.", "Ich nehme eine Flasche Wasser."],
      c1: ["Stell die Flasche bitte in den Kühlschrank.", "Die Flasche ist aus Glas."],
    },
  },
  {
    key: "glass",
    gender: "n",
    target: {
      de: { def: "das Glas", indef: "ein Glas" },
      en: "glass",
    },
    examples: {
      b1: ["Ich brauche ein Glas Wasser.", "Das Glas steht auf dem Tisch."],
      c1: ["Ich trinke aus einem Glas.", "Das Glas ist noch halb voll."],
    },
  },
  {
    key: "book",
    gender: "n",
    target: {
      de: { def: "das Buch", indef: "ein Buch" },
      en: "book",
    },
    examples: {
      b1: ["Ich lese ein Buch.", "Das Buch ist interessant."],
      c1: ["Ich habe das Buch schon gelesen.", "Das Buch liegt auf dem Tisch."],
    },
  },
];

const SYNONYMS: Record<string, string> = {
  "cell phone": "phone",
  cellphone: "phone",
  "mobile phone": "phone",
  smartphone: "phone",
  mug: "cup",
  "coffee cup": "cup",
  "indoor plant": "plant",
  "potted plant": "plant",
  handbag: "bag",
  backpack: "bag",
  rucksack: "bag",
  purse: "bag",
};

export function normalizeKey(label: string) {
  const key = label
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, " ")
    .trim();
  return SYNONYMS[key] ?? key;
}

export function getEntry(key: string) {
  return ENTRIES.find((e) => e.key === key) ?? null;
}

export const LEXICON_KEYS = ENTRIES.map((e) => e.key);
