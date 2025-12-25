"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { journeyCards } from "@/lib/data/marketingContent";

export function ExampleJourneysSection() {
  const journeysScrollRef = useRef<HTMLDivElement | null>(null);
  const journeyDragState = useRef({
    isDragging: false,
    startX: 0,
    scrollLeft: 0,
  });
  const [journeysEdges, setJourneysEdges] = useState({ atStart: true, atEnd: false });

  useEffect(() => {
    const el = journeysScrollRef.current;
    if (!el) return;
    setJourneysEdges({
      atStart: el.scrollLeft <= 8,
      atEnd: el.scrollLeft + el.clientWidth >= el.scrollWidth - 8,
    });
  }, []);

  return (
    <section
      aria-labelledby="example-journeys-heading"
      className="mx-auto w-full max-w-6xl px-4 py-16 lg:px-6"
    >
      <div className="mb-8 text-center">
        <h2
          id="example-journeys-heading"
          className="text-2xl font-semibold tracking-tight text-slate-900 sm:text-3xl"
        >
          Example journeys with Evolgrit.
        </h2>
        <p className="mt-2 mx-auto max-w-2xl text-sm text-slate-500">
          These stories are typical paths – not promises. They show how language, culture and work
          can grow together over 6–12 months.
        </p>
      </div>

      <div className="relative -mx-5 px-5 sm:-mx-6 sm:px-6">
        <div
          ref={journeysScrollRef}
          className="flex cursor-grab gap-4 overflow-x-auto snap-x snap-mandatory pb-4 scrollbar-hide"
          onMouseDown={(event) => {
            const el = journeysScrollRef.current;
            if (!el) return;
            journeyDragState.current.isDragging = true;
            journeyDragState.current.startX = event.pageX - el.offsetLeft;
            journeyDragState.current.scrollLeft = el.scrollLeft;
          }}
          onMouseMove={(event) => {
            const el = journeysScrollRef.current;
            if (!el || !journeyDragState.current.isDragging) return;
            event.preventDefault();
            const x = event.pageX - el.offsetLeft;
            el.scrollLeft =
              journeyDragState.current.scrollLeft - (x - journeyDragState.current.startX) * 1.2;
          }}
          onMouseUp={() => {
            journeyDragState.current.isDragging = false;
          }}
          onMouseLeave={() => {
            journeyDragState.current.isDragging = false;
          }}
          onScroll={() => {
            const el = journeysScrollRef.current;
            if (!el) return;
            const { scrollLeft, scrollWidth, clientWidth } = el;
            setJourneysEdges({
              atStart: scrollLeft <= 8,
              atEnd: scrollLeft + clientWidth >= scrollWidth - 8,
            });
          }}
        >
          {journeyCards.map((card) => (
            <article
              key={card.id}
              className="relative flex w-[82%] shrink-0 snap-start flex-col overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm transition duration-200 hover:-translate-y-0.5 hover:shadow-md cursor-pointer sm:w-[60%] md:w-[320px] lg:w-[340px] xl:w-[360px]"
            >
              <Link
                href="/learner-journey"
                className="absolute inset-0 z-10"
                aria-label={`Learn more about ${card.name}'s journey`}
              />
              <div className="relative aspect-[4/3]">
                <Image
                  src={card.image}
                  alt={`${card.name} – ${card.route}`}
                  fill
                  className="object-cover"
                  sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
                />
              </div>

              <div className="relative z-20 flex flex-col gap-2 px-5 pb-5 pt-4">
                <p className="text-[11px] uppercase tracking-[0.18em] text-slate-400">
                  <span className="mr-1">{card.flag}</span>
                  {card.country}
                </p>
                <h3 className="text-sm font-semibold leading-snug text-slate-900">
                  {card.name} · {card.age} · from {card.country} → {card.route}
                </h3>
                <p className="text-xs text-slate-600">{card.short}</p>
                <p className="text-xs text-slate-600">{card.result}</p>
                <div className="border-t border-slate-100 pt-2">
                  <span className="inline-flex items-center text-sm font-medium text-blue-600">
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
            const el = journeysScrollRef.current;
            if (!el) return;
            el.scrollBy({ left: -el.clientWidth * 0.8, behavior: "smooth" });
          }}
          className={`hidden md:flex absolute left-6 top-1/2 -translate-y-1/2 h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-700 shadow-sm transition hover:bg-slate-50 ${
            journeysEdges.atStart ? "pointer-events-none opacity-0" : ""
          }`}
          aria-label="Scroll journeys left"
        >
          ←
        </button>
        <button
          type="button"
          onClick={() => {
            const el = journeysScrollRef.current;
            if (!el) return;
            el.scrollBy({ left: el.clientWidth * 0.8, behavior: "smooth" });
          }}
          className={`hidden md:flex absolute right-6 top-1/2 -translate-y-1/2 h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-700 shadow-sm transition hover:bg-slate-50 ${
            journeysEdges.atEnd ? "pointer-events-none opacity-0" : ""
          }`}
          aria-label="Scroll journeys right"
        >
          →
        </button>

        <div className="pointer-events-none absolute inset-y-4 left-0 hidden w-12 bg-gradient-to-r from-white/70 to-transparent lg:block" />
        <div className="pointer-events-none absolute inset-y-4 right-0 hidden w-12 bg-gradient-to-l from-white/70 to-transparent lg:block" />
      </div>

      <p className="mt-4 text-center text-[11px] text-slate-400">
        These are illustrative stories based on typical learner profiles. Actual outcomes depend on
        each person&apos;s situation and effort.
      </p>
    </section>
  );
}
