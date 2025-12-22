export default function JobsLoading() {
  return (
    <div className="space-y-6 animate-pulse">
      <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="h-5 w-40 rounded-full bg-slate-100" />
        <div className="mt-4 space-y-3">
          <div className="h-6 w-2/3 rounded-full bg-slate-100" />
          <div className="h-4 w-full rounded-full bg-slate-100" />
        </div>
        <div className="mt-6 grid gap-4 lg:grid-cols-2">
          {[...Array(2)].map((_, idx) => (
            <div key={idx} className="h-36 rounded-3xl border border-slate-100 bg-slate-50" />
          ))}
        </div>
      </section>

      <section className="grid gap-6 lg:grid-cols-2">
        {[...Array(2)].map((_, idx) => (
          <div key={idx} className="h-48 rounded-3xl border border-slate-200 bg-white" />
        ))}
      </section>
    </div>
  );
}
