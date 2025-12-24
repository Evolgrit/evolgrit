import Link from "next/link";
import { cookies, headers } from "next/headers";
import { notFound } from "next/navigation";

async function loadCandidate(id: string) {
  const cookieStore = cookies();
  const headerStore = headers();
  const protocol = headerStore.get("x-forwarded-proto") || "http";
  const host = headerStore.get("x-forwarded-host") || headerStore.get("host");
  const baseUrl = host ? `${protocol}://${host}` : "http://localhost:3000";

  const cookieHeader = cookieStore
    .getAll()
    .map((cookie) => `${cookie.name}=${cookie.value}`)
    .join("; ");

  const res = await fetch(`${baseUrl}/api/employer/candidates/${id}`, {
    headers: cookieHeader ? { Cookie: cookieHeader } : undefined,
    cache: "no-store",
  });

  if (res.status === 404) {
    notFound();
  }

  if (!res.ok) {
    throw new Error("Unable to load candidate");
  }

  return res.json();
}

function formatDate(value: string | null | undefined) {
  if (!value) return "—";
  try {
    return new Date(value).toLocaleDateString();
  } catch {
    return value;
  }
}

export default async function EmployerCandidateDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const data = await loadCandidate(params.id);
  const candidate = data.candidate;
  const checkins = (data.checkins ?? []) as Array<{
    week_start: string;
    mood: string | null;
    hours: number | null;
    wins: string | null;
    blockers: string | null;
  }>;
  const modules = data.modules as { completed: number; total: number };

  return (
    <div className="space-y-6">
      <Link
        href="/employer/matches"
        className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-slate-900"
      >
        ← Back to candidates
      </Link>

      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <p className="text-[11px] uppercase tracking-[0.18em] text-slate-400">Candidate</p>
        <h1 className="mt-2 text-2xl font-semibold text-slate-900">
          {candidate.full_name || "Candidate"}
        </h1>
        <p className="mt-2 text-sm text-slate-600">
          Readiness signals and progress.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <article className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-[11px] uppercase tracking-[0.18em] text-slate-400">Readiness</p>
          <p className="mt-2 text-3xl font-semibold text-slate-900">
            {candidate.readiness_score ?? 0}%
          </p>
          <div className="mt-2 h-2 rounded-full bg-slate-100">
            <div
              className="h-2 rounded-full bg-emerald-500"
              style={{ width: `${Math.min(candidate.readiness_score ?? 0, 100)}%` }}
            />
          </div>
          <p className="mt-2 text-sm text-slate-500">
            Signals combine language, weekly momentum and documents.
          </p>
        </article>

        <article className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-[11px] uppercase tracking-[0.18em] text-slate-400">German level</p>
          <p className="mt-2 text-xl font-semibold text-slate-900">
            {candidate.german_level || "—"}
          </p>
          <p className="mt-1 text-sm text-slate-500">Placed based on onboarding snapshot.</p>
        </article>

        <article className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-[11px] uppercase tracking-[0.18em] text-slate-400">Modules</p>
          <p className="mt-2 text-xl font-semibold text-slate-900">
            {modules.completed}/{modules.total}
          </p>
          <p className="mt-1 text-sm text-slate-500">
            Completed learning blocks.
          </p>
        </article>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <article className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-[11px] uppercase tracking-[0.18em] text-slate-400">Last check-in</p>
          <p className="mt-2 text-xl font-semibold text-slate-900">
            {formatDate(candidate.last_checkin_week)}
          </p>
          <p className="mt-1 text-sm text-slate-500">
            Weekly mood + wins help us coordinate readiness.
          </p>
        </article>

        <article className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-[11px] uppercase tracking-[0.18em] text-slate-400">Documents</p>
          <p className="mt-2 text-xl font-semibold text-slate-900">
            {candidate.documents_count ?? 0}
          </p>
          <p className="mt-1 text-sm text-slate-500">Uploaded paperwork ready for onboarding.</p>
        </article>
      </div>

      {candidate.target_roles && candidate.target_roles.length > 0 && (
        <article className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-[11px] uppercase tracking-[0.18em] text-slate-400">Target roles</p>
          <div className="mt-3 flex flex-wrap gap-2">
            {candidate.target_roles.map((role: string) => (
              <span
                key={role}
                className="rounded-full bg-slate-100 px-3 py-1 text-sm text-slate-700"
              >
                {role}
              </span>
            ))}
          </div>
        </article>
      )}

      <article className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-[11px] uppercase tracking-[0.18em] text-slate-400">
              Weekly check-ins
            </p>
            <p className="text-sm text-slate-500">Last 6 weeks</p>
          </div>
        </div>
        <div className="mt-4 space-y-3">
          {checkins.length === 0 && (
            <p className="text-sm text-slate-500">No check-ins yet.</p>
          )}
          {checkins.map((checkin) => (
            <div
              key={`${checkin.week_start}-${checkin.created_at}`}
              className="rounded-2xl border border-slate-100 bg-slate-50 px-4 py-3"
            >
              <div className="flex flex-wrap justify-between text-sm">
                <strong className="text-slate-900">
                  {formatDate(checkin.week_start)}
                </strong>
                <span className="text-slate-500">Mood: {checkin.mood || "—"}</span>
              </div>
              <p className="mt-1 text-xs text-slate-500">
                Focus hours: {checkin.hours ?? "—"}
              </p>
              <p className="mt-1 text-sm text-slate-700">
                Wins: {checkin.wins || "—"}
              </p>
              <p className="text-sm text-slate-700">
                Blockers: {checkin.blockers || "—"}
              </p>
            </div>
          ))}
        </div>
      </article>
    </div>
  );
}
