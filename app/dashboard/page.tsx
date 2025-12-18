import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export default async function DashboardPage() {
  const supabase = createSupabaseServerClient();
  const { data } = await supabase.auth.getUser();

  if (!data.user) redirect("/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("full_name, german_level, avatar_url")
    .eq("id", data.user.id)
    .single();

  return (
    <main className="min-h-screen bg-slate-50 px-5 py-10">
      <div className="max-w-4xl mx-auto rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <h1 className="text-2xl font-semibold text-slate-900">
          Hi, {profile?.full_name ?? "there"} 👋
        </h1>
        <p className="mt-2 text-sm text-slate-600">
          Welcome to your Evolgrit dashboard.
        </p>

        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
            <p className="text-xs uppercase tracking-[0.18em] text-slate-400">German level</p>
            <p className="mt-1 text-lg font-semibold text-slate-900">
              {profile?.german_level ?? "Not set"}
            </p>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
            <p className="text-xs uppercase tracking-[0.18em] text-slate-400">Next</p>
            <p className="mt-1 text-sm text-slate-700">
              Complete your profile to join the next batch.
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
