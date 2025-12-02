'use client';

import { useState } from "react";

export default function Home() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <div 
    id="top"
    className="min-h-screen bg-gradient-to-b from-slate-50 via-slate-50 to-slate-100 text-slate-900">
      {/* HEADER / NAVBAR */}
      <header className="sticky top-0 z-50 backdrop-blur bg-white/70 border-b border-slate-200/50">
        <div className="max-w-6xl mx-auto px-5 py-4">
          <nav className="flex items-center justify-between gap-4">
            {/* Logo + Title */}
<button
  type="button"
  onClick={() =>
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    })
  }
  className="flex items-center gap-2"
>
  <div className="w-8 h-8 rounded-xl bg-slate-900 shadow-lg shadow-slate-900/40 flex items-center justify-center text-slate-100 text-sm font-semibold">
    E
  </div>
  <div>
    <div className="text-sm font-semibold tracking-[0.18em] uppercase">
      Evolgrit
    </div>
    <div className="text-[11px] text-slate-500">
      Language · Jobs · AI
    </div>
  </div>
</button>
            {/* Desktop Menu */}
            <div className="hidden sm:flex items-center gap-4 text-sm">
              <div className="flex items-center gap-2 pl-3 ml-1 border-l border-slate-200 text-xs text-slate-400">
                EN
              </div>

              <a href="#product" className="text-slate-500 hover:text-slate-900">
                Product
              </a>
              <a href="#how-it-works" className="text-slate-500 hover:text-slate-900">
                How it works
              </a>
              <a href="#for-employers" className="text-slate-500 hover:text-slate-900">
                For employers
              </a>

              <button className="rounded-full border border-slate-200 bg-white/80 px-3 py-1.5 text-sm hover:bg-white shadow-sm">
                Log in
              </button>
              <button className="rounded-full bg-blue-600 px-4 py-1.5 text-sm font-medium text-white shadow-md shadow-blue-500/40 hover:bg-blue-700">
                Join waitlist
              </button>
            </div>

            {/* Mobile hamburger */}
            <button
              className="sm:hidden inline-flex items-center justify-center rounded-full border border-slate-200 bg-white/80 px-3 py-2 text-xs text-slate-700 shadow-sm hover:bg-white"
              onClick={() => setIsMenuOpen((open) => !open)}
              aria-label="Open navigation menu"
            >
              <span className="flex flex-col gap-[3px]">
                <span className="h-[2px] w-4 bg-slate-700 rounded-full" />
                <span className="h-[2px] w-4 bg-slate-700 rounded-full" />
                <span className="h-[2px] w-4 bg-slate-700 rounded-full" />
              </span>
            </button>
          </nav>

          {/* Mobile Menu */}
          {isMenuOpen && (
            <div className="sm:hidden mt-4 mb-2 space-y-3 text-sm border border-slate-200 rounded-2xl bg-white/90 p-4">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xs uppercase tracking-[0.18em] text-slate-400">
                  Language
                </span>
                <div className="flex items-center gap-2 text-xs text-slate-500">
                  EN
                </div>
              </div>

              <a
                href="#product"
                className="block text-slate-700 hover:text-slate-900"
                onClick={() => setIsMenuOpen(false)}
              >
                Product
              </a>
              <a
                href="#how-it-works"
                className="block text-slate-700 hover:text-slate-900"
                onClick={() => setIsMenuOpen(false)}
              >
                How it works
              </a>
              <a
                href="#for-employers"
                className="block text-slate-700 hover:text-slate-900"
                onClick={() => setIsMenuOpen(false)}
              >
                For employers
              </a>

              <div className="pt-2 flex gap-2">
                <button
                  className="flex-1 rounded-full border border-slate-200 bg-white/80 px-3 py-1.5 text-xs hover:bg-white shadow-sm"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Log in
                </button>
                <button
                  className="flex-1 rounded-full bg-blue-600 px-3 py-1.5 text-xs font-medium text-white shadow-md shadow-blue-500/40 hover:bg-blue-700"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Join waitlist
                </button>
              </div>
            </div>
          )}
        </div>
      </header>

      {/* MAIN CONTENT */}
      <main className="max-w-6xl mx-auto px-5 pt-10 pb-24">
    
