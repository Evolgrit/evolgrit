import AsyncStorage from "@react-native-async-storage/async-storage";
import { uuid } from "./uuid";
import { loadPhaseState } from "./phaseStateStore";
import { appendEvent } from "./eventsStore";
import { getRiskState, riskActionFor, maybeTriggerMentorIntervention } from "./riskService";

export type NextActionSource = "mentor" | "risk" | "learn" | "default";

export type NextAction = {
  id: string;
  title: string;
  subtitle: string;
  cta: string;
  etaMin: number;
};

type Stored = {
  action: NextAction;
  source: NextActionSource;
  updatedAt: string;
};

const KEY = "evolgrit.nextAction.v2";

export async function getNextAction(): Promise<Stored> {
  const raw = await AsyncStorage.getItem(KEY);
  if (raw) return JSON.parse(raw);

  // if nothing exists yet, create default
  const created = await setDefaultNextAction();
  return created;
}

export async function setNextAction(action: NextAction, source: NextActionSource): Promise<Stored> {
  const stored: Stored = { action, source, updatedAt: new Date().toISOString() };
  await AsyncStorage.setItem(KEY, JSON.stringify(stored));
  return stored;
}

export async function setMentorNextAction(cta: string): Promise<Stored> {
  return setNextAction(
    {
      id: uuid(),
      title: "Next Action",
      subtitle: "From mentor: one small step today.",
      cta,
      etaMin: 3,
    },
    "mentor"
  );
}

export async function setRiskNextAction(cta: string): Promise<Stored> {
  return setNextAction(
    {
      id: uuid(),
      title: "Next Action",
      subtitle: "Let’s stabilize with one small step.",
      cta,
      etaMin: 3,
    },
    "risk"
  );
}

export async function setLearnNextAction(): Promise<Stored> {
  const ps = await loadPhaseState();
  return setNextAction(
    {
      id: uuid(),
      title: "Next Action",
      subtitle: `${ps.phase} · Week ${ps.week} → keep moving with one module step.`,
      cta: "Start today’s module step",
      etaMin: 5,
    },
    "learn"
  );
}

export async function setDefaultNextAction(): Promise<Stored> {
  return setNextAction(
    {
      id: uuid(),
      title: "Next Action",
      subtitle: "Short practice. Calm progress.",
      cta: "Do a 3-minute speaking drill",
      etaMin: 3,
    },
    "default"
  );
}

export async function completeNextActionAndRecompute(): Promise<Stored> {
  // MVP recompute rule:
  // Mentor stays until user does it once, then fallback to Learn, else Default.
  const current = await getNextAction();
  await appendEvent("next_action_completed", { source: current.source });

  const risk = await getRiskState();
  if (risk === "red") {
    const intervention = await maybeTriggerMentorIntervention(risk);
    if (intervention) await setMentorNextAction(intervention.cta);
    return getNextAction();
  }

  const intervention = await maybeTriggerMentorIntervention(risk);
  if (intervention) await setMentorNextAction(intervention.cta);

  if (current.source === "mentor") {
    // after completing a mentor action once, go to Learn
    return setLearnNextAction();
  }
  if (current.source === "learn") {
    // after completing Learn action, go to Default practice
    return setDefaultNextAction();
  }
  return setDefaultNextAction();
}

export async function resetNextActionService() {
  await AsyncStorage.removeItem(KEY);
}
