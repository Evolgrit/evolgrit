import { serve } from "https://deno.land/std@0.224.0/http/server.ts";

type VisionTag = { name: string; confidence: number };
type RankedTag = VisionTag & { score: number; norm: string };

const GENERIC_BLACKLIST = new Set([
  "object",
  "thing",
  "item",
  "stuff",
  "beverage",
  "soft drink",
  "drink",
  "food",
  "product",
  "indoor",
  "outdoor",
  "sky",
  "building",
  "clothing",
  "person",
  "human",
  "landscape",
  "nature",
  "street",
  "city",
  "container",
]);

const CONCRETE_BOOST: Record<string, number> = {
  "can": 0.35,
  "tin can": 0.35,
  "aluminum can": 0.35,
  "bottle": 0.30,
  "glass": 0.28,
  "cup": 0.28,
  "mug": 0.28,
  "bag": 0.20,
  "chair": 0.18,
  "table": 0.18,
  "plant": 0.22,
  "laptop": 0.24,
  "computer": 0.18,
  "mobile phone": 0.35,
  "cell phone": 0.35,
  "phone": 0.35,
  "key": 0.25,
};

const TARGET_LANGS = new Set(["de", "en", "fr", "nl", "sv", "no", "da", "fi", "ja", "ko"]);

function norm(s: string) {
  return s.trim().toLowerCase().replaceAll("_", " ");
}

function baseLang(code?: string) {
  const c = (code ?? "en").toLowerCase().split("-")[0];
  return TARGET_LANGS.has(c) ? c : c;
}

function isGeneric(n: string) {
  if (GENERIC_BLACKLIST.has(n)) return true;
  if (n.includes("soft drink") || n.includes("beverage")) return true;
  if (n === "drink" || n === "food" || n === "product") return true;
  return false;
}

function rankTags(tags: VisionTag[]): RankedTag[] {
  return tags
    .map((t) => {
      const n = norm(t.name);
      let score = t.confidence;

      if (GENERIC_BLACKLIST.has(n)) score -= 0.65;
      if (n.includes("indoor") || n.includes("outdoor")) score -= 0.35;
      if (n.includes("beverage") || n.includes("soft drink")) score -= 0.65;
      if (n === "drink" || n === "food" || n === "product") score -= 0.5;

      if (CONCRETE_BOOST[n] !== undefined) score += CONCRETE_BOOST[n];

      if (n.split(" ").length >= 2 && !GENERIC_BLACKLIST.has(n)) score += 0.06;

      return { ...t, norm: n, score };
    })
    .filter((t) => t.score > 0.05)
    .sort((a, b) => b.score - a.score);
}

function mapToConcept(normTag: string): string | null {
  const n = normTag;

  if (n === "mobile phone" || n === "cell phone" || n === "phone") return "phone";
  if (n === "tin can" || n === "aluminum can" || n === "can") return "can";
  if (n === "soft drink" || n === "soda" || n === "cola" || n === "beverage") return "soft_drink";
  if (n === "plant" || n.includes("houseplant") || n.includes("indoor plant")) return "plant";
  if (n === "cup" || n === "mug" || n.includes("coffee cup")) return "cup";
  if (n === "key") return "key";
  if (n === "laptop" || n === "computer") return "laptop";
  if (n === "bottle") return "bottle";
  if (n === "glass") return "glass";
  if (n === "chair") return "chair";
  if (n === "table") return "table";
  if (n === "bag" || n.includes("handbag") || n.includes("backpack")) return "bag";

  return null;
}

function composeConcept(candidates: string[]): string {
  const set = new Set(candidates);
  if (set.has("can") && set.has("soft_drink")) return "cola_can";
  return candidates[0] ?? "unknown";
}

function safeJsonParse(text: string) {
  return JSON.parse(text);
}

