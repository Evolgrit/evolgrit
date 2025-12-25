import type { Metadata } from "next";
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
    <div className={`${ui.container} py-8`}>
      <div className="grid gap-8 xl:grid-cols-[minmax(0,1fr)_320px]">
        <div className="space-y-6">
          <header className={`${ui.card} ${ui.cardPadding}`}>
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <p className="text-[11px] uppercase tracking-[0.18em] text-slate-400">
                  Batch Alpha · Week 3
                </p>
                <h1 className="text-2xl font-semibold text-slate-900">
                  Learner journey (Demo)
                </h1>
                <p className="text-sm text-slate-600">
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

          <section className="space-y-4">
            <article className={`${ui.card} ${ui.cardPadding}`}>
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                  <p className="text-[11px] uppercase tracking-[0.18em] text-slate-400">
                    Current phase
                  </p>
                  <h2 className="text-2xl font-semibold text-slate-900">
                    {phase.label} · {phase.title}
                  </h2>
                  <p className="mt-1 text-sm text-slate-600">{phase.description}</p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-slate-500">Journey progress</p>
                  <p className="text-4xl font-semibold text-slate-900">64%</p>
                  <p className="text-xs text-slate-400">Week 3 · calm pace</p>
                </div>
              </div>

              <div className="mt-6 grid gap-4 sm:grid-cols-3">
                <div className="rounded-2xl border border-slate-100 bg-slate-50 p-4">
                  <p className="text-[11px] uppercase tracking-[0.18em] text-slate-400">
                    German level
                  </p>
                  <p className="mt-2 text-lg font-semibold text-slate-900">
                    A2 → B1 path
                  </p>
                  <p className="text-xs text-slate-500">Refreshed weekly via mentor.</p>
                </div>
                <div className="rounded-2xl border border-slate-100 bg-slate-50 p-4">
                  <p className="text-[11px] uppercase tracking-[0.18em] text-slate-400">
                    Modules this week
                  </p>
                  <p className="mt-2 text-lg font-semibold text-slate-900">2 / 3</p>
                  <p className="text-xs text-slate-500">Keep momentum tonight.</p>
                </div>
                <div className="rounded-2xl border border-slate-100 bg-slate-50 p-4">
                  <p className="text-[11px] uppercase tracking-[0.18em] text-slate-400">
                    Weekly check-in
                  </p>
                  <p className="mt-2 text-lg font-semibold text-slate-900">Submitted</p>
                  <p className="text-xs text-slate-500">Saved Mar 11.</p>
                </div>
              </div>
            </article>
          </section>

          <section className="grid gap-6 lg:grid-cols-[2fr,1fr]">
            <article className={`${ui.card} ${ui.cardPadding}`}>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[11px] uppercase tracking-[0.18em] text-slate-400">
                    Weekly check-in
                  </p>
                  <p className="text-sm text-slate-500">Mood + focus snapshot</p>
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

            <article className={`${ui.card} ${ui.cardPadding}`}>
              <p className="text-[11px] uppercase tracking-[0.18em] text-slate-400">
                Documents readiness
              </p>
              <h3 className="mt-2 text-xl font-semibold text-slate-900">
                {documentsPreview.ready} / {documentsPreview.total} ready
              </h3>
              <p className="text-sm text-slate-600">
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

          <section className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[11px] uppercase tracking-[0.18em] text-slate-400">
                  Modules preview
                </p>
                <p className="text-sm text-slate-500">
                  Lightweight blocks, reusable each batch.
                </p>
              </div>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              {modulesPreview.map((module) => (
                <article
                  key={module.title}
                  className={`${ui.card} ${ui.compactCardPadding}`}
                >
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
        </div>

        <aside className="hidden xl:block">
          <div className="sticky top-24 space-y-4">
            <article className={`${ui.card} ${ui.compactCardPadding}`}>
              <div className="flex items-center gap-3">
                <div className="h-12 w-12 rounded-full bg-slate-900 text-white flex items-center justify-center text-lg font-semibold">
                  L
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-900">Lina · Mentor</p>
                  <p className="text-xs text-slate-500">Cultural readiness coach</p>
                </div>
                <span className="ml-auto flex items-center text-xs text-emerald-600">
                  <span className="mr-1 h-2 w-2 rounded-full bg-emerald-500" />
                  Online
                </span>
              </div>
              <p className="mt-3 text-sm text-slate-600">
                “I keep an eye on language, culture and mindset so you never feel alone.”
              </p>
            </article>

            <article className={`space-y-3 ${ui.card} ${ui.compactCardPadding}`}>
              <div>
                <p className="text-[11px] uppercase tracking-[0.18em] text-slate-400">
                  Video chat
                </p>
                <p className="text-sm text-slate-600">
                  Available during scheduled mentor sessions.
                </p>
              </div>
              <button
                type="button"
                disabled
                className="w-full rounded-full border border-slate-200 bg-slate-50 px-4 py-2 text-sm font-medium text-slate-500"
              >
                Start a call (demo)
              </button>
            </article>

            <article className={`space-y-4 ${ui.card} ${ui.compactCardPadding}`}>
              <div className="flex items-center justify-between">
                <p className="text-[11px] uppercase tracking-[0.18em] text-slate-400">
                  Text chat
                </p>
                <span className="text-xs text-slate-500">Demo transcript</span>
              </div>
              <div className="space-y-3">
                {mentorMessages.map((message) => (
                  <div
                    key={message.id}
                    className={`rounded-2xl px-3 py-2 text-sm ${
                      message.author === "mentor"
                        ? "bg-slate-100 text-slate-800"
                        : "bg-slate-900 text-white ml-6"
                    }`}
                  >
                    {message.text}
                  </div>
                ))}
              </div>
              <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-500">
                Chat is available inside Evolgrit.
              </div>
              <input
                type="text"
                disabled
                className="w-full rounded-full border border-slate-200 bg-slate-50 px-4 py-2 text-sm text-slate-500"
                placeholder="Chat available inside Evolgrit"
              />
            </article>
          </div>
        </aside>
      </div>
    </div>
  );
}
