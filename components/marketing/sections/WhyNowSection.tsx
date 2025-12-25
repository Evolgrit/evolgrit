"use client";

import { whyNowIntro } from "@/lib/data/marketingContent";

export function WhyNowSection() {
  return (
    <section className="bg-white py-12 sm:py-14">
      <div className="mx-auto w-full max-w-6xl px-5">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">Why now</p>
        <div className="mt-3 grid gap-4 md:grid-cols-[minmax(0,1.4fr),minmax(0,1fr)] md:items-start">
          <div className="space-y-3">
            <h2 className="text-2xl font-semibold tracking-tight text-slate-900 sm:text-3xl">
              {whyNowIntro.title}
            </h2>
            {whyNowIntro.paragraphs.map((paragraph) => (
              <p key={paragraph} className="text-sm text-slate-600 sm:text-base">
                {paragraph}
              </p>
            ))}
          </div>
          <ul className="mt-2 space-y-2 text-sm text-slate-600 md:mt-0">
            {whyNowIntro.bullets.map((bullet) => (
              <li key={bullet}>{bullet}</li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
