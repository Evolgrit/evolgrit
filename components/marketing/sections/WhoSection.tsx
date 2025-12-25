"use client";

import Link from "next/link";
import { whoCards } from "@/lib/data/marketingContent";

type WhoSectionProps = {
  variant?: "full" | "preview";
};

export function WhoSection({ variant = "full" }: WhoSectionProps) {
  const cards = variant === "preview" ? whoCards.slice(0, 2) : whoCards;
  const container = "mx-auto w-full max-w-6xl px-5";

  return (
    <section id="who" className="bg-slate-50 py-16 sm:py-20">
      <div className={container}>
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
          Who Evolgrit is built for
        </p>

        <div className="mt-3 flex flex-col gap-3 sm:flex-row sm:items-baseline sm:justify-between">
          <div className="max-w-2xl">
            <h2 className="text-2xl font-semibold tracking-tight text-slate-900 sm:text-3xl">
              Who Evolgrit is built for.
            </h2>
            <p className="mt-2 text-sm text-slate-600 sm:text-base">
              Evolgrit connects learners, employers and mentors in one shared journey – so language,
              culture and work preparation happen together.
            </p>
          </div>
          {variant === "preview" && (
            <Link
              href="/how-it-works"
              className="inline-flex items-center text-sm font-medium text-blue-600 hover:text-blue-700"
            >
              Read the full journey →
            </Link>
          )}
        </div>

        <div className="mt-8 flex gap-4 overflow-x-auto px-5 pb-2 -mx-5 md:mx-0 md:grid md:grid-cols-3 md:gap-6 md:overflow-visible md:px-0">
          {cards.map((card) => (
            <article
              key={card.id}
              className="group relative w-[260px] shrink-0 rounded-3xl border border-slate-200 bg-white p-5 shadow-sm transition-transform duration-200 hover:-translate-y-1 hover:shadow-lg sm:p-6 md:w-auto"
            >
              <div className="mb-4 flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-2xl bg-slate-900 text-sm font-semibold text-slate-50 shadow-sm shadow-slate-900/30">
                  {card.badge}
                </div>
                <div className="text-xs font-medium uppercase tracking-[0.18em] text-slate-400">
                  {card.label}
                </div>
              </div>

              <div className="space-y-2">
                <h3 className="text-sm font-semibold text-slate-900 sm:text-base">{card.title}</h3>
                <p
                  className={`text-sm text-slate-600 ${variant === "preview" ? "line-clamp-3" : ""}`}
                >
                  {card.description}
                </p>
              </div>

              <div className="mt-4 border-t border-slate-100 pt-3">
                <a
                  href={card.href}
                  className="inline-flex items-center text-sm font-medium text-blue-600 hover:text-blue-700"
                >
                  {card.cta}
                  <span className="ml-1 text-base" aria-hidden="true">
                    →
                  </span>
                </a>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
