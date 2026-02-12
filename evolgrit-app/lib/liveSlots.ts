export type ParsedSlots = Partial<{
  patientTitle: "Herr" | "Frau";
  patientName: string;
  roomNumber: string;
  painLocation: string;
  painScale: number;
  durationText: string;
  timeText: string;
  medName: string;
  medDoseText: string;
  medScheduleText: string;
  allergiesText: string;
  vital_bp_sys: string;
  vital_bp_dia: string;
  vital_pulse: string;
  vital_temp: string;
  vital_spo2: string;
  vital_concern: string;
  hygiene_action: string;
  safety_action: string;
  reason_short: string;
}>;

export function normalizeText(s: string): string {
  const lower = s.toLowerCase();
  const noPunct = lower.replace(/[^\w\säöüß]/g, " ");
  const replaced = noPunct
    .replace(/ä/g, "ae")
    .replace(/ö/g, "oe")
    .replace(/ü/g, "ue")
    .replace(/ß/g, "ss");
  return replaced.replace(/\s+/g, " ").trim();
}

export function parseNameAndRoom(s: string): ParsedSlots {
  const text = normalizeText(s);
  const parts = text.split(" ");
  const result: ParsedSlots = {};

  if (text.startsWith("herr")) {
    result.patientTitle = "Herr";
    if (parts[1]) result.patientName = parts[1].charAt(0).toUpperCase() + parts[1].slice(1);
  }
  if (text.startsWith("frau")) {
    result.patientTitle = "Frau";
    if (parts[1]) result.patientName = parts[1].charAt(0).toUpperCase() + parts[1].slice(1);
  }

  if (text.includes("ich heisse") || text.includes("ich heisse") || text.includes("ich heiße")) {
    const idx = parts.findIndex((p) => p === "heisse" || p === "heiße");
    if (idx >= 0 && parts[idx + 1]) {
      result.patientName = parts[idx + 1].charAt(0).toUpperCase() + parts[idx + 1].slice(1);
    }
  }
  if (text.includes("mein name ist")) {
    const idx = parts.findIndex((p) => p === "name");
    if (idx >= 0 && parts[idx + 2]) {
      result.patientName = parts[idx + 2].charAt(0).toUpperCase() + parts[idx + 2].slice(1);
    }
  }

  const roomMatch = text.match(/zimmer\s*(\d+)/) || text.match(/\bzi\s*(\d+)/);
  if (roomMatch?.[1]) {
    result.roomNumber = roomMatch[1];
  }

  return result;
}

export function parsePain(s: string): ParsedSlots {
  const text = normalizeText(s);
  const result: ParsedSlots = {};
  const locations: Record<string, string> = {
    kopf: "Kopf",
    bauch: "Bauch",
    ruecken: "Rücken",
    brust: "Brust",
    bein: "Bein",
    arm: "Arm",
    hals: "Hals",
  };
  for (const key of Object.keys(locations)) {
    if (text.includes(key)) {
      result.painLocation = locations[key];
      break;
    }
  }

  const scaleMatch = text.match(/\b([0-9]|10)\b/);
  if (scaleMatch?.[1]) {
    result.painScale = Number(scaleMatch[1]);
  }

  if (text.includes("seit")) {
    if (text.includes("gestern")) result.durationText = "seit gestern";
    else if (text.includes("heute")) result.durationText = "seit heute";
    else if (text.includes("stunden")) result.durationText = "seit Stunden";
    else if (text.includes("tagen") || text.includes("tage")) result.durationText = "seit Tagen";
    else result.durationText = "seit kurzem";
  }

  return result;
}

export function parseMedsAndTimes(s: string): ParsedSlots {
  const text = normalizeText(s);
  const result: ParsedSlots = {};
  const meds = [
    "ibuprofen",
    "paracetamol",
    "insulin",
    "schmerzmittel",
    "blutdruck",
    "tablette",
  ];
  for (const med of meds) {
    if (text.includes(med)) {
      result.medName = med.charAt(0).toUpperCase() + med.slice(1);
      break;
    }
  }

  const doseMatch = text.match(/\b(\d+)\s?(mg|ml)\b/);
  if (doseMatch?.[1] && doseMatch?.[2]) {
    result.medDoseText = `${doseMatch[1]} ${doseMatch[2]}`;
  } else if (text.includes("tablette")) {
    result.medDoseText = "1 Tablette";
  }

  const timeMatch = text.match(/\b(\d{1,2})\s?uhr\b/);
  if (timeMatch?.[1]) {
    result.timeText = `${timeMatch[1]} Uhr`;
  } else if (text.includes("morgens")) {
    result.timeText = "morgens";
  } else if (text.includes("mittags")) {
    result.timeText = "mittags";
  } else if (text.includes("abends")) {
    result.timeText = "abends";
  } else if (text.includes("nachts")) {
    result.timeText = "nachts";
  }

  if (text.includes("3x") || text.includes("dreimal")) {
    result.medScheduleText = "3x täglich";
  } else if (text.includes("2x") || text.includes("zweimal")) {
    result.medScheduleText = "2x täglich";
  }
  if (!result.medScheduleText && result.timeText) {
    result.medScheduleText = result.timeText;
  }

  if (text.includes("allergie") || text.includes("penicillin") || text.includes("vertraege nicht")) {
    result.allergiesText = "Allergie";
  } else if (text.includes("keine allergie")) {
    result.allergiesText = "keine Allergien";
  }

  return result;
}

