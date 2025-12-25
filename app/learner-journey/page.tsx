import type { Metadata } from "next";
import MarketingTopbar from "@/components/MarketingTopbar";
import { BigKpiCard } from "@/components/ui/BigKpiCard";
import { ui } from "@/lib/ui/tokens";

export const metadata: Metadata = {
  title: "How Evolgrit Works – From German Learning to Job Placement",
  description:
    "See how Evolgrit guides learners from German language training to job readiness and successful onboarding in Germany.",
  alternates: { canonical: "/learner-journey" },
  openGraph: {
    title: "The Evolgrit learner journey",
    description:
      "A structured batch-based journey from German learning to job readiness in Germany.",
    url: "/learner-journey",
  },
};

type DemoNavItem = {
  label: string;
  href: string;
  badge?: string;
};

const demoNavItems: DemoNavItem[] = [
  { label: "Overview", href: "#demo-overview", badge: "Live" },
  { label: "My journey", href: "#demo-journey" },
  { label: "Learning modules", href: "#demo-modules" },
  { label: "Mentor sessions", href: "#demo-mentor" },
  { label: "Jobs & opportunities", href: "#demo-jobs" },
  { label: "Documents", href: "#demo-docs" },
  { label: "Profile", href: "#demo-profile" },
];

const phase = {
  label: "Phase 2",
  title: "Language & everyday life",
  description:
    "German for transport, housing and public services so life in Germany feels familiar.",
};

const modulesPreview = [
  {
    title: "Orientation & onboarding",
    type: "Lesson",
    minutes: 25,
    status: "Completed",
  },
  {
    title: "Public transport & directions",
    type: "Task",
    minutes: 30,
    status: "In progress",
  },
  {
    title: "Childcare conversations",
    type: "Lesson",
    minutes: 20,
    status: "Scheduled",
  },
  {
    title: "Mentor check-in",
    type: "Session",
    minutes: 45,
    status: "Thu · 18:00",
  },
];

const documentsPreview = {
  ready: 2,
  total: 4,
};

const weeklyCheckin = {
  mood: "Calm",
  hours: 8,
  wins: "First role-play in German went well.",
  blockers: "Need clarity on bus shift vocabulary.",
  savedAt: "Mar 11",
};
const weeklyStatusLabelDemo = "Submitted";
const weeklyStatusHelperDemo = "Saved Mar 11 (demo).";
const germanChipsDemo = ["A1", "A2", "B1", "B2"];
const modulesValueDemo = "2/3";

const mentorMessages = [
  { id: 1, author: "mentor", text: "Hi Lina, ready for our calm check-in?" },
  { id: 2, author: "you", text: "Yes, I finished the transport module." },
  {
    id: 3,
    author: "mentor",
    text: "Beautiful. Let’s practice shift change phrases tomorrow.",
  },
  { id: 4, author: "you", text: "Great, that helps a lot." },
];

