import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

// Requires SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY env vars.
function getSupabaseAdmin() {
  return createClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
}

type EmployerState = "none" | "pending" | "approved";

export async function POST(
  request: NextRequest,
  context: { params: Promise<{}> }
) {
  try {
    const { email } = (await request.json()) as { email?: unknown };
    if (!email || typeof email !== "string") {
      return NextResponse.json({ state: "none" satisfies EmployerState });
    }

    const normalized = email.trim().toLowerCase();

    const supabaseAdmin = getSupabaseAdmin();
    const { data, error } = await supabaseAdmin
      .from("access_requests")
      .select("status")
      .eq("kind", "employer")
      .eq("email", normalized)
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    if (error) {
      console.error("employer check error", error);
      return NextResponse.json(
        { error: "Unable to check access" },
        { status: 500 }
      );
    }

    if (!data) {
      return NextResponse.json({ state: "none" satisfies EmployerState });
    }

    const status = (data.status as EmployerState) || "none";
    return NextResponse.json({ state: status });
  } catch (error) {
    console.error("employer check unexpected error", error);
    return NextResponse.json(
      { error: "Unable to check access" },
      { status: 500 }
    );
  }
}
