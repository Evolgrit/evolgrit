import Link from "next/link";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import WeeklyCheckinCard, {
  type WeekCheckin,
} from "./WeeklyCheckinCard";
import { computePhase } from "@/lib/phase/computePhase";
import { phaseMeta, type Phase } from "@/lib/phase/phaseMeta";
import MentorChatPanel from "@/components/dashboard/MentorChatPanel";

const phaseAccent: Record<Phase, {
  cardBorder: string;
  pillBg: string;
  pillText: string;
  kpiBorder: string;
  bar: string;
}> = {
  orientation: {
    cardBorder: "border-l-4 border-amber-300",
    pillBg: "bg-amber-100",
    pillText: "text-amber-700",
    kpiBorder: "border-amber-200",
    bar: "bg-amber-400",
  },
  language_life: {
    cardBorder: "border-l-4 border-blue-300",
    pillBg: "bg-blue-100",
    pillText: "text-blue-700",
    kpiBorder: "border-blue-200",
    bar: "bg-blue-400",
  },
  job_readiness: {
    cardBorder: "border-l-4 border-violet-300",
    pillBg: "bg-violet-100",
    pillText: "text-violet-700",
    kpiBorder: "border-violet-200",
    bar: "bg-violet-400",
  },
  matching: {
    cardBorder: "border-l-4 border-emerald-300",
    pillBg: "bg-emerald-100",
    pillText: "text-emerald-700",
    kpiBorder: "border-emerald-200",
    bar: "bg-emerald-400",
  },
};

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

