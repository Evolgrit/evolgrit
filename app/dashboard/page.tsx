import Link from "next/link";
import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase/server";

const todayTasks = [
  {
    id: "voice",
    icon: "🎙️",
    title: "Voice practice: explain your morning shift",
    meta: "Speaking · 10 min",
    detail: "Record 5–8 sentences about your childcare morning routine.",
  },
  {
    id: "quiz",
    icon: "🧾",
    title: "Mini-quiz: German paperwork words",
    meta: "Vocabulary · 7 min",
    detail: "Match the right words with Anmeldung, Mietvertrag, Versicherung.",
  },
  {
    id: "mentor",
    icon: "👥",
    title: "Prep notes for mentor Lina",
    meta: "Mentor session · Thu 18:00",
    detail: "Write down 2 questions about talking with parents and teachers.",
  },
];

const milestones = [
  {
    id: "m1",
    status: "done",
    title: "Phase 1 orientation call",
    meta: "Completed · last week",
  },
  {
    id: "m2",
    status: "current",
    title: "Batch language check-in",
    meta: "Scheduled · tomorrow",
  },
  {
    id: "m3",
    status: "upcoming",
    title: "First mentor walk-through",
    meta: "Next week · confirm availability",
  },
];

const phaseCards = [
  {
    id: "phase-1",
    label: "Phase 1 · Arrival & foundations",
    title: "Land softly in Germany.",
    detail:
      "Orientation, everyday German and a peer community that keeps you accountable.",
    tag: "Everyday confidence",
    tone: "blue",
  },
  {
    id: "phase-2",
    label: "Phase 2 · Practice & deepening",
    title: "Train for real jobs and real life.",
    detail:
      "Role-play job situations, get AI coach feedback and switch between formats to stay motivated.",
    tag: "Work-ready language",
    tone: "emerald",
  },
  {
    id: "phase-3",
    label: "Phase 3 · Job-ready & matching",
    title: "Move confidently into work.",
    detail:
      "Interview prep, workplace culture and matching with employers or education partners.",
    tag: "Job-ready & matched",
    tone: "violet",
  },
] as const;

function phaseToneClasses(
  tone: "blue" | "emerald" | "violet"
): { badge: string; tag: string } {
  switch (tone) {
    case "emerald":
      return {
        badge: "bg-emerald-500/10 text-emerald-600",
        tag: "bg-emerald-50 text-emerald-700",
      };
    case "violet":
      return {
        badge: "bg-violet-500/10 text-violet-600",
        tag: "bg-violet-50 text-violet-700",
      };
    default:
      return {
        badge: "bg-blue-600/10 text-blue-600",
        tag: "bg-blue-50 text-blue-700",
      };
  }
}

