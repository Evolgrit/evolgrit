import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

function getSupabaseAdmin() {
  return createClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
}

type AccessState = "none" | "pending" | "approved";

export async function POST(
  request: NextRequest,
  context: { params: Promise<{}> }
) {
  try {
    const { email } = (await request.json()) as { email?: unknown };
    if (!email || typeof email !== "string") {
      return NextResponse.json({ state: "none" satisfies AccessState });
    }

    const normalized = email.trim().toLowerCase();
    const supabaseAdmin = getSupabaseAdmin();
    const { data, error } = await supabaseAdmin
      .from("access_requests")
      .select("status")
      .eq("email", normalized)
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    if (error) {
      console.error("access check error", error);
      return NextResponse.json(
        { error: "Unable to check access" },
        { status: 500 }
      );
    }

    if (!data) {
      return NextResponse.json({ state: "none" satisfies AccessState });
    }

    const status = (data.status as AccessState) || "none";
    return NextResponse.json({ state: status });
  } catch (error) {
    console.error("access check unexpected error", error);
    return NextResponse.json(
      { error: "Unable to check access" },
      { status: 500 }
    );
  }
}
