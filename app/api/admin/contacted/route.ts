import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

function unauthorized() {
  return new NextResponse("Auth required", {
    status: 401,
    headers: { "WWW-Authenticate": 'Basic realm="Evolgrit Admin"' },
  });
}

function requireBasicAuth(req: Request) {
  const auth = req.headers.get("authorization");
  const user = process.env.ADMIN_USER || "";
  const pass = process.env.ADMIN_PASS || "";

  if (!auth || !auth.startsWith("Basic ") || !user || !pass) return false;
  const decoded = Buffer.from(auth.slice(6), "base64").toString();
  const [u, p] = decoded.split(":");
  return u === user && p === pass;
}

export async function POST(req: Request) {
  if (!requireBasicAuth(req)) return unauthorized();

  const { id, contacted } = await req.json();

  if (!id || typeof contacted !== "boolean") {
    return NextResponse.json({ ok: false, error: "Invalid payload" }, { status: 400 });
  }

  const supabase = createClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  const update = {
    contacted,
    contacted_at: contacted ? new Date().toISOString() : null,
  };

  const { error } = await supabase
    .from("waitlist_signups")
    .update(update)
    .eq("id", id);

  if (error) {
    return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true }, { status: 200 });
}
