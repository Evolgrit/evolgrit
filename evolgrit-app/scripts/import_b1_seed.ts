import fs from "fs";
import path from "path";
import { createClient } from "@supabase/supabase-js";

type Lesson = {
  title: string;
  slug: string;
  type: "learn" | "speak";
  context: string;
  target_text: string;
  mentor_tip: string;
  topic?: string;
  context_title?: string;
  context_hint?: string;
  dialog?: { speaker: string; text: string }[];
  pronunciation_guides?: { word: string; guide: string; note?: string }[];
};

type WeekBlock = {
  week: number;
  level: string;
  lessons: Lesson[];
};

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
  // eslint-disable-next-line no-console
  console.error("Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in env");
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

function pickAllowed<T extends Record<string, any>>(obj: T, allowed: string[]) {
  const out: Record<string, any> = {};
  allowed.forEach((k) => {
    if (k in obj) out[k] = obj[k];
  });
  return out;
}

async function run() {
  const seedPath = path.join(__dirname, "..", "content", "b1", "b1_seed.json");
  const raw = fs.readFileSync(seedPath, "utf-8");
  const weeks: WeekBlock[] = JSON.parse(raw);

  for (const weekBlock of weeks) {
    for (const lesson of weekBlock.lessons) {
      const topic = (lesson.topic ?? lesson.context ?? "daily").trim() || "daily";
      const drillRow: Record<string, any> = pickAllowed(
        {
          slug: lesson.slug,
          level: weekBlock.level,
          topic,
          duration_sec: lesson.type === "speak" ? 180 : 180,
          is_active: true,
        },
        ["slug", "level", "topic", "duration_sec", "is_active"]
      );
      const { data: drillData, error: drillErr } = await supabase
        .from("drills")
        .upsert(drillRow, { onConflict: "slug" })
        .select("id,slug")
        .single();
      if (drillErr) {
        throw new Error(`Drill upsert failed for ${lesson.slug}. Columns used: ${Object.keys(drillRow).join(", ")}. Error: ${drillErr.message}`);
      }
      if (!drillData?.id) {
        throw new Error(`Drill upsert returned no id for ${lesson.slug}`);
      }
      const drillId = drillData.id;

      // speak lines
      if (lesson.type === "speak") {
        await supabase.from("drill_lines").delete().eq("drill_id", drillId);
        const lineRows: any[] = [];
        const addLine = (payload: Record<string, any>) => {
          const cleaned = pickAllowed(payload, [
            "drill_id",
            "order_index",
            "context_title",
            "context_hint",
            "target_text",
            "mentor_tip",
            "difficulty",
          ]);
          // Ensure target_text is non-empty (NOT NULL constraint)
          if (!cleaned.target_text || typeof cleaned.target_text !== "string" || cleaned.target_text.trim() === "") {
            throw new Error(
              `Missing target_text for slug=${lesson.slug}, lineIndex=${cleaned.order_index}, role=${payload.context_title ?? "system"}`
            );
          }
          lineRows.push(cleaned);
        };

        // metadata/system lines into drill_lines fields
        addLine({
          drill_id: drillId,
          order_index: lineRows.length,
          context_title: lesson.title,
          target_text: lesson.title,
        });
        addLine({
          drill_id: drillId,
          order_index: lineRows.length,
          context_title: lesson.context_title ?? null,
          context_hint: lesson.context_hint ?? null,
          target_text: lesson.context_title ?? lesson.context ?? "Info",
        });
        addLine({
          drill_id: drillId,
          order_index: lineRows.length,
          target_text: lesson.target_text || lesson.context || "Prompt",
        });
        addLine({
          drill_id: drillId,
          order_index: lineRows.length,
          mentor_tip: lesson.mentor_tip,
          target_text: lesson.mentor_tip || "Hinweis",
        });
        addLine({
          drill_id: drillId,
          order_index: lineRows.length,
          context_title: `Week ${weekBlock.week} · ${lesson.type}`,
          target_text: `Week ${weekBlock.week} · ${lesson.type}`,
        });

        if (lesson.dialog?.length) {
          lesson.dialog.forEach((d, idx) => {
            const text = (d as any).text ?? (d as any).sentence ?? "";
            if (!text || text.trim() === "") {
              throw new Error(`Missing dialog text for slug=${lesson.slug}, dialogIndex=${idx}`);
            }
            addLine({
              drill_id: drillId,
              order_index: lineRows.length + idx,
              context_title: d.speaker,
              context_hint: text,
              target_text: text,
            });
          });
        }

        const { data: insertedLines, error: lineErr } = await supabase
          .from("drill_lines")
          .insert(lineRows)
          .select("id,order_index");
        if (lineErr) {
          throw new Error(`Drill lines insert failed for ${lesson.slug}: ${lineErr.message}`);
        }
        // pronunciation guides
        if (lesson.pronunciation_guides?.length) {
          const firstLineId = insertedLines?.[0]?.id;
          if (!firstLineId) {
            throw new Error(`Missing line_id for slug=${lesson.slug}`);
          }
          const pgRows = lesson.pronunciation_guides.map((p) =>
            pickAllowed(
              {
                line_id: firstLineId,
                word: p.word,
                guide: p.guide,
                note: p.note ?? null,
              },
              ["line_id", "word", "guide", "note"]
            )
          );
          const { error: pgErr } = await supabase.from("pronunciation_guides").insert(pgRows);
          if (pgErr) {
            throw new Error(`Pronunciation insert failed for ${lesson.slug}: ${pgErr.message}`);
          }
        }
      }
    }
  }

  // eslint-disable-next-line no-console
  console.log("Import completed");
}

run().catch((e) => {
  // eslint-disable-next-line no-console
  console.error(e);
  process.exit(1);
});
