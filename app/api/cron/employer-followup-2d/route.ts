import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { Resend } from "resend";

function requireCronAuth(req: Request) {
  const auth = req.headers.get("authorization") || "";
  const secret = process.env.CRON_SECRET || "";
  return secret && auth === `Bearer ${secret}`;
}

export async function GET(req: Request) {
  if (!requireCronAuth(req)) {
    return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  }

  const supabase = createClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
  const resend = new Resend(process.env.RESEND_API_KEY!);
  const from = process.env.RESEND_FROM!;

  const twoDaysAgo = new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString();

  const { data, error } = await supabase
    .from("employer_leads")
    .select("id, company, role_types, email, created_at")
    .lte("created_at", twoDaysAgo)
    .is("followup_2d_sent_at", null)
    .limit(200);

  if (error) {
    return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
  }

  let sent = 0;
  for (const r of data ?? []) {
    await resend.emails.send({
      from,
      to: r.email,
      subject: "Quick follow-up on your Evolgrit employer interest",
      html: `
        <div style="font-family: ui-sans-serif, system-ui; line-height: 1.6;">
          <p>Hi,</p>
          <p>Thanks again for reaching out about Evolgrit.</p>
          <p><strong>Two quick questions</strong> so we can suggest the right pilot setup:</p>
          <ul>
            <li>Which location(s) in Germany?</li>
            <li>How many hires (approx.) in the next 3–6 months?</li>
          </ul>
          <p>Current roles: <strong>${(r.role_types || "").replace(/</g, "&lt;")}</strong></p>
          <p style="color:#64748b;font-size:12px;margin-top:18px;">
            If you didn’t submit this request, you can ignore this email.
          </p>
        </div>
      `,
    });

    await supabase
      .from("employer_leads")
      .update({ followup_2d_sent_at: new Date().toISOString() })
      .eq("id", r.id);

    sent += 1;
  }

  return NextResponse.json({ ok: true, candidates: data?.length ?? 0, sent }, { status: 200 });
}
