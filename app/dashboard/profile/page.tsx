import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import ProfileForm from "./profile-form";

export default async function ProfilePage() {
  const supabase = await createSupabaseServerClient();
  const { data } = await supabase.auth.getUser();
  if (!data.user) redirect("/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select(
      "full_name, birthday, mother_tongue, other_languages, german_level, origin_country, current_country, avatar_url"
    )
    .eq("id", data.user.id)
    .single();

  return (
    <main className="min-h-screen bg-slate-50 px-5 py-10">
      <div className="max-w-3xl mx-auto">
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex items-baseline justify-between gap-4">
            <div>
              <h1 className="text-2xl font-semibold text-slate-900">Your profile</h1>
              <p className="mt-1 text-sm text-slate-600">
                Keep your details up to date for the next batch.
              </p>
            </div>
            <a href="/dashboard" className="text-sm text-slate-500 hover:text-slate-900">
              Back to dashboard →
            </a>
          </div>

          <div className="mt-6">
            <ProfileForm initialProfile={profile ?? {}} />
          </div>
        </div>
      </div>
    </main>
  );
}
