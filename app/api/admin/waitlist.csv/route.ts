import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

function unauthorized() {
  return new NextResponse("Auth required", {
    status: 401,
    headers: { "WWW-Authenticate": 'Basic realm="Evolgrit Admin"' },
  });
}

function toCSV(rows: Record<string, unknown>[]) {
  const header = [
    "created_at",
    "full_name",
    "email",
    "country",
    "target",
    "german_level",
    "start_timeframe",
    "whatsapp",
  ];

  const escape = (v: unknown) => {
    if (v === null || v === undefined) return "";
    const s = String(v);
    // wrap in quotes + escape quotes
    return `"${s.replace(/"/g, '""')}"`;
  };

  const lines = [
    header.join(","),
    ...rows.map((r) =>
      header
        .map((k) => {
          const val = r[k];
          return escape(val);
        })
        .join(",")
    ),
  ];

  return lines.join("\n");
}

export async function GET(
  request: NextRequest,
  context: { params: Promise<{}> }
) {
  const auth = request.headers.get("authorization");

  const user = process.env.ADMIN_USER || "";
  const pass = process.env.ADMIN_PASS || "";
  if (!auth || !auth.startsWith("Basic ") || !user || !pass) return unauthorized();

  const decoded = Buffer.from(auth.slice(6), "base64").toString();
  const [u, p] = decoded.split(":");
  if (u !== user || p !== pass) return unauthorized();

  const supabase = createClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  const { data, error } = await supabase
    .from("waitlist_signups")
    .select("created_at, full_name, email, country, target, german_level, start_timeframe, whatsapp")
    .order("created_at", { ascending: false })
    .limit(5000);

  if (error) {
    return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
  }

  const csv = toCSV(data ?? []);

  // Excel-friendly UTF-8 BOM
  const bom = "\uFEFF";
  const content = bom + csv;

  const stamp = new Date().toISOString().slice(0, 10); // YYYY-MM-DD
  const filename = `evolgrit-waitlist-${stamp}.csv`;

  return new NextResponse(content, {
    status: 200,
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="${filename}"`,
      "Cache-Control": "no-store",
    },
  });
}
