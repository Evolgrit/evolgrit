import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

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
