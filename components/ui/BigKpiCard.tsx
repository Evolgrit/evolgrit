"use client";

type Tone = "neutral" | "blue" | "green" | "amber" | "violet";

type ToneStyle = {
  bg: string;
  label: string;
  value: string;
};

const toneStyles: Record<Tone, ToneStyle & { accent: string }> = {
  neutral: {
    bg: "bg-slate-100 border border-slate-200",
    label: "text-slate-600",
    value: "text-slate-900",
    accent: "text-slate-400",
  },
  blue: {
    bg: "bg-blue-50 border border-blue-100",
    label: "text-blue-700",
    value: "text-blue-900",
    accent: "text-blue-300",
  },
  green: {
    bg: "bg-emerald-50 border border-emerald-100",
    label: "text-emerald-700",
    value: "text-emerald-900",
    accent: "text-emerald-300",
  },
  amber: {
    bg: "bg-amber-50 border border-amber-100",
    label: "text-amber-700",
    value: "text-amber-900",
    accent: "text-amber-300",
  },
  violet: {
    bg: "bg-violet-50 border border-violet-100",
    label: "text-violet-700",
    value: "text-violet-900",
    accent: "text-violet-300",
  },
};

type BigKpiCardProps = {
  label: string;
  value: string;
  sublabel?: string;
  tone?: Tone;
  watermark?: string;
  chips?: string[];
  footer?: string;
};

const cx = (...classes: (string | false | undefined)[]) =>
  classes.filter(Boolean).join(" ");

export function BigKpiCard({
  label,
  value,
  sublabel,
  tone = "neutral",
  watermark,
  chips,
  footer,
}: BigKpiCardProps) {
  const style = toneStyles[tone];

  const [mainValue, fraction] = value.includes("/")
    ? value.split("/")
    : [value, ""];

  return (
    <article
      className={cx(
        "relative rounded-3xl p-6 min-h-[190px] shadow-sm w-full",
        style.bg
      )}
    >
      {watermark && (
        <span
          className={cx(
            "pointer-events-none select-none absolute -right-4 top-4 text-[120px] font-semibold leading-none opacity-10",
            style.value
          )}
          aria-hidden="true"
        >
          {watermark}
        </span>
      )}
      <div className="relative z-10 flex flex-col gap-3">
        <div>
          <p className={cx("text-sm font-medium", style.label)}>{label}</p>
          {sublabel && <p className="text-xs text-slate-500">{sublabel}</p>}
        </div>
        <div className="flex items-baseline gap-1">
          <span
            className={cx(
              "break-words whitespace-normal text-3xl sm:text-4xl lg:text-[42px] font-semibold leading-none",
              style.value
            )}
          >
            {mainValue}
          </span>
          {fraction && (
            <span className="text-2xl font-semibold text-slate-400">
              /{fraction}
            </span>
          )}
        </div>
        {chips && chips.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {chips.map((chip) => (
              <span
                key={chip}
                className="rounded-full border border-white/50 bg-white/70 px-3 py-1 text-xs font-medium text-slate-700"
              >
                {chip}
              </span>
            ))}
          </div>
        )}
        {footer && <p className="text-xs text-slate-500">{footer}</p>}
      </div>
    </article>
  );
}