export default function LearnerJourneyPage() {
  return (
    <>
      <MarketingTopbar />
      <div className="min-h-screen bg-slate-50">
        <div className={`${ui.container} py-8`}>
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-12 lg:gap-8">
            <aside className="hidden lg:block lg:col-span-3">
              <div className="sticky top-24 flex flex-col justify-between rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
                    Evolgrit
                  </p>
                  <h1 className="mt-1 text-xl font-semibold text-slate-900">Learner hub</h1>
                  <p className="mt-1 text-sm text-slate-500">
                    AI-powered batches for life & work in Germany.
                  </p>
                  <nav className="mt-8 space-y-1">
                    {demoNavItems.map((item) => (
                      <a
                        key={item.label}
                        href={item.href}
                        className="group relative flex items-center justify-between rounded-2xl px-4 py-2 text-sm text-slate-600 transition hover:bg-slate-900/5 hover:text-slate-900"
                      >
                        <span className="relative z-10 flex-1">
                          {item.label}
                          {item.badge && (
                            <span className="ml-2 rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.2em] text-emerald-700">
                              {item.badge}
                            </span>
                          )}
                        </span>
                        <span
                          className="absolute left-1 top-1/2 h-6 w-1 -translate-y-1/2 rounded-full bg-slate-900 opacity-0 group-hover:opacity-50"
                          aria-hidden="true"
                        />
                      </a>
                    ))}
                  </nav>
                </div>
                <div className="mt-6 rounded-2xl border border-slate-100 bg-slate-900/90 p-4 text-slate-50">
                  <p className="text-xs uppercase tracking-[0.22em] text-slate-200">
                    Private beta 2026
                  </p>
                  <p className="mt-1 text-sm text-slate-100">
                    Weekly mentor calls · AI coach · cultural readiness.
                  </p>
                </div>
              </div>
            </aside>

            <div className="space-y-4 lg:col-span-6">
              <section id="demo-overview" className="space-y-4">
                <header className={`${ui.card} ${ui.cardPadding}`}>
                  <div className="flex flex-wrap items-center justify-between gap-4">
                    <div>
                      <p className={ui.text.meta}>Batch Alpha · Week 3</p>
                      <h1 className="text-2xl font-semibold text-slate-900">
                        Learner journey (Demo)
                      </h1>
                      <p className={ui.text.body}>
                        How Evolgrit keeps learners moving calmly from arrival to job-ready.
                      </p>
                    </div>
                    <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm">
                      <p className="text-xs uppercase tracking-[0.18em] text-slate-400">
                        Learner
                      </p>
                      <p className="font-semibold text-slate-900">Lina (Demo)</p>
                      <p className="text-[11px] text-slate-500">AI + mentor guidance</p>
                    </div>
                  </div>
                </header>

                <article className={`${ui.card} ${ui.cardPadding}`}>
                  <div className="flex flex-wrap items-center justify-between gap-4">
                    <div>
                      <p className={ui.text.meta}>Current phase</p>
                      <h2 className="text-2xl font-semibold text-slate-900">
                        {phase.label} · {phase.title}
                      </h2>
                      <p className={ui.text.body}>{phase.description}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-slate-500">Journey progress</p>
                      <p className="text-4xl font-semibold text-slate-900">64%</p>
                      <p className="text-xs text-slate-400">Week 3 · calm pace</p>
                    </div>
                  </div>
                  <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    <BigKpiCard
                      label="Level studied"
                      value="B2"
                      tone="neutral"
                      watermark="B2"
                      chips={germanChipsDemo}
                      footer="Refreshed weekly via mentor."
                    />
                    <BigKpiCard
                      label="Modules completed"
                      value={modulesValueDemo}
                      tone="blue"
                      watermark="Modules"
                      footer="Keep momentum tonight."
                    />
                    <BigKpiCard
                      label="Weekly check-in"
                      value={weeklyStatusLabelDemo}
                      tone="green"
                      watermark="✓"
                      footer={weeklyStatusHelperDemo}
                    />
                  </div>
                </article>
              </section>

              <section id="demo-journey" className={`${ui.card} ${ui.cardPadding} space-y-3`}>
                <p className={ui.text.meta}>Three calm phases</p>
                <p className="text-sm text-slate-600">
                  Evolgrit batches move from arrival to job-ready with clear guardrails:
                </p>
                <ul className="list-disc space-y-1 pl-4 text-sm text-slate-600">
                  <li>Phase 1 · Orientation & foundations – soft landing, everyday German.</li>
                  <li>Phase 2 · Language & life – transport, housing, cultural cues.</li>
                  <li>Phase 3 · Job-ready & matching – employer signals & next steps.</li>
                </ul>
              </section>

              <section className="grid gap-6 lg:grid-cols-[2fr,1fr]">
                <article id="demo-mentor" className={`${ui.card} ${ui.cardPadding}`}>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className={ui.text.meta}>Weekly check-in</p>
                      <p className={ui.text.body}>Mood + focus snapshot</p>
                    </div>
                    <span className="rounded-full bg-slate-900/5 px-3 py-1 text-xs text-slate-700">
                      Demo view
                    </span>
                  </div>
                  <div className="mt-4 space-y-2 text-sm text-slate-700">
                    <p>
                      <span className="font-semibold">Mood:</span> {weeklyCheckin.mood}
                    </p>
                    <p>
                      <span className="font-semibold">Focus hours:</span> {weeklyCheckin.hours} hrs
                    </p>
                    <p>
                      <span className="font-semibold">Wins:</span> {weeklyCheckin.wins}
                    </p>
                    <p>
                      <span className="font-semibold">Blockers:</span> {weeklyCheckin.blockers}
                    </p>
                    <p className="text-xs text-slate-500">Saved {weeklyCheckin.savedAt} (demo).</p>
                  </div>
                </article>

                <article id="demo-docs" className={`${ui.card} ${ui.cardPadding}`}>
                  <p className={ui.text.meta}>Documents readiness</p>
                  <h3 className="mt-2 text-xl font-semibold text-slate-900">
                    {documentsPreview.ready} / {documentsPreview.total} ready
                  </h3>
                  <p className={ui.text.body}>
                    IDs, contracts and health insurance proofs stay in one place.
                  </p>
                  <div className="mt-4 h-2 rounded-full bg-slate-100">
                    <div
                      className="h-full rounded-full bg-slate-900"
                      style={{
                        width: `${Math.round(
                          (documentsPreview.ready / documentsPreview.total) * 100
                        )}%`,
                      }}
                    />
                  </div>
                  <p className="mt-3 text-sm text-blue-600">Upload key documents →</p>
                </article>
              </section>

              <section id="demo-modules" className="space-y-4">
                <div>
                  <p className={ui.text.meta}>Modules preview</p>
                  <p className={ui.text.body}>
                    Lightweight blocks, reusable each batch.
                  </p>
                </div>
                <div className="grid gap-4 md:grid-cols-2">
                  {modulesPreview.map((module) => (
                    <article key={module.title} className={`${ui.card} ${ui.compactCardPadding}`}>
                      <div className="flex items-center justify-between text-xs uppercase tracking-[0.18em] text-slate-400">
                        <span>{module.type}</span>
                        <span>{module.minutes} min</span>
                      </div>
                      <h4 className="mt-3 text-lg font-semibold text-slate-900">
                        {module.title}
                      </h4>
                      <p className="mt-2 text-sm text-slate-500">{module.status}</p>
                    </article>
                  ))}
                </div>
              </section>

              <section id="demo-jobs">
                <article className={`${ui.card} ${ui.cardPadding}`}>
                  <p className={ui.text.meta}>Jobs & opportunities</p>
                  <h3 className="text-xl font-semibold text-slate-900">
                    Ready signals unlock introductions
                  </h3>
                  <p className={ui.text.body}>
                    Evolgrit batches generate readiness scores (language, culture, reliability)
                    so employers can invite you calmly when the match is right.
                  </p>
                </article>
              </section>

              <section id="demo-profile">
                <article className={`${ui.card} ${ui.cardPadding}`}>
                  <p className={ui.text.meta}>Profile snapshot</p>
                  <h3 className="text-xl font-semibold text-slate-900">
                    German A2 · Logistics experience · Berlin
                  </h3>
                  <p className={ui.text.body}>
                    All onboarding fields stay editable. Once complete, your profile unlocks
                    tailored batches, modules and employers.
                  </p>
                </article>
              </section>
            </div>

            <aside className="hidden lg:block lg:col-span-3">
              <div className="sticky top-24 rounded-3xl border border-slate-200 bg-white shadow-sm">
                <div className="flex items-center gap-3 p-5">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-slate-900 text-white text-lg font-semibold">
                    L
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-slate-900">Lina · Mentor</p>
                    <p className="text-xs text-slate-500">Cultural readiness coach</p>
                  </div>
                  <span className="ml-auto inline-flex items-center gap-1 rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
                    <span className="h-2 w-2 rounded-full bg-emerald-500" />
                    Online
                  </span>
                  <button
                    type="button"
                    className="rounded-full border border-slate-200 bg-white p-2 text-xs text-slate-500 hover:bg-slate-50"
                    aria-label="Mentor options"
                  >
                    ···
                  </button>
                </div>
                <div className="border-t border-slate-200" />
                <div className="space-y-3 border-b border-slate-200 p-5">
                  <div>
                    <p className={ui.text.meta}>Video chat</p>
                    <p className={ui.text.body}>Available during scheduled mentor sessions.</p>
                  </div>
                  <div className="rounded-2xl bg-blue-50 p-4 text-center text-sm text-slate-600">
                    Video calls unlock inside Evolgrit.
                  </div>
                  <button
                    type="button"
                    disabled
                    className="inline-flex w-full items-center justify-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-4 py-2 text-sm font-medium text-slate-500"
                  >
                    📞 Start a call (demo)
                  </button>
                </div>
                <div className="flex flex-col border-b border-slate-200 p-5">
                  <div className="mb-3 flex items-center justify-between">
                    <p className={ui.text.meta}>Text chat</p>
                    <span className="text-xs text-slate-500">Demo transcript</span>
                  </div>
                  <div className="max-h-64 space-y-3 overflow-y-auto pr-1">
                    {mentorMessages.map((message) => (
                      <div
                        key={message.id}
                        className={`flex items-start gap-3 ${
                          message.author === "mentor" ? "" : "flex-row-reverse text-right"
                        }`}
                      >
                        <div className="flex h-8 w-8 items-center justify-center rounded-full border border-slate-200 bg-white text-xs font-semibold text-slate-900">
                          {message.author === "mentor" ? "L" : "You"}
                        </div>
                        <div className="flex max-w-[80%] flex-col gap-1">
                          <div
                            className={`rounded-2xl px-3 py-2 text-sm ${
                              message.author === "mentor"
                                ? "bg-slate-100 text-slate-800"
                                : "bg-slate-900 text-white"
                            }`}
                          >
                            {message.text}
                          </div>
                          <span className="text-[11px] text-slate-400">Demo · 10:24</span>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-500">
                    Chat is available inside Evolgrit.
                  </div>
                  <div className="rounded-full border border-slate-200 bg-slate-50 px-4 py-2 text-sm text-slate-500">
                    Chat available inside Evolgrit
                  </div>
                </div>
                <div className="space-y-3 p-5">
                  <div className="rounded-full border border-slate-200 bg-white px-3 py-1.5 text-sm text-slate-500">
                    Chat available inside Evolgrit
                  </div>
                  <div className="flex items-center justify-between border-t border-slate-200 pt-3 text-xs text-slate-500">
                    <span>Help center</span>
                    <button
                      type="button"
                      className="rounded-full border border-slate-200 px-2 py-1 text-slate-600 hover:bg-slate-50"
                    >
                      ?
                    </button>
                  </div>
                </div>
              </div>
            </aside>
         </div>
       </div>
     </div>
    </>
  );
}
