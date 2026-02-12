import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect, useState } from "react";

export type CoachVoice = "de-DE-KatjaNeural" | "de-DE-AmalaNeural";

const KEY = "evolgrit.coachVoice";
export const DEFAULT_COACH_VOICE: CoachVoice = "de-DE-KatjaNeural";

export async function getCoachVoice() {
  try {
    const raw = await AsyncStorage.getItem(KEY);
    if (raw === "de-DE-AmalaNeural") return raw;
    if (raw === "de-DE-KatjaNeural") return raw;
    return DEFAULT_COACH_VOICE;
  } catch {
    return DEFAULT_COACH_VOICE;
  }
}

export async function setCoachVoice(voice: CoachVoice) {
  try {
    await AsyncStorage.setItem(KEY, voice);
  } catch {
    // ignore
  }
}

export function useCoachVoice() {
  const [voice, setVoiceState] = useState<CoachVoice>(DEFAULT_COACH_VOICE);

  useEffect(() => {
    let isMounted = true;
    getCoachVoice().then((stored) => {
      if (isMounted) setVoiceState(stored);
    });
    return () => {
      isMounted = false;
    };
  }, []);

  const setVoice = (next: CoachVoice) => {
    setVoiceState(next);
    void setCoachVoice(next);
  };

  return { voice, setVoice };
}
