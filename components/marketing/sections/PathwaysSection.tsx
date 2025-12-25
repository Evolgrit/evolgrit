"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { pathwaysCards } from "@/lib/data/marketingContent";

type PathwaysSectionProps = {
  id?: string;
};

export function PathwaysSection({ id = "pathways" }: PathwaysSectionProps) {
  const [activePathway, setActivePathway] =
    useState<(typeof pathwaysCards)[number] | null>(null);
  const pathwaysScrollRef = useRef<HTMLDivElement | null>(null);
  const [pathwaysEdges, setPathwaysEdges] = useState({ atStart: true, atEnd: false });

  useEffect(() => {
    const el = pathwaysScrollRef.current;
    if (!el) return;
    setPathwaysEdges({
      atStart: el.scrollLeft <= 8,
      atEnd: el.scrollLeft + el.clientWidth >= el.scrollWidth - 8,
    });
  }, []);

  return (
    <section id={id} className="mx-auto mt-24 w-full max-w-6xl px-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 className="text-3xl font-semibold text-slate-900 sm:text-[32px]">
            Unlock your future in Germany
          </h2>
          <p className="mt-2 max-w-2xl text-sm text-slate-600 sm:text-base">
            Turn your experience into a real life in Germany – with language, culture and job
            support on one Evolgrit journey.
          </p>
          <p className="mt-1 max-w-xl text-[13px] text-slate-500">
            Choose a pathway that fits your strengths. Evolgrit walks beside you from first words to
            your first working day.
          </p>
        </div>
        <div className="hidden items-center gap-3 text-sm sm:flex">
          <a href="#how-it-works" className="text-slate-500 hover:text-slate-900">
            Learn how Evolgrit works →
          </a>
        </div>
      </div>

      <div className="relative mt-6">
        <div className="relative -mx-5 px-5 sm:-mx-6 sm:px-6">
          <div
            ref={pathwaysScrollRef}
            className="flex gap-4 overflow-x-auto pb-4 snap-x snap-mandatory scrollbar-hide"
            onScroll={() => {
              const el = pathwaysScrollRef.current;
              if (!el) return;
              const { scrollLeft, scrollWidth, clientWidth } = el;
              setPathwaysEdges({
                atStart: scrollLeft <= 8,
                atEnd: scrollLeft + clientWidth >= scrollWidth - 8,
              });
            }}
          >
            {pathwaysCards.map((card) => (
              <article
                key={card.id}
                role="button"
                tabIndex={0}
                onClick={() => setActivePathway(card)}
                onKeyDown={(event) => {
                  if (event.key === "Enter" || event.key === " ") {
                    event.preventDefault();
                    setActivePathway(card);
                  }
                }}
                className="group relative flex w-[82%] shrink-0 snap-start flex-col overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm transition duration-200 hover:-translate-y-0.5 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-300 sm:w-[60%] md:w-[320px] lg:w-[340px] xl:w-[360px]"
              >
                <div className="relative aspect-[4/3]">
                  <Image
                    src={card.image}
                    alt={card.title}
                    fill
                    className="object-cover"
                    sizes="(min-width:1024px) 33vw, (min-width:768px) 50vw, 100vw"
                  />
                </div>
                <div className="flex flex-col gap-2 px-5 pb-5 pt-4">
                  <p className="text-[11px] uppercase tracking-[0.18em] text-slate-400">
                    {card.label}
                  </p>
                  <h3 className="text-base font-semibold leading-snug text-slate-900">
                    {card.title}
                  </h3>
                  <p className="text-sm leading-relaxed text-slate-600 line-clamp-3">
                    {card.description}
                  </p>
                  <div className="border-t border-slate-100 pt-2">
                    <span className="inline-flex items-center text-sm font-medium text-blue-600 group-hover:text-blue-700">
                      Learn more
                      <span className="ml-1 text-base" aria-hidden="true">
                        →
                      </span>
                    </span>
                  </div>
                </div>
              </article>
            ))}
          </div>

          <button
            type="button"
            onClick={() => {
              const el = pathwaysScrollRef.current;
              if (!el) return;
              el.scrollBy({ left: -el.clientWidth * 0.8, behavior: "smooth" });
            }}
            className={`hidden md:flex absolute left-6 top-1/2 -translate-y-1/2 h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-700 shadow-sm transition hover:bg-slate-50 ${
              pathwaysEdges.atStart ? "pointer-events-none opacity-0" : ""
            }`}
            aria-label="Scroll pathways left"
          >
            ←
          </button>
          <button
            type="button"
            onClick={() => {
              const el = pathwaysScrollRef.current;
              if (!el) return;
              el.scrollBy({ left: el.clientWidth * 0.8, behavior: "smooth" });
            }}
            className={`hidden md:flex absolute right-6 top-1/2 -translate-y-1/2 h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-700 shadow-sm transition hover:bg-slate-50 ${
              pathwaysEdges.atEnd ? "pointer-events-none opacity-0" : ""
            }`}
            aria-label="Scroll pathways right"
          >
            →
          </button>

          <div className="pointer-events-none absolute inset-y-4 left-0 hidden w-12 bg-gradient-to-r from-white/70 to-transparent lg:block" />
          <div className="pointer-events-none absolute inset-y-4 right-0 hidden w-12 bg-gradient-to-l from-white/70 to-transparent lg:block" />
        </div>
      </div>

      {activePathway && (
        <div className="fixed inset-0 z-40">
          <button
            type="button"
            onClick={() => setActivePathway(null)}
            className="absolute inset-0 bg-white/70 backdrop-blur-xl active:cursor-pointer"
            aria-label="Close pathways details overlay"
          />
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-white/80 via-white/40 to-white/70" />
          <div
            className="relative z-10 flex min-h-full items-center justify-center px-4"
            role="dialog"
            aria-modal="true"
            aria-labelledby="pathway-modal-title"
          >
            <div className="relative w-full max-w-xl rounded-3xl bg-white p-6 shadow-xl sm:p-8">
              <button
                type="button"
                onClick={() => setActivePathway(null)}
                className="absolute right-4 top-4 inline-flex h-8 w-8 items-center justify-center rounded-full bg-slate-100 text-slate-500 hover:bg-slate-200 hover:text-slate-700"
                aria-label="Close details"
              >
                ×
              </button>
              <p className="text-xs uppercase tracking-[0.18em] text-slate-400">
                {activePathway.label}
              </p>
              <h3
                id="pathway-modal-title"
                className="mt-2 text-xl font-semibold text-slate-900 sm:text-2xl"
              >
                {activePathway.title}
              </h3>
              <p className="mt-3 text-sm text-slate-600">{activePathway.description}</p>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
