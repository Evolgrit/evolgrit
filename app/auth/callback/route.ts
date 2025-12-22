import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const code = url.searchParams.get("code");
  const type = url.searchParams.get("type");

  if (code) {
    const supabase = await createSupabaseServerClient();
    await supabase.auth.exchangeCodeForSession(code);
  }

  if (type === "recovery") {
    return NextResponse.redirect(new URL("/reset-password", url.origin));
  }

  return NextResponse.redirect(new URL("/dashboard", url.origin));
}
