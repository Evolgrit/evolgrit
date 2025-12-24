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

    return NextResponse.json({ candidates: data ?? [] }, { status: 200 });
  } catch (error) {
    console.error("employer candidates unexpected error", error);
    return NextResponse.json(
      { error: "Unable to load candidates" },
      { status: 500 }
    );
  }
}
