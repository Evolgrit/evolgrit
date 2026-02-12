import {
  normalizeText,
  parseMedsAndTimes,
  parseNameAndRoom,
  parsePain,
  parseVitals,
  parseHygieneSafety,
  parseCommunication,
  mergeSlots,
} from "./liveSlots";
import {
  TEMPLATES,
  UNIVERSAL_TEMPLATES,
  type ModuleType as TemplateModuleType,
  type TemplateKey,
  renderTemplate,
} from "./liveCoachTemplates";
import { pickCoachKey, type PolicyState } from "./liveCoachPolicy";

export type LiveModuleType = TemplateModuleType;

export type ConvoState = {
  module: LiveModuleType;
  step: number;
  stepKey: string;
  slots: Record<string, any>;
  noAudioCount: number;
  tooShortCount: number;
  offTopicCount: number;
  rephraseCount: number;
  lastUserHash?: string;
  lastCoachKey?: string;
};

type RouteArgs = {
  module: LiveModuleType;
  userText: string;
  state: ConvoState;
};

type RouteResult = {
  coachText: string;
  nextState: ConvoState;
  done?: boolean;
};

const STEP_KEYS: Record<LiveModuleType, string[]> = {
  pfleg_aufnahme: [
    "aufnahme_01_name_zimmer",
    "aufnahme_02_problem",
    "aufnahme_03_dringlichkeit",
    "aufnahme_04_closing",
  ],
  pfleg_schmerzen: [
    "schmerz_01_ort",
    "schmerz_02_skala",
    "schmerz_03_dauer",
    "schmerz_04_symptome",
    "schmerz_05_closing",
  ],
  pfleg_medikamente: [
    "med_01_medikament",
    "med_02_dosis",
    "med_03_zeit",
    "med_04_allergie",
    "med_05_closing",
  ],
  pfleg_vital: [
    "vital_01_bp",
    "vital_02_puls",
    "vital_03_temp",
    "vital_04_spo2",
    "vital_05_einschaetzung",
    "vital_06_closing",
  ],
  pfleg_hygiene: [
    "hyg_01_haende",
    "hyg_02_handschuhe",
    "safety_03_sturz",
    "safety_04_lagerung",
    "hyg_05_closing",
  ],
  pfleg_kommunikation: [
    "comm_01_empathie",
    "comm_02_beruhigen",
    "comm_03_grenze_setzen",
    "comm_04_naechster_schritt",
    "comm_05_closing",
  ],
};

const PAIN_RED_FLAGS = [
  "atemnot",
  "brustschmerz",
  "bewusstlos",
  "blutung",
  "starke blutung",
  "sehr schwindelig",
  "starke uebelkeit",
  "starke übelkeit",
];

const PROBLEM_KEYWORDS = [
  "schmerz",
  "kopfschmerz",
  "bauch",
  "uebelkeit",
  "übelkeit",
  "schwindel",
  "fieber",
  "sturz",
  "atem",
  "husten",
  "blutung",
];

const MED_KEYWORDS = [
  "tablette",
  "mg",
  "tropfen",
  "insulin",
  "blutdruck",
  "schmerzmittel",
  "ibuprofen",
  "paracetamol",
];

const TIME_KEYWORDS = ["uhr", "morgens", "mittags", "abends", "nachts", "taeglich", "täglich"];

const PAIN_LOCATIONS = ["kopf", "bauch", "ruecken", "rücken", "brust", "bein", "arm", "hals"];

const VITAL_KEYWORDS = ["blutdruck", "puls", "temperatur", "spo2", "sauerstoff", "sättigung"];
const HYGIENE_KEYWORDS = ["hand", "desinf", "handschuh", "maske", "klingel", "bremse", "bettgitter"];
const COMM_KEYWORDS = ["verstehe", "unangenehm", "kuemmern", "kümmern", "leiser", "bitte", "arzt", "werte"];

