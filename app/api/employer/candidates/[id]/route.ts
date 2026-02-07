import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { createSupabaseServerClient } from "@/lib/supabase/server";

function getSupabaseAdmin() {
  return createClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
}

export async function GET(
  request: NextRequest,
  context: { params: Promise<{}> }
) {
  try {
    const { id } = (await context.params) as { id?: string };
    const learnerId = id;
    if (!learnerId) {
      return NextResponse.json({ error: "Missing id" }, { status: 400 });
    }

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
      console.error("employer candidate detail profile error", profileError);
      return NextResponse.json(
        { error: "Unable to verify role" },
        { status: 500 }
      );
    }

    if (profile?.role !== "employer" && profile?.role !== "admin") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const supabaseAdmin = getSupabaseAdmin();
    const { data: candidate, error: candidateError } = await supabaseAdmin
      .from("employer_readiness_view")
      .select("*")
      .eq("learner_id", learnerId)
      .maybeSingle();

    if (candidateError) {
      console.error("employer candidate detail view error", candidateError);
      return NextResponse.json(
        { error: "Unable to load candidate" },
        { status: 500 }
      );
    }

    if (!candidate) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    const [checkinsRes, completedRes, modulesTotalRes, eventsRes] = await Promise.all([
      supabaseAdmin
        .from("weekly_checkins")
        .select("week_start, mood, hours, wins, blockers, created_at")
        .eq("user_id", learnerId)
        .order("week_start", { ascending: false })
        .limit(6),
      supabaseAdmin
        .from("module_progress")
        .select("id", { count: "exact", head: true })
        .eq("user_id", learnerId)
        .eq("status", "completed"),
      supabaseAdmin
        .from("modules")
        .select("id", { count: "exact", head: true })
        .eq("is_active", true),
      supabaseAdmin
        .from("readiness_events")
        .select("id, event_type, event_value, created_at")
        .eq("profile_id", learnerId)
        .order("created_at", { ascending: false })
        .limit(10),
    ]);

    const modules = {
      completed: completedRes.count ?? 0,
      total: modulesTotalRes.count ?? 0,
    };

    return NextResponse.json(
      {
        candidate,
        checkins: checkinsRes.data ?? [],
        modules,
        readinessEvents: eventsRes.data ?? [],
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("employer candidate detail unexpected", error);
    return NextResponse.json(
      { error: "Unable to load candidate" },
      { status: 500 }
    );
  }
}
