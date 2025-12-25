"use client";

import Image from "next/image";
import { getToKnowCards } from "@/lib/data/marketingContent";

export function GetToKnowSection() {
  return (
    <section
      id="get-to-know"
      aria-labelledby="get-to-know-title"
      className="bg-slate-50 py-16 sm:py-20"
    >
      <div className="relative left-1/2 right-1/2 -ml-[50vw] -mr-[50vw] w-screen">
        <div className="px-4 sm:px-6 lg:px-8">
          <div className="mx-auto w-full max-w-6xl">
            <div className="flex items-baseline justify-between gap-4">
              <div>
                <h2
                  id="get-to-know-title"
                  className="text-2xl font-semibold tracking-tight text-slate-900 sm:text-3xl"
                >
                  Get to know Evolgrit.
                </h2>
                <p className="mt-2 max-w-xl text-sm text-slate-600 sm:text-base">
                  Evolgrit is not a normal German course. We combine language, everyday life and job
                  preparation in one journey – so you can actually live and work in Germany, not just
                  pass an exam.
                </p>
                <p className="mt-1 max-w-xl text-xs text-slate-500 sm:text-sm">
                  These seven pillars show how: from job-specific German and an AI-coach to real-life
                  mentoring, family support and help with documents.
                </p>
              </div>
              <a
                href="#how-it-works"
                className="hidden items-center text-xs font-medium text-blue-600 hover:text-blue-700 sm:inline-flex"
              >
                Learn how Evolgrit works&nbsp;→
              </a>
            </div>
          </div>

          <div className="mt-8 flex gap-5 overflow-x-auto pb-4 snap-x snap-mandatory">
            {getToKnowCards.map((card) => (
              <article
                key={card.id}
                className="group relative w-[82%] shrink-0 snap-center overflow-hidden rounded-3xl bg-slate-900 pb-14 text-slate-50 shadow-sm transition-transform duration-300 hover:-translate-y-1 hover:shadow-xl sm:w-[60%] md:w-[360px] lg:w-[380px] sm:pb-16"
              >
                <div className="relative aspect-[4/5]">
                  <Image
                    src={card.image}
                    alt={card.title}
                    fill
                    sizes="(min-width:1024px) 360px, (min-width:768px) 60vw, 82vw"
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-slate-900/40 to-slate-900/10" />

                  <div className="absolute inset-x-5 bottom-4 sm:bottom-6">
                    <p className="text-[11px] uppercase tracking-[0.18em] text-slate-300">
                      {card.label}
                    </p>
                    <h3 className="mt-1 text-base font-semibold leading-snug sm:text-lg">
                      {card.title}
                    </h3>
                    <p className="mt-2 text-xs text-slate-100/90 line-clamp-3 sm:text-sm">
                      {card.description}
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  className="absolute bottom-4 right-4 inline-flex h-9 w-9 items-center justify-center rounded-full bg-white/90 text-slate-900 shadow-sm ring-1 ring-slate-200/80 transition group-hover:scale-105 group-hover:bg-white"
                  aria-label="More about this Evolgrit feature"
                >
                  <span className="text-lg leading-none">+</span>
                </button>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
