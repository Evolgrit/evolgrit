import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { Resend } from "resend";
import { getAdminActorId, logAdminAudit } from "@/lib/admin-audit";

// Requires SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, optional ADMIN_EMAIL, RESEND_API_KEY.
const supabaseAdmin = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);
const resendApiKey = process.env.RESEND_API_KEY;
const resend =
  resendApiKey && resendApiKey.length > 0 ? new Resend(resendApiKey) : null;
const adminEmail = process.env.ADMIN_EMAIL || "info@evolgrit.com";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const company_name = String(body.company_name ?? "").trim();
    const contact_name = String(body.contact_name ?? "").trim();
    const email = String(body.email ?? "").trim().toLowerCase();
    const phone = String(body.phone ?? "").trim();
    const notes = String(body.notes ?? "").trim();

    if (!company_name || !contact_name || !email.includes("@")) {
      return NextResponse.json(
        { error: "Invalid input" },
        { status: 400 }
      );
    }

    const { error } = await supabaseAdmin.from("access_requests").upsert(
      {
        email,
        company_name,
        contact_name,
        phone: phone || null,
        notes: notes || null,
        kind: "employer",
        status: "pending",
      },
      { onConflict: "email" }
    );

    if (error) {
      console.error("employer access request insert error", error);
      return NextResponse.json(
        { error: "Unable to store request" },
        { status: 500 }
      );
    }

    if (resend) {
      try {
        await resend.emails.send({
          from: "Evolgrit <hello@send.evolgrit.com>",
          to: adminEmail,
          replyTo: email,
          subject: `New employer access request: ${company_name}`,
          html: `
            <p><strong>Company:</strong> ${company_name}</p>
            <p><strong>Contact:</strong> ${contact_name}</p>
            <p><strong>Email:</strong> ${email}</p>
            <p><strong>Phone:</strong> ${phone || "—"}</p>
            <p><strong>Notes:</strong> ${notes || "—"}</p>
            <p><strong>Timestamp:</strong> ${new Date().toISOString()}</p>
          `,
        });
      } catch (emailError) {
        console.error("employer access request email error", emailError);
      }
    }

    const actorId = await getAdminActorId();
    await logAdminAudit({
      actorId,
      action: "employer_access_request_created",
      target: email,
      meta: {
        company_name,
        contact_name,
        phone: phone || null,
      },
    });

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("employer access request unexpected error", error);
    return NextResponse.json(
      { error: "Unable to submit request" },
      { status: 500 }
    );
  }
}
