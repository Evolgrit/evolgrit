import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { createClient } from "@supabase/supabase-js";
import EmployerCandidateActions from "./EmployerCandidateActions";

const supabaseAdmin = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const actionLabels: Record<string, string> = {
  saved: "Saved candidate",
  interested: "Marked as interested",
  intro_requested: "Intro requested",
};

async function loadCandidate(id: string) {
  const supabase = await createSupabaseServerClient();
  const { data: auth } = await supabase.auth.getUser();
  if (!auth.user) {
    redirect("/login?role=employer");
  }

  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", auth.user.id)
    .single();

  if (profileError || !profile || (profile.role !== "employer" && profile.role !== "admin")) {
    redirect("/employer");
  }

  const { data: candidate, error: candidateError } = await supabaseAdmin
    .from("employer_readiness_view")
    .select("*")
    .eq("learner_id", id)
    .maybeSingle();

  if (candidateError) {
    console.error("candidate query failed", { id, candidateError });
    notFound();
  }

  if (!candidate) {
    console.warn("candidate not found", { id });
    notFound();
  }

  const [checkinsRes, completedRes, modulesTotalRes, eventsRes] = await Promise.all([
    supabaseAdmin
      .from("weekly_checkins")
      .select("week_start, mood, hours, wins, blockers, created_at")
      .eq("user_id", id)
      .order("week_start", { ascending: false })
      .limit(6),
    supabaseAdmin
      .from("module_progress")
      .select("id", { count: "exact", head: true })
      .eq("user_id", id)
      .eq("status", "completed"),
    supabaseAdmin
      .from("modules")
      .select("id", { count: "exact", head: true })
      .eq("is_active", true),
    supabaseAdmin
      .from("readiness_events")
      .select("id, event_type, event_value, created_at")
      .eq("profile_id", id)
      .order("created_at", { ascending: false })
      .limit(10),
  ]);

  return {
    candidate,
    checkins: checkinsRes.data ?? [],
    modules: {
      completed: completedRes.count ?? 0,
      total: modulesTotalRes.count ?? 0,
    },
    readinessEvents: eventsRes.data ?? [],
  };
}

function formatDate(value: string | null | undefined) {
  if (!value) return "—";
  try {
    return new Date(value).toLocaleDateString();
  } catch {
    return value;
  }
}

