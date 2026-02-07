"use client";

import { useState } from "react";

declare const window: { alert?: (message?: string) => void } | undefined;

export function ContactedToggle({
  id,
  initial,
}: {
  id: string;
  initial: boolean;
}) {
  const [value, setValue] = useState(initial);
  const [busy, setBusy] = useState(false);

  async function toggle(next: boolean) {
    setBusy(true);
    setValue(next);

    const res = await fetch("/api/admin/contacted", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, contacted: next }),
    });

    if (!res.ok) {
      setValue(!next);
      if (typeof window !== "undefined" && typeof window.alert === "function") {
        window.alert("Update failed. Please try again.");
      }
    }

    setBusy(false);
  }

  return (
    <label className="inline-flex items-center gap-2">
      <input
        type="checkbox"
        checked={value}
        disabled={busy}
        onChange={(e) => {
          const target = e.target as { checked?: boolean };
          toggle(Boolean(target?.checked));
        }}
      />
      <span className="text-xs text-slate-500">
        {value ? "Contacted" : "Open"}
      </span>
    </label>
  );
}