type MentorMessage = {
  id: string;
  sender_type: "learner" | "mentor";
  content: string;
  created_at: string;
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

function formatDate(value?: string | null) {
  if (!value) return "—";
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return "—";
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
  }).format(parsed);
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

  const modulesPercent = modulesTotal
    ? Math.round((modulesCompleted / modulesTotal) * 100)
    : 0;
  const phaseKey = computePhase({
    onboardingPercent,
    modulesCompletedPercent: modulesPercent,
  });
  const phaseInfo = phaseMeta[phaseKey];
  const phaseColors = phaseAccent[phaseKey];
  const journeyProgress = Math.max(
    0,
    Math.min(100, Math.round((onboardingPercent + modulesPercent) / 2))
  );

  const nextActions: Record<keyof typeof phaseMeta, {
    label: string;
    href: string;
    helper: string;
  }> = {
    orientation: {
      label: "Continue onboarding",
      href: "/dashboard/onboarding",
      helper: "Finish your basics so we can place you in the right batch.",
    },
    language_life: {
      label: "Complete this week’s modules",
      href: "/dashboard/modules",
      helper: "Short tasks keep language and everyday life moving.",
    },
    job_readiness: {
      label: "Upload key documents",
      href: "/dashboard/documents",
      helper: "Contracts and IDs unlock the next phase.",
    },
    matching: {
      label: "Review opportunities",
      href: "/dashboard/jobs",
      helper: "See which employers fit your profile right now.",
    },
  };
  const currentAction = nextActions[phaseKey];
  const currentWeekCheckin = weeklyTimeline.find((week) => week.isCurrent)?.checkin;
  const weeklyStatusLabel = currentWeekCheckin ? "Submitted" : "Not submitted";
  const weeklyStatusHelper = currentWeekCheckin
    ? `Saved ${formatDate(currentWeekCheckin.updated_at ?? currentWeekCheckin.created_at ?? currentWeekIso)}`
    : "Share mood & blockers so mentors can support you.";

  const mentorId = process.env.DEFAULT_MENTOR_ID ?? null;
  const mentorName = process.env.DEFAULT_MENTOR_NAME ?? "Lina";
  const mentorRole = process.env.DEFAULT_MENTOR_ROLE ?? "Cultural readiness mentor";
  const mentorInitial =
    mentorName.trim().charAt(0).toUpperCase() || mentorRole.trim().charAt(0) || "M";
  let mentorThreadId: string | null = null;
  let mentorMessages: MentorMessage[] = [];

  if (mentorId) {
    const { data: existingThread, error: existingThreadError } = await supabase
      .from("mentor_threads")
      .select("id")
      .eq("learner_id", data.user.id)
      .eq("mentor_id", mentorId)
      .maybeSingle();

    if (existingThreadError) {
      console.error("mentor thread fetch error", existingThreadError);
    }

    if (existingThread?.id) {
      mentorThreadId = existingThread.id;
    } else {
      const { data: insertedThread, error: insertThreadError } = await supabase
        .from("mentor_threads")
        .insert({
          learner_id: data.user.id,
          mentor_id: mentorId,
        })
        .select("id")
        .single();

      if (insertThreadError) {
        console.error("mentor thread insert error", insertThreadError);
      } else {
        mentorThreadId = insertedThread?.id ?? null;
      }
    }

    if (mentorThreadId) {
      const { data: mentorMessageRows, error: mentorMessageError } = await supabase
        .from("mentor_messages")
        .select("id, sender_type, content, created_at")
        .eq("thread_id", mentorThreadId)
        .order("created_at", { ascending: true })
        .limit(30);

      if (mentorMessageError) {
        console.error("mentor messages fetch error", mentorMessageError);
      } else if (mentorMessageRows) {
        mentorMessages = mentorMessageRows as MentorMessage[];
      }
    }
  }

  const mentorConfigured = Boolean(mentorId && mentorThreadId);

  return (
    <div className="mx-auto max-w-[1200px] space-y-6 px-4 sm:px-6 lg:px-8">
      <div className="grid gap-8 xl:grid-cols-[minmax(0,1fr)_320px]">
        <div className="space-y-4">
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
                <p className="text-xs uppercase tracking-[0.18em] text-slate-400">
                  Learner
                </p>
                <p className="font-semibold text-slate-900">
                  {profile?.full_name ?? "Learner"}
                </p>
                <p className="text-[11px] text-slate-500">AI + mentor guidance</p>
              </div>
            </div>
          </header>

          <section className="space-y-4">
            <article
              className={`rounded-3xl border border-slate-200 bg-white p-6 shadow-sm ${phaseColors.cardBorder}`}
            >
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                  <span
                    className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${phaseColors.pillBg} ${phaseColors.pillText}`}
                  >
                    Current phase
                  </span>
                  <h2 className="text-2xl font-semibold text-slate-900">
                    {phaseInfo.label} · {phaseInfo.title}
                  </h2>
                  <p className="mt-1 text-sm text-slate-600">
                    {phaseInfo.description}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-slate-500">Journey progress</p>
                  <p className="text-4xl font-semibold text-slate-900">
                    {journeyProgress}%
                  </p>
                  <p className="text-xs text-slate-400">Week 3 · calm pace</p>
                </div>
              </div>

              <div className="mt-6 grid gap-4 sm:grid-cols-3">
                <div
                  className={`rounded-2xl border border-slate-100 bg-slate-50 p-4 border-l-4 border-slate-200 ${phaseColors.kpiBorder}`}
                >
                  <p className="text-[11px] uppercase tracking-[0.18em] text-slate-400">
                    German level
                  </p>
                  <p className="mt-2 text-lg font-semibold text-slate-900">
                    {profile?.german_level ?? "Not set"}
                  </p>
                  <p className="text-xs text-slate-500">Update in onboarding any time.</p>
                </div>
                <div
                  className={`rounded-2xl border border-slate-100 bg-slate-50 p-4 border-l-4 border-slate-200 ${phaseColors.kpiBorder}`}
                >
                  <p className="text-[11px] uppercase tracking-[0.18em] text-slate-400">
                    Modules this week
                  </p>
                  <p className="mt-2 text-lg font-semibold text-slate-900">
                    {modulesSummaryLabel}
                  </p>
                  <p className="text-xs text-slate-500">{modulesSummaryHelper}</p>
                </div>
                <div
                  className={`rounded-2xl border border-slate-100 bg-slate-50 p-4 border-l-4 border-slate-200 ${phaseColors.kpiBorder}`}
                >
                  <p className="text-[11px] uppercase tracking-[0.18em] text-slate-400">
                    Weekly check-in
                  </p>
                  <p className="mt-2 text-lg font-semibold text-slate-900">
                    {weeklyStatusLabel}
                  </p>
                  <p className="text-xs text-slate-500">{weeklyStatusHelper}</p>
                </div>
              </div>
            </article>
          </section>

          <section className="grid gap-4 lg:grid-cols-[2fr,1fr]">
            <WeeklyCheckinCard
              weeks={weeklyTimeline}
              action={submitWeeklyCheckinAction}
              summaryFirst
            />
            <article className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
              <p className="text-[11px] uppercase tracking-[0.18em] text-slate-400">
                Next best action
              </p>
              <h3 className="text-xl font-semibold text-slate-900">
                Keep moving calmly
              </h3>
              <p className="mt-1 text-sm text-slate-600">{currentAction.helper}</p>
              <Link
                href={currentAction.href}
                className="mt-4 inline-flex rounded-full bg-slate-900 px-5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-slate-800"
              >
                {currentAction.label} →
              </Link>
            </article>
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
                  className={`h-full rounded-full transition-all ${phaseColors.bar}`}
                  style={{ width: `${onboardingPercent}%` }}
                />
              </div>
            </div>
          </section>
        </div>

        <aside className="hidden xl:block">
          <div className="sticky top-24">
            <MentorChatPanel
              mentorName={mentorName}
              mentorRole={mentorRole}
              mentorInitial={mentorInitial}
              isConfigured={mentorConfigured}
              threadId={mentorThreadId}
              initialMessages={mentorMessages}
            />
          </div>
        </aside>
      </div>
    </div>
  );
}
