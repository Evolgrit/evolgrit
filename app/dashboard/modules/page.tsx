import Link from "next/link";

const modules = [
  {
    id: "module-1",
    phase: "Phase 1 · Arrival",
    title: "Parent conversation basics",
    summary:
      "Practice how to greet, explain the day, and close conversations with parents in German.",
    tags: ["AI coach", "Role play", "Vocabulary"],
    progress: 0.66,
    tasksComplete: 2,
    tasksTotal: 3,
    due: "Today",
  },
  {
    id: "module-2",
    phase: "Phase 1 · Everyday life",
    title: "Housing paperwork walkthrough",
    summary:
      "Understand Anmeldung, Mietvertrag clauses, and how to ask for clarifications on forms.",
    tags: ["Documents", "Real-life tasks"],
    progress: 0.33,
    tasksComplete: 1,
    tasksTotal: 3,
    due: "Tomorrow",
  },
  {
    id: "module-3",
    phase: "Phase 2 · Practice",
    title: "Shift handover storytelling",
    summary:
      "Learn to explain what happened during your shift and what the next colleague needs to know.",
    tags: ["Speaking", "Mentor feedback"],
    progress: 0.1,
    tasksComplete: 1,
    tasksTotal: 10,
    due: "Next week",
  },
];

export default function ModulesPage() {
  return (
    <div className="space-y-6">
      <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-[11px] uppercase tracking-[0.18em] text-slate-400">
              Learning modules
            </p>
            <h1 className="text-2xl font-semibold text-slate-900">
              Your mix of language, culture and job simulations.
            </h1>
            <p className="mt-2 text-sm text-slate-600">
              Evolgrit alternates formats so you can stay motivated: AI coach prompts,
              live mentor sessions, paperwork walkthroughs and more.
            </p>
          </div>
          <Link
            href="/dashboard/journey"
            className="text-sm font-medium text-blue-600 hover:text-blue-700"
          >
            View journey timeline →
          </Link>
        </div>

        <div className="mt-6 space-y-5">
          {modules.map((module) => (
            <article
              key={module.id}
              className="rounded-3xl border border-slate-200 bg-slate-50 p-5 shadow-sm"
            >
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div className="space-y-2">
                  <p className="text-[11px] uppercase tracking-[0.18em] text-slate-400">
                    {module.phase}
                  </p>
                  <h2 className="text-lg font-semibold text-slate-900">
                    {module.title}
                  </h2>
                  <p className="text-sm text-slate-600">{module.summary}</p>
                </div>
                <span className="rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-medium text-slate-600">
                  Due {module.due}
                </span>
              </div>

              <div className="mt-4">
                <div className="flex items-center justify-between text-xs text-slate-500">
                  <span>
                    {module.tasksComplete}/{module.tasksTotal} tasks
                  </span>
                  <span>{Math.round(module.progress * 100)}%</span>
                </div>
                <div className="mt-2 h-2 w-full rounded-full bg-white">
                  <div
                    className="h-2 rounded-full bg-slate-900"
                    style={{ width: `${module.progress * 100}%` }}
                  />
                </div>
              </div>

              <div className="mt-4 flex flex-wrap gap-2 text-[11px] text-slate-500">
                {module.tags.map((tag) => (
                  <span
                    key={tag}
                    className="inline-flex items-center rounded-full border border-slate-200 bg-white px-3 py-1"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
