"use client";

import { useState } from "react";
import Link from "next/link";
import { employerCards } from "@/lib/data/employerCards";

type EmployersSectionProps = {
  variant?: "full" | "preview";
  id?: string;
  ctaHref?: string;
};

export function EmployersSection({
  variant = "full",
  id = "for-employers",
  ctaHref = "/for-employers#tina-story",
}: EmployersSectionProps) {
  const [openEmployerCardId, setOpenEmployerCardId] = useState<string | null>(null);
  const activeEmployerCard = employerCards.find((card) => card.id === openEmployerCardId);
  const cards = variant === "preview" ? employerCards.slice(0, 4) : employerCards;
  const allowModal = variant === "full";

  return (
    <section id={id} className="bg-slate-50 py-16 sm:py-20">
      <div className="mx-auto w-full max-w-6xl px-4 lg:px-6">
        <div className="mb-10 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
              For employers
            </p>
            <h2 className="mt-2 text-2xl font-semibold text-slate-900 sm:text-3xl">
              {variant === "preview"
                ? "Readiness signals before you onboard"
                : "For employers who need international talent to actually stay."}
            </h2>
            <p className="mt-3 max-w-2xl text-sm text-slate-600 sm:text-base">
              {variant === "preview"
                ? "A short preview of what employers see inside Evolgrit."
                : "Evolgrit gives you access to motivated international candidates who are not only learning German – they are actively preparing for life and work in your organisation."}
            </p>
          </div>
          {variant === "full" ? (
            <Link
              href="/login?role=employer"
              className="hidden items-center justify-center rounded-full bg-slate-900 px-5 py-2 text-sm font-medium text-slate-50 shadow-md shadow-slate-900/40 hover:bg-slate-800 sm:inline-flex"
            >
              Talk to us about hiring
            </Link>
          ) : (
            <Link
              href={ctaHref}
              className="inline-flex items-center text-sm font-medium text-blue-600 hover:text-blue-700"
            >
              Read more for employers →
            </Link>
          )}
        </div>

        <div
          className={`${
            variant === "full"
              ? "flex gap-4 overflow-x-auto pb-4 -mx-4 px-4 md:mx-0 md:px-0 md:overflow-visible snap-x snap-mandatory"
              : "grid gap-4 md:grid-cols-2 xl:grid-cols-4"
          }`}
        >
          {cards.map((card) => (
            <article
              key={card.id}
              onClick={() => {
                if (allowModal) setOpenEmployerCardId(card.id);
              }}
              className={`${
                variant === "full"
                  ? "group relative flex shrink-0 snap-center flex-col justify-between"
                  : ""
              } rounded-3xl border border-slate-200 bg-white p-5 pb-14 shadow-sm transition-transform duration-300 hover:-translate-y-1 hover:shadow-lg ${
                variant === "full" ? "w-[80%] sm:w-[320px] md:w-1/4 cursor-pointer" : ""
              }`}
            >
              <div className="flex items-start gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-2xl bg-slate-900 text-base text-slate-50">
                  <span aria-hidden="true">{card.icon}</span>
                </div>
                <div className="space-y-1">
                  <p className="text-[11px] uppercase tracking-[0.18em] text-slate-400">
                    {card.label}
                  </p>
                  <h3 className="text-sm font-semibold text-slate-900">{card.title}</h3>
                </div>
              </div>

              <p className="mt-3 text-sm text-slate-600">{card.description}</p>

              {allowModal && (
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setOpenEmployerCardId(card.id);
                  }}
                  aria-label={`Open details for: ${card.title}`}
                  className="absolute bottom-4 right-4 inline-flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 bg-white text-lg font-medium text-slate-900 shadow-sm transition-colors group-hover:bg-slate-900 group-hover:text-slate-50"
                >
                  +
                </button>
              )}
            </article>
          ))}
        </div>

        {variant === "full" && (
          <div className="mt-6 sm:hidden">
            <Link
              href="/employers"
              className="inline-flex w-full items-center justify-center rounded-full bg-slate-900 px-5 py-2.5 text-sm font-medium text-slate-50 shadow-md shadow-slate-900/40 hover:bg-slate-800"
            >
              Talk to us about hiring
            </Link>
          </div>
        )}
      </div>

      {allowModal && activeEmployerCard && (
        <div className="fixed inset-0 z-40">
          <button
            type="button"
            onClick={() => setOpenEmployerCardId(null)}
            className="absolute inset-0 bg-white/70 backdrop-blur-xl active:cursor-pointer"
            aria-label="Close employer details overlay"
          />
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-white/80 via-white/40 to-white/70" />
          <div
            className="relative z-10 flex min-h-full items-center justify-center px-4"
            role="dialog"
            aria-modal="true"
            aria-labelledby="employer-modal-title"
          >
            <div className="relative w-full max-w-lg rounded-3xl bg-white p-6 shadow-xl sm:p-8">
              <button
                type="button"
                onClick={() => setOpenEmployerCardId(null)}
                className="absolute right-4 top-4 inline-flex h-8 w-8 items-center justify-center rounded-full bg-slate-100 text-slate-500 hover:bg-slate-200 hover:text-slate-700"
                aria-label="Close details"
              >
                ×
              </button>

              <p className="text-xs uppercase tracking-[0.18em] text-slate-400">
                {activeEmployerCard.label}
              </p>
              <h3
                id="employer-modal-title"
                className="mt-2 text-xl font-semibold text-slate-900 sm:text-2xl"
              >
                {activeEmployerCard.modalTitle}
              </h3>
              <p className="mt-3 whitespace-pre-line text-sm text-slate-600">
                {activeEmployerCard.modalBody}
              </p>

              <div className="mt-5 flex flex-wrap gap-3">
                <a
                  href="mailto:info@evolgrit.com?subject=Evolgrit%20for%20employers"
                  className="inline-flex items-center justify-center rounded-full bg-slate-900 px-4 py-2 text-sm font-medium text-slate-50 shadow-md shadow-slate-900/40 hover:bg-slate-800"
                >
                  Speak with an employer specialist
                </a>
                <button
                  type="button"
                  onClick={() => setOpenEmployerCardId(null)}
                  className="inline-flex items-center justify-center rounded-full border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
