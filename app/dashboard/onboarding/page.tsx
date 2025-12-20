import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { OnboardingForm, OnboardingField } from "./OnboardingForm";

const BASICS_THRESHOLD = 3;
const BACKGROUND_THRESHOLD = 6;

const STAGE_FIELDS: Record<
  "basics" | "background" | "goal",
  { title: string; helper: string; fields: OnboardingField[] }
> = {
  basics: {
    title: "Tell us about your language basics",
    helper: "We calibrate your first phase using your language experience.",
    fields: [
      { name: "full_name", label: "Full name", type: "text", placeholder: "Your name" },
      { name: "mother_tongue", label: "Mother tongue", type: "text", placeholder: "e.g., Spanish" },
      { name: "other_languages", label: "Other languages", type: "text", placeholder: "Optional" },
      {
        name: "german_level",
        label: "German level",
        type: "select",
        options: [
          { value: "A0", label: "A0" },
          { value: "A1", label: "A1" },
          { value: "A2", label: "A2" },
          { value: "B1", label: "B1" },
          { value: "B2", label: "B2" },
          { value: "C1", label: "C1" },
          { value: "C2", label: "C2" },
        ],
      },
    ],
  },
  background: {
    title: "Where are you coming from?",
    helper: "A bit of context helps mentors support you better.",
    fields: [
      { name: "current_country", label: "Current country", type: "text", placeholder: "Where you live now" },
      { name: "origin_country", label: "Country of origin", type: "text", placeholder: "Where you grew up" },
      { name: "birthday", label: "Birthday", type: "date" },
    ],
  },
  goal: {
    title: "What’s your next goal in Germany?",
    helper: "We recommend roles and modules based on your target.",
    fields: [
      {
        name: "target",
        label: "Target",
        type: "select",
        options: [
          { value: "Job", label: "Job" },
          { value: "Apprenticeship", label: "Apprenticeship" },
          { value: "Further training", label: "Further training" },
        ],
      },
    ],
  },
};

export default async function OnboardingPage() {
  const supabase = await createSupabaseServerClient();
  const { data } = await supabase.auth.getUser();

  if (!data.user) redirect("/login");

  const [{ data: profile }, { data: progress }] = await Promise.all([
    supabase
      .from("profiles")
      .select(
        "full_name, mother_tongue, other_languages, german_level, current_country, origin_country, birthday, target"
      )
      .eq("id", data.user.id)
      .maybeSingle(),
    supabase
      .from("v_onboarding_progress")
      .select("completed, total")
      .eq("user_id", data.user.id)
      .maybeSingle(),
  ]);

  const total = progress?.total ?? 8;
  const completed = Math.min(progress?.completed ?? 0, total);

  if (total > 0 && completed >= total) {
    redirect("/dashboard?onboarding=done");
  }

  let stage: "basics" | "background" | "goal";
  if (completed < BASICS_THRESHOLD) stage = "basics";
  else if (completed < BACKGROUND_THRESHOLD) stage = "background";
  else stage = "goal";

  const stageConfig = STAGE_FIELDS[stage];

  return (
    <main className="min-h-screen bg-slate-50 px-5 py-10">
      <div className="mx-auto max-w-2xl space-y-6">
        <div>
          <p className="text-xs uppercase tracking-[0.18em] text-slate-400">
            Onboarding • {completed} of {total} details complete
          </p>
          <h1 className="mt-2 text-3xl font-semibold text-slate-900">
            {stageConfig.title}
          </h1>
          <p className="mt-2 text-sm text-slate-600">{stageConfig.helper}</p>
        </div>

        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <OnboardingForm fields={stageConfig.fields} initialValues={profile ?? {}} />
        </div>
      </div>
    </main>
  );
}
