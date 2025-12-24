import Link from "next/link";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import WeeklyCheckinCard, {
  type WeekCheckin,
} from "./WeeklyCheckinCard";
import { computePhase } from "@/lib/phase/computePhase";
import { phaseMeta } from "@/lib/phase/phaseMeta";

type WeeklyCheckinRow = {
  week_start: string | null;
  mood: string | null;
  hours: number | null;
  wins: string | null;
  blockers: string | null;
  created_at: string | null;
  updated_at: string | null;
};

type CheckinSummary = {
  mood: string | null;
  hours: number | null;
  wins: string | null;
  blockers: string | null;
  created_at: string | null;
  updated_at: string | null;
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

  const { error: eventError } = await supabase.from("readiness_events").insert({
    user_id: data.user.id,
    type: "weekly_checkin_submitted",
    metadata: { week_start: weekStartIso },
  });
  if (eventError) {
    console.error("weekly_checkin_submitted event error", eventError);
  }

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
            .select("week_start, mood, hours, wins, blockers, created_at, updated_at")
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
    const row = weeklyCheckinsMap.get(iso) as WeeklyCheckinRow | undefined;
    const checkin: CheckinSummary | undefined = row
      ? {
          mood: row.mood ?? null,
          hours: row.hours ?? null,
          wins: row.wins ?? null,
          blockers: row.blockers ?? null,
          created_at: row.created_at ?? null,
          updated_at: row.updated_at ?? null,
        }
      : undefined;

    return {
      weekStart: iso,
      label: getWeekLabel(date),
      isCurrent: iso === currentWeekIso,
      checkin,
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

  const phaseInfo = phaseMeta[
    computePhase({
      onboardingPercent,
      modulesCompletedPercent: modulesTotal
        ? Math.round((modulesCompleted / modulesTotal) * 100)
        : 0,
    })
  ];

  return (
    <div className="space-y-6">
      <header className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-[11px] uppercase tracking-[0.18em] text-slate-400">
              Batch Alpha · Week 3
            </p>
            <h1 className="text-2xl font-semibold text-slate-900">
              Dashboard overview
            </h1>
            <p className="text-sm text-slate-600">
              Keep your journey calm and consistent.
            </p>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm">
            <p className="text-xs uppercase tracking-[0.18em] text-slate-400">Learner</p>
            <p className="font-semibold text-slate-900">
              {profile?.full_name ?? "Learner"}
            </p>
            <p className="text-[11px] text-slate-500">AI + mentor guidance</p>
          </div>
        </div>
      </header>

      <section className="grid gap-6 lg:grid-cols-[1.35fr,0.9fr]">
        <article className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="text-[11px] uppercase tracking-[0.18em] text-slate-400">
                {phaseInfo.label}
              </p>
              <h2 className="text-2xl font-semibold text-slate-900">
                {phaseInfo.title}
              </h2>
              <p className="mt-1 text-sm text-slate-600">
                {phaseInfo.description}
              </p>
            </div>
            <div className="text-right">
              <p className="text-xs text-slate-500">Journey progress</p>
              <p className="text-4xl font-semibold text-slate-900">60%</p>
              <p className="text-xs text-slate-400">Week 3 · 8-week phase</p>
            </div>
          </div>

          <div className="mt-6 grid gap-4 sm:grid-cols-3">
            <div className="rounded-2xl border border-slate-100 bg-slate-50 p-4">
              <p className="text-[11px] uppercase tracking-[0.18em] text-slate-400">
                German level
              </p>
              <p className="mt-2 text-lg font-semibold text-slate-900">
                {profile?.german_level ?? "Not set"}
              </p>
              <p className="text-xs text-slate-500">Goal: B1 for childcare</p>
            </div>
            <div className="rounded-2xl border border-slate-100 bg-slate-50 p-4">
              <p className="text-[11px] uppercase tracking-[0.18em] text-slate-400">
                Next mentor call
              </p>
              <p className="mt-2 text-lg font-semibold text-slate-900">Thu · 18:00</p>
              <p className="text-xs text-slate-500">Lina · cultural readiness</p>
            </div>
            <div className="rounded-2xl border border-slate-100 bg-slate-50 p-4">
              <p className="text-[11px] uppercase tracking-[0.18em] text-slate-400">
                Modules this week
              </p>
              <p className="mt-2 text-lg font-semibold text-slate-900">
                {modulesSummaryLabel}
              </p>
              <p className="text-xs text-slate-500">{modulesSummaryHelper}</p>
            </div>
          </div>
        </article>

        <WeeklyCheckinCard weeks={weeklyTimeline} action={submitWeeklyCheckinAction} />
      </section>

      <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-[11px] uppercase tracking-[0.18em] text-slate-400">
              Onboarding status
            </p>
            <h3 className="text-xl font-semibold text-slate-900">
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
    </div>
  );
}
