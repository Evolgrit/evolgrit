export type JobModule = {
  title: string;
  subtitle?: string;
  durationMin?: number;
  route?: string;
  locked?: boolean;
};

export type JobUnit = {
  id: string;
  title: string;
  subtitle?: string;
  modules: JobModule[];
};

export type JobGroup = {
  id: string;
  title: string;
  subtitle: string;
  bg: string;
  units: JobUnit[];
};

export const JOBS: JobGroup[] = [
  {
    id: "pflege",
    title: "Pflege",
    subtitle: "Patienten · Übergabe · Alltag",
    bg: "$surfaceJob",
    units: [
      {
        id: "pflege_u1",
        title: "Unit 1 · Start im Dienst",
        subtitle: "Aufnahme und Schmerzen",
        modules: [
          { title: "Modul 1", subtitle: "Aufnahme & Übergabe", durationMin: 12, route: "/learn/job/pflege/01" },
          { title: "Modul 2", subtitle: "Schmerzen & Maßnahmen", durationMin: 14, route: "/learn/job/pflege/02" },
        ],
      },
      {
        id: "pflege_u2",
        title: "Unit 2 · Beobachten & Dokumentieren",
        subtitle: "Medikamente und Dokumentation",
        modules: [
          { title: "Modul 3", subtitle: "Medikamente & Zeiten", durationMin: 16, route: "/learn/job/pflege/03" },
          { title: "Modul 4", subtitle: "Übergabe & Dokumentation", durationMin: 18, route: "/learn/job/pflege/04" },
        ],
      },
      {
        id: "pflege_u3",
        title: "Unit 3 · Routine & Sicherheit",
        subtitle: "Vitalwerte und Hygiene",
        modules: [
          { title: "Modul 5", subtitle: "Vitalwerte", durationMin: 12, route: "/learn/job/pflege/05" },
          { title: "Modul 6", subtitle: "Hygiene & Sicherheit", durationMin: 12, route: "/learn/job/pflege/06" },
        ],
      },
      {
        id: "pflege_u4",
        title: "Unit 4 · Verantwortung",
        subtitle: "Melden und Beobachten",
        modules: [
          { title: "Modul 7", subtitle: "Verantwortung & Meldewege", durationMin: 12, route: "/learn/job/pflege/07" },
          { title: "Modul 8", subtitle: "Beobachten & Begründen", durationMin: 14, route: "/learn/job/pflege/08" },
        ],
      },
      {
        id: "pflege_u5",
        title: "Unit 5 · Kommunikation",
        subtitle: "Gespräche und Grenzen",
        modules: [
          { title: "Modul 9", subtitle: "Schwierige Gespräche", durationMin: 14, route: "/learn/job/pflege/09" },
          { title: "Modul 10", subtitle: "Rechte & Grenzen", durationMin: 12, route: "/learn/job/pflege/10" },
        ],
      },
      {
        id: "pflege_u6",
        title: "Unit 6 · Prüfung & Organisation",
        subtitle: "Prüfung und Selbstorganisation",
        modules: [
          { title: "Modul 11", subtitle: "Prüfung – kurz & strukturiert", durationMin: 12, route: "/learn/job/pflege/11" },
          { title: "Modul 12", subtitle: "Selbstorganisation & Stress", durationMin: 12, route: "/learn/job/pflege/12" },
        ],
      },
    ],
  },
  {
    id: "handwerk",
    title: "Handwerk",
    subtitle: "Werkstatt · Baustelle · Team",
    bg: "$surfaceLanguage",
    units: [
      {
        id: "handwerk_u1",
        title: "Unit 1 · Einstieg",
        subtitle: "Kommt bald",
        modules: [
          { title: "Modul 1", subtitle: "Bald verfügbar", durationMin: 10, locked: true },
          { title: "Modul 2", subtitle: "Bald verfügbar", durationMin: 10, locked: true },
        ],
      },
      {
        id: "handwerk_u2",
        title: "Unit 2 · Teamarbeit",
        subtitle: "Kommt bald",
        modules: [{ title: "Modul 3", subtitle: "Bald verfügbar", durationMin: 10, locked: true }],
      },
      {
        id: "handwerk_u3",
        title: "Unit 3 · Alltag",
        subtitle: "Kommt bald",
        modules: [{ title: "Modul 4", subtitle: "Bald verfügbar", durationMin: 10, locked: true }],
      },
    ],
  },
  {
    id: "gastro",
    title: "Gastro",
    subtitle: "Service · Küche · Bestellungen",
    bg: "$surfaceLife",
    units: [
      {
        id: "gastro_u1",
        title: "Unit 1 · Service",
        subtitle: "Kommt bald",
        modules: [
          { title: "Modul 1", subtitle: "Bald verfügbar", durationMin: 10, locked: true },
          { title: "Modul 2", subtitle: "Bald verfügbar", durationMin: 10, locked: true },
        ],
      },
      {
        id: "gastro_u2",
        title: "Unit 2 · Küche",
        subtitle: "Kommt bald",
        modules: [{ title: "Modul 3", subtitle: "Bald verfügbar", durationMin: 10, locked: true }],
      },
      {
        id: "gastro_u3",
        title: "Unit 3 · Ablauf",
        subtitle: "Kommt bald",
        modules: [{ title: "Modul 4", subtitle: "Bald verfügbar", durationMin: 10, locked: true }],
      },
    ],
  },
  {
    id: "logistik",
    title: "Logistik",
    subtitle: "Lieferung · Routen · Übergaben",
    bg: "$surfaceFocus",
    units: [
      {
        id: "logistik_u1",
        title: "Unit 1 · Übergabe",
        subtitle: "Kommt bald",
        modules: [
          { title: "Modul 1", subtitle: "Bald verfügbar", durationMin: 10, locked: true },
          { title: "Modul 2", subtitle: "Bald verfügbar", durationMin: 10, locked: true },
        ],
      },
      {
        id: "logistik_u2",
        title: "Unit 2 · Route",
        subtitle: "Kommt bald",
        modules: [{ title: "Modul 3", subtitle: "Bald verfügbar", durationMin: 10, locked: true }],
      },
      {
        id: "logistik_u3",
        title: "Unit 3 · Alltag",
        subtitle: "Kommt bald",
        modules: [{ title: "Modul 4", subtitle: "Bald verfügbar", durationMin: 10, locked: true }],
      },
    ],
  },
  {
    id: "reinigung",
    title: "Reinigung",
    subtitle: "Räume · Aufgaben · Rückmeldung",
    bg: "$surfaceLife",
    units: [
      {
        id: "reinigung_u1",
        title: "Unit 1 · Einstieg",
        subtitle: "Kommt bald",
        modules: [
          { title: "Modul 1", subtitle: "Bald verfügbar", durationMin: 10, locked: true },
          { title: "Modul 2", subtitle: "Bald verfügbar", durationMin: 10, locked: true },
        ],
      },
      {
        id: "reinigung_u2",
        title: "Unit 2 · Ordnung",
        subtitle: "Kommt bald",
        modules: [{ title: "Modul 3", subtitle: "Bald verfügbar", durationMin: 10, locked: true }],
      },
      {
        id: "reinigung_u3",
        title: "Unit 3 · Abschluss",
        subtitle: "Kommt bald",
        modules: [{ title: "Modul 4", subtitle: "Bald verfügbar", durationMin: 10, locked: true }],
      },
    ],
  },
  {
    id: "lager",
    title: "Lager",
    subtitle: "Waren · Ordnung · Rückfragen",
    bg: "$surfaceLanguage",
    units: [
      {
        id: "lager_u1",
        title: "Unit 1 · Einstieg",
        subtitle: "Kommt bald",
        modules: [
          { title: "Modul 1", subtitle: "Bald verfügbar", durationMin: 10, locked: true },
          { title: "Modul 2", subtitle: "Bald verfügbar", durationMin: 10, locked: true },
        ],
      },
      {
        id: "lager_u2",
        title: "Unit 2 · Ordnung",
        subtitle: "Kommt bald",
        modules: [{ title: "Modul 3", subtitle: "Bald verfügbar", durationMin: 10, locked: true }],
      },
      {
        id: "lager_u3",
        title: "Unit 3 · Rückfragen",
        subtitle: "Kommt bald",
        modules: [{ title: "Modul 4", subtitle: "Bald verfügbar", durationMin: 10, locked: true }],
      },
    ],
  },
  {
    id: "kueche",
    title: "Küche",
    subtitle: "Vorbereitung · Abläufe · Hygiene",
    bg: "$surfaceFocus",
    units: [
      {
        id: "kueche_u1",
        title: "Unit 1 · Einstieg",
        subtitle: "Kommt bald",
        modules: [
          { title: "Modul 1", subtitle: "Bald verfügbar", durationMin: 10, locked: true },
          { title: "Modul 2", subtitle: "Bald verfügbar", durationMin: 10, locked: true },
        ],
      },
      {
        id: "kueche_u2",
        title: "Unit 2 · Hygiene",
        subtitle: "Kommt bald",
        modules: [{ title: "Modul 3", subtitle: "Bald verfügbar", durationMin: 10, locked: true }],
      },
      {
        id: "kueche_u3",
        title: "Unit 3 · Abschluss",
        subtitle: "Kommt bald",
        modules: [{ title: "Modul 4", subtitle: "Bald verfügbar", durationMin: 10, locked: true }],
      },
    ],
  },
];
