"use client";

import Link from "next/link";

export function FinalCtaSection() {
  return (
    <section className="mx-auto mt-16 w-full max-w-6xl px-5">
      <div className="flex flex-col items-start justify-between gap-4 rounded-2xl bg-slate-900 px-6 py-6 text-slate-50 shadow-lg sm:flex-row sm:items-center sm:px-8 sm:py-7">
        <div>
          <h2 className="mb-1 text-xl font-semibold sm:text-2xl">
            Ready to shape the next Evolgrit batch?
          </h2>
          <p className="text-sm text-slate-300 sm:text-base">
            Whether you&apos;re a learner, employer or mentor – we&apos;d love to explore how
            Evolgrit can work for you.
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          <Link
            href="/waitlist"
            className="rounded-full bg-blue-500 px-4 py-2 text-sm font-medium text-white hover:bg-blue-600"
          >
            Join learner waitlist
          </Link>
          <Link
            href="/employers"
            className="rounded-full border border-slate-500 px-4 py-2 text-sm font-medium text-slate-50 hover:bg-slate-800"
          >
            Talk to us about hiring
          </Link>
        </div>
        <a
          href="mailto:info@evolgrit.com?subject=Mentor%20at%20Evolgrit"
          className="inline-flex items-center gap-1 text-xs font-medium text-slate-300 hover:text-slate-50"
        >
          Become a mentor
          <span aria-hidden="true">→</span>
        </a>
      </div>
    </section>
  );
}
