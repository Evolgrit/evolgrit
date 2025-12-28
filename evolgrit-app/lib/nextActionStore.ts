import AsyncStorage from "@react-native-async-storage/async-storage";
import { uuid } from "./uuid";

export type NextAction = {
  id: string;
  title: string;
  subtitle: string;
  cta: string;
  etaMin: number;
};

const KEY = "evolgrit.nextAction";

export async function loadNextAction(): Promise<NextAction | null> {
  const raw = await AsyncStorage.getItem(KEY);
  return raw ? JSON.parse(raw) : null;
}

export async function saveNextAction(action: NextAction) {
  await AsyncStorage.setItem(KEY, JSON.stringify(action));
}

export async function completeNextAction(): Promise<NextAction> {
  const next: NextAction = {
    id: uuid(),
    title: "Next Action",
    subtitle: "Situation: Transport \u2192 Ask for direction + stop",
    cta: "Start 3-min listening drill",
    etaMin: 3,
  };
  await saveNextAction(next);
  return next;
}
