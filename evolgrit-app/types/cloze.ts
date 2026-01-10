export type ClozeTurn = {
  speaker: string;
  align: "left" | "right";
  text: string;
  translation?: string;
};

export type ClozeGap = {
  id: number;
  answer: string;
  options: string[];
};

export type ClozeDialogExercise = {
  id: string;
  level: string;
  week: number;
  title: string;
  prompt: string;
  tip?: string;
  turns: ClozeTurn[];
  gaps: ClozeGap[];
};

export type ClozeSegment =
  | { kind: "text"; value: string }
  | { kind: "gap"; gapId: number };

/**
 * Parses a text with placeholders like {{gap:0}} into text/gap segments.
 */
export function parseClozeText(text: string): ClozeSegment[] {
  const segments: ClozeSegment[] = [];
  const regex = /{{\s*gap\s*:\s*(\d+)\s*}}/g;
  let lastIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = regex.exec(text)) !== null) {
    const [full, gapIdRaw] = match;
    const start = match.index;

    if (start > lastIndex) {
      segments.push({ kind: "text", value: text.slice(lastIndex, start) });
    }

    const gapId = Number(gapIdRaw);
    if (!Number.isNaN(gapId)) {
      segments.push({ kind: "gap", gapId });
    }

    lastIndex = start + full.length;
  }

  if (lastIndex < text.length) {
    segments.push({ kind: "text", value: text.slice(lastIndex) });
  }

  return segments;
}
