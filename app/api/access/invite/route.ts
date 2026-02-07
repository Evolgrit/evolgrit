import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { getAdminActorId, logAdminAudit } from "@/lib/admin-audit";

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
    const actorId = await getAdminActorId();
    const { email } = (await request.json()) as { email?: unknown };
    if (!email || typeof email !== "string") {
      return NextResponse.json(
        { error: "Email required" },
        { status: 400 }
      );
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
      console.error("invite access check error", error);
      return NextResponse.json(
        { error: "Unable to verify access" },
        { status: 500 }
      );
    }

    if (!data || data.status !== "approved") {
      return NextResponse.json(
        { error: "Access not approved" },
        { status: 403 }
      );
    }

    const redirectTo =
      process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ||
      "https://evolgrit.com";

    const { error: inviteError } = await supabaseAdmin.auth.admin.inviteUserByEmail(
      normalized,
      {
        redirectTo: `${redirectTo}/auth/callback`,
      }
    );

    if (inviteError) {
      console.error("invite resend error", inviteError);
      return NextResponse.json(
        { error: inviteError.message },
        { status: 500 }
      );
    }

    await logAdminAudit({
      actorId,
      action: "access_invite_sent",
      target: normalized,
      meta: { source: "api/access/invite" },
    });

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("access invite unexpected error", error);
    return NextResponse.json(
      { error: "Unable to send invite" },
      { status: 500 }
    );
  }
}
