import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import OnboardingForm from "./OnboardingForm";

type ProfileRow = {
  role: "learner" | "employer" | "admin" | string | null;
  full_name: string | null;
  current_country: string | null;
  target_in_germany: string | null;
  start_timeframe: string | null;
  onboarding_completed_at: string | null;
  target_roles: string[] | null;
};

export default async function OnboardingPage() {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const profileRes = await supabase
    .from("profiles")
    .select(
      [
        "full_name",
        "current_country",
        "target_in_germany",
        "start_timeframe",
        "onboarding_completed_at",
        "role",
        "target_roles",
      ].join(",")
    )
    .eq("id", user.id)
    .single();

  const profileRow = profileRes.data as ProfileRow | null;
  const profileError = profileRes.error;

  const { data: progressRow } = await supabase
    .from("v_onboarding_progress")
    .select("next_step, is_complete, completed, total")
    .eq("user_id", user.id)
    .maybeSingle();

  if (profileError) {
    console.error("Profile load error", profileError);
  }

  if (profileRow?.role && profileRow.role !== "learner") {
    redirect(profileRow.role === "employer" ? "/employer" : "/admin");
  }

  if (profileRow?.onboarding_completed_at) {
    redirect("/dashboard?onboarding=done");
  }

  if (progressRow?.next_step === "done" || progressRow?.is_complete) {
    redirect("/dashboard?onboarding=done");
  }

  const profile =
    profileRow && typeof profileRow === "object"
      ? (profileRow as ProfileRow)
      : null;

  return (
    <OnboardingForm
      userId={user.id}
      stage={progressRow?.next_step ?? "basics"}
      completion={{
        completed: progressRow?.completed ?? 0,
        total: progressRow?.total ?? 9,
      }}
      initialProfile={{
        full_name: profile?.full_name ?? "",
        current_country: profile?.current_country ?? "",
        target_in_germany: profile?.target_in_germany ?? "",
        start_timeframe: profile?.start_timeframe ?? "",
      }}
    />
  );
}
