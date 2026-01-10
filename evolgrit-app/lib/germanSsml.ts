export type TtsStyle = "normal" | "slow" | "teaching";

export type SsmlOptions = {
  voiceId: string; // e.g. "de-DE-KatjaNeural"
  style: TtsStyle;
  text: string; // German target text
  lang?: string; // default "de-DE"
  breakMs?: number; // default 220ms (for teaching)
};

/**
 * Minimal, Apple-like SSML for German drills.
 * - normal: natural rate
 * - slow: slower, clearer articulation
 * - teaching: slightly slower + micro breaks between clauses/sentences
 */
export function buildGermanSsml(opts: SsmlOptions): string {
  const lang = opts.lang ?? "de-DE";
  const breakMs = opts.breakMs ?? 220;

  const escapeXml = (s: string) =>
    s
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&apos;");

  const text = escapeXml(opts.text.trim());

  const prosodyRate = opts.style === "normal" ? "1.0" : opts.style === "slow" ? "0.88" : "0.92";

  const teachingText = opts.style === "teaching" ? injectTeachingBreaks(text, breakMs) : text;

  return [
    `<speak xml:lang="${lang}">`,
    `  <voice name="${opts.voiceId}">`,
    `    <prosody rate="${prosodyRate}" pitch="0%">`,
    `      ${teachingText}`,
    `    </prosody>`,
    `  </voice>`,
    `</speak>`,
  ].join("\n");
}

/**
 * Inserts short breaks after commas and sentence endings.
 * Keeps it subtle (no robotic pauses).
 */
function injectTeachingBreaks(text: string, breakMs: number): string {
  const br = `<break time="${breakMs}ms"/>`;

  let out = text.replace(/,\s*/g, `,${br}`);

  out = out.replace(/([.!?])\s+/g, `$1<break time="${Math.max(breakMs + 40, 260)}ms"/>`);

  return out;
}
