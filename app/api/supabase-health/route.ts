import { NextRequest, NextResponse } from "next/server";

export async function GET() {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url)
    return NextResponse.json({ ok: false, error: "SUPABASE_URL missing" }, { status: 500 });
  if (!key)
    return NextResponse.json(
      { ok: false, error: "SUPABASE_SERVICE_ROLE_KEY missing" },
      { status: 500 }
    );

  try {
    const res = await fetch(`${url}/rest/v1/`, {
      method: "GET",
      headers: { apikey: key, Authorization: `Bearer ${key}` },
    });

    return NextResponse.json({ ok: true, status: res.status }, { status: 200 });
  } catch (e) {
    const message = e instanceof Error ? e.message : typeof e === "string" ? e : "fetch failed";
    return NextResponse.json(
      { ok: false, error: message },
      { status: 500 }
    );
  }
}
