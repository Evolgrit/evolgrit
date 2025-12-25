"use client";

type NextActionCardProps = {
  meta?: string;
  title: string;
  description: string;
  primaryLabel: string;
  primaryHref: string;
};

export function NextActionCard({
  meta,
  title,
  description,
  primaryLabel,
  primaryHref,
}: NextActionCardProps) {
  return (
    <article className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      {meta && (
        <p className="text-[11px] uppercase tracking-[0.18em] text-slate-400">{meta}</p>
      )}
      <h3 className="mt-1 text-xl font-semibold text-slate-900">{title}</h3>
      <p className="mt-1 text-sm text-slate-600 line-clamp-2">{description}</p>
      <a
        href={primaryHref}
        className="mt-4 inline-flex rounded-full bg-slate-900 px-5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-slate-800"
      >
        {primaryLabel} →
      </a>
    </article>
  );
}
