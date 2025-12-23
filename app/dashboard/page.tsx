import Link from "next/link";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import WeeklyCheckinCard, {
  type WeekCheckin,
} from "./WeeklyCheckinCard";

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

type WeeklyCheckinRow = {
  week_start: string | null;
  mood: string | null;
  hours: number | null;
  wins: string | null;
  blockers: string | null;
  submitted_at: string | null;
};

function getWeekStart(date = new Date()) {
  const weekStart = new Date(date);
  const day = weekStart.getDay();
  const diff = (day + 6) % 7;
  weekStart.setHours(0, 0, 0, 0);
  weekStart.setDate(weekStart.getDate() - diff);
  return weekStart;
}

function getWeekLabel(date: Date) {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
  }).format(date);
}

async function submitWeeklyCheckinAction(formData: FormData) {
  "use server";
  const supabase = await createSupabaseServerClient();
  const { data } = await supabase.auth.getUser();
  if (!data.user) redirect("/login");

  const submittedWeek =
    (formData.get("weekStart") as string | null) ?? undefined;
  const weekStartDate = submittedWeek ? new Date(submittedWeek) : getWeekStart();
  weekStartDate.setHours(0, 0, 0, 0);
  const weekStartIso = weekStartDate.toISOString().slice(0, 10);

  const mood = (formData.get("mood") as string | null)?.trim() || null;
  const hoursValue = formData.get("hours");
  const hours =
    typeof hoursValue === "string" && hoursValue.trim() !== ""
      ? Number(hoursValue)
      : null;
  const wins = (formData.get("wins") as string | null)?.trim() || null;
  const blockers = (formData.get("blockers") as string | null)?.trim() || null;

  await supabase
    .from("weekly_checkins")
    .upsert(
      {
        user_id: data.user.id,
        week_start: weekStartIso,
        mood,
        hours,
        wins,
        blockers,
      },
      { onConflict: "user_id,week_start" }
    );

  await supabase.from("readiness_events").insert({
    user_id: data.user.id,
    type: "weekly_checkin_submitted",
    metadata: { week_start: weekStartIso },
  });

  revalidatePath("/dashboard");
}

function normalizePhaseKey(value?: string | null) {
  if (!value) return "";
  return value.toLowerCase().replace(/\s+/g, "");
}

function isPhaseOnePhase(value?: string | null) {
  const key = normalizePhaseKey(value);
  return key.includes("phase1") || key.includes("phase_1");
}

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

  const weekStartDate = getWeekStart();
  const weekDates = Array.from({ length: 6 }, (_, index) => {
    const date = new Date(weekStartDate);
    date.setDate(date.getDate() - index * 7);
    return date;
  });
  const weekIsoList = weekDates.map((date) =>
    date.toISOString().slice(0, 10)
  );
  const currentWeekIso = weekIsoList[0];

  const [{ data: profile }, { data: onboarding }, weekRowsRes] =
    await Promise.all([
      supabase
        .from("profiles")
        .select("full_name, german_level")
        .eq("id", data.user.id)
        .single(),
      supabase
        .from("v_onboarding_progress")
        .select("completed, total, is_complete")
        .eq("user_id", data.user.id)
        .maybeSingle(),
      weekIsoList.length
        ? supabase
            .from("weekly_checkins")
            .select("week_start, mood, hours, wins, blockers, submitted_at")
            .eq("user_id", data.user.id)
            .in("week_start", weekIsoList)
        : Promise.resolve({ data: [] as WeeklyCheckinRow[] }),
    ]);

  const weeklyCheckinsMap = new Map<string, WeeklyCheckinRow>(
    ((weekRowsRes.data as WeeklyCheckinRow[]) ?? []).map((row) => [
      row.week_start as string,
      row,
    ])
  );
  const weeklyTimeline: WeekCheckin[] = weekDates.map((date, index) => {
    const iso = weekIsoList[index];
    return {
      weekStart: iso,
      label: getWeekLabel(date),
      isCurrent: iso === currentWeekIso,
      checkin: weeklyCheckinsMap.get(iso),
    };
  });

  if (onboarding?.is_complete) {
    const { data: existing } = await supabase
      .from("journey_events")
      .select("id")
      .eq("user_id", data.user.id)
      .eq("type", "onboarding_complete")
      .maybeSingle();

    if (!existing) {
      await supabase.from("journey_events").insert({
        user_id: data.user.id,
        type: "onboarding_complete",
        title: "Onboarding completed",
        detail:
          "All onboarding details are in place. Time to focus on learning modules.",
        status: "completed",
        phase: "Phase 1",
        metadata: {
          completed: onboarding.completed ?? 0,
          total: onboarding.total ?? 0,
        },
        event_date: new Date().toISOString(),
      });
    }
  }

  const { data: modulePhases } = await supabase
    .from("modules")
    .select("id, phase");

  const phaseOneIds =
    modulePhases
      ?.filter((module) => isPhaseOnePhase(module.phase))
      .map((module) => module.id) ?? [];

  let phaseOneProgress: { module_id: string; status: string }[] = [];
  if (phaseOneIds.length > 0) {
    const { data: progressRows } = await supabase
      .from("module_progress")
      .select("module_id, status")
      .eq("user_id", data.user.id)
      .in("module_id", phaseOneIds);
    phaseOneProgress = progressRows ?? [];
  }

  const modulesTotal = phaseOneIds.length;
  const modulesCompleted = phaseOneProgress.filter(
    (row) => row.status === "completed"
  ).length;
  const modulesSummaryLabel =
    modulesTotal > 0 ? `${modulesCompleted} / ${modulesTotal}` : "—";
  const modulesSummaryHelper =
    modulesTotal > 0 && modulesCompleted >= modulesTotal
      ? "All priority modules done"
      : "Keep momentum tonight";

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
              <p className="mt-1 text-lg font-semibold text-slate-900">
                {modulesSummaryLabel}
              </p>
              <p className="text-xs text-slate-500">
                {modulesSummaryHelper}
              </p>
            </div>
          </div>
        </article>

        <WeeklyCheckinCard
          weeks={weeklyTimeline}
          action={submitWeeklyCheckinAction}
        />
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
