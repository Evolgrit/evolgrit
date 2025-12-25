import type { Metadata } from "next";
import Link from "next/link";
import MarketingTopbar from "@/components/MarketingTopbar";
import { Reveal } from "@/components/ui/Reveal";
import { MarketingPageShell } from "@/components/marketing/MarketingPageShell";

export const metadata: Metadata = {
  title: "For Employers – Evolgrit batches & readiness signals",
  description:
    "Invite-only access to Evolgrit batches: readiness signals, structured onboarding, calm hiring for international talent.",
};

const container = "mx-auto w-full max-w-[1280px] px-4 sm:px-6 lg:px-8";

const challengePoints = [
  "Language-only courses do not guarantee work readiness.",
  "Paperwork, housing and expectations slow down onboarding.",
  "Managers lack calm signals to know when a candidate is truly ready.",
];

const employerValueCards = [
  {
    title: "Readiness signals",
    copy: "Score composed of language, everyday life confidence and reliability. Updated every week.",
  },
  {
    title: "Candidate detail view",
    copy: "Documents, modules, mentor notes and weekly check-ins in one card — easy to scan.",
  },
  {
    title: "Documents readiness",
    copy: "IDs, contracts, insurance proofs are requested early so onboarding does not stall.",
  },
  {
    title: "Private actions",
    copy: "Save, mark interested or request an intro. Evolgrit only loops you in when a match is aligned.",
  },
];

const accessSteps = [
  { title: "Request access", body: "Share your hiring focus, locations and timeline." },
  { title: "Review & alignment", body: "We calibrate readiness expectations and batches with you." },
  { title: "Invite-only workspace", body: "Access Evolgrit when we have calm matches for your teams." },
];

const batchHighlights = [
  { title: "Predictable windows", body: "Each batch has clear start weeks for easier workforce planning." },
  {
    title: "Mentor + AI loop",
    body: "Learners stay motivated, so they’re ready when your onboarding starts.",
  },
  { title: "Shared signals", body: "You see the same readiness status as learners and mentors — no surprises." },
];

export default function ForEmployersPage() {
  return (
    <>
      <MarketingTopbar />
      <MarketingPageShell>
        <main className="min-h-screen bg-slate-50 pb-16 text-slate-900">
          <Reveal durationMs={220} distance={8}>
            <section className={`${container} pt-16`}>
              <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-slate-400">
              For employers
            </p>
            <h1 className="mt-3 text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl">
              Hire job-ready talent, not language-only profiles.
            </h1>
            <p className="mt-3 text-base text-slate-600">
              Evolgrit batches create readiness signals, structured onboarding and calmer matches for international talent.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link
                href="/login?role=employer"
                className="inline-flex items-center justify-center rounded-full bg-slate-900 px-5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-slate-800"
              >
                Request access
              </Link>
              <Link
                href="/learner-journey"
                className="inline-flex items-center justify-center rounded-full border border-slate-200 bg-white px-5 py-2.5 text-sm font-semibold text-slate-900 hover:border-slate-400"
              >
                See readiness demo
              </Link>
            </div>
              </div>
            </section>
          </Reveal>

          <Reveal durationMs={220} distance={8}>
            <section className={`${container} mt-10`}>
              <div className="rounded-3xl border border-slate-200 bg-white p-7 shadow-sm">
            <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Why Evolgrit</p>
            <h2 className="mt-2 text-2xl font-semibold text-slate-900">
              The old approach wastes time for learners and teams.
            </h2>
                <ul className="mt-4 space-y-2 text-sm text-slate-600">
                  {challengePoints.map((point) => (
                    <li key={point} className="flex gap-2">
                      <span className="text-slate-400">•</span>
                      <span>{point}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </section>
          </Reveal>

          <Reveal durationMs={220} distance={8}>
            <section className={`${container} mt-10`}>
              <Reveal
                durationMs={220}
                distance={6}
                staggerChildren
                className="grid gap-4 md:grid-cols-2"
              >
                {employerValueCards.map((card) => (
                  <article
                    key={card.title}
                    className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm"
                  >
                    <h3 className="text-lg font-semibold text-slate-900">{card.title}</h3>
                    <p className="mt-2 text-sm text-slate-600">{card.copy}</p>
                  </article>
                ))}
              </Reveal>
            </section>
          </Reveal>

          <Reveal durationMs={220} distance={8}>
            <section className={`${container} mt-12`}>
              <div className="rounded-3xl border border-slate-200 bg-white p-7 shadow-sm">
            <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Invite-only access</p>
            <h2 className="mt-2 text-2xl font-semibold text-slate-900">How access works</h2>
                <Reveal
                  durationMs={220}
                  distance={6}
                  staggerChildren
                  className="mt-6 grid gap-4 md:grid-cols-3"
                >
                  {accessSteps.map((step, index) => (
                    <div
                      key={step.title}
                      className="rounded-2xl border border-slate-100 bg-slate-50/70 p-5"
                    >
                      <p className="text-xs uppercase tracking-[0.2em] text-slate-400">
                        Step {index + 1}
                      </p>
                      <h4 className="mt-1 text-lg font-semibold text-slate-900">{step.title}</h4>
                      <p className="mt-2 text-sm text-slate-600">{step.body}</p>
                    </div>
                  ))}
                </Reveal>
              </div>
            </section>
          </Reveal>

          <Reveal durationMs={220} distance={8}>
            <section className={`${container} mt-12`}>
              <div className="rounded-3xl border border-slate-200 bg-white p-7 shadow-sm">
            <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Batches</p>
            <h2 className="mt-2 text-2xl font-semibold text-slate-900">Predictable groups, calmer onboarding.</h2>
                <Reveal
                  durationMs={220}
                  distance={6}
                  staggerChildren
                  className="mt-6 grid gap-4 md:grid-cols-3"
                >
                  {batchHighlights.map((batch) => (
                    <div
                      key={batch.title}
                      className="rounded-2xl border border-slate-100 bg-slate-50/70 p-5"
                    >
                      <h4 className="text-base font-semibold text-slate-900">{batch.title}</h4>
                      <p className="mt-2 text-sm text-slate-600">{batch.body}</p>
                    </div>
                  ))}
                </Reveal>
              </div>
            </section>
          </Reveal>

          <Reveal durationMs={220} distance={8}>
            <section className={`${container} mt-12`}>
              <div className="rounded-3xl border border-slate-200 bg-white p-8 text-center shadow-sm">
            <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Partner with Evolgrit</p>
            <h3 className="mt-2 text-2xl font-semibold text-slate-900">
              Ready for calmer international hiring?
            </h3>
            <p className="mt-2 text-sm text-slate-600">
              Tell us what you need. We’ll respond with batch windows, readiness expectations and next steps.
            </p>
            <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
              <Link
                href="/login?role=employer"
                className="inline-flex items-center justify-center rounded-full bg-slate-900 px-6 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-slate-800"
              >
                Request access
              </Link>
              <Link
                href="/learner-journey"
                className="text-sm font-medium text-blue-600 hover:text-blue-700"
              >
                See readiness demo →
              </Link>
            </div>
              </div>
            </section>
          </Reveal>
        </main>
      </MarketingPageShell>
    </>
  );
}
