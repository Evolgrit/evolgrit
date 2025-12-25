"use client";

import { useState } from "react";
import { howItWorksSteps, learnersGetHighlights } from "@/lib/data/marketingContent";

export function LearnerHowItWorksSection() {
  const [activeHowStep, setActiveHowStep] = useState<string | null>(null);

  return (
    <section id="how-it-works" className="scroll-mt-24 py-16 sm:py-20">
      <div className="mx-auto w-full max-w-6xl px-6 sm:px-8">
        <div className="mb-10 space-y-2 text-center">
          <p className="text-[11px] uppercase tracking-[0.18em] text-slate-400">Learner journey</p>
          <h2 className="text-2xl font-semibold tracking-tight text-slate-900 sm:text-3xl">
            How Evolgrit works for learners
          </h2>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:gap-6 md:grid-cols-2 lg:grid-cols-4">
          {howItWorksSteps.map((step, index) => {
            const isActive = activeHowStep === step.step;
            const toggle = () => setActiveHowStep(isActive ? null : step.step);

            return (
              <article
                key={step.step}
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
                  "group relative w-full text-left",
                  "rounded-3xl border border-slate-200 bg-white shadow-sm",
                  "p-6 pb-14 space-y-3",
                  "transition-transform duration-200",
                  "hover:-translate-y-1 hover:shadow-lg",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-300",
                  isActive ? "shadow-md" : "",
                ].join(" ")}
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-900 text-xs font-semibold text-white">
                    {index + 1}
                  </div>
                  <span className="text-[11px] uppercase tracking-[0.18em] text-slate-400">
                    STEP {step.step}
                  </span>
                </div>

                <div className="space-y-2 pr-10">
                  <h3 className="text-sm font-semibold text-slate-900">{step.title}</h3>
                  <p
                    className={[
                      "text-sm leading-relaxed text-slate-500 transition-all duration-200",
                      isActive ? "line-clamp-none" : "line-clamp-3",
                    ].join(" ")}
                  >
                    {step.body}
                  </p>
                </div>

                <div className="mt-2 border-t border-slate-100 pt-3 text-sm text-blue-600 inline-flex items-center gap-1">
                  <span>Learn more</span>
                  <span aria-hidden="true">→</span>
                </div>

                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    toggle();
                  }}
                  aria-label={isActive ? "Close details" : "Open details"}
                  className={[
                    "absolute bottom-4 right-4 inline-flex h-9 w-9 items-center justify-center",
                    "rounded-full border border-slate-200 bg-white text-lg font-medium text-slate-900 shadow-sm",
                    "transition-colors",
                    "group-hover:bg-slate-900 group-hover:text-slate-50",
                    isActive ? "rotate-45" : "",
                  ].join(" ")}
                >
                  +
                </button>
              </article>
            );
          })}
        </div>

        <div className="mt-10">
          <h3 className="mb-4 text-sm font-semibold text-slate-900 sm:text-base">
            What learners get with Evolgrit
          </h3>
          <div className="grid grid-cols-1 gap-4 sm:gap-6 md:grid-cols-2">
            {learnersGetHighlights.map((item) => (
              <article
                key={item.id}
                className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md"
              >
                <div className="flex flex-col gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full border border-slate-200 bg-slate-50 text-xs text-slate-600">
                    {item.icon}
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-slate-900">{item.title}</h4>
                    <p className="text-sm leading-relaxed text-slate-500">{item.body}</p>
                  </div>
                </div>
                <div className="border-t border-slate-100 pt-3">
                  <span className="inline-flex items-center text-sm font-medium text-blue-600">
                    Learn more
                    <span className="ml-1" aria-hidden="true">
                      →
                    </span>
                  </span>
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
