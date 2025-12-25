"use client";

type LearnerStorySectionProps = {
  id?: string;
};

export function LearnerStorySection({ id = "learner-story" }: LearnerStorySectionProps) {
  return (
    <section
      id={id}
      aria-labelledby="tina-story-heading"
      className="mx-auto mt-6 w-full max-w-6xl px-5"
    >
      <div className="flex flex-col gap-6 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-7 lg:flex-row lg:items-stretch lg:p-8">
        <div className="flex-1 space-y-3">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-emerald-600">
            Learner story · Childcare
          </p>

          <h3
            id="tina-story-heading"
            className="text-lg font-semibold tracking-tight text-slate-900 sm:text-xl"
          >
            Tina · 24 · von Kosovo → Kinder­garten­assistentin in Berlin
          </h3>

          <p className="text-sm text-slate-600 sm:text-base">
            In nur drei Wochen ist Tina vom unsicheren Deutsch zu einer Kollegin geworden, die
            Kinder, Eltern und Team sicher durch den Alltag begleitet – als wäre sie schon seit
            Jahren dabei.
          </p>

          <p className="text-sm font-medium italic text-slate-900 sm:text-base">
            „Vor Evolgrit hatte ich Angst vor Gesprächen mit Eltern. Jetzt kann ich den Tag
            erklären, Wünsche verstehen und Konflikte ruhig ansprechen – auf Deutsch.“
          </p>

          <div className="flex flex-wrap gap-2 pt-2">
            <span className="inline-flex items-center rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-700">
              Alltags­sprache mit Eltern
            </span>
            <span className="inline-flex items-center rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-700">
              Kultur &amp; Erwartungen verstehen
            </span>
            <span className="inline-flex items-center rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-700">
              Unter­stützung durch Mentor:innen
            </span>
          </div>
        </div>

        <aside className="flex w-full flex-col gap-4 text-sm text-slate-600 lg:w-64 lg:border-l lg:border-slate-100 lg:pl-6">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-100 text-sm font-semibold text-emerald-700">
              T
            </div>
            <div>
              <p className="text-xs uppercase tracking-[0.16em] text-slate-400">Profil</p>
              <p className="text-sm font-medium text-slate-900">Tina, 24 · Kinder­garten­assistenz</p>
            </div>
          </div>

          <dl className="space-y-2 text-xs sm:text-sm">
            <div className="flex justify-between gap-4">
              <dt className="text-slate-400">Ausgangs­niveau</dt>
              <dd className="font-medium text-slate-900">A2 Deutsch</dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="text-slate-400">Zeit mit Evolgrit</dt>
              <dd className="font-medium text-slate-900">3 Wochen</dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="text-slate-400">Fokus</dt>
              <dd className="font-medium text-slate-900">
                Eltern­ge­spräche, Tages­ablauf, Team
              </dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="text-slate-400">Unterstützung</dt>
              <dd className="font-medium text-slate-900">AI-Coach + 1:1 Mentoring</dd>
            </div>
          </dl>
        </aside>
      </div>
    </section>
  );
}
