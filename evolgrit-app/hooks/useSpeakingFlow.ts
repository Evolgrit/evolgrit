import { useEffect, useMemo, useState } from "react";

export type DialogLine = {
  id: string;
  role: "mentor" | "user" | "system";
  displayText: string;
};

export type SpeakingPhase = "mentor" | "user" | "done";

export function useSpeakingFlow(lines: DialogLine[]) {
  const dialogLines = useMemo(
    () => lines.filter((l): l is DialogLine & { role: "mentor" | "user" } => l.role !== "system"),
    [lines]
  );
  const [activeIndex, setActiveIndex] = useState(0);
  const [completed, setCompleted] = useState<Record<string, boolean>>({});

  const activeLine = dialogLines[activeIndex];
  const phase: SpeakingPhase = activeLine ? (activeLine.role as SpeakingPhase) : "done";

  // reset if dialog changes
  useEffect(() => {
    setActiveIndex(0);
    setCompleted({});
  }, [lines]);

  function advanceMentor() {
    if (phase !== "mentor") return;
    const next = activeIndex + 1;
    if (next >= dialogLines.length) {
      setActiveIndex(dialogLines.length);
    } else {
      setActiveIndex(next);
    }
  }

  function completeUser() {
    if (phase !== "user" || !activeLine) return;
    setCompleted((prev) => ({ ...prev, [activeLine.id]: true }));
    const next = activeIndex + 1;
    if (next >= dialogLines.length) {
      setActiveIndex(dialogLines.length);
    } else {
      setActiveIndex(next);
    }
  }

  return {
    dialogLines,
    activeLineId: activeLine?.id ?? null,
    activeRole: activeLine?.role ?? null,
    phase,
    activeIndex,
    completed,
    setCompleted,
    advanceMentor,
    completeUser,
  };
}
