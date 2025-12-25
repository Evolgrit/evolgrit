"use client";

import { useState } from "react";
import { timelinePhases } from "@/lib/data/marketingContent";

type PhaseId = (typeof timelinePhases)[number]["id"];

export function ProgramTimelineSection() {
  const [activePhase, setActivePhase] = useState<PhaseId | null>(null);

  return (
    <section className="mx-auto mt-24 w-full max-w-6xl px-5">
      <div className="mx-auto mb-10 max-w-2xl text-center">
        <h2 className="mb-3 text-3xl font-semibold text-slate-900">Three phases – not just a course.</h2>
        <p className="text-sm text-slate-600 sm:text-base">
          Evolgrit is a structured 3-phase journey – from arrival to job-ready – so learners can grow
          step by step without burning out.
        </p>
      </div>

      <div className="grid gap-6 text-sm md:grid-cols-3">
        {timelinePhases.map((phase, idx) => {
          const isActive = activePhase === phase.id;
          const toneStyles =
            phase.tone === "blue"
              ? { badge: "bg-blue-600/10 text-blue-600", tag: "bg-blue-50 text-blue-700" }
              : phase.tone === "emerald"
              ? { badge: "bg-emerald-500/10 text-emerald-600", tag: "bg-emerald-50 text-emerald-700" }
              : { badge: "bg-violet-500/10 text-violet-600", tag: "bg-violet-50 text-violet-700" };

          const toggle = () => setActivePhase(isActive ? null : phase.id);

          return (
            <article
              key={phase.id}
              role="button"
              tabIndex={0}
              onClick={toggle}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  toggle();
                }
              }}
              className={[
                "group relative flex flex-col gap-4 rounded-3xl border border-slate-200 bg-white p-6 pb-14 shadow-sm",
                "transition-transform duration-200 hover:-translate-y-1 hover:shadow-lg",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-300",
              ].join(" ")}
            >
              <div className="flex items-center gap-3">
                <div
                  className={[
                    "flex h-10 w-10 items-center justify-center rounded-2xl text-sm font-semibold",
                    toneStyles.badge,
                  ].join(" ")}
                >
                  {idx + 1}
                </div>
                <div>
                  <p className="text-[11px] uppercase tracking-[0.18em] text-slate-400">{phase.label}</p>
                  <h3 className="font-semibold text-slate-900">{phase.title}</h3>
                </div>
              </div>

              <ul className="space-y-1.5 text-sm text-slate-600">
                {phase.bullets.map((bullet, i) => (
                  <li
                    key={bullet}
                    className={["transition-all duration-200", isActive ? "opacity-100" : i > 0 ? "hidden" : ""].join(" ")}
                  >
                    • {bullet}
                  </li>
                ))}
              </ul>

              <div className="mt-auto pt-2">
                <span
                  className={[
                    "inline-flex items-center rounded-full px-3 py-1 text-[11px]",
                    toneStyles.tag,
                  ].join(" ")}
                >
                  {phase.tag}
                </span>
              </div>

              <div className="mt-2 border-t border-slate-100 pt-3 text-sm text-blue-600 inline-flex items-center gap-1">
                <span>{isActive ? "Show less" : "Learn more"}</span>
                <span aria-hidden="true">→</span>
              </div>

              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  toggle();
                }}
                aria-label={isActive ? "Close phase details" : "Open phase details"}
                className={[
                  "absolute bottom-4 right-4 inline-flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 bg-white text-lg font-medium text-slate-900 shadow-sm",
                  "transition-colors group-hover:bg-slate-900 group-hover:text-slate-50",
                  isActive ? "rotate-45" : "",
                ].join(" ")}
              >
                +
              </button>
            </article>
          );
        })}
      </div>
    </section>
  );
}
