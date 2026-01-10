# A1 Content Schema (MVP)

Target language: **German (de)**. English is a helper/fallback language only.

## Week shape
```json
{
  "week": 1,
  "theme": "Ankommen",
  "goal": "Kurz, was du nach der Woche kannst.",
  "tasks": [ /* A1Task[] */ ]
}
```

## Task shape
```json
{
  "id": "a1_w1_t1_intro",
  "situation": "Kurze Situationsbeschreibung",
  "observe": {
    "kind": "listen" | "read",
    "de": "Beispieltext in Deutsch",
    "en": "Optional helper in Englisch"
  },
  "do": {
    "kind": "speak" | "select",
    "prompt": "Was der Nutzer tun soll (DE)",
    "target_de": "Zielsatz in Deutsch",
    "helper_en": "Optionaler kurzer Helfer in EN",
    "options": ["Opt 1", "Opt 2"] // nur für select
  },
  "miniHint": "Kurzer Grammatik/Betonungshinweis (DE)",
  "success": "Kurz, was geschafft wurde (DE)",
  "durationMin": 3
}
```

Rules (MVP):
- **German** is always the main language in `observe.de` and `do.target_de`.
- English appears only as optional helpers (`observe.en`, `do.helper_en`).
- No separate grammar screen; hints stay inline via `miniHint`.
- Duration defaults to 3–4 Minuten; keep tasks short.
