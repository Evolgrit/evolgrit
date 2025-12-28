import { lastEvent } from "./eventsStore";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { addMentorMessage } from "./mentorStore";
import { limiterOf, type ERS } from "./ersStore";

export type RiskState = "green" | "yellow" | "red";

// Simple MVP thresholds (can tune later):
// - yellow: no completion for 2+ days
// - red: no completion for 5+ days
export async function getRiskState(): Promise<RiskState> {
  const last = await lastEvent("next_action_completed");
  if (!last) return "yellow"; // brand new user = treat as gentle start

  const lastTs = new Date(last.createdAt).getTime();
  const nowTs = Date.now();
  const days = (nowTs - lastTs) / (1000 * 60 * 60 * 24);

  let computed: RiskState = "green";
  if (days >= 5) computed = "red";
  else if (days >= 2) computed = "yellow";

  const override = await getCheckinOverrideRisk();
  if (override === "red") return "red";
  if (override === "yellow" && computed === "green") return "yellow";
  return computed;
}

export function riskActionFor(state: RiskState) {
  if (state === "red") {
    return {
      subtitle: "Let’s stabilize first. One small step is enough.",
      cta: "Do a 2-minute speaking drill",
      etaMin: 2,
    };
  }
  if (state === "yellow") {
    return {
      subtitle: "Keep it simple today. One short step is enough.",
      cta: "Do a 3-minute speaking drill",
      etaMin: 3,
    };
  }
  return null;
}

const COOLDOWN_KEY = "evolgrit.mentorInterventionAt";
const COOLDOWN_HOURS = 48;
const LAST_AUTO_MENTOR_TS = "evolgrit.last_auto_mentor_ts";
const AUTO_COOLDOWN_MS = 24 * 60 * 60 * 1000;

async function cooldownActive(): Promise<boolean> {
  const raw = await AsyncStorage.getItem(COOLDOWN_KEY);
  if (!raw) return false;
  const last = Number(raw);
  const hours = (Date.now() - last) / (1000 * 60 * 60);
  return hours < COOLDOWN_HOURS;
}

async function getCheckinOverrideRisk(): Promise<RiskState | null> {
  const e = await lastEvent("checkin_submitted");
  if (!e) return null;

  const ts = new Date(e.createdAt).getTime();
  const hours = (Date.now() - ts) / (1000 * 60 * 60);
  if (hours > 24) return null;

  const mood = e.payload?.mood;
  if (mood === "no_time") return "red";
  if (mood === "stressed") return "yellow";
  return null;
}

function mentorMessageForLimiter(limiter: "A" | "C" | "L" | "S") {
  switch (limiter) {
    case "A":
      return {
        title: "Mentor",
        text: "Let’s make it practical.\nToday: one short real-life speaking drill is enough.",
      };
    case "C":
      return {
        title: "Mentor",
        text: "Let’s keep it simple.\nA 2-minute speaking drill helps rebuild consistency.",
      };
    case "L":
      return {
        title: "Mentor",
        text: "Focus on clarity today.\nOne calm speaking drill is enough.",
      };
    case "S":
      return {
        title: "Mentor",
        text: "Take it easy today.\nGentle practice works better than pressure.",
      };
  }
}

export async function maybeTriggerMentorIntervention(
  risk: RiskState,
  ers?: ERS
): Promise<null | { cta: string }> {
  if (risk !== "red") return null;

  if (await cooldownActive()) return null;

  const lastAuto = await AsyncStorage.getItem(LAST_AUTO_MENTOR_TS);
  if (lastAuto) {
    const lastTs = Number(lastAuto);
    if (Date.now() - lastTs < AUTO_COOLDOWN_MS) return null;
  }

  const limiter = ers ? limiterOf(ers) : "A";
  const message = mentorMessageForLimiter(limiter);
  await addMentorMessage(message.text, { ctaLabel: "Start now · 2 min", ctaRoute: "/speak-v2" });
  await AsyncStorage.setItem(COOLDOWN_KEY, String(Date.now()));
  await AsyncStorage.setItem(LAST_AUTO_MENTOR_TS, String(Date.now()));
  return { cta: "Do a 2-minute speaking drill" };
}
