"use client";

import Link from "next/link";

type BrandMeaningSectionProps = {
  ctaVariant?: "full" | "preview";
};

export function BrandMeaningSection({ ctaVariant = "full" }: BrandMeaningSectionProps) {
  return (
    <section className="mx-auto mt-16 w-full max-w-6xl px-5">
      <div className="mx-auto max-w-4xl rounded-3xl bg-slate-900 px-8 py-8 text-center text-slate-50 shadow-xl sm:px-12 sm:py-10">
        <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">What is Evolgrit?</h2>

        <p className="mt-4 text-base leading-relaxed text-slate-300 sm:text-lg">
          We believe every person can improve their future — through evolution{" "}
          <span className="italic">(Evol-)</span> and grit <span className="italic">(-grit)</span>.
          Evolgrit is the ability to keep going, to learn, to grow — and to build a new life.
        </p>

        <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
          <Link
            href="/waitlist"
            className="inline-flex items-center justify-center rounded-full bg-white px-5 py-2.5 text-sm font-semibold text-slate-900 shadow-sm"
          >
            Start the journey
          </Link>
          {ctaVariant === "full" && (
            <Link
              href="/how-it-works"
              className="text-sm font-medium text-slate-200 hover:text-white"
            >
              Learn how it works →
            </Link>
          )}
        </div>

        <p className="mt-6 text-[11px] uppercase tracking-[0.28em] text-slate-500">
          Built with patience, courage and consistency.
        </p>
      </div>
    </section>
  );
}
