export const ui = {
  container: "mx-auto max-w-[1200px] px-4 sm:px-6 lg:px-8",
  sectionSpacing: "space-y-4",
  card: "rounded-3xl border border-slate-200 bg-white shadow-sm",
  cardPadding: "p-6",
  compactCardPadding: "p-5",
  text: {
    title: "text-2xl font-semibold text-slate-900",
    body: "text-sm text-slate-600",
    meta: "text-[11px] uppercase tracking-[0.18em] text-slate-400",
  },
  tone: {
    primary: "bg-slate-900 text-white",
    success: "bg-emerald-50 text-emerald-700 border border-emerald-200",
    warning: "bg-amber-50 text-amber-700 border border-amber-200",
  },
  pill: {
    active: "inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold bg-slate-900 text-white",
    inactive: "inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold bg-slate-100 text-slate-600",
  },
  badge: {
    success: "rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700",
    warning: "rounded-full border border-amber-200 bg-amber-50 px-3 py-1 text-xs font-semibold text-amber-700",
    primary: "rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-semibold text-slate-700",
  },
  progress: {
    track: "h-2 rounded-full bg-slate-100",
    fillPrimary: "h-full rounded-full bg-slate-900",
    fillSuccess: "h-full rounded-full bg-emerald-500",
    fillWarning: "h-full rounded-full bg-amber-500",
  },
  chat: {
    mentorBubble: "bg-slate-100 text-slate-800",
    userBubble: "bg-slate-900 text-white",
    input: "rounded-full border border-slate-200 bg-white px-4 py-2 text-sm text-slate-900 shadow-sm focus:outline-none focus:ring-2 focus:ring-slate-300",
    send: "rounded-full bg-slate-900 px-4 py-2 text-sm font-semibold text-white disabled:opacity-50",
  },
} as const;

