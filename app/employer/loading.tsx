export default function EmployerLoading() {
  return (
    <main className="min-h-screen bg-slate-50 px-5 py-16">
      <div className="mx-auto max-w-4xl space-y-4">
        <div className="h-10 w-56 rounded-2xl bg-white/60" />
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="h-32 rounded-2xl bg-slate-200/60" />
            <div className="h-32 rounded-2xl bg-slate-200/60" />
          </div>
        </div>
      </div>
    </main>
  );
}
