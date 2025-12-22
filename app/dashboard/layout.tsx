import { ReactNode } from "react";
import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import DashboardShell from "./DashboardShell";

export default async function DashboardLayout({
  children,
}: {
  children: ReactNode;
}) {
  const supabase = await createSupabaseServerClient();
  const { data } = await supabase.auth.getUser();

  if (!data.user) redirect("/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("full_name, avatar_url")
    .eq("id", data.user.id)
    .single();

  return (
    <DashboardShell
      profileName={profile?.full_name ?? "Learner"}
      profileAvatar={profile?.avatar_url ?? null}
      initials={getInitials(profile?.full_name) || "EG"}
    >
      {children}
    </DashboardShell>
  );
}

function getInitials(name?: string | null) {
  if (!name) return "";
  const parts = name.trim().split(" ");
  const [first, second] = parts;
  if (first && second) return `${first[0]}${second[0]}`.toUpperCase();
  return first?.slice(0, 2).toUpperCase() ?? "";
}
