"use client";

import { useEffect, useMemo, useState } from "react";

type WaitlistCountResponse = {
  count: number;
  source: "supabase" | "fallback";
};

function getInitialFallbackCount() {
  const raw = process.env.NEXT_PUBLIC_WAITLIST_FALLBACK_COUNT;
  const parsed = raw ? Number.parseInt(raw, 10) : Number.NaN;
  if (Number.isFinite(parsed) && parsed >= 0) return parsed;
  return process.env.NODE_ENV === "production" ? 0 : 1247;
}

function formatCount(count: number) {
  return new Intl.NumberFormat("en-US").format(count);
}

export function WaitlistCounter() {
  const [count, setCount] = useState(getInitialFallbackCount);

  useEffect(() => {
    let cancelled = false;

    fetch("/api/waitlist/count", { cache: "no-store" })
      .then((res) => (res.ok ? res.json() : null))
      .then((data: WaitlistCountResponse | null) => {
        if (cancelled || !data || typeof data.count !== "number") return;
        setCount(data.count);
      })
      .catch(() => {});

    return () => {
      cancelled = true;
    };
  }, []);

  const text = useMemo(() => {
    if (count <= 0) return "Join the EVOLGRIT private beta waitlist";
    return `Join ${formatCount(count)} people on the waitlist`;
  }, [count]);

  return (
    <div className="flex flex-wrap items-center gap-2 text-sm text-slate-600">
      <span className="inline-flex h-2 w-2 rounded-full bg-emerald-500" />
      <span className="font-medium text-slate-700">{text}</span>
      <span className="text-slate-300">·</span>
      <span>Private beta 2026</span>
    </div>
  );
}
