import { serve } from "https://deno.land/std@0.224.0/http/server.ts";

type Body = {
  conceptKey: string;
  targetLanguageCode?: string;
  nativeLanguageCode?: string;
};

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}

function buildSystemPrompt() {
  return `You are a language-learning content generator for Evolgrit.

Your job: Convert a concept hint into one everyday, learner-friendly noun in the TARGET language (with correct article when applicable) and generate useful B1 and C1 example sentences.

Hard rules:
1) Output MUST be valid JSON ONLY. No markdown. No extra text.
2) NEVER return generic category words as the final noun, e.g. "object", "thing", "item", "beverage", "soft drink", "food", "indoor", "outdoor", "clothing", "building", "sky".
3) Prefer concrete everyday nouns people actually say, e.g. "die Cola-Dose", "die Dose", "die Pflanze", "das Handy", "der Laptop".
4) German output MUST include correct article when the noun is common and gender is known. Use der/die/das and ein/eine/ein.
5) Provide 2–3 B1 sentences and 2–3 C1 sentences in the TARGET language:
   - B1: short, practical, everyday/work-relevant.
   - C1: more natural and slightly complex.
6) If possible, include at least one Akkusativ/Dativ pair using the same noun.
7) Keep it safe and neutral.`;
}

function buildUserPrompt(params: {
  conceptKey: string;
  targetLang: string;
  nativeLang: string;
}) {
  return `Target language: ${params.targetLang}
Native UI language: ${params.nativeLang}
CEFR: B1 and C1 examples

Concept hint (important): ${params.conceptKey}

Return JSON with exactly this schema:
{
  "bestKey": "snake_case_key_in_english",
  "target": {
    "wordDef": "article + noun in target language",
    "wordIndef": "indefinite article + noun in target language"
  },
  "native": { "word": "short translation in native UI language" },
  "examples": {
    "b1": ["...", "..."],
    "c1": ["...", "..."]
  }
}`;
}

async function callOpenAiJson(system: string, user: string) {
  const apiKey = Deno.env.get("OPENAI_API_KEY");
  if (!apiKey) throw new Error("OPENAI_API_KEY missing");

  const res = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: { "Authorization": `Bearer ${apiKey}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      model: "gpt-4o-mini",
      temperature: 0.2,
      messages: [
        { role: "system", content: system },
        { role: "user", content: user },
      ],
      response_format: { type: "json_object" },
    }),
  });

  if (!res.ok) {
    const txt = await res.text().catch(() => "");
    throw new Error(`OpenAI error ${res.status}: ${txt}`);
  }
  const data = await res.json();
  const content = data?.choices?.[0]?.message?.content;
  if (!content) throw new Error("No GPT content");
  return JSON.parse(content);
}

serve(async (req) => {
  try {
    if (req.method !== "POST") return json({ error: "Method Not Allowed" }, 405);

    const body: Body = await req.json().catch(() => ({ conceptKey: "" } as Body));
    const conceptKey = String(body?.conceptKey ?? "").trim() || "unknown";
    const targetLanguageCode = (body?.targetLanguageCode ?? "de").toLowerCase().split("-")[0];
    const nativeLanguageCode = (body?.nativeLanguageCode ?? "en").toLowerCase().split("-")[0];

    const system = buildSystemPrompt();
    const user = buildUserPrompt({
      conceptKey,
      targetLang: targetLanguageCode,
      nativeLang: nativeLanguageCode,
    });

    const result = await callOpenAiJson(system, user);
    return json({ ...result, meta: { usedGpt: true, conceptKey } }, 200);
  } catch (e) {
    return json({ error: String(e?.message ?? e), meta: { usedGpt: false } }, 200);
  }
});
