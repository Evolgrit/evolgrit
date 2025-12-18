"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { createSupabaseBrowserClient } from "@/lib/supabase/browser";

export default function NewJourneyEvent() {
  const supabase = useMemo(() => createSupabaseBrowserClient(), []);
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [detail, setDetail] = useState("");
  const [eventDate, setEventDate] = useState("");
  const [state, setState] = useState<"idle" | "saving" | "error" | "success">("idle");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!title.trim()) {
      setErrorMsg("Please add a title.");
      return;
    }

    setState("saving");
    setErrorMsg(null);

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      setState("error");
      setErrorMsg("You need to be logged in.");
      return;
    }

    const payload = {
      user_id: user.id,
      title: title.trim(),
      detail: detail.trim() || null,
      event_date: eventDate || null,
      status: "recorded",
    };

    const { error } = await supabase.from("journey_events").insert(payload);

    if (error) {
      setState("error");
      setErrorMsg("Could not save. Please try again.");
      return;
    }

    setTitle("");
    setDetail("");
    setEventDate("");
    setState("success");
    router.refresh();
    setTimeout(() => setState("idle"), 2500);
  }

  return (
    <div className="rounded-3xl border border-slate-200 bg-slate-900 text-slate-50 p-5 shadow-sm">
      <p className="text-[11px] uppercase tracking-[0.18em] text-slate-300">
        Add a new moment
      </p>
      <h3 className="mt-1 text-lg font-semibold tracking-tight">
        Capture a quick win or learning.
      </h3>

      <form onSubmit={onSubmit} className="mt-4 space-y-3">
        <div>
          <label className="text-xs uppercase tracking-[0.18em] text-slate-300">
            Title
          </label>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="mt-1 w-full rounded-2xl border border-slate-700 bg-slate-800 px-3 py-2 text-sm text-slate-50 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-500"
            placeholder="e.g., First German-only parent chat"
            required
          />
        </div>

        <div>
          <label className="text-xs uppercase tracking-[0.18em] text-slate-300">
            Notes (optional)
          </label>
          <textarea
            value={detail}
            onChange={(e) => setDetail(e.target.value)}
            className="mt-1 w-full resize-none rounded-2xl border border-slate-700 bg-slate-800 px-3 py-2 text-sm text-slate-50 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-500"
            rows={3}
            placeholder="Why did this matter? What did you learn?"
          />
        </div>

        <div>
          <label className="text-xs uppercase tracking-[0.18em] text-slate-300">
            Date
          </label>
          <input
            type="date"
            value={eventDate}
            onChange={(e) => setEventDate(e.target.value)}
            className="mt-1 w-full rounded-2xl border border-slate-700 bg-slate-800 px-3 py-2 text-sm text-slate-50 focus:outline-none focus:ring-2 focus:ring-slate-500"
          />
        </div>

        {errorMsg && (
          <p className="text-xs text-rose-200">{errorMsg}</p>
        )}
        {state === "success" && (
          <p className="text-xs text-emerald-200">Saved to your journey.</p>
        )}

        <button
          type="submit"
          disabled={state === "saving"}
          className="w-full rounded-full bg-white/90 px-4 py-2 text-sm font-semibold text-slate-900 shadow-sm transition hover:bg-white disabled:opacity-70"
        >
          {state === "saving" ? "Saving…" : "Save moment"}
        </button>
      </form>
    </div>
  );
}
