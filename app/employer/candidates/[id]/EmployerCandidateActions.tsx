"use client";

import { useState } from "react";

type ActionType = "saved" | "interested" | "intro_requested";

type ExistingAction = {
  action: ActionType;
  created_at: string | null;
};

const actionMeta: Record< ActionType, {
  label: string;
  helper: string;
}> = {
  saved: {
    label: "Save candidate",
    helper: "Add to your list for later review.",
  },
  interested: {
    label: "Mark as interested",
    helper: "Signals interest to Evolgrit.",
  },
  intro_requested: {
    label: "Request intro",
    helper: "Ask Evolgrit for an introduction.",
  },
};

export default function EmployerCandidateActions({
  learnerId,
  initialActions,
}: {
  learnerId: string;
  initialActions: ExistingAction[];
}) {
  const [performed, setPerformed] = useState(() =>
    new Map(initialActions.map((action) => [action.action, action.created_at]))
  );
  const [status, setStatus] = useState<string | null>(null);
  const [loadingAction, setLoadingAction] = useState<ActionType | null>(null);

  async function handleAction(action: ActionType) {
    if (performed.get(action)) return;
    setLoadingAction(action);
    setStatus(null);
    try {
      const res = await fetch(`/api/employer/candidates/${learnerId}/actions`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action }),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({ error: "Unable to save" }));
        throw new Error(body.error || "Unable to save action");
      }
      setPerformed((prev) => {
        const next = new Map(prev);
        next.set(action, new Date().toISOString());
        return next;
      });
      setStatus(`${actionMeta[action].label} saved.`);
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Unable to save action";
      setStatus(message);
    } finally {
      setLoadingAction(null);
    }
  }

  return (
    <article className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-[11px] uppercase tracking-[0.18em] text-slate-400">
            Actions
          </p>
          <h3 className="text-lg font-semibold text-slate-900">
            Coordinate your next step
          </h3>
          <p className="text-sm text-slate-600">
            These actions stay private to your team.
          </p>
        </div>
      </div>
      <div className="mt-4 grid gap-3 md:grid-cols-3">
        {(Object.keys(actionMeta) as ActionType[]).map((action) => {
          const meta = actionMeta[action];
          const doneAt = performed.get(action);
          return (
            <button
              key={action}
              type="button"
              disabled={Boolean(doneAt) || loadingAction === action}
              onClick={() => handleAction(action)}
              className={`rounded-2xl border border-slate-200 px-4 py-3 text-left shadow-sm transition ${
                doneAt
                  ? "bg-emerald-50 text-emerald-700"
                  : "bg-white text-slate-900 hover:-translate-y-0.5"
                }`}
            >
              <p className="text-sm font-semibold">
                {doneAt ? `✓ ${meta.label}` : meta.label}
              </p>
              <p className="text-xs text-slate-500">
                {doneAt ? `Saved ${new Date(doneAt).toLocaleDateString()}` : meta.helper}
              </p>
            </button>
          );
        })}
      </div>
      {status && (
        <p className="mt-4 text-xs text-slate-500">{status}</p>
      )}
    </article>
  );
}