export function mergeSlots(base: Record<string, any>, patch: ParsedSlots): Record<string, any> {
  return { ...base, ...patch };
}

export function parseVitals(s: string): ParsedSlots {
  const text = normalizeText(s);
  const result: ParsedSlots = {};

  const bpMatch =
    text.match(/\b(\d{2,3})\s*(?:zu|\/)\s*(\d{2,3})\b/) ??
    text.match(/\b(\d{2,3})\s*\/\s*(\d{2,3})\b/);
  if (bpMatch?.[1] && bpMatch?.[2]) {
    result.vital_bp_sys = bpMatch[1];
    result.vital_bp_dia = bpMatch[2];
  }

  const pulseMatch = text.match(/\b(puls|herzfrequenz)\s*(\d{2,3})\b/);
  if (pulseMatch?.[2]) {
    result.vital_pulse = pulseMatch[2];
  } else {
    const numberMatch = text.match(/\b(\d{2,3})\b/);
    if (numberMatch?.[1] && !result.vital_bp_sys) {
      result.vital_pulse = numberMatch[1];
    }
  }

  const tempMatch = text.match(/\b(\d{2})[,.](\d)\b/);
  if (tempMatch?.[1] && tempMatch?.[2]) {
    result.vital_temp = `${tempMatch[1]},${tempMatch[2]}`;
  }

  const spo2Match = text.match(/\b(\d{2,3})\s*(%|prozent|spo2)\b/);
  if (spo2Match?.[1]) {
    result.vital_spo2 = spo2Match[1];
  }

  if (text.includes("auffaellig") || text.includes("auffällig")) {
    result.vital_concern = "ja";
  }
  if (text.includes("ja")) {
    result.vital_concern = result.vital_concern ?? "ja";
  }
  if (text.includes("nein")) {
    result.vital_concern = "nein";
  }

  return result;
}

export function parseHygieneSafety(s: string): ParsedSlots {
  const text = normalizeText(s);
  const result: ParsedSlots = {};

  if (text.includes("hand") && (text.includes("desinf") || text.includes("desinfizieren"))) {
    result.hygiene_action = "Hände desinfizieren";
  }
  if (text.includes("handschuh")) {
    result.hygiene_action = result.hygiene_action ?? "Handschuhe anziehen";
    result.reason_short = "Handschuhe";
  }
  if (text.includes("maske")) {
    result.hygiene_action = result.hygiene_action ?? "Maske tragen";
  }
  if (text.includes("koerperfluess") || text.includes("körperflüss") || text.includes("wunde")) {
    result.reason_short = "Bei Körperflüssigkeiten";
  }

  if (text.includes("helfe") || text.includes("warte") || text.includes("nicht alleine")) {
    result.safety_action = "Bitte warten, ich helfe Ihnen.";
  }
  if (text.includes("klingel")) {
    result.safety_action = "Klingel erreichbar";
  }
  if (text.includes("bremse")) {
    result.safety_action = "Bremse drin";
  }
  if (text.includes("bettgitter")) {
    result.safety_action = "Bettgitter oben";
  }

  return result;
}

export function parseCommunication(s: string): ParsedSlots {
  const text = normalizeText(s);
  const result: ParsedSlots = {};

  if (text.includes("ich verstehe") || text.includes("unangenehm")) {
    result.reason_short = "Empathie";
  }
  if (text.includes("wir kuemmern") || text.includes("wir kümmern") || text.includes("gleich darum")) {
    result.reason_short = "Beruhigen";
  }
  if (text.includes("bitte") && text.includes("leiser")) {
    result.reason_short = "Grenze setzen";
  }
  if (text.includes("ich messe") || text.includes("ich hole")) {
    result.reason_short = "Nächster Schritt";
  }

  return result;
}
