"use client";

import Link from "next/link";
import { heroStats } from "@/lib/data/marketingContent";

const marketingContainer = "mx-auto w-full max-w-[1280px] px-4 sm:px-6 lg:px-8";

export function HeroSection() {
  return (
    <section id="product" className="border-b border-slate-100 bg-gradient-to-b from-slate-50/80 to-white">
      <div className={`${marketingContainer} grid items-start gap-12 py-16 lg:grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)] lg:py-24`}>
        <div className="space-y-6">
          <div className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-medium text-slate-500">
            <span className="inline-flex h-1.5 w-1.5 rounded-full bg-emerald-500" />
            Private beta 2026 · international learners & employers
          </div>

          <div className="space-y-4">
            <h1 className="text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl lg:text-[2.7rem]">
              German language &amp; job preparation for working in Germany
            </h1>
            <p className="max-w-xl text-base text-slate-600 sm:text-lg">
              Evolgrit is a 6–12 month hybrid journey that combines AI-powered German learning, cultural readiness and job preparation – so international talent can truly arrive and stay in Germany, not just pass an exam.
            </p>
          </div>

          <div className="mt-8 flex flex-wrap items-center gap-3">
            <Link
              href="/waitlist"
              className="inline-flex items-center justify-center rounded-full bg-slate-900 px-5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-slate-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-900/50"
            >
              Join learner waitlist
            </Link>
            <Link
              href="/for-employers"
              className="inline-flex items-center justify-center rounded-full border border-slate-300 bg-white px-5 py-2.5 text-sm font-semibold text-slate-900 hover:border-slate-400"
            >
              Talk to us about hiring
            </Link>
          </div>

          <Link
            href="/how-it-works"
            className="mt-3 inline-flex items-center text-sm font-medium text-slate-500 hover:text-slate-900"
          >
            See how it works
            <span className="ml-1" aria-hidden="true">
              →
            </span>
          </Link>

          <p className="mt-4 text-xs uppercase tracking-[0.16em] text-slate-400">
            Built for people first – shaped together with learners and employers.
          </p>
        </div>

        <aside className="w-full max-w-md lg:ml-auto">
          <div className="space-y-5 rounded-3xl border border-slate-200 bg-white/80 p-5 shadow-sm backdrop-blur-sm sm:p-6">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-xs font-semibold tracking-[0.18em] text-slate-400">
                  {heroStats.batchTitle}
                </p>
                <p className="mt-1 text-sm font-semibold text-slate-900">
                  {heroStats.batchSubtitle}
                </p>
              </div>
              <span className="inline-flex items-center rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
                {heroStats.tag}
              </span>
            </div>

            <div className="grid gap-3 sm:grid-cols-3">
              {heroStats.cards.map((card) => (
                <div
                  key={card.title}
                  className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm"
                >
                  <p className="text-xs text-slate-500">{card.title}</p>
                  <p className="mt-1 text-lg font-semibold text-slate-900">{card.value}</p>
                  <p className="mt-0.5 text-xs text-slate-500">{card.sub}</p>
                </div>
              ))}
            </div>

            <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-xs leading-relaxed text-slate-600">
              {heroStats.summary}
            </div>
          </div>
        </aside>
      </div>
    </section>
  );
}
