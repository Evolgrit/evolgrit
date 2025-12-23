import { ReactNode } from "react";
import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export default async function EmployerLayout({
  children,
}: {
  children: ReactNode;
}) {
  const supabase = await createSupabaseServerClient();
  const { data } = await supabase.auth.getUser();
  if (!data.user) redirect("/login?role=employer");

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", data.user.id)
    .single();

  if (profile?.role !== "employer") {
    redirect(profile?.role === "admin" ? "/admin" : "/dashboard");
  }

  return <div className="min-h-screen bg-slate-50">{children}</div>;
}
