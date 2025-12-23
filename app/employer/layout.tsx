import { ReactNode } from "react";
import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import EmployerShell from "./EmployerShell";

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
    .select("role, full_name, avatar_url")
    .eq("id", data.user.id)
    .single();

  if (profile?.role !== "employer") {
    redirect(profile?.role === "admin" ? "/admin" : "/dashboard");
  }

  return (
    <EmployerShell
      profileName={profile?.full_name ?? "Employer"}
      profileAvatar={profile?.avatar_url ?? null}
      initials={getInitials(profile?.full_name) || "EH"}
    >
      {children}
    </EmployerShell>
  );
}

function getInitials(name?: string | null) {
  if (!name) return "";
  const parts = name.trim().split(" ");
  const [first, second] = parts;
  if (first && second) return `${first[0]}${second[0]}`.toUpperCase();
  return first?.slice(0, 2).toUpperCase() ?? "";
}
