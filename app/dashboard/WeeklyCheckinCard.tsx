"use client";

import { useMemo, useState } from "react";

const moodLabels: Record<string, { label: string; emoji: string }> = {
  energized: { label: "Energized", emoji: "⚡️" },
  steady: { label: "Steady", emoji: "🌤️" },
  stretched: { label: "Stretched", emoji: "🌊" },
  tired: { label: "Tired", emoji: "🌙" },
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
    created_at: string | null;
    updated_at: string | null;
  };
};

export default function WeeklyCheckinCard({
  weeks,
  action,
  summaryFirst = false,
}: {
  weeks: WeekCheckin[];
  action: (formData: FormData) => Promise<void>;
  summaryFirst?: boolean;
}) {
  const currentWeek = useMemo(() => weeks.find((w) => w.isCurrent), [weeks]);
  const [selectedWeekStart, setSelectedWeekStart] = useState(
    currentWeek?.weekStart ?? weeks[0]?.weekStart ?? ""
  );
  const [editingCurrent, setEditingCurrent] = useState(false);
  const [showMoreWins, setShowMoreWins] = useState(false);
  const [showMoreBlockers, setShowMoreBlockers] = useState(false);

  const selectedWeek = weeks.find(
    (week) => week.weekStart === selectedWeekStart
  );
  const selectedCheckin = selectedWeek?.checkin;
  const showForm =
    selectedWeek?.isCurrent &&
    (editingCurrent || !selectedCheckin || !summaryFirst);

  function handleSelectWeek(weekStart: string, isCurrent: boolean) {
    setSelectedWeekStart(weekStart);
    if (!isCurrent) {
      setEditingCurrent(false);
    }
    setShowMoreWins(false);
    setShowMoreBlockers(false);
  }

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

      <div className="mt-3 flex snap-x snap-mandatory gap-2 overflow-x-auto pb-2">
        {weeks.map((week) => {
          const hasEntry = Boolean(week.checkin);
          const isSelected = week.weekStart === selectedWeekStart;
          return (
            <button
              key={week.weekStart}
              type="button"
              onClick={() => handleSelectWeek(week.weekStart, week.isCurrent)}
              className={`snap-center rounded-full px-3 py-1 text-xs font-semibold transition ${
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

      {selectedWeek && !selectedWeek.isCurrent && (
        <div className="mt-4 text-xs text-slate-500">
          Viewing week of {selectedWeek.label}.{" "}
          <button
            type="button"
            className="text-blue-600 hover:text-blue-700"
            onClick={() =>
              handleSelectWeek(
                currentWeek?.weekStart ?? weeks[0]?.weekStart ?? "",
                true
              )
            }
          >
            Back to current week →
          </button>
        </div>
      )}

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
                  {Object.entries(moodLabels).map(([value, m]) => (
                    <option key={value} value={value}>
                      {m.emoji} {m.label}
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
                      ? `${
                          moodLabels[selectedCheckin.mood]?.emoji ?? "•"
                        } ${
                          moodLabels[selectedCheckin.mood]?.label ??
                          selectedCheckin.mood
                        }`
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
                    {selectedCheckin.wins
                      ? showMoreWins
                        ? selectedCheckin.wins
                        : selectedCheckin.wins.slice(0, 120) +
                          (selectedCheckin.wins.length > 120 ? "…" : "")
                      : "No highlights shared."}
                  </p>
                  {selectedCheckin.wins &&
                    selectedCheckin.wins.length > 120 && (
                      <button
                        type="button"
                        className="mt-2 text-xs text-blue-600 hover:text-blue-700"
                        onClick={() => setShowMoreWins((prev) => !prev)}
                      >
                        {showMoreWins ? "Show less" : "Show more"}
                      </button>
                    )}
                </div>
                <div className="rounded-2xl border border-slate-100 bg-slate-50 px-4 py-3 text-sm">
                  <p className="text-xs uppercase tracking-[0.18em] text-slate-400">Blockers</p>
                  <p className="mt-1 text-slate-700">
                    {selectedCheckin.blockers
                      ? showMoreBlockers
                        ? selectedCheckin.blockers
                        : selectedCheckin.blockers.slice(0, 120) +
                          (selectedCheckin.blockers.length > 120 ? "…" : "")
                      : "No blockers noted."}
                  </p>
                  {selectedCheckin.blockers &&
                    selectedCheckin.blockers.length > 120 && (
                      <button
                        type="button"
                        className="mt-2 text-xs text-blue-600 hover:text-blue-700"
                        onClick={() => setShowMoreBlockers((prev) => !prev)}
                      >
                        {showMoreBlockers ? "Show less" : "Show more"}
                      </button>
                    )}
                </div>
              </div>
              <p className="text-xs text-slate-500">
                Saved{" "}
                {formatSubmitted(
                  selectedCheckin.updated_at ?? selectedCheckin.created_at
                )}
                .
              </p>
              <p className="text-xs text-emerald-600">Saved ✓</p>
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