function buildGptSystemPrompt() {
  return `You are a language-learning content generator for Evolgrit.

Your job: Convert noisy computer-vision tags into one everyday, learner-friendly noun in the TARGET language (with correct article when applicable) and generate useful B1 and C1 example sentences.

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

function buildGptUserPrompt(params: {
  targetLang: string;
  nativeLang: string;
  ranked: { name: string; confidence: number; score: number; concept?: string | null }[];
  conceptKey: string;
  ocrText?: string;
}) {
  const tagsList = params.ranked
    .map((t) => `- ${t.name} (conf=${t.confidence.toFixed(3)}, score=${t.score.toFixed(3)}${t.concept ? `, concept=${t.concept}` : ""})`)
    .join("\n");

  return `Target language: ${params.targetLang}
Native UI language: ${params.nativeLang}
CEFR: B1 and C1 examples

Concept hint (important): ${params.conceptKey}

Computer vision tags (sorted by usefulness):
${tagsList}

OCR text (may be empty):
${params.ocrText ?? ""}

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

async function callAzureVisionTags(imageBytes: Uint8Array): Promise<VisionTag[]> {
  const endpoint = Deno.env.get("AZURE_VISION_ENDPOINT")?.replace(/\/+$/, "");
  const key = Deno.env.get("AZURE_VISION_KEY");

  if (!endpoint || !key) {
    return [];
  }

  const url = `${endpoint}/vision/v3.2/analyze?visualFeatures=Tags`;
  const res = await fetch(url, {
    method: "POST",
    headers: {
      "Ocp-Apim-Subscription-Key": key,
      "Content-Type": "application/octet-stream",
    },
    body: imageBytes,
  });

  if (!res.ok) {
    const txt = await res.text().catch(() => "");
    console.error("[snap-recognize] AzureVision error", res.status, txt);
    return [];
  }

  const json = await res.json();
  const tags = Array.isArray(json?.tags) ? json.tags : [];
  return tags
    .map((t: any) => ({ name: String(t?.name ?? ""), confidence: Number(t?.confidence ?? 0) }))
    .filter((t: VisionTag) => t.name && Number.isFinite(t.confidence));
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
  return safeJsonParse(content);
}

function hardSanitize(output: any) {
  const bad = ["object", "thing", "item", "beverage", "soft drink", "drink", "food"];
  const wordDef = String(output?.target?.wordDef ?? "").toLowerCase();
  for (const b of bad) {
    if (wordDef.includes(b)) throw new Error(`Generic output: ${b}`);
  }
  return output;
}

serve(async (req) => {
  try {
    if (req.method !== "POST") return new Response("Method Not Allowed", { status: 405 });

    const body = await req.json().catch(() => ({}));
    const imageBase64 = String(body?.imageBase64 ?? "");
    const targetLanguageCode = baseLang(body?.targetLanguageCode ?? "de");
    const nativeLanguageCode = baseLang(body?.nativeLanguageCode ?? "en");

    if (!imageBase64) {
      return new Response(JSON.stringify({ suggestions: [], error: "missing imageBase64" }), {
        headers: { "Content-Type": "application/json" },
        status: 200,
      });
    }

    const raw = Uint8Array.from(atob(imageBase64), (c) => c.charCodeAt(0));

    const tags = await callAzureVisionTags(raw);
    const ranked = rankTags(tags);

    const rankedWithConcept = ranked.slice(0, 10).map((t) => ({
      name: t.norm,
      confidence: t.confidence,
      score: t.score,
      concept: mapToConcept(t.norm),
    }));

    const concepts = rankedWithConcept.map((t) => t.concept).filter(Boolean) as string[];
    const conceptKey = composeConcept(concepts);

    const topNorm = rankedWithConcept[0]?.name ?? "";
    const mustUseGpt = isGeneric(topNorm) || conceptKey === "unknown" || rankedWithConcept.length === 0;

    const system = buildGptSystemPrompt();
    const user = buildGptUserPrompt({
      targetLang: targetLanguageCode,
      nativeLang: nativeLanguageCode,
      ranked: rankedWithConcept,
      conceptKey,
      ocrText: "",
    });

    let gptOut: any = null;
    let usedGpt = false;

    try {
      gptOut = await callOpenAiJson(system, user);
      gptOut = hardSanitize(gptOut);
      usedGpt = true;
    } catch (e) {
      console.error("[snap-recognize] GPT failed, fallback to rule-based", String(e));
      usedGpt = false;
    }

    const fallback = {
      bestKey: conceptKey === "unknown" ? (rankedWithConcept[0]?.concept ?? "unknown") : conceptKey,
      target: {
        wordDef: conceptKey === "can" ? "die Dose" : conceptKey === "soft_drink" ? "die Limonade" : "Laptop",
        wordIndef: conceptKey === "can" ? "eine Dose" : conceptKey === "soft_drink" ? "eine Limonade" : "ein Laptop",
      },
      native: { word: rankedWithConcept[0]?.name ?? "item" },
      examples: {
        b1: ["Ich brauche das jetzt.", "Kannst du mir das bitte geben?"],
        c1: ["Ich nutze das regelmaessig im Alltag.", "Das ist heute besonders praktisch."],
      },
    };

    const out = gptOut ?? fallback;

    const resp = {
      ...out,
      meta: {
        usedGpt,
        mustUseGpt,
        conceptKey,
        sourceTags: rankedWithConcept,
      },
    };

    return new Response(JSON.stringify(resp), { headers: { "Content-Type": "application/json" } });
  } catch (e) {
    console.error("[snap-recognize] fatal", String(e));
    return new Response(JSON.stringify({ suggestions: [], error: String(e) }), {
      headers: { "Content-Type": "application/json" },
      status: 200,
    });
  }
});
