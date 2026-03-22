import { ALLOWED_KEYS, type ModuleType, type TemplateKey } from "./liveCoachTemplates";

export type PolicyState = {
  stepKey: string;
  noAudioCount: number;
  tooShortCount: number;
  offTopicCount: number;
  rephraseCount: number;
  lastUserHash?: string;
  lastCoachKey?: string;
};

export function hashUser(s: string): string {
  let hash = 0;
  for (let i = 0; i < s.length; i++) {
    hash = (hash << 5) - hash + s.charCodeAt(i);
    hash |= 0;
  }
  return String(hash);
}

export function pickCoachKey(args: {
  module: ModuleType;
  stepKey: string;
  normalizedUserText: string;
  hasUsefulSlot: boolean;
  isOffTopic: boolean;
  isTooShort: boolean;
  hasAudio: boolean;
  state: PolicyState;
}): { key: TemplateKey; next: PolicyState } {
  const allowed = ALLOWED_KEYS[args.module][args.stepKey] ?? ["ASK"];
  const next = { ...args.state, stepKey: args.stepKey };

  const userHash = hashUser(args.normalizedUserText);
  if (args.state.lastUserHash && args.state.lastUserHash === userHash) {
    next.offTopicCount += 1;
    next.lastUserHash = userHash;
    const rotate = allowed.includes("HINT_STRUCTURE") ? "HINT_STRUCTURE" : "ASK";
    return { key: rotate, next: { ...next, lastCoachKey: rotate } };
  }
  next.lastUserHash = userHash;

  if (!args.hasAudio) {
    next.noAudioCount += 1;
    const key: TemplateKey = next.noAudioCount >= 2 ? "HINT_STRUCTURE" : "NO_AUDIO";
    const resolved =
      key === args.state.lastCoachKey && allowed.includes("HINT_STRUCTURE") ? "HINT_STRUCTURE" : key;
    return { key: resolved, next: { ...next, lastCoachKey: resolved } };
  }

  if (args.isTooShort) {
    next.tooShortCount += 1;
    const key: TemplateKey = next.tooShortCount >= 2 ? "HINT_STRUCTURE" : "TOO_SHORT";
    const resolved =
      key === args.state.lastCoachKey && allowed.includes("HINT_STRUCTURE") ? "HINT_STRUCTURE" : key;
    return { key: resolved, next: { ...next, lastCoachKey: resolved } };
  }

  if (args.isOffTopic) {
    next.offTopicCount += 1;
    const key: TemplateKey = next.offTopicCount >= 2 ? "REMIND_GOAL" : "ASK";
    const resolved = key === args.state.lastCoachKey && allowed.includes("HINT_STRUCTURE")
      ? "HINT_STRUCTURE"
      : key;
    return { key: resolved, next: { ...next, lastCoachKey: resolved } };
  }

  next.offTopicCount = 0;
  next.tooShortCount = 0;
  next.noAudioCount = 0;

  if (args.hasUsefulSlot) {
    const key: TemplateKey = allowed.includes("CLOSING") ? "CLOSING" : "ACK";
    const resolved =
      key === args.state.lastCoachKey && allowed.includes("ACK") ? "ACK" : key;
    return { key: resolved, next: { ...next, lastCoachKey: resolved } };
  }

  if (allowed.includes("REPHRASE") && next.rephraseCount < 1) {
    next.rephraseCount += 1;
    const resolved = args.state.lastCoachKey === "REPHRASE" && allowed.includes("ASK") ? "ASK" : "REPHRASE";
    return { key: resolved, next: { ...next, lastCoachKey: resolved } };
  }

  const fallback = args.state.lastCoachKey === "ASK" && allowed.includes("HINT_STRUCTURE")
    ? "HINT_STRUCTURE"
    : "ASK";
  return { key: fallback, next: { ...next, lastCoachKey: fallback } };
}
