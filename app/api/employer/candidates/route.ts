import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { createSupabaseServerClient } from "@/lib/supabase/server";

const supabaseAdmin = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET() {
  try {
    const supabase = await createSupabaseServerClient();
    const { data: auth } = await supabase.auth.getUser();
    if (!auth.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", auth.user.id)
      .single();

    if (profileError) {
      console.error("employer candidates profile error", profileError);
      return NextResponse.json({ error: "Unable to verify role" }, { status: 500 });
    }

    const role = profile?.role;
    if (role !== "employer" && role !== "admin") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const { data, error } = await supabaseAdmin
      .from("employer_readiness_view")
      .select("*")
      .order("readiness_score", { ascending: false })
      .limit(50);

    if (error) {
      console.error("employer candidates view error", error);
      return NextResponse.json(
        { error: "Unable to load candidates" },
        { status: 500 }
      );
    }

    const candidateRows = data ?? [];
    const learnerIds = candidateRows
      .map((row) => row?.learner_id)
      .filter((id): id is string => Boolean(id));

    let actionsByLearner = new Map<string, Record<string, string | null>>();
    if (learnerIds.length > 0) {
      const { data: actionsData, error: actionsError } = await supabaseAdmin
        .from("employer_candidate_actions")
        .select("learner_id, action, created_at")
        .eq("employer_id", auth.user.id)
        .in("learner_id", learnerIds);

      if (actionsError) {
        console.error("employer candidates actions error", actionsError);
      } else {
        actionsByLearner = new Map(
          learnerIds.map((id) => [id, {} as Record<string, string | null>])
        );
        actionsData?.forEach((actionRow) => {
          const mapEntry = actionsByLearner.get(actionRow.learner_id) ?? {};
          mapEntry[actionRow.action] = actionRow.created_at;
          actionsByLearner.set(actionRow.learner_id, mapEntry);
        });
      }
    }

    const enriched = candidateRows.map((row) => {
      const actionInfo = row.learner_id
        ? actionsByLearner.get(row.learner_id) ?? {}
        : {};
      return {
        ...row,
        saved_at: actionInfo["saved"] ?? null,
        interested_at: actionInfo["interested"] ?? null,
        intro_requested_at: actionInfo["intro_requested"] ?? null,
      };
    });

    return NextResponse.json({ candidates: enriched }, { status: 200 });
  } catch (error) {
    console.error("employer candidates unexpected error", error);
    return NextResponse.json(
      { error: "Unable to load candidates" },
      { status: 500 }
    );
  }
}
