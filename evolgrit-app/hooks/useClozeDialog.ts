import { useMemo, useState } from "react";
import type { ClozeDialogExercise, ClozeGap, ClozeSegment, ClozeTurn } from "../types/cloze";
import { parseClozeText } from "../types/cloze";

export type GapState = "idle" | "correct" | "wrong";

export function useClozeDialog(exercise: ClozeDialogExercise | null) {
  const parsedTurns = useMemo(() => {
    if (!exercise) return [];
    return exercise.turns.map((t) => ({
      ...t,
      segments: parseClozeText(t.text),
    }));
  }, [exercise]);

  const gaps = exercise?.gaps ?? [];

  const [activeGapIndex, setActiveGapIndex] = useState(0);
  const [answersByGapId, setAnswersByGapId] = useState<Record<number, { selected?: string; state: GapState }>>({});

  const activeGap = gaps[activeGapIndex] ?? null;

  const onPick = (opt: string) => {
    if (!activeGap) return;
    setAnswersByGapId((prev) => {
      const next = { ...prev };
      const correct = opt === activeGap.answer;
      next[activeGap.id] = { selected: opt, state: correct ? "correct" : "wrong" };
      return next;
    });

    if (opt === activeGap.answer) {
      const nextIndex = activeGapIndex + 1;
      setTimeout(() => {
        setActiveGapIndex(nextIndex);
      }, 450);
    }
  };

  const isComplete = activeGapIndex >= gaps.length && gaps.length > 0;

  return {
    parsedTurns,
    gaps,
    activeGapIndex,
    activeGap,
    answersByGapId,
    onPick,
    isComplete,
    setActiveGapIndex,
  };
}