export default async function EmployerCandidateDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  if (!id) {
    notFound();
  }
  const supabase = await createSupabaseServerClient();
  const { data: auth } = await supabase.auth.getUser();
  if (!auth.user) redirect("/login?role=employer");

  const [data, actionRes] = await Promise.all([
    loadCandidate(id),
    supabaseAdmin
      .from("employer_candidate_actions")
      .select("action, created_at")
      .eq("learner_id", id)
      .eq("employer_id", auth.user.id)
      .order("created_at", { ascending: false }),
  ]);
  const candidate = data.candidate;
  const checkins = (data.checkins ?? []) as Array<{
    week_start: string;
    mood: string | null;
    hours: number | null;
    wins: string | null;
    blockers: string | null;
  }>;
  const modules = data.modules as { completed: number; total: number };
  const actions = actionRes.data ?? [];
  const actionHistory = actions.map((action) => ({
    label: actionLabels[action.action] ?? action.action,
    created_at: action.created_at,
  }));

  return (
    <div className="mx-auto max-w-[1200px] px-4 sm:px-6 lg:px-8 space-y-6">
      <Link
        href="/employer/matches"
        className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-slate-900"
      >
        ← Back to candidates
      </Link>

      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <p className="text-[11px] uppercase tracking-[0.18em] text-slate-400">Candidate</p>
        <h1 className="mt-2 text-2xl font-semibold text-slate-900">
          {candidate.full_name || "Candidate"}
        </h1>
        <p className="mt-2 text-sm text-slate-600">
          Readiness signals and progress.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-12">
        <div className="space-y-6 lg:col-span-8">
          <div className="grid gap-4 md:grid-cols-3">
            <article className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
              <p className="text-[11px] uppercase tracking-[0.18em] text-slate-400">Readiness</p>
              <p className="mt-2 text-3xl font-semibold text-slate-900">
                {candidate.readiness_score ?? 0}%
              </p>
              <div className="mt-2 h-2 rounded-full bg-slate-100">
                <div
                  className="h-2 rounded-full bg-emerald-500"
                  style={{ width: `${Math.min(candidate.readiness_score ?? 0, 100)}%` }}
                />
              </div>
              <p className="mt-2 text-sm text-slate-500">
                Signals combine language, weekly momentum and documents.
              </p>
            </article>

            <article className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
              <p className="text-[11px] uppercase tracking-[0.18em] text-slate-400">German level</p>
              <p className="mt-2 text-xl font-semibold text-slate-900">
                {candidate.german_level || "—"}
              </p>
              <p className="mt-1 text-sm text-slate-500">Placed based on onboarding snapshot.</p>
            </article>

            <article className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
              <p className="text-[11px] uppercase tracking-[0.18em] text-slate-400">Modules</p>
              <p className="mt-2 text-xl font-semibold text-slate-900">
                {modules.completed}/{modules.total}
              </p>
              <p className="mt-1 text-sm text-slate-500">Completed learning blocks.</p>
            </article>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <article className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
              <p className="text-[11px] uppercase tracking-[0.18em] text-slate-400">Last check-in</p>
              <p className="mt-2 text-xl font-semibold text-slate-900">
                {formatDate(candidate.last_checkin_week)}
              </p>
              <p className="mt-1 text-sm text-slate-500">
                Weekly mood + wins help us coordinate readiness.
              </p>
            </article>

            <article className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
              <p className="text-[11px] uppercase tracking-[0.18em] text-slate-400">Documents</p>
              <p className="mt-2 text-xl font-semibold text-slate-900">
                {candidate.documents_count ?? 0}
              </p>
              <p className="mt-1 text-sm text-slate-500">Uploaded paperwork ready for onboarding.</p>
            </article>
          </div>

          {candidate.target_roles && candidate.target_roles.length > 0 && (
            <article className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
              <p className="text-[11px] uppercase tracking-[0.18em] text-slate-400">Target roles</p>
              <div className="mt-3 flex flex-wrap gap-2">
                {candidate.target_roles.map((role: string) => (
                  <span
                    key={role}
                    className="rounded-full bg-slate-100 px-3 py-1 text-sm text-slate-700"
                  >
                    {role}
                  </span>
                ))}
              </div>
            </article>
          )}

          <article className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[11px] uppercase tracking-[0.18em] text-slate-400">
                  Weekly check-ins
                </p>
                <p className="text-sm text-slate-500">Last 6 weeks</p>
              </div>
            </div>
            <div className="mt-4 space-y-3">
              {checkins.length === 0 && (
                <p className="text-sm text-slate-500">No check-ins yet.</p>
              )}
              {checkins.map((checkin) => (
                <div
                  key={checkin.week_start}
                  className="rounded-2xl border border-slate-100 bg-slate-50 px-4 py-3"
                >
                  <div className="flex flex-wrap justify-between text-sm">
                    <strong className="text-slate-900">
                      {formatDate(checkin.week_start)}
                    </strong>
                    <span className="text-slate-500">Mood: {checkin.mood || "—"}</span>
                  </div>
                  <p className="mt-1 text-xs text-slate-500">
                    Focus hours: {checkin.hours ?? "—"}
                  </p>
                  <p className="mt-1 text-sm text-slate-700">
                    Wins: {checkin.wins || "—"}
                  </p>
                  <p className="text-sm text-slate-700">
                    Blockers: {checkin.blockers || "—"}
                  </p>
                </div>
              ))}
            </div>
          </article>
        </div>

        <div className="space-y-6 lg:col-span-4">
          <div className="sticky top-24 space-y-6">
            <EmployerCandidateActions learnerId={id} initialActions={actions} />

            <article className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
              <p className="text-[11px] uppercase tracking-[0.18em] text-slate-400">
                Recent actions
              </p>
              <div className="mt-3 space-y-2">
                {actionHistory.length === 0 && (
                  <p className="text-sm text-slate-500">No actions yet.</p>
                )}
                {actionHistory.map((action) => (
                  <div
                    key={`${action.label}-${action.created_at}`}
                    className="rounded-2xl border border-slate-100 bg-slate-50 px-4 py-3"
                  >
                    <p className="text-sm font-medium text-slate-900">{action.label}</p>
                    <p className="text-xs text-slate-500">{formatDate(action.created_at)}</p>
                  </div>
                ))}
              </div>
            </article>
          </div>
        </div>
      </div>
    </div>
  );
}
