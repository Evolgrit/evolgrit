import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { createSupabaseServerClient } from "@/lib/supabase/server";

function getSupabaseAdmin() {
  return createClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
}

export async function POST(
  request: NextRequest,
  context: { params: Promise<{}> }
) {
  try {
    const { id: learnerId } = (await context.params) as { id?: string };
    if (!learnerId) {
      return NextResponse.json({ error: "Missing id" }, { status: 400 });
    }

    const body = (await request.json()) as Record<string, any>;
    const action = String(body?.action ?? "").trim();
    if (!action || !["saved", "interested", "intro_requested"].includes(action)) {
      return NextResponse.json({ error: "Invalid action" }, { status: 400 });
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

    if (profileError || !profile || (profile.role !== "employer" && profile.role !== "admin")) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const supabaseAdmin = getSupabaseAdmin();
    const { error: insertError } = await supabaseAdmin
      .from("employer_candidate_actions")
      .upsert(
        {
          employer_id: auth.user.id,
          learner_id: learnerId,
          action,
        },
        { onConflict: "employer_id,learner_id,action" }
      );

    if (insertError) {
      console.error("employer action insert error", insertError);
      return NextResponse.json({ error: "Unable to save action" }, { status: 500 });
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("employer action unexpected", error);
    return NextResponse.json({ error: "Unable to save action" }, { status: 500 });
  }
}
