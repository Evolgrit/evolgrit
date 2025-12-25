"use client";

import Link from "next/link";
import MarketingTopbar from "./MarketingTopbar";
import { Reveal } from "@/components/ui/Reveal";
import { employerCards } from "@/lib/data/employerCards";

const marketingContainer =
  "mx-auto w-full max-w-[1280px] px-4 sm:px-6 lg:px-8";

const phases = [
  {
    label: "PHASE 1",
    title: "Arrival & foundations",
    body:
      "Soft landing, orientation and everyday German with a peer group that stays with you.",
  },
  {
    label: "PHASE 2",
    title: "Language & life",
    body:
      "Real situations: transport, housing, cultural cues and switching formats to keep energy high.",
  },
  {
    label: "PHASE 3",
    title: "Job-ready & matching",
    body:
      "Mentor feedback, readiness signals and calm introductions into work or education paths.",
  },
] as const;

export default function HomePageClient() {
  return (
    <>
      <MarketingTopbar />
      <main className="min-h-screen bg-slate-50 pb-16 text-slate-900">
        <Reveal delayMs={180}>
          <section className={`${marketingContainer} grid gap-10 pt-16 lg:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)]`}
          >
            <div className="space-y-6">
              <div className="inline-flex items-center rounded-full border border-slate-200/80 bg-white px-3 py-1 text-xs font-semibold tracking-[0.2em] text-slate-500">
                Private beta 2026
              </div>
              <div className="space-y-4">
                <h1 className="text-3xl sm:text-4xl font-semibold tracking-tight text-slate-900">
                  AI-powered German learning & job preparation for working in Germany.
                </h1>
                <p className="text-base text-slate-600">
                  Evolgrit links language, everyday life and job readiness so international talent can calmly become job-ready and stay.
                </p>
              </div>
              <div className="flex flex-wrap gap-3">
                <Link
                  href="/waitlist"
                  className="inline-flex items-center justify-center rounded-full bg-slate-900 px-5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-slate-800"
                >
                  Join learner waitlist
                </Link>
                <Link
                  href="/login?role=employer"
                  className="inline-flex items-center justify-center rounded-full border border-slate-200 bg-white px-5 py-2.5 text-sm font-semibold text-slate-900 hover:border-slate-400"
                >
                  Talk to us about hiring
                </Link>
              </div>
            </div>

            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
              <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Batch preview</p>
              <h2 className="mt-2 text-2xl font-semibold text-slate-900">Batch Alpha · Week 3</h2>
              <p className="mt-1 text-sm text-slate-500">Learners practicing for logistics & childcare roles.</p>
              <div className="mt-6 grid gap-4 text-sm text-slate-600">
                <div className="rounded-2xl bg-slate-50 px-4 py-3">
                  <p className="text-xs text-slate-500">Journey progress</p>
                  <p className="text-2xl font-semibold text-slate-900">64%</p>
                </div>
                <div className="rounded-2xl bg-slate-50 px-4 py-3">
                  <p className="text-xs text-slate-500">Mentor touchpoints</p>
                  <p className="text-sm">Live weekly, AI in-between.</p>
                </div>
                <div className="rounded-2xl bg-slate-50 px-4 py-3">
                  <p className="text-xs text-slate-500">Documents ready</p>
                  <p className="text-sm">2 / 4 key proofs uploaded.</p>
                </div>
              </div>
            </div>
          </section>
        </Reveal>

        <Reveal delayMs={260}>
          <section id="journey-preview" className={`${marketingContainer} mt-16 space-y-6`}>
            <div className="text-center space-y-3">
              <p className="text-[11px] uppercase tracking-[0.18em] text-slate-400">
                Evolgrit journey
              </p>
              <h2 className="text-2xl font-semibold tracking-tight text-slate-900">
                A calm three-phase journey
              </h2>
              <p className="text-sm text-slate-600">
                From arrival to job-ready, Evolgrit keeps learners moving without burning out.
              </p>
            </div>
            <div className="grid gap-4 md:grid-cols-3">
              {phases.map((phase) => (
                <article
                  key={phase.label}
                  className="rounded-3xl border border-slate-200 bg-white p-5 text-left shadow-sm"
                >
                  <p className="text-[11px] uppercase tracking-[0.18em] text-slate-400">
                    {phase.label}
                  </p>
                  <h3 className="mt-2 text-lg font-semibold text-slate-900">{phase.title}</h3>
                  <p className="mt-2 text-sm text-slate-600">{phase.body}</p>
                </article>
              ))}
            </div>
            <div className="flex flex-wrap items-center justify-center gap-3">
              <Link
                href="/how-it-works"
                className="text-sm font-medium text-blue-600 hover:text-blue-700"
              >
                Read how it works →
              </Link>
              <Link
                href="/learner-journey"
                className="text-sm font-medium text-blue-600 hover:text-blue-700"
              >
                Open learner demo →
              </Link>
            </div>
          </section>
        </Reveal>

        <Reveal delayMs={320}>
          <section id="for-employers" className={`${marketingContainer} mt-20 space-y-6`}>
            <div className="flex flex-col gap-3 text-center">
              <p className="text-[11px] uppercase tracking-[0.18em] text-slate-400">
                For employers
              </p>
              <h2 className="text-2xl font-semibold text-slate-900">
                Readiness signals before you onboard
              </h2>
              <p className="text-sm text-slate-600">
                A short preview of what employers see inside Evolgrit.
              </p>
            </div>
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
              {employerCards.slice(0, 4).map((card) => (
                <article
                  key={card.id}
                  className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm"
                >
                  <div className="flex items-start gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-2xl bg-slate-900 text-base text-slate-50">
                      <span aria-hidden="true">{card.icon}</span>
                    </div>
                    <div>
                      <p className="text-[11px] uppercase tracking-[0.18em] text-slate-400">
                        {card.label}
                      </p>
                      <h3 className="text-sm font-semibold text-slate-900">{card.title}</h3>
                    </div>
                  </div>
                  <p className="mt-3 text-sm text-slate-600">{card.description}</p>
                </article>
              ))}
            </div>
            <div className="text-center">
              <Link
                href="/for-employers#tina-story"
                className="text-sm font-medium text-blue-600 hover:text-blue-700"
              >
                Read more for employers →
              </Link>
            </div>
          </section>
        </Reveal>

        <Reveal delayMs={380}>
          <section className={`${marketingContainer} mt-20`}> 
            <div className="max-w-4xl mx-auto rounded-3xl bg-slate-900 text-slate-50 shadow-xl px-8 py-8 sm:px-12 sm:py-10 text-center">
              <h2 className="text-2xl sm:text-3xl font-semibold tracking-tight">
                What is Evolgrit?
              </h2>
              <p className="mt-4 text-base sm:text-lg text-slate-300 leading-relaxed">
                We believe every person can improve their future — through evolution <span className="italic">(Evol-)</span> and grit <span className="italic">(-grit)</span>. Evolgrit is the ability to keep going, to learn, to grow — and to build a new life.
              </p>
              <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
                <Link
                  href="/waitlist"
                  className="inline-flex items-center justify-center rounded-full bg-white px-5 py-2.5 text-sm font-semibold text-slate-900 shadow-sm"
                >
                  Start the journey
                </Link>
                <Link
                  href="/how-it-works"
                  className="text-sm font-medium text-slate-200 hover:text-white"
                >
                  Learn how it works →
                </Link>
              </div>
            </div>
          </section>
        </Reveal>
      </main>
    </>
  );
}
