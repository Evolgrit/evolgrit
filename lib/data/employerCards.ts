export type EmployerCard = {
  id: string;
  label: string;
  icon: string;
  title: string;
  description: string;
  modalTitle: string;
  modalBody: string;
};

export const employerCards: EmployerCard[] = [
  {
    id: "readiness",
    label: "Readiness at a glance",
    icon: "📊",
    title: "See who is really ready – not just who has a CV.",
    description:
      "Language level, cultural readiness and reliability signals in one simple view.",
    modalTitle: "One profile that shows real readiness.",
    modalBody: `Mit Evolgrit sehen Sie nicht nur einen Lebenslauf:

• Sprachlevel und Selbstvertrauen – basierend auf echten Aufgaben.
• Kulturelle Bereitschaft – Alltag, Arbeit und Teamdynamik.
• Zuverlässigkeitssignale – Teilnahme, Aufgabenerfüllung, Engagement.

So erkennen Sie auf einen Blick, welche Kandidat:innen wirklich für Ihre Rollen vorbereitet sind – nicht nur, wer ein Zertifikat besitzt.`,
  },
  {
    id: "risk",
    label: "Onboarding support",
    icon: "🧭",
    title: "Reduce onboarding risk for you and your team.",
    description:
      "Structured support before and after arrival – so people actually stay.",
    modalTitle: "Weniger Onboarding-Risiko, mehr Stabilität.",
    modalBody: `Evolgrit begleitet internationale Talente schon vor dem ersten Vertrag:

• Vorbereitung auf Arbeitsalltag, Schichtpläne und Kommunikation im Team.
• Klärung von Papieren, Wohnung, Versicherungen und Behördenwegen.
• Mentoring in den ersten Wochen im Job – sprachlich und kulturell.

Das senkt Ihr Risiko im Onboarding und erhöht die Chance, dass neue Mitarbeitende langfristig bleiben.`,
  },
  {
    id: "pilots",
    label: "Batches",
    icon: "🧪",
    title: "Start with focused batches.",
    description:
      "Align roles, locations and timelines – and learn together in small steps.",
    modalTitle: "Gemeinsam mit Pilotkohorten starten.",
    modalBody: `Wir beginnen nicht mit Hunderten Profilen, sondern mit klaren Pilotkohorten:

• Ausrichtung auf Ihre Rollen (z.B. Logistik, Pflege, Busfahrer:innen).
• Abstimmung auf Standorte, Schichten und Saisonverläufe.
• Gemeinsame Definition von Sprache, Skills und Unterstützung.

So können Sie das Modell im Kleinen testen, bevor Sie es skalieren.`,
  },
  {
    id: "pipeline",
    label: "Repeatable pipeline",
    icon: "🔁",
    title: "Build a repeatable international talent pipeline.",
    description:
      "Plug Evolgrit into your existing hiring process – not a separate universe.",
    modalTitle: "Eine wiederholbare Pipeline für internationale Talente.",
    modalBody: `In späteren Phasen kann Evolgrit in Ihre bestehende Talent-Pipeline integriert werden:

• Gemeinsame Definition von Rollenprofilen und Anforderungen.
• Regelmäßige Kohorten, die zu Ihren Einstellungszyklen passen.
• Transparente Kennzahlen zu Sprache, Fortschritt und Verbleib.

Damit wird internationale Einstellung kein einmaliges Projekt, sondern ein wiederholbares System.`,
  },
] as const;
