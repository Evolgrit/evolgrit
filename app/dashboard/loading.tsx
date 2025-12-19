export default function Loading() {
  return (
    <main className="min-h-screen bg-slate-50 px-5 py-10">
      <div className="mx-auto max-w-4xl space-y-4">
        <div className="h-8 w-64 rounded-xl bg-slate-200 animate-pulse" />
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="h-28 rounded-3xl border border-slate-200 bg-white shadow-sm animate-pulse" />
          <div className="h-28 rounded-3xl border border-slate-200 bg-white shadow-sm animate-pulse" />
        </div>
        <div className="h-48 rounded-3xl border border-slate-200 bg-white shadow-sm animate-pulse" />
      </div>
    </main>
  );
}
