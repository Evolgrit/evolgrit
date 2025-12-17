import Link from "next/link";

export default function EmployersPage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-50 via-slate-50 to-slate-100 text-slate-900 px-5 py-16 sm:py-20">
      <div className="max-w-6xl mx-auto">
        <div className="max-w-3xl mx-auto text-center">
          <p className="text-[11px] uppercase tracking-[0.18em] text-slate-400">
            For employers
          </p>
          <h1 className="mt-2 text-2xl sm:text-3xl font-semibold tracking-tight text-slate-900">
            Hire international talent that’s ready to stay.
          </h1>
          <p className="mt-3 text-sm sm:text-base text-slate-600">
            Evolgrit connects language, cultural readiness and onboarding support — so hiring becomes repeatable, not risky.
          </p>
        </div>

        <div className="mt-10 max-w-3xl mx-auto rounded-3xl border border-slate-200 bg-white shadow-sm p-6 sm:p-8">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
              <p className="text-[11px] uppercase tracking-[0.18em] text-slate-400">
                Readiness at a glance
              </p>
              <p className="mt-1 text-sm font-semibold text-slate-900">
                Language + culture + reliability signals
              </p>
              <p className="mt-1 text-sm text-slate-600">
                See who is truly ready — not just who has a CV.
              </p>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
              <p className="text-[11px] uppercase tracking-[0.18em] text-slate-400">
                Pilot cohorts
              </p>
              <p className="mt-1 text-sm font-semibold text-slate-900">
                Start small, learn fast
              </p>
              <p className="mt-1 text-sm text-slate-600">
                Align roles, locations and timelines — then scale.
              </p>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
              <p className="text-[11px] uppercase tracking-[0.18em] text-slate-400">
                Onboarding support
              </p>
              <p className="mt-1 text-sm font-semibold text-slate-900">
                Reduce risk for your team
              </p>
              <p className="mt-1 text-sm text-slate-600">
                Structured support before and after arrival — so people actually stay.
              </p>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
              <p className="text-[11px] uppercase tracking-[0.18em] text-slate-400">
                Repeatable pipeline
              </p>
              <p className="mt-1 text-sm font-semibold text-slate-900">
                Plug into your hiring process
              </p>
              <p className="mt-1 text-sm text-slate-600">
                Build a long-term international hiring channel — not a one-off project.
              </p>
            </div>
          </div>

          <div className="mt-6 flex flex-col sm:flex-row gap-3 justify-center">
            <a
              href="mailto:info@evolgrit.com?subject=Evolgrit%20for%20employers"
              className="inline-flex items-center justify-center rounded-full bg-slate-900 px-5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-slate-800"
            >
              Talk to us about hiring
            </a>
            <Link
              href="/"
              className="inline-flex items-center justify-center rounded-full border border-slate-300 bg-white px-5 py-2.5 text-sm font-semibold text-slate-900 hover:border-slate-400"
            >
              Back to homepage
            </Link>
          </div>

          <p className="mt-4 text-center text-xs text-slate-500">
            Early-stage pilots · Private beta 2026
          </p>
        </div>
      </div>
    </main>
  );
}
