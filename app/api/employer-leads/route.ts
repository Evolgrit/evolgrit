import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const company = String(body.company ?? "").trim();
    const role_types = String(body.role_types ?? "").trim();
    const email = String(body.email ?? "").trim().toLowerCase();

    if (!company || !role_types || !email.includes("@")) {
      return NextResponse.json({ ok: false, error: "Invalid input" }, { status: 400 });
    }

    const supabase = createClient(
      process.env.SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    const { error } = await supabase.from("employer_leads").insert({
      company,
      role_types,
      email,
    });

    if (error) {
      const msg = (error.message ?? "").toLowerCase();
      const isDup = msg.includes("duplicate") || msg.includes("unique");
      if (isDup) {
        return NextResponse.json({ ok: true, duplicate: true }, { status: 200 });
      }
      return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
    }

    return NextResponse.json({ ok: true }, { status: 200 });
  } catch (err) {
    const message =
      err instanceof Error ? err.message : typeof err === "string" ? err : "Unexpected error";
    return NextResponse.json({ ok: false, error: message }, { status: 500 });
  }
}