{/* HERO */}
<section className="grid gap-10 lg:grid-cols-[1.1fr,1fr] items-center mb-16">
  {/* LEFT SIDE – TEXT */}
  <div>
    <div className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-[11px] text-emerald-700 mb-4">
      <span className="inline-block h-2 w-2 rounded-full bg-emerald-500" />
      Private beta 2026 · international learners & employers
    </div>

    <h1 className="text-4xl sm:text-[52px] font-semibold leading-snug tracking-tight mb-4">
      AI-powered{" "}
      <span className="bg-gradient-to-r from-blue-600 to-sky-500 bg-clip-text text-transparent">
        German learning &amp; job coaching
      </span>{" "}
      for international talent.
    </h1>

    <p className="text-sm sm:text-base text-slate-600 max-w-xl mb-6">
      Evolgrit is a 6–12 month hybrid journey that combines AI-powered
      German learning, cultural readiness and job preparation – so
      international talent can truly arrive and stay in Germany.
    </p>

    <div className="flex flex-wrap gap-3 mb-3">
      <a
        href="mailto:info@evolgrit.com?subject=Evolgrit%20Beta%20waitlist&amp;body=Hi%20Evolgrit%20team,%0A%0AI%27d%20like%20to%20join%20the%20beta.%0A%0AName:%0AGerman%20level:%0AProfessional%20background:%0A"
        className="rounded-full bg-blue-600 px-5 py-2 text-sm font-medium text-white shadow-md shadow-blue-500/40 hover:bg-blue-700 inline-flex items-center justify-center"
      >
        Join the beta waitlist
      </a>
      <a
        href="#how-it-works"
        className="rounded-full border border-slate-300 px-5 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100 inline-flex items-center justify-center"
      >
        See how it works
      </a>
    </div>

    <p className="text-[12px] text-slate-500">
      <span className="text-emerald-600 font-medium">
        Built for people first.
      </span>{" "}
      We start with a small cohort of learners and partner employers to
      shape the product together.
    </p>
  </div>

  {/* RIGHT SIDE – DASHBOARD PREVIEW */}
  <aside
    aria-label="Preview of Evolgrit dashboard"
    className="rounded-2xl border border-slate-200/70 bg-white/90 shadow-xl shadow-slate-900/5 p-4 sm:p-5 backdrop-blur"
  >
    <div className="flex items-center justify-between mb-3">
      <div className="text-[12px] text-slate-500">
        Evolgrit ·{" "}
        <span className="font-semibold text-slate-800">
          Cohort overview
        </span>
      </div>
      <span className="rounded-full bg-sky-50 text-sky-700 border border-sky-100 px-2 py-1 text-[11px]">
        Q1 · Preview
      </span>
    </div>

    <div className="grid grid-cols-3 gap-2 mb-4">
      <div className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2">
        <div className="text-[11px] text-slate-500 mb-1">
          Language progress
        </div>
        <div className="text-[17px] font-semibold">+38%</div>
        <div className="text-[11px] text-emerald-600">over 12 weeks</div>
      </div>
      <div className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2">
        <div className="text-[11px] text-slate-500 mb-1">
          Job-ready profiles
        </div>
        <div className="text-[17px] font-semibold">24</div>
        <div className="text-[11px] text-slate-500">of 32 learners</div>
      </div>
      <div className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2">
        <div className="text-[11px] text-slate-500 mb-1">
          Employer matches
        </div>
        <div className="text-[17px] font-semibold">17</div>
        <div className="text-[11px] text-slate-500">active pipelines</div>
      </div>
    </div>

    <div className="rounded-xl bg-slate-950/95 text-slate-100 px-3 py-3 mb-3">
      <div className="flex items-center justify-between text-[11px] text-slate-400 mb-2">
        <span>German level improvement · cohort</span>
        <span>Last 12 weeks</span>
      </div>
      <div className="relative h-20 overflow-hidden rounded-md bg-slate-900">
        <div className="absolute inset-0 opacity-60 bg-gradient-to-r from-blue-500/10 via-blue-400/70 to-blue-500/60" />
        <div className="absolute inset-0 opacity-40 bg-gradient-to-r from-emerald-400/10 via-emerald-300/70 to-emerald-400/70" />
      </div>
      <div className="flex justify-end gap-4 mt-2 text-[10px] text-slate-400">
        <span>
          <span className="inline-block w-2 h-2 rounded-full bg-blue-400 mr-1" />
          Language level
        </span>
        <span>
          <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 mr-1" />
          Placement matches
        </span>
      </div>
    </div>

    <div className="flex items-center justify-between mt-1 text-[11px] text-slate-500">
      <span>
        <span className="font-semibold text-slate-800">Top signals:</span>{" "}
        B1+/B2 learners with care, logistics &amp; hospitality background.
      </span>
      <span className="hidden sm:inline-flex items-center rounded-full border border-emerald-200 bg-emerald-50 px-2 py-1 text-[10px] text-emerald-700">
        New · cultural readiness score
      </span>
    </div>
  </aside>
