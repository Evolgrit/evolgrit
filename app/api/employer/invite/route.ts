import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

// Requires SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY env vars.
const supabaseAdmin = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(request: Request) {
  try {
    const { email } = await request.json();
    if (!email || typeof email !== "string") {
      return NextResponse.json(
        { error: "Email required" },
        { status: 400 }
      );
    }

    const normalized = email.trim().toLowerCase();
    const { data, error } = await supabaseAdmin
      .from("access_requests")
      .select("status")
      .eq("kind", "employer")
      .eq("email", normalized)
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    if (error || !data || data.status !== "approved") {
      return NextResponse.json(
        { error: "Access not approved" },
        { status: 403 }
      );
    }

    const redirect =
      process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ||
      "https://evolgrit.com";

    const { error: inviteError } = await supabaseAdmin.auth.admin.inviteUserByEmail(
      normalized,
      { redirectTo: `${redirect}/auth/callback` }
    );

    if (inviteError) {
      console.error("employer invite resend error", inviteError);
      return NextResponse.json(
        { error: inviteError.message },
        { status: 500 }
      );
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("employer invite unexpected error", error);
    return NextResponse.json(
      { error: "Unable to send invite" },
      { status: 500 }
    );
  }
}
