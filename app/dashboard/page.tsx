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
import { ui } from "@/lib/ui/tokens";
import { BigKpiCard } from "@/components/ui/BigKpiCard";
import { KpiCard } from "@/components/ui/KpiCard";
import { NextActionCard } from "@/components/ui/NextActionCard";
import MobileMentorChatTrigger from "@/components/dashboard/MobileMentorChatTrigger";
import type { MentorMessage } from "@/lib/types/mentor";
import { DocumentIcon, Paperclip, Smile } from "@/components/icons/LucideIcons";

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
    kpiBorder: "border-l-4 border-amber-300",
    bar: "bg-amber-400",
  },
  language_life: {
    cardBorder: "border-l-4 border-blue-300",
    pillBg: "bg-blue-100",
    pillText: "text-blue-700",
    kpiBorder: "border-l-4 border-blue-300",
    bar: "bg-blue-400",
  },
  job_readiness: {
    cardBorder: "border-l-4 border-violet-300",
    pillBg: "bg-violet-100",
    pillText: "text-violet-700",
    kpiBorder: "border-l-4 border-violet-300",
    bar: "bg-violet-400",
  },
  matching: {
    cardBorder: "border-l-4 border-emerald-300",
    pillBg: "bg-emerald-100",
    pillText: "text-emerald-700",
    kpiBorder: "border-l-4 border-emerald-300",
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

  const modulesProgress =
    modulesTotal > 0 ? modulesCompleted / modulesTotal : 0;
  const modulesReady = modulesProgress >= 1;
  const currentWeekCheckin = weeklyTimeline.find((week) => week.isCurrent)?.checkin;
  const documentsReadyCount = 2;
  const documentsTotalCount = 4;
  const documentsProgress =
    documentsTotalCount > 0 ? documentsReadyCount / documentsTotalCount : 0;
  const docsReady = documentsProgress >= 1;
  const nextAction =
    !onboardingDone
      ? {
          meta: "Next action",
          title: "Continue onboarding",
          description: "Finish your basics so we can place you in the right batch.",
          href: "/dashboard/onboarding",
        }
      : !docsReady
      ? {
          meta: "Next action",
          title: "Upload key documents",
          description: "Contracts and IDs unlock the next phase.",
          href: "/dashboard/documents",
        }
      : !currentWeekCheckin
      ? {
          meta: "Next action",
          title: "Submit weekly check-in",
          description: "Share mood & blockers so mentors can support you.",
          href: "#weekly-checkin",
        }
      : !modulesReady
      ? {
          meta: "Next action",
          title: "Start this week’s modules",
          description: "Short tasks keep language and everyday life moving.",
          href: "/dashboard/modules",
        }
      : {
          meta: "Next action",
          title: "Open learning modules",
          description: "Keep momentum with new tasks and mentor feedback.",
          href: "/dashboard/modules",
        };
  const germanLevelDisplay = profile?.german_level ?? "Not set";
  const germanChips =
    germanLevelDisplay && germanLevelDisplay !== "Not set"
      ? ["A1", "A2", "B1", germanLevelDisplay]
      : ["A1", "A2", "B1", "B2"];
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
    <div className={`${ui.container} space-y-4`}>
      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_320px]">
        <div className="space-y-4">
          <header className={`${ui.card} ${ui.compactCardPadding}`}>
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
              className={`${ui.card} ${ui.compactCardPadding} ${phaseColors.cardBorder}`}
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

              <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                <BigKpiCard
                  label="Level studied"
                  value={germanLevelDisplay}
                  tone="neutral"
                  watermark={germanLevelDisplay}
                  chips={germanChips}
                  footer="Update in onboarding any time."
                  className={phaseColors.kpiBorder}
                />
                <KpiCard
                  label="Modules completed"
                  valueMain={modulesCompleted}
                  valueSub={`/${modulesTotal}`}
                  statusText="this batch"
                  tone="blue"
                  progress={modulesProgress}
                  icon={<Paperclip className="h-5 w-5" />}
                  ctaLabel="Go to modules"
                  ctaHref="/dashboard/modules"
                  className="gap-2"
                />
                <KpiCard
                  label="Weekly check-in"
                  valueMain={currentWeekCheckin ? 1 : 0}
                  valueSub="/1"
                  statusText={currentWeekCheckin ? "submitted" : "not submitted"}
                  tone={currentWeekCheckin ? "green" : "amber"}
                  progress={currentWeekCheckin ? 1 : 0}
                  icon={<Smile className="h-5 w-5" />}
                  ctaLabel="Go to check-in"
                  ctaHref="#weekly-checkin"
                  className="gap-2"
                />
                <KpiCard
                  label="Documents readiness"
                  valueMain={documentsReadyCount}
                  valueSub={`/${documentsTotalCount}`}
                  statusText="ready"
                  tone="blue"
                  progress={documentsProgress}
                  icon={<DocumentIcon className="h-5 w-5" />}
                  ctaLabel="Upload key documents"
                  ctaHref="/dashboard/documents"
                  className="gap-2"
                />
              </div>
            </article>

            <NextActionCard
              meta={nextAction.meta}
              title={nextAction.title}
              description={nextAction.description}
              primaryLabel={nextAction.title.replace(/→?$/, "→")}
              primaryHref={nextAction.href}
            />
          </section>

          <section className="grid gap-4" id="weekly-checkin">
            <WeeklyCheckinCard
              weeks={weeklyTimeline}
              action={submitWeeklyCheckinAction}
              summaryFirst
            />
          </section>

          <section className={`${ui.card} ${ui.compactCardPadding}`}>
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
      <MobileMentorChatTrigger
        mentorName={mentorName}
        mentorRole={mentorRole}
        mentorInitial={mentorInitial}
        initialMessages={mentorMessages}
        isConfigured={mentorConfigured}
        threadId={mentorThreadId}
      />
    </div>
  );
}
