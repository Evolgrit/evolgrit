"use client";

import { evolgritPhases, evolgritSteps } from "@/lib/data/marketingContent";

export function JourneyOverviewSection() {
  return (
    <section className="bg-white py-16 sm:py-20">
      <div className="mx-auto w-full max-w-6xl px-4 sm:px-6">
        <div className="mb-10 space-y-3 text-center">
          <p className="text-[11px] uppercase tracking-[0.18em] text-slate-400">Evolgrit journey</p>
          <h2 className="text-2xl font-semibold tracking-tight text-slate-900 sm:text-3xl">
            A calm three-phase journey.
          </h2>
          <p className="mx-auto max-w-3xl text-sm text-slate-600 sm:text-base">
            From arrival to job-ready, Evolgrit keeps learners moving step by step without burning
            out.
          </p>
        </div>

        <div className="grid gap-5 md:grid-cols-3">
          {evolgritPhases.map((phase) => (
            <article
              key={phase.id}
              className="space-y-2 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm"
            >
              <p className="text-[11px] uppercase tracking-[0.18em] text-slate-400">
                {phase.label}
              </p>
              <h3 className="text-lg font-semibold text-slate-900">{phase.title}</h3>
              <p className="text-sm text-slate-600">{phase.summary}</p>
            </article>
          ))}
        </div>

        <div className="relative mt-10">
          <div className="pointer-events-none absolute inset-y-0 left-0 w-12 bg-gradient-to-r from-white/80 to-transparent md:hidden" />
          <div className="pointer-events-none absolute inset-y-0 right-0 w-12 bg-gradient-to-l from-white/80 to-transparent md:hidden" />
          <div className="flex gap-4 overflow-x-auto snap-x snap-mandatory scrollbar-hide md:grid md:grid-cols-12 md:gap-4 md:overflow-visible md:snap-none">
            {evolgritSteps.map((step) => (
              <article
                key={step.id}
                className={`flex w-[80%] shrink-0 snap-start flex-col gap-3 rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:w-[60%] md:w-auto ${step.colSpan}`}
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-900 text-sm font-semibold text-white">
                    {step.number}
                  </div>
                  <p className="text-xs font-medium uppercase tracking-[0.18em] text-slate-400">
                    Step {step.number}
                  </p>
                </div>
                <h4 className="text-sm font-semibold text-slate-900">{step.title}</h4>
                <p className="text-sm leading-relaxed text-slate-600">{step.description}</p>
                <p className="text-xs uppercase tracking-[0.18em] text-slate-400">{step.outcome}</p>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
