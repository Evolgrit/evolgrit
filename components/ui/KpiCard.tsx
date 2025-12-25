"use client";

import type { ReactNode } from "react";

type Tone = "neutral" | "blue" | "green" | "amber" | "violet";

const toneMap: Record<
  Tone,
  {
    iconBg: string;
    iconText: string;
    progress: string;
  }
> = {
  neutral: {
    iconBg: "bg-slate-100",
    iconText: "text-slate-600",
    progress: "bg-slate-900",
  },
  blue: {
    iconBg: "bg-blue-50",
    iconText: "text-blue-600",
    progress: "bg-blue-600",
  },
  green: {
    iconBg: "bg-emerald-50",
    iconText: "text-emerald-600",
    progress: "bg-emerald-600",
  },
  amber: {
    iconBg: "bg-amber-50",
    iconText: "text-amber-600",
    progress: "bg-amber-500",
  },
  violet: {
    iconBg: "bg-violet-50",
    iconText: "text-violet-600",
    progress: "bg-violet-600",
  },
};

export type KpiCardProps = {
  label: string;
  valueMain: string | number;
  valueSub?: string;
  statusText?: string;
  tone?: Tone;
  icon?: ReactNode;
  progress?: number;
  ctaLabel?: string;
  ctaHref?: string;
  className?: string;
};

export function KpiCard({
  label,
  valueMain,
  valueSub,
  statusText,
  tone = "neutral",
  icon,
  progress,
  ctaLabel,
  ctaHref,
  className,
}: KpiCardProps) {
  const colors = toneMap[tone];
  const clampedProgress =
    typeof progress === "number"
      ? `${Math.min(Math.max(progress, 0), 1) * 100}%`
      : undefined;

  return (
    <div
      className={`relative w-full min-w-0 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm ${className ?? ""}`}
    >
      {icon && (
        <div
          className={`absolute right-5 top-5 flex h-10 w-10 items-center justify-center rounded-full ${colors.iconBg}`}
        >
          <span className={`${colors.iconText}`}>{icon}</span>
        </div>
      )}

      <p className="text-xs uppercase tracking-wide text-slate-500">{label}</p>

      <div className="mt-2 flex items-baseline gap-1">
        <span className="text-4xl font-semibold text-slate-900">{valueMain}</span>
        {valueSub && <span className="text-lg text-slate-400">{valueSub}</span>}
        {statusText && <span className="ml-2 text-sm text-slate-500">{statusText}</span>}
      </div>

      {clampedProgress && (
        <div className="mt-4 h-2 w-full rounded-full bg-slate-100">
          <div
            className={`h-2 rounded-full transition-all ${colors.progress}`}
            style={{ width: clampedProgress }}
          />
        </div>
      )}

      {ctaLabel && ctaHref && (
        <a
          href={ctaHref}
          className="mt-4 inline-flex items-center gap-2 text-sm font-medium text-blue-600 hover:underline"
        >
          {ctaLabel} <span aria-hidden>→</span>
        </a>
      )}
    </div>
  );
}
