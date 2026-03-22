
export type SnapCardContent = {
  targetWord: string;
  nativeWord: string;
  targetSentence: string;
  nativeSentence: string;
};

type WordEntry = {
  key: string;
  labels: Record<string, string>;
  sentences: Record<string, string>;
};

const OBJECTS: WordEntry[] = [
  {
    key: "cup",
    labels: { de: "Tasse", en: "cup", fr: "tasse", nl: "kopje" },
    sentences: {
      de: "Die Tasse ist heiß.",
      en: "The cup is hot.",
      fr: "La tasse est chaude.",
      nl: "Het kopje is heet.",
    },
  },
  {
    key: "chair",
    labels: { de: "Stuhl", en: "chair", fr: "chaise", nl: "stoel" },
    sentences: {
      de: "Der Stuhl ist bequem.",
      en: "The chair is comfortable.",
      fr: "La chaise est confortable.",
      nl: "De stoel is comfortabel.",
    },
  },
  {
    key: "phone",
    labels: { de: "Handy", en: "phone", fr: "téléphone", nl: "telefoon" },
    sentences: {
      de: "Mein Handy ist neu.",
      en: "My phone is new.",
      fr: "Mon téléphone est nouveau.",
      nl: "Mijn telefoon is nieuw.",
    },
  },
  {
    key: "key",
    labels: { de: "Schlüssel", en: "key", fr: "clé", nl: "sleutel" },
    sentences: {
      de: "Ich brauche den Schlüssel.",
      en: "I need the key.",
      fr: "J'ai besoin de la clé.",
      nl: "Ik heb de sleutel nodig.",
    },
  },
  {
    key: "bottle",
    labels: { de: "Flasche", en: "bottle", fr: "bouteille", nl: "fles" },
    sentences: {
      de: "Die Flasche ist voll.",
      en: "The bottle is full.",
      fr: "La bouteille est pleine.",
      nl: "De fles is vol.",
    },
  },
  {
    key: "book",
    labels: { de: "Buch", en: "book", fr: "livre", nl: "boek" },
    sentences: {
      de: "Das Buch ist interessant.",
      en: "The book is interesting.",
      fr: "Le livre est intéressant.",
      nl: "Het boek is interessant.",
    },
  },
  {
    key: "bag",
    labels: { de: "Tasche", en: "bag", fr: "sac", nl: "tas" },
    sentences: {
      de: "Meine Tasche ist schwer.",
      en: "My bag is heavy.",
      fr: "Mon sac est lourd.",
      nl: "Mijn tas is zwaar.",
    },
  },
  {
    key: "table",
    labels: { de: "Tisch", en: "table", fr: "table", nl: "tafel" },
    sentences: {
      de: "Der Tisch ist groß.",
      en: "The table is big.",
      fr: "La table est grande.",
      nl: "De tafel is groot.",
    },
  },
  {
    key: "window",
    labels: { de: "Fenster", en: "window", fr: "fenêtre", nl: "raam" },
    sentences: {
      de: "Das Fenster ist offen.",
      en: "The window is open.",
      fr: "La fenêtre est ouverte.",
      nl: "Het raam is open.",
    },
  },
  {
    key: "door",
    labels: { de: "Tür", en: "door", fr: "porte", nl: "deur" },
    sentences: {
      de: "Die Tür ist zu.",
      en: "The door is closed.",
      fr: "La porte est fermée.",
      nl: "De deur is dicht.",
    },
  },
  {
    key: "car",
    labels: { de: "Auto", en: "car", fr: "voiture", nl: "auto" },
    sentences: {
      de: "Das Auto ist sauber.",
      en: "The car is clean.",
      fr: "La voiture est propre.",
      nl: "De auto is schoon.",
    },
  },
  {
    key: "bus",
    labels: { de: "Bus", en: "bus", fr: "bus", nl: "bus" },
    sentences: {
      de: "Der Bus kommt gleich.",
      en: "The bus arrives soon.",
      fr: "Le bus arrive bientôt.",
      nl: "De bus komt zo.",
    },
  },
  {
    key: "bike",
    labels: { de: "Fahrrad", en: "bike", fr: "vélo", nl: "fiets" },
    sentences: {
      de: "Das Fahrrad ist schnell.",
      en: "The bike is fast.",
      fr: "Le vélo est rapide.",
      nl: "De fiets is snel.",
    },
  },
  {
    key: "plate",
    labels: { de: "Teller", en: "plate", fr: "assiette", nl: "bord" },
    sentences: {
      de: "Der Teller ist leer.",
      en: "The plate is empty.",
      fr: "L'assiette est vide.",
      nl: "Het bord is leeg.",
    },
  },
  {
    key: "spoon",
    labels: { de: "Löffel", en: "spoon", fr: "cuillère", nl: "lepel" },
    sentences: {
      de: "Der Löffel liegt auf dem Tisch.",
      en: "The spoon is on the table.",
      fr: "La cuillère est sur la table.",
      nl: "De lepel ligt op de tafel.",
    },
  },
  {
    key: "apple",
    labels: { de: "Apfel", en: "apple", fr: "pomme", nl: "appel" },
    sentences: {
      de: "Der Apfel ist frisch.",
      en: "The apple is fresh.",
      fr: "La pomme est fraîche.",
      nl: "De appel is vers.",
    },
  },
  {
    key: "bread",
    labels: { de: "Brot", en: "bread", fr: "pain", nl: "brood" },
    sentences: {
      de: "Ich kaufe Brot.",
      en: "I buy bread.",
      fr: "J'achète du pain.",
      nl: "Ik koop brood.",
    },
  },
  {
    key: "water",
    labels: { de: "Wasser", en: "water", fr: "eau", nl: "water" },
    sentences: {
      de: "Ich trinke Wasser.",
      en: "I drink water.",
      fr: "Je bois de l'eau.",
      nl: "Ik drink water.",
    },
  },
  {
    key: "pen",
    labels: { de: "Stift", en: "pen", fr: "stylo", nl: "pen" },
    sentences: {
      de: "Der Stift ist blau.",
      en: "The pen is blue.",
      fr: "Le stylo est bleu.",
      nl: "De pen is blauw.",
    },
  },
  {
    key: "wallet",
    labels: { de: "Geldbörse", en: "wallet", fr: "portefeuille", nl: "portemonnee" },
    sentences: {
      de: "Meine Geldbörse ist hier.",
      en: "My wallet is here.",
      fr: "Mon portefeuille est ici.",
      nl: "Mijn portemonnee is hier.",
    },
  },
];