</section>
        {/* VALUE STRIP (HIGHLIGHTS) */}
        <section className="mt-10 grid gap-3 md:grid-cols-3 text-[13px]" id="product-highlights">
          <div className="flex items-center gap-2 rounded-full border border-slate-200 bg-white/80 px-3 py-2 text-slate-600">
            <span className="h-2 w-2 rounded-full bg-emerald-500" />
            Adaptive German learning based on real job contexts, not textbook dialogs.
          </div>
          <div className="flex items-center gap-2 rounded-full border border-slate-200 bg-white/80 px-3 py-2 text-slate-600">
            <span className="h-2 w-2 rounded-full bg-emerald-500" />
            One profile that combines language level, skills and work history – ready for employers.
<div
  className="flex items-center gap-2 rounded-full border border-slate-200 bg-white/80 px-3 py-2 text-slate-600"
>
  <span className="h-2 w-2 rounded-full bg-emerald-500" />
  Built together with learners and employers in one loop.
</div>
        </section>
{/* AUDIENCE SECTION */}
<section className="max-w-6xl mx-auto mt-24 px-5">
  <h2 className="text-3xl font-semibold text-slate-900 text-center mb-12">
    Who Evolgrit is built for
  </h2>

  <div className="grid gap-6 md:grid-cols-3">

    {/* Learners */}
    <div className="p-6 rounded-2xl border border-slate-200 bg-white hover:shadow transition">
      <div className="h-10 w-10 rounded-xl bg-blue-600/10 text-blue-600 flex items-center justify-center text-lg font-bold mb-4">L</div>
      <h3 className="font-semibold text-slate-900 mb-2">Learners</h3>
      <p className="text-slate-600 mb-4">6–12 month hybrid journey to build real German skills, culture & job readiness.</p>
      <a className="text-blue-600 font-medium text-sm hover:underline" href="#how-it-works">See journey →</a>
    </div>

    {/* Employers */}
    <div className="p-6 rounded-2xl border border-slate-200 bg-white hover:shadow transition">
      <div className="h-10 w-10 rounded-xl bg-emerald-600/10 text-emerald-600 flex items-center justify-center text-lg font-bold mb-4">E</div>
      <h3 className="font-semibold text-slate-900 mb-2">Employers</h3>
      <p className="text-slate-600 mb-4">A pipeline of motivated international candidates with transparent readiness.</p>
      <a className="text-emerald-600 font-medium text-sm hover:underline" href="#for-employers">Hire talent →</a>
    </div>

    {/* Mentors */}
    <div className="p-6 rounded-2xl border border-slate-200 bg-white hover:shadow transition">
      <div className="h-10 w-10 rounded-xl bg-purple-600/10 text-purple-600 flex items-center justify-center text-lg font-bold mb-4">M</div>
      <h3 className="font-semibold text-slate-900 mb-2">Mentors</h3>
      <p className="text-slate-600 mb-4">Support learners in language, culture and mindset through 1:1 coaching.</p>
      <a className="text-purple-600 font-medium text-sm hover:underline" href="mailto:info@evolgrit.com?subject=Mentor%20Application">Become a mentor →</a>
    </div>

  </div>