function wordCount(text: string) {
  return text.split(/\s+/).filter(Boolean).length;
}

function shorten(text: string, max = 140) {
  const trimmed = text.trim();
  if (trimmed.length <= max) return trimmed;
  return `${trimmed.slice(0, max).trim()}…`;
}

function getTemplate(module: LiveModuleType, stepKey: string, key: TemplateKey) {
  const tpl = TEMPLATES[module]?.[stepKey]?.[key];
  if (tpl) return tpl;
  const fallback = UNIVERSAL_TEMPLATES[key];
  if (fallback?.length) return fallback[0];
  return TEMPLATES[module]?.[stepKey]?.ASK ?? "";
}

function getExamples(module: LiveModuleType, stepKey: string) {
  const step = TEMPLATES[module]?.[stepKey] ?? {};
  const examples = [step.HINT_EXAMPLE_1, step.HINT_EXAMPLE_2, step.HINT_EXAMPLE_3]
    .filter(Boolean)
    .map((value) => String(value));
  return examples;
}

function buildHintWithExamples(module: LiveModuleType, stepKey: string, base: string) {
  const examples = getExamples(module, stepKey);
  if (!examples.length) return base;
  return `${base} ${examples.join(" ")}`.trim();
}

function detectUrgencyText(normalized: string, slots: Record<string, any>) {
  if (normalized.includes("leicht")) return "leicht";
  if (normalized.includes("mittel")) return "mittel";
  if (normalized.includes("stark")) return "stark";
  if (typeof slots.painScale === "number") {
    if (slots.painScale >= 7) return "stark";
    if (slots.painScale >= 4) return "mittel";
    return "leicht";
  }
  if (normalized.includes("dringend") || normalized.includes("akut") || normalized.includes("sofort")) {
    return "stark";
  }
  return "";
}

function parseProblemShort(text: string, normalized: string) {
  if (PROBLEM_KEYWORDS.some((k) => normalized.includes(k))) {
    return shorten(text);
  }
  return "";
}

function detectSymptoms(normalized: string) {
  if (normalized.includes("nein")) return "nein";
  if (normalized.includes("uebelkeit") || normalized.includes("übelkeit")) return "Übelkeit";
  if (normalized.includes("schwindel")) return "Schwindel";
  if (normalized.includes("fieber")) return "Fieber";
  if (normalized.includes("atem")) return "Atemprobleme";
  return "";
}

function isOffTopic(module: LiveModuleType, normalized: string, hasUsefulSlot: boolean) {
  if (!normalized) return true;
  if (hasUsefulSlot) return false;
  if (module === "pfleg_aufnahme") {
    return (
      !normalized.includes("zimmer") &&
      !normalized.includes("name") &&
      !normalized.includes("herr") &&
      !normalized.includes("frau") &&
      !PROBLEM_KEYWORDS.some((k) => normalized.includes(k))
    );
  }
  if (module === "pfleg_schmerzen") {
    return !PAIN_LOCATIONS.some((k) => normalized.includes(k)) && !normalized.includes("schmerz");
  }
  if (module === "pfleg_medikamente") {
    return (
      !MED_KEYWORDS.some((k) => normalized.includes(k)) &&
      !TIME_KEYWORDS.some((k) => normalized.includes(k))
    );
  }
  if (module === "pfleg_vital") {
    return !VITAL_KEYWORDS.some((k) => normalized.includes(k));
  }
  if (module === "pfleg_hygiene") {
    return !HYGIENE_KEYWORDS.some((k) => normalized.includes(k));
  }
  if (module === "pfleg_kommunikation") {
    return !COMM_KEYWORDS.some((k) => normalized.includes(k));
  }
  return false;
}

function advanceStep(state: ConvoState) {
  const steps = STEP_KEYS[state.module];
  const nextStep = Math.min(state.step + 1, steps.length - 1);
  return { ...state, step: nextStep, stepKey: steps[nextStep] };
}

