"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

type CandidateRow = {
  learner_id: string;
  full_name: string | null;
  german_level: string | null;
  target_roles: string[] | null;
  readiness_score: number | null;
  modules_completed: number | null;
  modules_total: number | null;
  last_checkin_week: string | null;
  documents_count: number | null;
  saved?: boolean;
  saved_at?: string | null;
  interested?: boolean;
  interested_at?: string | null;
  intro_requested?: boolean;
  intro_requested_at?: string | null;
};

const readinessPresets = [30, 50, 70];
const actionFilters = ["all", "saved", "interested", "intro_requested"] as const;
const germanLevels = ["A1", "A2", "B1", "B2", "C1", "C2"];

type ActionFilter = (typeof actionFilters)[number];

export default function EmployerCandidatesClient() {
  const [candidates, setCandidates] = useState<CandidateRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [minReadiness, setMinReadiness] = useState<number | null>(null);
  const [germanFilter, setGermanFilter] = useState<string>("");
  const [actionFilter, setActionFilter] = useState<ActionFilter>("all");

  useEffect(() => {
    async function load() {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch("/api/employer/candidates", { cache: "no-store" });
        if (!res.ok) {
          const body = await res.json().catch(() => ({ error: "Unable to load" }));
          throw new Error(body.error || "Unable to load candidates");
        }
        const data = await res.json();
        setCandidates(Array.isArray(data.candidates) ? data.candidates : []);
      } catch (err) {
        const message = err instanceof Error ? err.message : "Unable to load candidates";
        setError(message);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const filtered = useMemo(() => {
    return candidates.filter((candidate) => {
      const score = candidate.readiness_score ?? 0;
      if (minReadiness !== null && score < minReadiness) return false;
      if (germanFilter && (candidate.german_level ?? "").toUpperCase() !== germanFilter)
        return false;
      if (actionFilter === "saved" && !candidate.saved) return false;
      if (actionFilter === "interested" && !candidate.interested) return false;
      if (actionFilter === "intro_requested" && !candidate.intro_requested) return false;
      return true;
    });
  }, [candidates, minReadiness, germanFilter, actionFilter]);

  return (
    <div className="mx-auto max-w-[1200px] px-4 sm:px-6 lg:px-8">
      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <p className="text-[11px] uppercase tracking-[0.18em] text-slate-400">Candidates</p>
        <h1 className="mt-2 text-2xl font-semibold text-slate-900">Candidates ready for onboarding</h1>
        <p className="mt-2 text-sm text-slate-600">
          Readiness signals to coordinate onboarding.
        </p>

      <div className="mt-6 flex flex-wrap gap-3">
        <fieldset className="rounded-2xl border border-slate-200 px-3 py-2">
          <legend className="text-xs text-slate-500">Min readiness</legend>
          <div className="mt-2 flex gap-2">
            {readinessPresets.map((preset) => (
              <button
                key={preset}
                type="button"
                onClick={() => setMinReadiness((current) => (current === preset ? null : preset))}
                className={`rounded-full px-3 py-1 text-sm ${
                  minReadiness === preset
                    ? "bg-slate-900 text-white"
                    : "bg-slate-100 text-slate-600"
                }`}
              >
                {preset}%
              </button>
            ))}
          </div>
        </fieldset>

        <label className="rounded-2xl border border-slate-200 px-3 py-2 text-xs text-slate-500">
          German level
          <select
            value={germanFilter}
            onChange={(e) => setGermanFilter(e.target.value)}
            className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-1 text-sm text-slate-900"
          >
            <option value="">All</option>
            {germanLevels.map((level) => (
              <option key={level} value={level}>
                {level}
              </option>
            ))}
          </select>
        </label>

        <fieldset className="rounded-2xl border border-slate-200 px-3 py-2">
          <legend className="text-xs text-slate-500">Actions</legend>
          <div className="mt-2 flex flex-wrap gap-2">
            {actionFilters.map((filter) => (
              <button
                key={filter}
                type="button"
                onClick={() => setActionFilter(filter)}
                className={`rounded-full px-3 py-1 text-sm capitalize ${
                  actionFilter === filter
                    ? "bg-slate-900 text-white"
                    : "bg-slate-100 text-slate-600"
                }`}
              >
                {filter === "all" ? "All" : filter.replace("_", " ")}
              </button>
            ))}
          </div>
        </fieldset>
      </div>

        {loading && <p className="mt-6 text-sm text-slate-500">Loading candidates…</p>}
        {error && (
          <p className="mt-6 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-2 text-sm text-rose-700">
            {error}
          </p>
        )}

        {!loading && !error && filtered.length === 0 && (
          <p className="mt-6 text-sm text-slate-500">No candidates yet.</p>
        )}

        <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
          {filtered.map((candidate) => {
            if (!candidate.learner_id) return null;
            return (
              <Link
                key={candidate.learner_id}
                href={`/employer/candidates/${candidate.learner_id}`}
                className="flex h-full flex-col rounded-3xl border border-slate-200 p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
              >
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-semibold text-slate-900">
                    {candidate.full_name || "Candidate"}
                  </h2>
                  <p className="text-sm text-slate-500">
                    German level: {candidate.german_level || "—"}
                  </p>
                  <div className="mt-2 flex flex-wrap gap-2 text-xs">
                    {candidate.saved && (
                      <span className="rounded-full bg-slate-900/5 px-2 py-1 text-slate-700">
                        Saved
                      </span>
                    )}
                    {candidate.interested && (
                      <span className="rounded-full bg-amber-100 px-2 py-1 text-amber-700">
                        Interested
                      </span>
                    )}
                    {candidate.intro_requested && (
                      <span className="rounded-full bg-emerald-100 px-2 py-1 text-emerald-700">
                        Intro requested
                      </span>
                    )}
                  </div>
                </div>
                  <div className="text-right">
                    <p className="text-[11px] uppercase tracking-[0.18em] text-slate-400">Readiness</p>
                    <p className="text-xl font-semibold text-slate-900">
                      {candidate.readiness_score ?? 0}%
                    </p>
                    <div className="mt-1 h-1.5 w-28 rounded-full bg-slate-100">
                      <div
                        className="h-1.5 rounded-full bg-emerald-500"
                        style={{ width: `${Math.min(candidate.readiness_score ?? 0, 100)}%` }}
                      />
                    </div>
                  </div>
                </div>

                <div className="mt-3 flex flex-wrap gap-1">
                  {(candidate.target_roles ?? []).map((role) => (
                    <span
                      key={role}
                      className="rounded-full bg-slate-100 px-3 py-1 text-xs text-slate-700"
                    >
                      {role}
                    </span>
                  ))}
                  {(!candidate.target_roles || candidate.target_roles.length === 0) && (
                    <span className="text-xs text-slate-500">No target roles set</span>
                  )}
                </div>

                <dl className="mt-4 grid grid-cols-2 gap-3 text-sm text-slate-600">
                  <div>
                    <dt className="text-xs uppercase tracking-[0.18em] text-slate-400">Modules</dt>
                    <dd className="font-medium text-slate-900">
                      {candidate.modules_completed ?? 0}/{candidate.modules_total ?? 0}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-xs uppercase tracking-[0.18em] text-slate-400">Last check-in</dt>
                    <dd>
                      {candidate.last_checkin_week
                        ? new Date(candidate.last_checkin_week).toLocaleDateString()
                        : "No check-in yet"}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-xs uppercase tracking-[0.18em] text-slate-400">Documents</dt>
                    <dd>{candidate.documents_count ?? 0}</dd>
                  </div>
                </dl>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