</section>
{/* BRANCH PATHWAYS SECTION */}
<section className="max-w-6xl mx-auto mt-24 px-5">
  <h2 className="text-3xl font-semibold text-slate-900 mb-10 text-center">
    Explore pathways for different careers
  </h2>

  <div className="grid gap-6 md:grid-cols-3 text-sm">

    {/* Logistics */}
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm hover:shadow-md transition">
      <div className="h-10 w-10 rounded-xl bg-blue-600/10 text-blue-600 flex items-center justify-center text-lg font-bold mb-4">
        L
      </div>
      <h3 className="font-semibold text-slate-900 mb-2">Logistics</h3>
      <p className="text-slate-600 mb-4">
        Warehouse, delivery & supply-chain roles with quick placement pathways.
      </p>
      <a href="#" className="text-blue-600 font-medium hover:underline">
        See logistics pathway →
      </a>
    </div>

    {/* Drivers */}
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm hover:shadow-md transition">
      <div className="h-10 w-10 rounded-xl bg-emerald-600/10 text-emerald-600 flex items-center justify-center text-lg font-bold mb-4">
        D
      </div>
      <h3 className="font-semibold text-slate-900 mb-2">Professional Drivers</h3>
      <p className="text-slate-600 mb-4">
        Bus & van drivers — in high demand across Europe.
      </p>
      <a href="#" className="text-emerald-600 font-medium hover:underline">
        See driver pathway →
      </a>
    </div>

    {/* Kindergarden / Care */}
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm hover:shadow-md transition">
      <div className="h-10 w-10 rounded-xl bg-purple-600/10 text-purple-600 flex items-center justify-center text-lg font-bold mb-4">
        K
      </div>
      <h3 className="font-semibold text-slate-900 mb-2">Childcare & Care</h3>
      <p className="text-slate-600 mb-4">
        Kindergarden assistants & entry-care roles with cultural readiness support.
      </p>
      <a href="#" className="text-purple-600 font-medium hover:underline">
        See care pathway →
      </a>
    </div>

  </div>
</section>
        {/* PRODUCT SECTION */}
<section
  id="product"
  className="scroll-mt-24 max-w-6xl mx-auto mt-20 px-5 grid gap-10 md:grid-cols-[1.2fr,0.8fr] items-start"
>
            <div>
            <h2 className="text-3xl font-semibold text-slate-900 mb-4">
              A hybrid program for language, culture & careers.
            </h2>
<p className="text-slate-600 mb-6 text-sm sm:text-base">
  Evolgrit is designed as a 6–12 month journey where learners build
  German, cultural confidence and job readiness in parallel. AI-guided
  modules, changing task formats and regular human mentoring keep
  motivation high – and make sure progress is real, not just on paper.
</p>
            <div className="space-y-4">
              <div className="flex gap-3">
                <span className="mt-1 h-2 w-2 rounded-full bg-emerald-500" />
                <div>
                  <h3 className="font-semibold text-slate-900 text-sm sm:text-base">
                    AI-guided learning focused on real work situations
                  </h3>
                  <p className="text-slate-600 text-sm">
                    Learners practice German through job-related contexts,
                    not textbook dialogues – with personalized feedback and
                    adaptive difficulty.
                  </p>
                </div>
              </div>

              <div className="flex gap-3">
                <span className="mt-1 h-2 w-2 rounded-full bg-emerald-500" />
                <div>
                  <h3 className="font-semibold text-slate-900 text-sm sm:text-base">
                    Human mentors for language, culture and mindset
                  </h3>
                  <p className="text-slate-600 text-sm">
                    Experienced mentors support learners with live sessions,
                    cultural coaching and practical advice for life and work
                    in Germany.
                  </p>
                </div>
              </div>

              <div className="flex gap-3">
                <span className="mt-1 h-2 w-2 rounded-full bg-emerald-500" />
                <div>
                  <h3 className="font-semibold text-slate-900 text-sm sm:text-base">
                    Job-ready profiles for employers
                  </h3>
                  <p className="text-slate-600 text-sm">
                    Every participant builds a profile that combines skills,
                    experience and language progress – so employers see
                    exactly who is ready for which role.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm space-y-3 text-sm">
            <h3 className="font-semibold text-slate-900 mb-2">
              What learners get
            </h3>
