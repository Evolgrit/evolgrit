export function makeCorrection(transcriptRaw: string) {
  const transcript = transcriptRaw.trim();
  if (!transcript) {
    return { better: "", tip: "", score: 0 };
  }

  const lower = transcript.toLowerCase();
  const hasBitte = lower.includes("bitte");
  const hasIch = lower.startsWith("ich");
  const hasQuestion = /\b(wie|was|wo|wann|warum|können|kann)\b/i.test(transcript);
  const hasArticle = /\b(ein|eine|einen)\b/i.test(transcript);
  const needsArticle = /\b(brot|apfel|käse)\b/i.test(transcript);

  let better = transcript;
  let tip = "";

  if (needsArticle && !hasArticle) {
    if (/brot/i.test(transcript)) {
      better = "Ich suche ein Brot, bitte.";
      tip = "Ein Artikel macht den Satz klarer.";
    } else if (/apfel/i.test(transcript)) {
      better = "Ich hätte gern einen Apfel, bitte.";
      tip = "Ein Artikel macht den Satz klarer.";
    } else if (/käse/i.test(transcript)) {
      better = "Ich hätte gern einen Käse, bitte.";
      tip = "Ein Artikel macht den Satz klarer.";
    }
  } else if (!hasBitte) {
    better = `${transcript.replace(/[.!?]$/, "")}, bitte.`;
    tip = "Ein „bitte“ klingt höflicher.";
  }

  let score = 0;
  if (hasIch || hasQuestion) score += 0.3;
  if (hasBitte) score += 0.3;
  if (needsArticle && hasArticle) score += 0.3;
  score = Math.min(1, score);

  return { better, tip, score };
}
