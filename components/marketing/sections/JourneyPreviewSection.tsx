"use client";

import Link from "next/link";
import { evolgritPhases } from "@/lib/data/marketingContent";

const marketingContainer = "mx-auto w-full max-w-[1280px] px-4 sm:px-6 lg:px-8";

export function JourneyPreviewSection() {
  return (
    <section id="journey-preview" className={`${marketingContainer} mt-16 space-y-6`}>
      <div className="space-y-3 text-center">
        <p className="text-[11px] uppercase tracking-[0.18em] text-slate-400">Evolgrit journey</p>
        <h2 className="text-2xl font-semibold tracking-tight text-slate-900">
          A calm three-phase journey
        </h2>
        <p className="text-sm text-slate-600">
          From arrival to job-ready, Evolgrit keeps learners moving without burning out.
        </p>
      </div>
      <div className="grid gap-4 md:grid-cols-3">
        {evolgritPhases.map((phase) => (
          <article
            key={phase.id}
            className="rounded-3xl border border-slate-200 bg-white p-5 text-left shadow-sm"
          >
            <p className="text-[11px] uppercase tracking-[0.18em] text-slate-400">{phase.label}</p>
            <h3 className="mt-2 text-lg font-semibold text-slate-900">{phase.title}</h3>
            <p className="mt-2 text-sm text-slate-600 line-clamp-3">{phase.summary}</p>
          </article>
        ))}
      </div>
      <div className="flex flex-wrap items-center justify-center gap-3">
        <Link href="/how-it-works" className="text-sm font-medium text-blue-600 hover:text-blue-700">
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
  );
}