<ul className="text-slate-600 space-y-2">
  <li>• A clear multi-month structure with defined phases.</li>
  <li>• Regular changes in task formats to keep motivation high.</li>
  <li>• Live mentoring for language, culture and career questions.</li>
  <li>• A clear next step: education, job or internship.</li>
</ul>
          </div>
        </section>

{/* HOW IT WORKS SECTION */}
<section
  id="how-it-works"
  className="scroll-mt-24 max-w-6xl mx-auto mt-24 px-5"
>
    <h2 className="text-3xl font-semibold text-slate-900 mb-8 text-center">
    How Evolgrit works for learners
  </h2>

  <div className="grid gap-6 md:grid-cols-4 text-sm">
    {/* STEP 1 */}
    <div className="rounded-2xl border border-slate-200 bg-white p-5">
      <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-blue-600 text-xs font-semibold text-white mb-3">
        1
      </span>
      <h3 className="font-semibold text-slate-900 mb-2">
        Onboarding & profiling
      </h3>
      <p className="text-slate-600">
        Learners share their background, target role and current
        language level – so we can tailor their journey.
      </p>
    </div>

    {/* STEP 2 */}
    <div className="rounded-2xl border border-slate-200 bg-white p-5">
      <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-blue-600 text-xs font-semibold text-white mb-3">
        2
      </span>
      <h3 className="font-semibold text-slate-900 mb-2">
        Hybrid learning program
      </h3>
<p className="text-slate-600">
  Language and culture are practiced in job-related situations with a
  mix of digital tasks and live mentor sessions.
</p>
    </div>

    {/* STEP 3 */}
    <div className="rounded-2xl border border-slate-200 bg-white p-5">
      <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-blue-600 text-xs font-semibold text-white mb-3">
        3
      </span>
      <h3 className="font-semibold text-slate-900 mb-2">
        Progress & readiness
      </h3>
<p className="text-slate-600">
  We continuously track progress and flag when someone is ready for
  interviews and new opportunities.
</p>
    </div>

    {/* STEP 4 */}
    <div className="rounded-2xl border border-slate-200 bg-white p-5">
      <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-blue-600 text-xs font-semibold text-white mb-3">
        4
      </span>
      <h3 className="font-semibold text-slate-900 mb-2">
        Matching & next steps
      </h3>
      <p className="text-slate-600">
        We connect learners with partner employers or education paths –
        always aligned with skills, language and personal goals.
      </p>
    </div>
  </div>
</section>
{/* PROGRAM TIMELINE SECTION */}
<section className="max-w-6xl mx-auto mt-24 px-5">
  <h2 className="text-3xl font-semibold text-slate-900 mb-4 text-center">
    A 6–12 month journey – not just a course.
  </h2>
<p className="text-slate-600 text-sm sm:text-base mb-8 text-center max-w-2xl mx-auto">
  Evolgrit is structured in three phases – from arrival to job-ready –
  so that learners can grow step by step without burning out.
