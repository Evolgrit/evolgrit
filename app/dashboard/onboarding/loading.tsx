export default function Loading() {
  return (
    <main className="min-h-screen bg-slate-50 px-5 py-10">
      <div className="mx-auto max-w-2xl space-y-6">
        <div className="h-8 w-64 rounded-xl bg-slate-200 animate-pulse" />
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm space-y-4">
          <div className="h-5 w-40 rounded-full bg-slate-100 animate-pulse" />
          <div className="h-10 rounded-2xl bg-slate-50 border border-slate-100 animate-pulse" />
          <div className="h-10 rounded-2xl bg-slate-50 border border-slate-100 animate-pulse" />
          <div className="h-10 rounded-2xl bg-slate-50 border border-slate-100 animate-pulse" />
        </div>
      </div>
    </main>
  );
}
