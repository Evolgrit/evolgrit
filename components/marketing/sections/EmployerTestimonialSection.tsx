"use client";

import Image from "next/image";
import { employerStory } from "@/lib/data/marketingContent";

type EmployerTestimonialSectionProps = {
  id?: string;
};

export function EmployerTestimonialSection({ id = "tina-story" }: EmployerTestimonialSectionProps) {
  return (
    <section id={id} className="mx-auto mt-12 w-full max-w-5xl px-5 sm:px-6 lg:px-8">
      <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
        <div className="relative aspect-[16/9] sm:aspect-[21/9]">
          <Image
            src="/testimonial-tina.jpg"
            alt="Tina arbeitet mit Kindern in einem Kindergarten"
            fill
            className="object-cover"
            sizes="(min-width: 1024px) 832px, 100vw"
          />
        </div>
        <div className="p-6 sm:p-8">
          <p className="mb-2 text-xs uppercase tracking-[0.18em] text-slate-400">
            {employerStory.eyebrow}
          </p>
          <p className="mb-3 text-lg font-semibold text-slate-900 sm:text-xl">
            {employerStory.quoteHeadline}
          </p>
          <p className="mb-4 text-sm text-slate-600">{employerStory.body}</p>
          <div className="flex items-center gap-3 text-xs text-slate-500">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-100 text-sm font-semibold text-emerald-700">
              {employerStory.person.badge}
            </div>
            <div>
              <p className="font-semibold text-slate-700">{employerStory.person.name}</p>
              <p>{employerStory.person.title}</p>
            </div>
            <span className="ml-auto inline-flex items-center rounded-full bg-emerald-50 px-2 py-[2px] text-[11px] text-emerald-700">
              {employerStory.person.tag}
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
