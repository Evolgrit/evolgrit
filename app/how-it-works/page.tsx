import type { Metadata } from "next";
import Link from "next/link";
import MarketingTopbar from "@/components/MarketingTopbar";
import { Reveal } from "@/components/ui/Reveal";
import { MarketingPageShell } from "@/components/marketing/MarketingPageShell";

export const metadata: Metadata = {
  title: "How Evolgrit Works – Calm three-phase journey",
  description:
    "Understand Evolgrit's journey: phase zero expectations, weekly rhythm, readiness signals and mentor touchpoints.",
};

const container = "mx-auto w-full max-w-[1280px] px-4 sm:px-6 lg:px-8";

const journeyCards = [
  {
    label: "Phase 0",
    title: "Orientation & expectations",
    copy: "Clear onboarding, paperwork prep and a realistic view of the effort — before a learner commits.",
  },
  {
    label: "Phase 1–2",
    title: "Language & everyday life",
    copy: "Real German for transport, housing, public services and community so daily life feels steady.",
  },
  {
    label: "Phase 3",
    title: "Job readiness & matching",
    copy: "Employer signals, simulations, mentor feedback and calm introductions into work or education paths.",
  },
];

const signalCards = [
  {
    title: "Weekly check-in",
    body: "Mood, focus hours and blockers turn into simple signals that mentors and employers read at a glance.",
  },
  {
    title: "Modules & momentum",
    body: "Micro-modules and tasks keep batches moving together, with progress ready for review.",
  },
  {
    title: "Documents readiness",
    body: "IDs, contracts, health insurance and residence proofs are collected early with reminders.",
  },
  {
    title: "Mentor touchpoints",
    body: "Weekly mentor guidance plus AI support ensures learners get corrections the moment they need them.",
  },
];

const trustPoints = [
  "No shortcuts — Evolgrit is for learners ready to build a real life in Germany.",
  "Structured weeks reduce burnout and make progress visible.",
  "A calm batch path replaces ad-hoc courses and scattered paperwork.",
];

export default function HowItWorksPage() {
  return (
    <>
      <MarketingTopbar />
      <MarketingPageShell>
        <main className="min-h-screen bg-slate-50 pb-16 text-slate-900">
          <Reveal delayMs={180} durationMs={360} distance={12}>
            <section className={`${container} pt-16`}>
              <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-slate-400">
              How it works
            </p>
            <h1 className="mt-3 text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl">
              A calm three-phase journey to job-ready.
            </h1>
            <p className="mt-3 text-base text-slate-600">
              Language, everyday life and job readiness stay linked from the first week — so learners know what’s next and employers see true progress.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link
                href="/learner-journey"
                className="inline-flex items-center justify-center rounded-full bg-slate-900 px-5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-slate-800"
              >
                See the learner demo
              </Link>
              <Link
                href="/waitlist"
                className="inline-flex items-center justify-center rounded-full border border-slate-200 bg-white px-5 py-2.5 text-sm font-semibold text-slate-900 hover:border-slate-400"
              >
                Join the waitlist
              </Link>
            </div>
              </div>
            </section>
          </Reveal>

          <Reveal delayMs={260} durationMs={360} distance={12}>
            <section className={`${container} mt-10`}>
              <Reveal
                durationMs={220}
                distance={6}
                staggerChildren
                className="grid gap-4 md:grid-cols-3"
              >
                {journeyCards.map((card) => (
                  <article
                    key={card.label}
                    className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm"
                  >
                    <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-400">
                      {card.label}
                    </p>
                    <h2 className="mt-2 text-xl font-semibold text-slate-900">{card.title}</h2>
                    <p className="mt-2 text-sm text-slate-600">{card.copy}</p>
                  </article>
                ))}
              </Reveal>
            </section>
          </Reveal>

          <Reveal delayMs={320} durationMs={360} distance={12}>
            <section className={`${container} mt-12`}>
              <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
            <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Progress & readiness</p>
            <h3 className="mt-2 text-2xl font-semibold text-slate-900">
              Signals that show when someone is ready — not just hopeful.
            </h3>
                <Reveal
                  durationMs={220}
                  distance={6}
                  staggerChildren
                  className="mt-6 grid gap-4 md:grid-cols-2"
                >
                  {signalCards.map((signal) => (
                    <div
                      key={signal.title}
                      className="rounded-2xl border border-slate-100 bg-slate-50/60 p-5"
                    >
                      <p className="text-sm font-semibold text-slate-900">{signal.title}</p>
                      <p className="mt-2 text-sm text-slate-600">{signal.body}</p>
                    </div>
                  ))}
                </Reveal>
              </div>
            </section>
          </Reveal>

          <Reveal delayMs={380} durationMs={360} distance={12}>
            <section className={`${container} mt-12`}>
              <div className="grid gap-6 lg:grid-cols-2">
                <article className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
              <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Weekly rhythm</p>
              <h4 className="mt-2 text-xl font-semibold text-slate-900">Every week stays predictable.</h4>
              <div className="mt-4 space-y-3 text-sm text-slate-600">
                <div className="rounded-2xl border border-slate-100 bg-slate-50/70 p-4">
                  <p className="font-medium text-slate-900">Tasks & micro-modules</p>
                  <p>Language + integration blocks with AI support.</p>
                </div>
                <div className="rounded-2xl border border-slate-100 bg-slate-50/70 p-4">
                  <p className="font-medium text-slate-900">Weekly check-in</p>
                  <p>Mood, focus hours and blockers keep mentors informed.</p>
                </div>
                <div className="rounded-2xl border border-slate-100 bg-slate-50/70 p-4">
                  <p className="font-medium text-slate-900">Mentor touchpoint</p>
                  <p>Live feedback or voice notes align expectations calmly.</p>
                </div>
              </div>
            </article>
                <article className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
              <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Before you start</p>
              <h4 className="mt-2 text-xl font-semibold text-slate-900">Phase 0 sets the tone.</h4>
              <ul className="mt-4 space-y-2 text-sm text-slate-600">
                {trustPoints.map((point) => (
                  <li key={point} className="flex gap-2">
                    <span className="text-slate-400">•</span>
                    <span>{point}</span>
                  </li>
                ))}
              </ul>
            </article>
              </div>
            </section>
          </Reveal>

          <Reveal delayMs={420} durationMs={360} distance={12}>
            <section className={`${container} mt-12`}>
              <div className="rounded-3xl border border-slate-200 bg-white p-8 text-center shadow-sm">
            <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Ready?</p>
            <h3 className="mt-2 text-2xl font-semibold text-slate-900">
              Start the journey the right way.
            </h3>
            <p className="mt-2 text-sm text-slate-600">
              Calm batches, guided expectations and real readiness signals.
            </p>
            <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
              <Link
                href="/waitlist"
                className="inline-flex items-center justify-center rounded-full bg-slate-900 px-6 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-slate-800"
              >
                Join learner waitlist
              </Link>
              <Link
                href="/learner-journey"
                className="text-sm font-medium text-blue-600 hover:text-blue-700"
              >
                Explore the demo →
              </Link>
            </div>
              </div>
            </section>
          </Reveal>
        </main>
      </MarketingPageShell>
    </>
  );
}
