export default function EmployerHome() {
  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
      <p className="text-[11px] uppercase tracking-[0.18em] text-slate-400">
        Employer hub
      </p>
      <h1 className="mt-2 text-2xl font-semibold text-slate-900">
        Welcome to the Evolgrit employer hub
      </h1>
      <p className="mt-2 text-sm text-slate-600">
        Manage your international talent batches, view readiness signals and coordinate onboarding.
      </p>
      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
            Batches
          </p>
          <p className="mt-1 text-sm text-slate-700">No batches active yet.</p>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
            Candidates
          </p>
          <p className="mt-1 text-sm text-slate-700">We’ll notify you once learners are ready.</p>
        </div>
      </div>
    </div>
  );
}
