export default function Loading() {
  return (
    <main className="min-h-screen bg-slate-50 px-5 py-10">
      <div className="mx-auto max-w-3xl space-y-6">
        <div className="h-7 w-48 rounded-xl bg-slate-200 animate-pulse" />
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm space-y-4">
          <div className="flex items-center gap-4">
            <div className="h-16 w-16 rounded-2xl bg-slate-100 animate-pulse" />
            <div className="h-10 w-32 rounded-full bg-slate-100 animate-pulse" />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            {Array.from({ length: 6 }).map((_, idx) => (
              <div
                key={idx}
                className="h-16 rounded-2xl border border-slate-100 bg-slate-50 animate-pulse"
              />
            ))}
          </div>
          <div className="h-10 w-32 rounded-full bg-slate-100 animate-pulse" />
        </div>
      </div>
    </main>
  );
}