export default async function DashboardPage() {
  const supabase = await createSupabaseServerClient();
  const { data } = await supabase.auth.getUser();

  if (!data.user) redirect("/login");

  const [{ data: profile }, { data: onboarding }] = await Promise.all([
    supabase
      .from("profiles")
      .select("full_name, german_level")
      .eq("id", data.user.id)
      .single(),
    supabase
      .from("v_onboarding_progress")
      .select("completed, total")
      .eq("user_id", data.user.id)
      .maybeSingle(),
  ]);

  const onboardingTotal = onboarding?.total ?? 8;
  const onboardingCompleted = Math.min(
    onboarding?.completed ?? 0,
    onboardingTotal
  );
  const onboardingDone =
    onboardingTotal > 0 && onboardingCompleted >= onboardingTotal;
  const onboardingPercent = onboardingTotal
    ? Math.round((onboardingCompleted / onboardingTotal) * 100)
    : 0;

  return (
    <div className="space-y-6">
      <section className="grid gap-6 lg:grid-cols-[1.35fr,0.9fr]">
        <article className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="text-xs uppercase tracking-[0.18em] text-slate-400">
                Current phase
              </p>
              <h2 className="mt-1 text-lg font-semibold text-slate-900">
                Phase 1 · Arrival & foundations
              </h2>
              <p className="mt-1 text-sm text-slate-600">
                Everyday German, orientation and the first mentor touchpoints.
              </p>
            </div>
            <div className="text-right">
              <p className="text-xs text-slate-500">Journey progress</p>
              <p className="text-3xl font-semibold text-slate-900">60%</p>
              <p className="text-xs text-slate-400">Week 3 · 8-week phase</p>
            </div>
          </div>

          <div className="mt-6 grid gap-4 sm:grid-cols-3">
            <div className="rounded-2xl border border-slate-100 bg-slate-50 p-4">
              <p className="text-xs uppercase tracking-[0.18em] text-slate-400">
                German level
              </p>
              <p className="mt-1 text-lg font-semibold text-slate-900">
                {profile?.german_level ?? "Not set"}
              </p>
              <p className="text-xs text-slate-500">Goal: B1 for childcare</p>
            </div>
            <div className="rounded-2xl border border-slate-100 bg-slate-50 p-4">
              <p className="text-xs uppercase tracking-[0.18em] text-slate-400">
                Next mentor call
              </p>
              <p className="mt-1 text-lg font-semibold text-slate-900">
                Thu · 18:00
              </p>
              <p className="text-xs text-slate-500">Lina · cultural readiness</p>
            </div>
            <div className="rounded-2xl border border-slate-100 bg-slate-50 p-4">
              <p className="text-xs uppercase tracking-[0.18em] text-slate-400">
                Modules this week
              </p>
              <p className="mt-1 text-lg font-semibold text-slate-900">2 / 3</p>
              <p className="text-xs text-slate-500">Keep momentum tonight</p>
            </div>
          </div>
        </article>

        <article className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <p className="text-xs uppercase tracking-[0.18em] text-slate-400">
            Weekly snapshot
          </p>
          <h3 className="mt-1 text-lg font-semibold text-slate-900">
            Hi {profile?.full_name?.split(" ")[0] ?? "there"}, your momentum
            looks strong.
          </h3>
          <div className="mt-6 grid gap-3">
            <div className="flex items-center justify-between rounded-2xl border border-slate-100 bg-slate-50 px-4 py-3">
              <div>
                <p className="text-xs text-slate-500">Speaking practice</p>
                <p className="text-sm font-semibold text-slate-900">
                  18 mins this week
                </p>
              </div>
              <span className="text-xs font-semibold text-emerald-600">
                +6 mins vs last week
              </span>
            </div>
            <div className="flex items-center justify-between rounded-2xl border border-slate-100 bg-slate-50 px-4 py-3">
              <div>
                <p className="text-xs text-slate-500">AI coach check-ins</p>
                <p className="text-sm font-semibold text-slate-900">4 sessions</p>
              </div>
              <span className="text-xs text-slate-500">Goal: 5 / week</span>
            </div>
            <div className="flex items-center justify-between rounded-2xl border border-slate-100 bg-slate-50 px-4 py-3">
              <div>
                <p className="text-xs text-slate-500">Reliability signals</p>
                <p className="text-sm font-semibold text-slate-900">
                  On time · 100%
                </p>
              </div>
              <span className="text-xs text-emerald-600">Looks great</span>
            </div>
          </div>
        </article>
      </section>

      <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-xs uppercase tracking-[0.18em] text-slate-400">
              Onboarding status
            </p>
            <h3 className="text-lg font-semibold text-slate-900">
              {onboardingCompleted} / {onboardingTotal} details complete
            </h3>
            <p className="text-sm text-slate-600">
              {onboardingDone
                ? "You’re ready for matching."
                : "Finish onboarding to unlock tailored roles."}
            </p>
          </div>
          {onboardingDone ? (
            <span className="rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
              Complete
            </span>
          ) : (
            <Link
              href="/dashboard/onboarding"
              className="inline-flex items-center rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-900 shadow-sm hover:border-slate-300"
            >
              Continue onboarding →
            </Link>
          )}
        </div>
        <div className="mt-4">
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span>Progress</span>
            <span>{onboardingPercent}%</span>
          </div>
          <div className="mt-2 h-2 rounded-full bg-slate-100">
            <div
              className="h-full rounded-full bg-slate-900 transition-all"
              style={{ width: `${onboardingPercent}%` }}
            />
          </div>
        </div>
      </section>

      <section className="grid gap-6 lg:grid-cols-2">
        <article className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.18em] text-slate-400">
                Today’s focus
              </p>
              <h3 className="text-lg font-semibold text-slate-900">
                3 activities to keep the streak.
              </h3>
            </div>
            <span className="text-xs text-slate-500">All flexible · ~25 min</span>
          </div>
          <div className="mt-4 space-y-4">
            {todayTasks.map((task) => (
              <div
                key={task.id}
                className="flex items-start gap-3 rounded-2xl border border-slate-100 bg-slate-50 px-3 py-3"
              >
                <span className="text-lg">{task.icon}</span>
                <div className="flex-1 space-y-1">
                  <p className="text-sm font-semibold text-slate-900">
                    {task.title}
                  </p>
                  <p className="text-xs text-slate-500">{task.detail}</p>
                  <span className="inline-flex items-center rounded-full bg-white px-2 py-1 text-[11px] font-medium text-slate-600">
                    {task.meta}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </article>

        <article className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.18em] text-slate-400">
                Milestones
              </p>
              <h3 className="text-lg font-semibold text-slate-900">
                Track what moves you closer to work.
              </h3>
            </div>
            <Link
              href="/learner-journey"
              className="text-sm font-medium text-blue-600 hover:text-blue-700"
            >
              See journey →
            </Link>
          </div>
          <ul className="mt-4 space-y-4">
            {milestones.map((milestone) => (
              <li
                key={milestone.id}
                className="flex items-start gap-3 rounded-2xl border border-slate-100 bg-slate-50 px-3 py-3"
              >
                <span
                  className={[
                    "mt-1 flex h-8 w-8 items-center justify-center rounded-full border text-xs font-semibold",
                    milestone.status === "done"
                      ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                      : milestone.status === "current"
                      ? "border-blue-200 bg-blue-50 text-blue-700"
                      : "border-slate-200 bg-white text-slate-500",
                  ].join(" ")}
                >
                  {milestone.status === "done"
                    ? "✓"
                    : milestone.status === "current"
                    ? "•"
                    : "→"}
                </span>
                <div>
                  <p className="text-sm font-semibold text-slate-900">
                    {milestone.title}
                  </p>
                  <p className="text-xs text-slate-500">{milestone.meta}</p>
                </div>
              </li>
            ))}
          </ul>
        </article>
      </section>

      <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-xs uppercase tracking-[0.18em] text-slate-400">
              Three-phase journey
            </p>
            <h3 className="text-lg font-semibold text-slate-900">
              From arrival to job-ready.
            </h3>
          </div>
          <Link
            href="/learner-journey"
            className="text-sm font-medium text-blue-600 hover:text-blue-700"
          >
            Explore phases →
          </Link>
        </div>
        <div className="mt-6 grid gap-4 md:grid-cols-3">
          {phaseCards.map((phase, index) => {
            const tone = phaseToneClasses(phase.tone);
            return (
              <article
                key={phase.id}
                className="rounded-3xl border border-slate-200 bg-slate-50 p-5 space-y-3"
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`flex h-10 w-10 items-center justify-center rounded-2xl text-sm font-semibold ${tone.badge}`}
                  >
                    {index + 1}
                  </div>
                  <p className="text-[11px] uppercase tracking-[0.18em] text-slate-400">
                    {phase.label}
                  </p>
                </div>
                <h4 className="text-base font-semibold text-slate-900">
                  {phase.title}
                </h4>
                <p className="text-sm text-slate-600 leading-relaxed">
                  {phase.detail}
                </p>
                <span
                  className={`inline-flex items-center rounded-full px-3 py-1 text-[11px] font-medium ${tone.tag}`}
                >
                  {phase.tag}
                </span>
              </article>
            );
          })}
        </div>
      </section>
    </div>
  );
}
