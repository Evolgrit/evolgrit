import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { Resend } from "resend";

function normalizeRoles(s: string) {
  const x = s.toLowerCase();
  const tags: string[] = [];
  if (x.includes("logistics") || x.includes("warehouse")) tags.push("logistics");
  if (x.includes("care") || x.includes("pflege")) tags.push("care");
  if (x.includes("childcare") || x.includes("kita")) tags.push("childcare");
  if (x.includes("hospitality") || x.includes("gastro")) tags.push("hospitality");
  if (x.includes("driver") || x.includes("bus")) tags.push("drivers");
  return tags.join(",");
}

function isPriorityEmployer(norm: string) {
  return norm.includes("care") || norm.includes("childcare");
}

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const company = String(body.company ?? "").trim();
    const role_types = String(body.role_types ?? "").trim();
    const email = String(body.email ?? "").trim().toLowerCase();
    const contact_name = String(body.contact_name ?? "").trim();
    const phone = String(body.phone ?? "").trim();
    const industry = String(body.industry ?? "").trim();
    const notes = String(body.notes ?? "").trim();

    if (!company || !role_types || !email.includes("@")) {
      return NextResponse.json({ ok: false, error: "Invalid input" }, { status: 400 });
    }

    const supabase = createClient(
      process.env.SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    const normalized_roles = normalizeRoles(role_types);
    const priority = isPriorityEmployer(normalized_roles);

    const { error } = await supabase.from("employer_leads").insert({
      company,
      role_types,
      normalized_roles,
      email,
      priority,
      contact_name: contact_name || null,
      phone: phone || null,
      industry: industry || null,
      notes: notes || null,
    });

    if (error) {
      const msg = (error.message ?? "").toLowerCase();
      const isDup = msg.includes("duplicate") || msg.includes("unique");
      if (isDup) {
        return NextResponse.json({ ok: true, duplicate: true }, { status: 200 });
      }
      return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
    }

    const resend = new Resend(process.env.RESEND_API_KEY!);
    const from = process.env.RESEND_FROM!;

    try {
      await resend.emails.send({
        from,
        to: email,
        replyTo: "hello@evolgrit.com",
        subject: "Thanks — we received your Evolgrit employer request",
        text: `Hi,

thanks for reaching out to Evolgrit.

We received:
Company: ${company}
Role types: ${role_types}

What happens next:
- We check upcoming batches and fit
- We reply with concrete pilot options and next steps

If this is time-sensitive, just reply to this email.

— Daniel
Evolgrit
`,
        html: `
  <div style="font-family: ui-sans-serif, system-ui; line-height:1.6;">
    <h2 style="margin:0 0 8px;">Thanks — we got it.</h2>
    <p style="margin:0 0 10px;">We received your employer request.</p>

    <div style="margin:14px 0; padding:12px 14px; border:1px solid #e2e8f0; border-radius:12px; background:#f8fafc;">
      <p style="margin:0; font-size:12px; letter-spacing:.12em; text-transform:uppercase; color:#64748b;">Details</p>
      <p style="margin:8px 0 0;"><strong>Company:</strong> ${company.replace(/</g, "&lt;")}</p>
      <p style="margin:6px 0 0;"><strong>Role types:</strong> ${role_types.replace(/</g, "&lt;")}</p>
    </div>

    <p style="margin:0 0 10px;"><strong>What happens next:</strong> we’ll review your needs and reply with concrete pilot options and next steps.</p>
    <p style="margin:0 0 10px;">If this is time-sensitive, just reply to this email.</p>

    <p style="margin:18px 0 0; color:#64748b; font-size:12px;">If you didn’t submit this request, you can ignore this email.</p>
    <p style="margin:18px 0 0;"><strong>Daniel</strong><br/>Founder, Evolgrit</p>
  </div>
  `,
      });
    } catch (emailError) {
      console.error("employer lead ack email error", emailError);
    }

    try {
      await resend.emails.send({
        from,
        to: process.env.ADMIN_EMAIL || "info@evolgrit.com",
        replyTo: email,
        subject: `New employer application: ${company}`,
        html: `
  <div style="font-family: ui-sans-serif, system-ui; line-height:1.6;">
    <h2 style="margin:0 0 8px;">New employer application</h2>
    <p><strong>Company:</strong> ${company.replace(/</g, "&lt;")}</p>
    <p><strong>Contact:</strong> ${contact_name || "—"}</p>
    <p><strong>Email:</strong> ${email}</p>
    <p><strong>Phone:</strong> ${phone || "—"}</p>
    <p><strong>Industry:</strong> ${industry || "—"}</p>
    <p><strong>Roles:</strong> ${role_types.replace(/</g, "&lt;")}</p>
    <p><strong>Notes:</strong><br/>${notes ? notes.replace(/</g, "&lt;").replace(/\\n/g, "<br/>") : "—"}</p>
    <p style="margin-top:12px;font-size:12px;color:#64748b;">Received at ${new Date().toLocaleString()}</p>
  </div>
        `,
      });
    } catch (emailError) {
      console.error("admin notification email error", emailError);
    }

    await supabase
      .from("employer_leads")
      .update({ email_confirmed_at: new Date().toISOString() })
      .eq("email", email);

    return NextResponse.json({ ok: true }, { status: 200 });
  } catch (err) {
    const message =
      err instanceof Error ? err.message : typeof err === "string" ? err : "Unexpected error";
    return NextResponse.json({ ok: false, error: message }, { status: 500 });
  }
}
