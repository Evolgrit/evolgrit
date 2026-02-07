import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

function unauthorized() {
  return new NextResponse("Auth required", {
    status: 401,
    headers: { "WWW-Authenticate": 'Basic realm="Evolgrit Admin"' },
  });
}

function requireBasicAuth(req: NextRequest) {
  const auth = req.headers.get("authorization");
  const user = process.env.ADMIN_USER || "";
  const pass = process.env.ADMIN_PASS || "";
  if (!auth || !auth.startsWith("Basic ") || !user || !pass) return false;
  const decoded = Buffer.from(auth.slice(6), "base64").toString();
  const [u, p] = decoded.split(":");
  return u === user && p === pass;
}

function toCSV(rows: Record<string, unknown>[]) {
  const header = ["created_at", "company", "role_types", "email"];
  const escape = (v: unknown) => `"${String(v ?? "").replace(/"/g, '""')}"`;
  const lines = [header.join(","), ...rows.map((r) => header.map((k) => escape(r[k])).join(","))];
  return lines.join("\n");
}

export async function GET(
  request: NextRequest,
  context: { params: Promise<{}> }
) {
  if (!requireBasicAuth(request)) return unauthorized();

  const supabase = createClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  const { data, error } = await supabase
    .from("employer_leads")
    .select("created_at, company, role_types, email")
    .order("created_at", { ascending: false })
    .limit(5000);

  if (error) {
    return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
  }

  const stamp = new Date().toISOString().slice(0, 10);
  const filename = `evolgrit-employer-leads-${stamp}.csv`;

  const bom = "\uFEFF";
  const csv = bom + toCSV(data ?? []);

  return new NextResponse(csv, {
    status: 200,
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="${filename}"`,
      "Cache-Control": "no-store",
    },
  });
}
