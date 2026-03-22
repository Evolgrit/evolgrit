export type ConceptEntry = {
  key: string;
  wordDef: string;
  wordIndef: string;
  examples: {
    b1: string[];
    c1: string[];
  };
};

const ENTRIES: ConceptEntry[] = [
  {
    key: "cola_can",
    wordDef: "die Cola-Dose",
    wordIndef: "eine Cola-Dose",
    examples: {
      b1: [
        "Ich kaufe eine Cola-Dose im Supermarkt.",
        "Stell die Cola-Dose bitte in den Kuehlschrank.",
        "Ich trinke aus der Dose.",
      ],
      c1: [
        "Ich versuche, Cola-Dosen zu vermeiden, weil sie viel Zucker enthalten.",
        "Die Cola-Dose ist eiskalt, deshalb beschlaegt sie sofort.",
      ],
    },
  },
  {
    key: "can",
    wordDef: "die Dose",
    wordIndef: "eine Dose",
    examples: {
      b1: ["Ich oeffne die Dose.", "Die Dose steht im Schrank."],
      c1: ["Die Dose ist fast leer.", "Ich stelle die Dose in den Kuehlschrank."],
    },
  },
  {
    key: "soft_drink",
    wordDef: "die Limonade",
    wordIndef: "eine Limonade",
    examples: {
      b1: ["Ich trinke eine Limonade.", "Die Limonade ist kalt."],
      c1: ["Ich bestelle eine Limonade ohne Eis.", "Die Limonade steht auf dem Tisch."],
    },
  },
  {
    key: "phone",
    wordDef: "das Handy",
    wordIndef: "ein Handy",
    examples: {
      b1: ["Ich brauche mein Handy.", "Ruf mich auf dem Handy an."],
      c1: ["Ich lege das Handy auf den Tisch.", "Ich schreibe dir vom Handy aus."],
    },
  },
  {
    key: "laptop",
    wordDef: "der Laptop",
    wordIndef: "ein Laptop",
    examples: {
      b1: ["Ich arbeite am Laptop.", "Der Laptop ist leer."],
      c1: ["Ich benutze den Laptop jeden Tag bei der Arbeit.", "Der Laptop steht neben dem Bildschirm."],
    },
  },
  {
    key: "plant",
    wordDef: "die Pflanze",
    wordIndef: "eine Pflanze",
    examples: {
      b1: ["Ich giesse die Pflanze jeden Morgen.", "Die Pflanze steht neben dem Fenster."],
      c1: ["Die Pflanze braucht mehr Licht, sonst werden die Blaetter gelb.", "Ich stelle die Pflanze ins Wohnzimmer."],
    },
  },
  {
    key: "bottle",
    wordDef: "die Flasche",
    wordIndef: "eine Flasche",
    examples: {
      b1: ["Die Flasche ist leer.", "Ich nehme eine Flasche Wasser."],
      c1: ["Stell die Flasche bitte in den Kuehlschrank.", "Die Flasche ist aus Glas."],
    },
  },
  {
    key: "cup",
    wordDef: "die Tasse",
    wordIndef: "eine Tasse",
    examples: {
      b1: ["Ich nehme eine Tasse Tee.", "Die Tasse steht auf dem Tisch."],
      c1: ["Kannst du mir eine Tasse bringen?", "Ich trinke aus einer Tasse ohne Henkel."],
    },
  },
];

export function getConceptEntry(key: string) {
  return ENTRIES.find((e) => e.key === key) ?? null;
}

export function labelFor(entry: ConceptEntry) {
  return entry.wordDef.replace(/^(der|die|das)\s+/, "");
}

export function keyForLabel(label: string) {
  const normalized = label.trim().toLowerCase();
  const match = ENTRIES.find((e) => labelFor(e).toLowerCase() === normalized);
  return match?.key ?? null;
}
