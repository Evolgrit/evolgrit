"use client";

import { useMemo, useState } from "react";

const moodLabels: Record<string, string> = {
  energized: "Energized",
  steady: "Steady",
  stretched: "Stretched",
  tired: "Tired",
};

export type WeekCheckin = {
  weekStart: string;
  label: string;
  isCurrent: boolean;
  checkin?: {
    mood: string | null;
    hours: number | null;
    wins: string | null;
    blockers: string | null;
    submitted_at: string | null;
  };
};

export default function WeeklyCheckinCard({
  weeks,
  action,
}: {
  weeks: WeekCheckin[];
  action: (formData: FormData) => Promise<void>;
}) {
  const currentWeek = useMemo(() => weeks.find((w) => w.isCurrent), [weeks]);
  const [selectedWeekStart, setSelectedWeekStart] = useState(
    currentWeek?.weekStart ?? (weeks[0]?.weekStart ?? "")
  );
  const [editingCurrent, setEditingCurrent] = useState(false);

  const selectedWeek = weeks.find((week) => week.weekStart === selectedWeekStart);
  const selectedCheckin = selectedWeek?.checkin;
  const showForm = selectedWeek?.isCurrent && (editingCurrent || !selectedCheckin);

  function formatSubmitted(date?: string | null) {
    if (!date) return "Just now";
    const d = new Date(date);
    return d.toLocaleString(undefined, {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  }

  return (
    <article className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
      <p className="text-xs uppercase tracking-[0.18em] text-slate-400">
        Weekly check-in · {selectedWeek?.label}
      </p>

      <div className="mt-3 flex flex-wrap gap-2">
        {weeks.map((week) => {
          const hasEntry = Boolean(week.checkin);
          const isSelected = week.weekStart === selectedWeekStart;
          return (
            <button
              key={week.weekStart}
              type="button"
              onClick={() => {
                setSelectedWeekStart(week.weekStart);
                if (!week.isCurrent) {
                  setEditingCurrent(false);
                }
              }}
              className={`rounded-full px-3 py-1 text-xs font-semibold transition ${
                isSelected
                  ? "bg-slate-900 text-white"
                  : hasEntry
                  ? "border border-slate-300 bg-white text-slate-900"
                  : "border border-dashed border-slate-300 text-slate-500"
              }`}
            >
              {week.label}
            </button>
          );
        })}
      </div>

      {showForm ? (
        <form action={action} className="mt-5 space-y-4">
          <input type="hidden" name="weekStart" value={selectedWeekStart} />
          <p className="text-sm text-slate-600">
            Takes 30 seconds. Mentors use this to understand your energy.
          </p>
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-900">Mood</label>
            <select
              name="mood"
              defaultValue={selectedCheckin?.mood ?? ""}
              required
              className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-900 shadow-sm focus:outline-none focus:ring-2 focus:ring-slate-300"
            >
              <option value="">Select mood…</option>
              {Object.entries(moodLabels).map(([value, label]) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </select>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-900">
              Focus hours (optional)
            </label>
            <input
              type="number"
              name="hours"
              min="0"
              step="0.5"
              defaultValue={selectedCheckin?.hours ?? ""}
              className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-900 shadow-sm focus:outline-none focus:ring-2 focus:ring-slate-300"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-900">Wins</label>
            <textarea
              name="wins"
              rows={2}
              defaultValue={selectedCheckin?.wins ?? ""}
              className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-900 shadow-sm focus:outline-none focus:ring-2 focus:ring-slate-300"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-900">Blockers</label>
            <textarea
              name="blockers"
              rows={2}
              defaultValue={selectedCheckin?.blockers ?? ""}
              className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-900 shadow-sm focus:outline-none focus:ring-2 focus:ring-slate-300"
            />
          </div>
          <div className="flex flex-wrap gap-3">
            <button
              type="submit"
              className="inline-flex flex-1 items-center justify-center rounded-full bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-slate-800"
            >
              Save check-in
            </button>
            {selectedCheckin && (
              <button
                type="button"
                onClick={() => setEditingCurrent(false)}
                className="inline-flex flex-1 items-center justify-center rounded-full border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-900 hover:border-slate-300"
              >
                Cancel
              </button>
            )}
          </div>
        </form>
      ) : (
        <div className="mt-5 space-y-4">
          {selectedCheckin ? (
            <>
              <div className="grid gap-3 sm:grid-cols-2">
                <div className="rounded-2xl border border-slate-100 bg-slate-50 px-4 py-3 text-sm">
                  <p className="text-xs uppercase tracking-[0.18em] text-slate-400">
                    Mood
                  </p>
                  <p className="mt-1 text-slate-900 font-semibold">
                    {selectedCheckin.mood
                      ? moodLabels[selectedCheckin.mood] ?? selectedCheckin.mood
                      : "—"}
                  </p>
                </div>
                <div className="rounded-2xl border border-slate-100 bg-slate-50 px-4 py-3 text-sm">
                  <p className="text-xs uppercase tracking-[0.18em] text-slate-400">
                    Focus hours
                  </p>
                  <p className="mt-1 text-slate-900 font-semibold">
                    {selectedCheckin.hours ?? "—"}
                  </p>
                </div>
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                <div className="rounded-2xl border border-slate-100 bg-slate-50 px-4 py-3 text-sm">
                  <p className="text-xs uppercase tracking-[0.18em] text-slate-400">Wins</p>
                  <p className="mt-1 text-slate-700">
                    {selectedCheckin.wins || "No highlights shared."}
                  </p>
                </div>
                <div className="rounded-2xl border border-slate-100 bg-slate-50 px-4 py-3 text-sm">
                  <p className="text-xs uppercase tracking-[0.18em] text-slate-400">Blockers</p>
                  <p className="mt-1 text-slate-700">
                    {selectedCheckin.blockers || "No blockers noted."}
                  </p>
                </div>
              </div>
              <p className="text-xs text-slate-500">
                Saved {formatSubmitted(selectedCheckin.submitted_at)}.
              </p>
              {selectedWeek?.isCurrent && (
                <button
                  type="button"
                  onClick={() => setEditingCurrent(true)}
                  className="rounded-full border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-900 hover:border-slate-400"
                >
                  Edit check-in
                </button>
              )}
            </>
          ) : (
            <p className="text-sm text-slate-500">
              No check-in for this week yet.
            </p>
          )}
        </div>
      )}
    </article>
  );
}