</p>
  <div className="grid gap-6 md:grid-cols-3 text-sm">
    {/* Phase 1 */}
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="inline-flex items-center gap-2 rounded-full bg-blue-50 px-3 py-1 text-xs font-medium text-blue-700 mb-3">
        <span className="h-2 w-2 rounded-full bg-blue-500" />
        <span>Phase 1 · Arrival &amp; foundations</span>
      </div>
      <ul className="text-slate-600 space-y-2">
        <li>• Orientation, onboarding and first language baseline.</li>
        <li>• Focus on everyday communication and confidence.</li>
        <li>• Early contact with mentors and peer community.</li>
      </ul>
    </div>

    {/* Phase 2 */}
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="inline-flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-700 mb-3">
        <span className="h-2 w-2 rounded-full bg-emerald-500" />
        <span>Phase 2 · Deepening &amp; practice</span>
      </div>
      <ul className="text-slate-600 space-y-2">
        <li>• Job-related German, scenarios and role plays.</li>
        <li>• Alternating tasks to keep motivation high.</li>
        <li>• Regular feedback from mentors and AI-coach.</li>
      </ul>
    </div>

    {/* Phase 3 */}
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="inline-flex items-center gap-2 rounded-full bg-slate-50 px-3 py-1 text-xs font-medium text-slate-700 mb-3">
        <span className="h-2 w-2 rounded-full bg-slate-600" />
        <span>Phase 3 · Job-ready &amp; matching</span>
      </div>
      <ul className="text-slate-600 space-y-2">
        <li>• Interview preparation and workplace communication.</li>
        <li>• Matching with partner employers or education paths.</li>
        <li>• Clear next steps: job, apprenticeship or further training.</li>
      </ul>
    </div>
  </div>
</section>
        {/* FOR EMPLOYERS SECTION */}
<section
  id="for-employers"
  className="scroll-mt-24 max-w-6xl mx-auto mt-24 px-5 mb-24"
>
            <div className="grid gap-8 md:grid-cols-[1.1fr,0.9fr] items-center">
            <div>
              <h2 className="text-3xl font-semibold text-slate-900 mb-4">
                For employers who need international talent to actually stay.
              </h2>
              <p className="text-slate-600 mb-6 text-sm sm:text-base">
                Evolgrit gives you access to motivated international candidates
                who are not only learning German – they are actively preparing
                for life and work in your organisation.
              </p>

              <ul className="text-slate-600 space-y-2 text-sm">
                <li>• Pre-screened candidates with transparent progress.</li>
                <li>• One place to see language level, skills and readiness.</li>
                <li>• Reduced onboarding risk through structured support.</li>
                <li>• A partner who understands both talent and employers.</li>
              </ul>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm text-sm space-y-3">
              <h3 className="font-semibold text-slate-900">
                What you can expect as a partner
              </h3>
              <p className="text-slate-600">
                We start small with pilot cohorts and align the program with
                your roles, locations and timelines. You get clear expectations
                on language, skills and support.
              </p>
              <p className="text-slate-600">
                In later stages, Evolgrit can plug into your existing talent
                pipeline and help you build a repeatable model for
                international hiring.
              </p>
              <div className="pt-2">
                <a
                  href="mailto:info@evolgrit.com?subject=Evolgrit%20Employer%20Partnership"
                  className="inline-flex items-center justify-center rounded-full bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800"
                >
                  Talk to us about hiring
                </a>
              </div>
            </div>
          </div>
        </section>
{/* PHASE DETAIL SECTION – Apple-like layout */}
<section className="max-w-6xl mx-auto mt-24 px-5 grid gap-12 lg:grid-cols-[minmax(260px,320px),1fr] items-start">
  {/* LEFT: Phone Mockup */}
  <div className="lg:sticky top-32">
    <div className="mx-auto w-[260px] aspect-[9/19] rounded-[40px] border border-slate-200 bg-white shadow-xl shadow-slate-900/10 overflow-hidden flex items-center justify-center">
      {/* Platzhalter – später echter Screenshot deiner App */}
      <span className="text-slate-400 text-xs">
        Evolgrit app preview – phases 1–3
      </span>
    </div>
  </div>

  {/* RIGHT: Phases */}
  <div className="space-y-10 text-sm">
    {/* Phase 1 */}
    <div id="phase-1">
      <div className="inline-flex items-center gap-2 rounded-full bg-blue-50 px-3 py-1 text-xs font-medium text-blue-700 mb-3">
        <span className="h-2 w-2 rounded-full bg-blue-500" />
        Phase 1 · Arrival & foundations
      </div>
      <h3 className="text-xl font-semibold text-slate-900 mb-2">
        Land softly in Germany.
      </h3>
      <p className="text-slate-600 mb-2">
        Orientation, onboarding and first language baseline – with a focus
        on everyday communication and feeling at home.
      </p>
      <ul className="text-slate-600 space-y-1">
        <li>• Orientation and personal starting point check.</li>
        <li>• Everyday German for living and basic work situations.</li>
        <li>• Early contact with mentors and peer community.</li>
      </ul>
    </div>

    {/* Phase 2 */}
    <div id="phase-2">
      <div className="inline-flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-700 mb-3">
        <span className="h-2 w-2 rounded-full bg-emerald-500" />
        Phase 2 · Deepening & practice
      </div>
      <h3 className="text-xl font-semibold text-slate-900 mb-2">
        Practice for real jobs and real life.
      </h3>
      <p className="text-slate-600 mb-2">
        Job-related German, scenarios and role plays – with alternating
        task formats to keep motivation high.
      </p>
      <ul className="text-slate-600 space-y-1">
        <li>• Job-specific language for logistics, care, childcare and trades.</li>
        <li>• Changing formats (video, tasks, group sessions) to avoid burnout.</li>
        <li>• Regular feedback from mentors and AI-coach.</li>
      </ul>
    </div>

    {/* Phase 3 */}
    <div id="phase-3">
      <div className="inline-flex items-center gap-2 rounded-full bg-slate-50 px-3 py-1 text-xs font-medium text-slate-700 mb-3">
        <span className="h-2 w-2 rounded-full bg-slate-600" />
        Phase 3 · Job-ready & matching
      </div>
      <h3 className="text-xl font-semibold text-slate-900 mb-2">
        Move confidently into work.
      </h3>
      <p className="text-slate-600 mb-2">
        Interview preparation, workplace communication and matching with
        partner employers or education paths.
      </p>
      <ul className="text-slate-600 space-y-1">
        <li>• Practice for interviews and typical workplace conversations.</li>
        <li>• Matching with partner employers or education partners.</li>
        <li>• Clear next steps: job, apprenticeship or further training.</li>
      </ul>
    </div>
  </div>
