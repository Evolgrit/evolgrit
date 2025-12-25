import type { Metadata } from "next";
import Link from "next/link";
import MarketingTopbar from "@/components/MarketingTopbar";
import { Reveal } from "@/components/ui/Reveal";
import { MarketingPageShell } from "@/components/marketing/MarketingPageShell";
import { EmployersSection } from "@/components/marketing/sections/EmployersSection";
import { EmployerTestimonialSection } from "@/components/marketing/sections/EmployerTestimonialSection";
import { FinalCtaSection } from "@/components/marketing/sections/FinalCtaSection";
import { ReadinessScoreSection } from "@/components/marketing/sections/ReadinessScoreSection";

export const metadata: Metadata = {
  title: "For Employers – Evolgrit batches & readiness signals",
  description:
    "Invite-only access to Evolgrit batches: readiness signals, structured onboarding, calm hiring for international talent.",
};

const container = "mx-auto w-full max-w-[1280px] px-4 sm:px-6 lg:px-8";

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
          <Reveal delayMs={180} durationMs={360} distance={12}>
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

          <Reveal delayMs={260} durationMs={360} distance={12}>
            <EmployersSection />
          </Reveal>

          <Reveal delayMs={300} durationMs={360} distance={12}>
            <ReadinessScoreSection variant="employer" />
          </Reveal>

          <Reveal delayMs={360} durationMs={360} distance={12}>
            <section className={`${container} mt-10 space-y-10`}>
              <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
                    Access
                  </p>
                  <h2 className="mt-2 text-2xl font-semibold text-slate-900 sm:text-3xl">
                    Invite-only access with predictable batches.
                  </h2>
                  <p className="mt-3 max-w-2xl text-sm text-slate-600 sm:text-base">
                    Evolgrit aligns readiness expectations, timelines and roles with you before you
                    meet candidates, keeping hiring calm and transparent.
                  </p>
                </div>
                <Link
                  href="/login?role=employer"
                  className="inline-flex items-center justify-center rounded-full bg-slate-900 px-5 py-2 text-sm font-medium text-slate-50 shadow-md shadow-slate-900/30 hover:bg-slate-800"
                >
                  Talk to us about hiring
                </Link>
              </div>
              <div className="grid gap-6 lg:grid-cols-2">
                <article className="rounded-3xl border border-slate-200 bg-white p-7 shadow-sm">
                  <p className="text-xs uppercase tracking-[0.2em] text-slate-400">
                    How access works
                  </p>
                  <h3 className="mt-2 text-xl font-semibold text-slate-900">
                    Invite-only access in three calm steps.
                  </h3>
                  <Reveal
                    durationMs={220}
                    distance={6}
                    staggerChildren
                    className="mt-5 grid gap-4 sm:grid-cols-3"
                  >
                    {accessSteps.map((step, index) => (
                      <div
                        key={step.title}
                        className="rounded-2xl border border-slate-100 bg-slate-50/70 p-4"
                      >
                        <p className="text-[11px] uppercase tracking-[0.18em] text-slate-400">
                          Step {index + 1}
                        </p>
                        <h4 className="mt-1 text-base font-semibold text-slate-900">
                          {step.title}
                        </h4>
                        <p className="mt-2 text-sm text-slate-600">{step.body}</p>
                      </div>
                    ))}
                  </Reveal>
                </article>
                <article className="rounded-3xl border border-slate-200 bg-white p-7 shadow-sm">
                  <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Batches</p>
                  <h3 className="mt-2 text-xl font-semibold text-slate-900">
                    Predictable groups, calmer onboarding.
                  </h3>
                  <Reveal
                    durationMs={220}
                    distance={6}
                    staggerChildren
                    className="mt-5 grid gap-3"
                  >
                    {batchHighlights.map((batch) => (
                      <div
                        key={batch.title}
                        className="rounded-2xl border border-slate-100 bg-slate-50/70 p-4"
                      >
                        <h4 className="text-sm font-semibold text-slate-900">{batch.title}</h4>
                        <p className="mt-1 text-sm text-slate-600">{batch.body}</p>
                      </div>
                    ))}
                  </Reveal>
                </article>
              </div>
            </section>
          </Reveal>

          <Reveal delayMs={420} durationMs={360} distance={12}>
            <EmployerTestimonialSection />
          </Reveal>

          <Reveal durationMs={220} distance={8}>
            <FinalCtaSection />
          </Reveal>
        </main>
      </MarketingPageShell>
    </>
  );
}
