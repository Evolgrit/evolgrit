import { addMentorMessage } from "./mentorStore";
import { setNextAction } from "./nextActionService";
import { uuid } from "./uuid";

export async function triggerMentorIntervention(reason: string) {
  const text =
    "Thanks. Let’s make it smaller.\nToday: one 2-minute speaking drill is enough." +
    (reason ? `\nReason: ${reason}` : "");

  await addMentorMessage(text);

  await setNextAction(
    {
      id: uuid(),
      title: "Short speaking drill",
      subtitle: "Low effort. Focus on clarity, not speed.",
      cta: "Start now · 2 min",
      etaMin: 2,
    },
    "mentor"
  );
}
