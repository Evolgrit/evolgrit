import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { Resend } from "resend";

function getSupabase() {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url) throw new Error("SUPABASE_URL is required");
  if (!key) throw new Error("SUPABASE_SERVICE_ROLE_KEY is required");
  return createClient(url, key);
}

function getResend() {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) throw new Error("RESEND_API_KEY is required");
  return new Resend(apiKey);
}

export async function POST(req: Request) {
  try {
    const supabase = getSupabase();
    const resend = getResend();
    const body = await req.json();

    const full_name = String(body.full_name ?? "").trim();
    const email = String(body.email ?? "").trim().toLowerCase();

    if (!full_name || !email.includes("@")) {
      return NextResponse.json({ ok: false, error: "Invalid input" }, { status: 400 });
    }

    const payload = {
      full_name,
      email,
      country: body.country?.trim?.() || null,
      target: body.target || null,
      german_level: body.german_level || null,
      start_timeframe: body.start_timeframe
        ? body.start_timeframe.replace("–", "-")
        : null,
      whatsapp: body.whatsapp?.trim?.() || null,
    };

    const res = await supabase.from("waitlist_signups").insert(payload);
    const insertError = res.error;

    if (insertError !== null) {
      const message = insertError?.message ?? "";
      const msg = message.toLowerCase();
      const isDup = msg.includes("duplicate") || msg.includes("unique");

      if (isDup) {
        return NextResponse.json({ ok: true, duplicate: true }, { status: 200 });
      }

      return NextResponse.json(
        { ok: false, error: `Supabase insert failed: ${message}` },
        { status: 500 }
      );
    }

    const from = process.env.RESEND_FROM!;
    await resend.emails.send({
      from,
      to: email,
      subject: "You’re on the Evolgrit learner waitlist",
      html: `
        <div style="font-family: ui-sans-serif, system-ui; line-height: 1.6;">
          <h2 style="margin:0 0 8px;">You’re on the list 🎉</h2>
          <p style="margin:0 0 12px;">Hi ${full_name.split(" ")[0] || full_name}, thanks for joining the Evolgrit learner waitlist.</p>
          <p style="margin:0 0 12px;"><strong>What happens next:</strong> We’ll email you when the next cohort opens. No spam.</p>
          <p style="margin:18px 0 0; color:#64748b; font-size:12px;">If you didn’t sign up, you can ignore this email.</p>
        </div>
      `,
    });

    return NextResponse.json({ ok: true }, { status: 200 });
  } catch (err) {
    const message =
      err instanceof Error ? err.message : typeof err === "string" ? err : "Unexpected error";
    return NextResponse.json({ ok: false, error: message }, { status: 500 });
  }
}
