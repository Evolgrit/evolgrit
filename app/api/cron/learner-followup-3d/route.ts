import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { Resend } from "resend";

function requireCronAuth(req: NextRequest) {
  const auth = req.headers.get("authorization") || "";
  const secret = process.env.CRON_SECRET || "";
  return secret && auth === `Bearer ${secret}`;
}

export async function GET(
  request: NextRequest,
  context: { params: Promise<{}> }
) {
  if (!requireCronAuth(request)) {
    return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  }

  const supabase = createClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
  const resend = new Resend(process.env.RESEND_API_KEY!);
  const from = process.env.RESEND_FROM!;

  const threeDaysAgo = new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString();

  const { data, error } = await supabase
    .from("waitlist_signups")
    .select("id, full_name, email, created_at")
    .lte("created_at", threeDaysAgo)
    .is("followup_3d_sent_at", null)
    .eq("contacted", false)
    .limit(200);

  if (error) {
    return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
  }

  let sent = 0;
  for (const r of data ?? []) {
    const firstName = (r.full_name || "").split(" ")[0] || "there";

    await resend.emails.send({
      from,
      to: r.email,
      subject: "Quick question about your Evolgrit waitlist signup",
      html: `
        <div style="font-family: ui-sans-serif, system-ui; line-height: 1.6;">
          <p>Hi ${firstName},</p>
          <p>Quick check-in — when would you ideally like to start your Evolgrit journey?</p>
          <p><strong>Reply with:</strong> 0–3 months / 3–6 months / 6–12 months</p>
          <p style="color:#64748b;font-size:12px;margin-top:18px;">
            If you didn’t sign up, you can ignore this email.
          </p>
        </div>
      `,
    });

    await supabase
      .from("waitlist_signups")
      .update({ followup_3d_sent_at: new Date().toISOString() })
      .eq("id", r.id);

    sent += 1;
  }

  return NextResponse.json({ ok: true, candidates: data?.length ?? 0, sent }, { status: 200 });
}