function resetPolicyCounts(state: ConvoState) {
  return {
    ...state,
    noAudioCount: 0,
    tooShortCount: 0,
    offTopicCount: 0,
    rephraseCount: 0,
  };
}

export function routeCoachReply({ module, userText, state }: RouteArgs): RouteResult {
  const normalized = normalizeText(userText);
  const steps = STEP_KEYS[module];
  const stepKey = steps[state.step] ?? steps[0];
  const isTooShort = wordCount(normalized) < 3;
  const hasAudio = Boolean(normalized);

  let slotPatch: Record<string, any> = {};
  if (module === "pfleg_aufnahme") {
    slotPatch = parseNameAndRoom(userText);
    const problemShort = parseProblemShort(userText, normalized);
    if (problemShort) slotPatch.problemShort = problemShort;
    const painPatch = parsePain(userText);
    if (painPatch.durationText) slotPatch.durationText = painPatch.durationText;
    const urgencyText = detectUrgencyText(normalized, { ...state.slots, ...painPatch });
    if (urgencyText) slotPatch.urgencyText = urgencyText;
  } else if (module === "pfleg_schmerzen") {
    slotPatch = parsePain(userText);
    const symptoms = detectSymptoms(normalized);
    if (symptoms) slotPatch.symptomsText = symptoms;
  } else if (module === "pfleg_medikamente") {
    slotPatch = parseMedsAndTimes(userText);
    if (normalized.includes("keine")) {
      slotPatch.allergiesText = "keine Allergien";
    }
  } else if (module === "pfleg_vital") {
    slotPatch = parseVitals(userText);
  } else if (module === "pfleg_hygiene") {
    slotPatch = parseHygieneSafety(userText);
  } else if (module === "pfleg_kommunikation") {
    slotPatch = parseCommunication(userText);
  }

  const slots = mergeSlots(state.slots, slotPatch);

  if (module === "pfleg_schmerzen" && PAIN_RED_FLAGS.some((k) => normalized.includes(k))) {
    slots.redflag = "true";
  }

  let hasUsefulSlot = false;
  if (stepKey === "aufnahme_01_name_zimmer") {
    hasUsefulSlot = Boolean(slots.patientName && slots.roomNumber);
  } else if (stepKey === "aufnahme_02_problem") {
    hasUsefulSlot = Boolean(slots.problemShort);
  } else if (stepKey === "aufnahme_03_dringlichkeit") {
    hasUsefulSlot = Boolean(slots.durationText && slots.urgencyText);
  } else if (stepKey === "aufnahme_04_closing") {
    hasUsefulSlot = true;
  } else if (stepKey === "schmerz_01_ort") {
    hasUsefulSlot = Boolean(slots.painLocation);
  } else if (stepKey === "schmerz_02_skala") {
    hasUsefulSlot = typeof slots.painScale === "number";
  } else if (stepKey === "schmerz_03_dauer") {
    hasUsefulSlot = Boolean(slots.durationText);
  } else if (stepKey === "schmerz_04_symptome") {
    hasUsefulSlot = Boolean(slots.symptomsText || normalized.includes("nein"));
  } else if (stepKey === "schmerz_05_closing") {
    hasUsefulSlot = true;
  } else if (stepKey === "med_01_medikament") {
    hasUsefulSlot = Boolean(slots.medName);
  } else if (stepKey === "med_02_dosis") {
    hasUsefulSlot = Boolean(slots.medDoseText);
  } else if (stepKey === "med_03_zeit") {
    hasUsefulSlot = Boolean(slots.medScheduleText || slots.timeText);
  } else if (stepKey === "med_04_allergie") {
    hasUsefulSlot = Boolean(slots.allergiesText);
  } else if (stepKey === "med_05_closing") {
    hasUsefulSlot = true;
  } else if (stepKey === "vital_01_bp") {
    hasUsefulSlot = Boolean(slots.vital_bp_sys && slots.vital_bp_dia);
  } else if (stepKey === "vital_02_puls") {
    hasUsefulSlot = Boolean(slots.vital_pulse);
  } else if (stepKey === "vital_03_temp") {
    hasUsefulSlot = Boolean(slots.vital_temp);
  } else if (stepKey === "vital_04_spo2") {
    hasUsefulSlot = Boolean(slots.vital_spo2);
  } else if (stepKey === "vital_05_einschaetzung") {
    hasUsefulSlot = Boolean(slots.vital_concern);
  } else if (stepKey === "vital_06_closing") {
    hasUsefulSlot = true;
  } else if (stepKey === "hyg_01_haende") {
    hasUsefulSlot = Boolean(slots.hygiene_action);
  } else if (stepKey === "hyg_02_handschuhe") {
    hasUsefulSlot = Boolean(slots.reason_short || slots.hygiene_action);
  } else if (stepKey === "safety_03_sturz") {
    hasUsefulSlot = Boolean(slots.safety_action);
  } else if (stepKey === "safety_04_lagerung") {
    hasUsefulSlot = Boolean(slots.safety_action);
  } else if (stepKey === "hyg_05_closing") {
    hasUsefulSlot = true;
  } else if (stepKey === "comm_01_empathie") {
    hasUsefulSlot = Boolean(slots.reason_short);
  } else if (stepKey === "comm_02_beruhigen") {
    hasUsefulSlot = Boolean(slots.reason_short);
  } else if (stepKey === "comm_03_grenze_setzen") {
    hasUsefulSlot = Boolean(slots.reason_short);
  } else if (stepKey === "comm_04_naechster_schritt") {
    hasUsefulSlot = Boolean(slots.reason_short);
  } else if (stepKey === "comm_05_closing") {
    hasUsefulSlot = true;
  }

  const offTopic = isOffTopic(module, normalized, hasUsefulSlot);

  const policyState: PolicyState = {
    stepKey,
    noAudioCount: state.noAudioCount,
    tooShortCount: state.tooShortCount,
    offTopicCount: state.offTopicCount,
    rephraseCount: state.rephraseCount,
    lastCoachKey: state.lastCoachKey,
    lastUserHash: state.lastUserHash,
  };

  const { key, next } = pickCoachKey({
    module,
    stepKey,
    normalizedUserText: normalized,
    hasUsefulSlot,
    isOffTopic: offTopic,
    isTooShort,
    hasAudio,
    state: policyState,
  });

  let coachText = getTemplate(module, stepKey, key);
  coachText = renderTemplate(coachText, slots);

  const needsExtraHint =
    (next.offTopicCount >= 2 || next.tooShortCount >= 2) &&
    (key === "HINT_STRUCTURE" || key === "REMIND_GOAL" || key === "TOO_SHORT");

  if (needsExtraHint) {
    const remind = getTemplate(module, stepKey, "REMIND_GOAL");
    const structure = getTemplate(module, stepKey, "HINT_STRUCTURE");
    const combined = buildHintWithExamples(module, stepKey, structure);
    coachText = [remind, combined].filter(Boolean).join(" ").trim();
  } else if (key === "HINT_STRUCTURE") {
    coachText = buildHintWithExamples(module, stepKey, coachText);
  }

  let nextState: ConvoState = {
    ...state,
    slots,
    stepKey,
    noAudioCount: next.noAudioCount,
    tooShortCount: next.tooShortCount,
    offTopicCount: next.offTopicCount,
    rephraseCount: next.rephraseCount,
    lastUserHash: next.lastUserHash,
    lastCoachKey: next.lastCoachKey,
  };

  let done = false;
  if (hasUsefulSlot && (key === "ACK" || key === "CLOSING")) {
    if (stepKey.endsWith("closing")) {
      done = true;
    } else {
      nextState = resetPolicyCounts(advanceStep(nextState));
    }
  }

  return { coachText, nextState, done };
}
