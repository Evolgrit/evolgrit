export type A1UnitItem = {
  id: string;
  title: string;
  kind: "lesson" | "mini" | "quiz" | "abschluss" | "speaking";
  minutes: number;
};

export type A1Unit = {
  id: string;
  title: string;
  subtitle: string;
  items: A1UnitItem[];
};

export const A1_UNITS: A1Unit[] = [
  {
    id: "a1_unit_1",
    title: "Unit 1 · Ankommen",
    subtitle: "Begruessung und erster Alltag",
    items: [
      { id: "a1_l1_01_name", title: "Sich vorstellen: Name", kind: "lesson", minutes: 3 },
      { id: "a1_l2_01_einkaufen_basics", title: "Einkaufen: Basics", kind: "lesson", minutes: 3 },
      { id: "a1_w1_name", title: "Mini · Schnellstart", kind: "mini", minutes: 2 },
      { id: "a1_l1_04_bitte_danke", title: "Quiz · Bitte & Danke", kind: "quiz", minutes: 3 },
    ],
  },
  {
    id: "a1_unit_2",
    title: "Unit 2 · Alltag",
    subtitle: "Termine, Orte, Begruessen",
    items: [
      { id: "a1_l3_01_menschen_namen", title: "Menschen & Namen", kind: "lesson", minutes: 3 },
      { id: "a1_l4_01_uhrzeit_termin", title: "Termine & Regeln", kind: "lesson", minutes: 3 },
      { id: "a1_l4_04_termin_verschieben", title: "Quiz · Termin verschieben", kind: "quiz", minutes: 3 },
    ],
  },
  {
    id: "a1_unit_3",
    title: "Unit 3 · Zuhause & Arbeit",
    subtitle: "Wohnung und erster Arbeitstag",
    items: [
      { id: "a1_l5_01_wohnung_adresse", title: "Wohnen & Adresse", kind: "lesson", minutes: 3 },
      { id: "a1_l6_01_job_erster_tag", title: "Job: Erster Tag", kind: "lesson", minutes: 3 },
      { id: "a1_l6_04_hilfe_verstehen", title: "Quiz · Hilfe verstehen", kind: "quiz", minutes: 3 },
    ],
  },
  {
    id: "a1_unit_4",
    title: "Unit 4 · Abschluss",
    subtitle: "Sprechen und Abschluss",
    items: [
      { id: "a1_l7_01_bitte_fragen", title: "Bitten & Fragen", kind: "lesson", minutes: 3 },
      { id: "a1_l8_01_wiederholung", title: "Wiederholung", kind: "lesson", minutes: 3 },
      { id: "a1_l8_04_abschluss", title: "Abschluss", kind: "abschluss", minutes: 3 },
    ],
  },
];