</section>
        {/* BRANDING SECTION */}
        <section className="max-w-3xl mx-auto mt-10 text-slate-700 leading-relaxed">
          <h2 className="text-2xl font-semibold mb-4">What is Evolgrit?</h2>
          <p className="mb-3">
            We believe every person can improve their future — through evolution{" "}
            <em>(Evol-)</em> and resilience <em>(-grit)</em>.
          </p>
          <p>
            Evolgrit stands for the ability to keep moving forward despite
            challenges, to learn, to grow, and to build a new life.
          </p>
        </section>
        {/* FINAL CTA BAR */}
<section className="max-w-6xl mx-auto mt-16 px-5">
  <div className="rounded-2xl bg-slate-900 text-slate-50 px-6 py-6 sm:px-8 sm:py-7 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
    <div>
      <h2 className="text-xl sm:text-2xl font-semibold mb-1">
        Ready to shape the next Evolgrit cohort?
      </h2>
      <p className="text-slate-300 text-sm sm:text-base">
        Whether you&apos;re a learner, employer or mentor – we&apos;d love to
        explore how Evolgrit can work for you.
      </p>
    </div>
    <div className="flex flex-wrap gap-3">
      <a
        href="mailto:info@evolgrit.com?subject=Join%20Evolgrit%20beta"
        className="rounded-full bg-blue-500 px-4 py-2 text-sm font-medium text-white hover:bg-blue-600"
      >
        Join the beta waitlist
      </a>
      <a
        href="mailto:info@evolgrit.com?subject=Evolgrit%20intro%20call"
        className="rounded-full border border-slate-500 px-4 py-2 text-sm font-medium text-slate-50 hover:bg-slate-800"
      >
        Book an intro call
      </a>
    </div>
  </div>
</section>
      </main>
    </div>
  );
}