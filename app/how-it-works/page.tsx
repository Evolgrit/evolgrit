import type { Metadata } from "next";
import Link from "next/link";
import MarketingTopbar from "@/components/MarketingTopbar";
import { Reveal } from "@/components/ui/Reveal";
import { MarketingPageShell } from "@/components/marketing/MarketingPageShell";
import { WhyNowSection } from "@/components/marketing/sections/WhyNowSection";
import { WhoSection } from "@/components/marketing/sections/WhoSection";
import { JourneyOverviewSection } from "@/components/marketing/sections/JourneyOverviewSection";
import { LearnerHowItWorksSection } from "@/components/marketing/sections/LearnerHowItWorksSection";
import { ProgramTimelineSection } from "@/components/marketing/sections/ProgramTimelineSection";
import { ReadinessScoreSection } from "@/components/marketing/sections/ReadinessScoreSection";
import { GetToKnowSection } from "@/components/marketing/sections/GetToKnowSection";
import { PathwaysSection } from "@/components/marketing/sections/PathwaysSection";
import { ExampleJourneysSection } from "@/components/marketing/sections/ExampleJourneysSection";
import { BrandMeaningSection } from "@/components/marketing/sections/BrandMeaningSection";
import { FinalCtaSection } from "@/components/marketing/sections/FinalCtaSection";
import { LearnerStorySection } from "@/components/marketing/sections/LearnerStorySection";

export const metadata: Metadata = {
  title: "How Evolgrit Works – Calm three-phase journey",
  description:
    "Understand Evolgrit's journey: phase zero expectations, weekly rhythm, readiness signals and mentor touchpoints.",
};

const container = "mx-auto w-full max-w-[1280px] px-4 sm:px-6 lg:px-8";

export default function HowItWorksPage() {
  return (
    <>
      <MarketingTopbar />
      <MarketingPageShell>
        <main className="min-h-screen bg-slate-50 pb-16 text-slate-900">
          <Reveal delayMs={180} durationMs={360} distance={12}>
            <section className={`${container} pt-16`}>
              <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-slate-400">
              How it works
            </p>
            <h1 className="mt-3 text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl">
              A calm three-phase journey to job-ready.
            </h1>
            <p className="mt-3 text-base text-slate-600">
              Language, everyday life and job readiness stay linked from the first week — so learners know what’s next and employers see true progress.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link
                href="/learner-journey"
                className="inline-flex items-center justify-center rounded-full bg-slate-900 px-5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-slate-800"
              >
                See the learner demo
              </Link>
              <Link
                href="/waitlist"
                className="inline-flex items-center justify-center rounded-full border border-slate-200 bg-white px-5 py-2.5 text-sm font-semibold text-slate-900 hover:border-slate-400"
              >
                Join the waitlist
              </Link>
            </div>
              </div>
            </section>
          </Reveal>

          <Reveal delayMs={240} durationMs={360} distance={12}>
            <LearnerStorySection />
          </Reveal>

          <Reveal delayMs={260} durationMs={360} distance={12}>
            <WhyNowSection />
          </Reveal>

          <Reveal delayMs={280} durationMs={360} distance={12}>
            <WhoSection />
          </Reveal>

          <Reveal delayMs={300} durationMs={360} distance={12}>
            <JourneyOverviewSection />
          </Reveal>

          <Reveal delayMs={320} durationMs={360} distance={12}>
            <LearnerHowItWorksSection />
          </Reveal>

          <Reveal delayMs={340} durationMs={360} distance={12}>
            <ProgramTimelineSection />
          </Reveal>

          <Reveal delayMs={360} durationMs={360} distance={12}>
            <ReadinessScoreSection />
          </Reveal>

          <Reveal delayMs={380} durationMs={360} distance={12}>
            <GetToKnowSection />
          </Reveal>

          <Reveal delayMs={400} durationMs={360} distance={12}>
            <PathwaysSection />
          </Reveal>

          <Reveal delayMs={420} durationMs={360} distance={12}>
            <ExampleJourneysSection />
          </Reveal>

          <Reveal delayMs={440} durationMs={360} distance={12}>
            <section className={`${container} mt-12`}>
              <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
                <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)]">
                  <div className="space-y-3">
                    <p className="text-[11px] uppercase tracking-[0.2em] text-slate-400">
                      Proof · Demo
                    </p>
                    <h3 className="text-2xl font-semibold text-slate-900">
                      See the learner hub before joining.
                    </h3>
                    <p className="text-sm text-slate-600">
                      Explore the Evolgrit learner dashboard demo to review phases, weekly check-ins,
                      documents readiness and mentor chat in context.
                    </p>
                    <div className="flex flex-wrap gap-3">
                      <Link
                        href="/learner-journey"
                        className="inline-flex items-center justify-center rounded-full bg-slate-900 px-5 py-2.5 text-sm font-semibold text-white hover:bg-slate-800"
                      >
                        Open learner demo
                      </Link>
                      <Link
                        href="/for-employers#tina-story"
                        className="text-sm font-medium text-blue-600 hover:text-blue-700"
                      >
                        Review employer story →
                      </Link>
                    </div>
                  </div>
                  <div className="rounded-3xl border border-slate-100 bg-gradient-to-br from-slate-100 via-slate-50 to-white p-6 shadow-inner">
                    <div className="rounded-2xl border border-slate-200 bg-white/80 p-5 text-sm text-slate-600 shadow">
                      <p className="text-xs uppercase tracking-[0.2em] text-slate-400">
                        Demo snapshot
                      </p>
                      <h4 className="mt-2 text-lg font-semibold text-slate-900">
                        Batch Alpha · Week 3
                      </h4>
                      <p className="mt-1">
                        Learner check-ins, modules and documents readiness updates appear here for
                        mentors and employers.
                      </p>
                      <div className="mt-4 grid gap-3 text-xs text-slate-500">
                        <div className="rounded-xl border border-slate-100 bg-slate-50/70 px-3 py-2">
                          Weekly check-in · Submitted
                        </div>
                        <div className="rounded-xl border border-slate-100 bg-slate-50/70 px-3 py-2">
                          Documents ready · 2 / 4
                        </div>
                        <div className="rounded-xl border border-slate-100 bg-slate-50/70 px-3 py-2">
                          Mentor chat · Live corrections
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>
          </Reveal>

          <Reveal delayMs={460} durationMs={360} distance={12}>
            <BrandMeaningSection />
          </Reveal>

          <Reveal delayMs={480} durationMs={360} distance={12}>
            <FinalCtaSection />
          </Reveal>
        </main>
      </MarketingPageShell>
    </>
  );
}
