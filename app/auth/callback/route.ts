import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const code = url.searchParams.get("code");
  const type = url.searchParams.get("type");

  const supabase = await createSupabaseServerClient();

  if (code) {
    await supabase.auth.exchangeCodeForSession(code);
  }

  if (type === "recovery") {
    return NextResponse.redirect(new URL("/reset-password", url.origin));
  }

  const { data } = await supabase.auth.getUser();
  if (!data.user) {
    return NextResponse.redirect(new URL("/login", url.origin));
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", data.user.id)
    .single();

  const role = profile?.role ?? "learner";
  const path =
    role === "employer" ? "/employer" : role === "admin" ? "/admin" : "/dashboard";

  return NextResponse.redirect(new URL(path, url.origin));
}