function normalizeCode(code?: string) {
  return (code ?? "en").toLowerCase().split("-")[0];
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
  const key = objectLabel.trim().toLowerCase();
  const match = OBJECTS.find((obj) => obj.key === key) ?? null;
  const targetCode = normalizeCode(targetLanguageCode);
  const nativeCode = normalizeCode(nativeLanguageCode);

  if (!match) {
    const fallbackWord = objectLabel.trim() || "object";
    const targetWord = fallbackWord;
    const nativeWord = fallbackWord;
    const targetSentence = sentenceFor(targetCode, fallbackWord);
    const nativeSentence = sentenceFor(nativeCode, fallbackWord);
    return { targetWord, nativeWord, targetSentence, nativeSentence };
  }

  const targetWord = match.labels[targetCode] ?? match.labels.de ?? match.labels.en;
  const targetSentence = match.sentences[targetCode] ?? match.sentences.de ?? match.sentences.en;

  const nativeWord = match.labels[nativeCode] ?? match.labels.en ?? match.labels.de;
  const nativeSentence = match.sentences[nativeCode] ?? match.sentences.en ?? match.sentences.de;

  return { targetWord, nativeWord, targetSentence, nativeSentence };
}

export const SNAP_OBJECTS = OBJECTS.map((o) => o.key);

function sentenceFor(code: string, word: string) {
  switch (code) {
    case "de":
      return `Das ist ${word}.`;
    case "fr":
      return `C'est ${word}.`;
    case "nl":
      return `Dit is ${word}.`;
    case "en":
    default:
      return `This is ${word}.`;
  }
}
