"use client";

import { readinessScoreCards } from "@/lib/data/marketingContent";

type ReadinessScoreSectionProps = {
  variant?: "learner" | "employer";
};

export function ReadinessScoreSection({ variant = "learner" }: ReadinessScoreSectionProps) {
  const heading =
    variant === "employer"
      ? "See real readiness signals before you hire."
      : "See more than just a language level.";
  const body =
    variant === "employer"
      ? "The Evolgrit Readiness Score shows language, everyday life, job skills and reliability in one view — so employers know who is truly ready and learners see their own progress."
      : "The Evolgrit Readiness Score brings language, everyday life and job skills together in one simple view – so employers can see who is truly ready for a role, and learners can see how far they have come.";

  return (
    <section className="border-t border-slate-100 bg-slate-50 py-12 sm:py-14">
      <div className="mx-auto w-full max-w-6xl px-5">
        <div className="max-w-2xl">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
            Readiness score
          </p>
          <h2 className="mt-2 text-2xl font-semibold tracking-tight text-slate-900 sm:text-3xl">
            {heading}
          </h2>
          <p className="mt-2 text-sm text-slate-600 sm:text-base">{body}</p>
        </div>

        <div className="mt-5 grid gap-3 text-sm sm:grid-cols-2">
          {readinessScoreCards.map((card) => (
            <div key={card.title} className="rounded-2xl border border-slate-200 bg-white p-4">
              <p className="mb-1 text-xs font-medium text-slate-500">{card.title}</p>
              <p className="text-sm text-slate-700">{card.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
