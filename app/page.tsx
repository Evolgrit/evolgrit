'use client';

import Image from "next/image";
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
className="flex items-center gap-2 cursor-pointer"
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

  <a
    href="/login"
    className="rounded-full border border-slate-200 bg-white/80 px-3 py-1.5 text-sm hover:bg-white shadow-sm"
  >
    Log in
  </a>
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
  <a
    href="/login"
    className="flex-1 rounded-full border border-slate-200 bg-white/80 px-3 py-1.5 text-xs hover:bg-white shadow-sm flex items-center justify-center text-slate-700"
    onClick={() => setIsMenuOpen(false)}
  >
    Log in
  </a>
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
  <div className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-[11px] text-emerald-700 mb-3">
    <span className="inline-block h-2 w-2 rounded-full bg-emerald-500" />
    Private beta 2026 · international learners & employers
  </div>

  {/* Category / Positioning line */}
  <p className="text-[11px] sm:text-xs font-medium text-slate-500 tracking-[0.16em] uppercase mb-3">
    Not a language school. A European talent &amp; integration engine.
  </p>

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
      international talent can truly arrive and stay in Germany, not just
      pass an exam.
    </p>

    <div className="flex flex-wrap gap-3 mb-3">
      <a
        href="mailto:info@evolgrit.com?subject=Evolgrit%20Beta%20waitlist&amp;body=Hi%20Evolgrit%20team,%0A%0AI%27d%20like%20to%20join%20the%20beta.%0A%0AName:%0AGerman%20level:%0AProfessional%20background:%0A"
        className="rounded-full bg-blue-600 px-5 py-2 text-sm font-medium text-white shadow-md shadow-blue-500/40 hover:bg-blue-700 inline-flex items-center justify-center"
      >
        Join learner waitlist
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
<a
  className="text-blue-600 font-medium text-sm hover:underline"
  href="/learner-journey"
>
  See learner journey →
</a>
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
{/* PATHWAYS – Apple-style cards with swipe on mobile */}
<section id="pathways" className="max-w-6xl mx-auto mt-24 px-5">
  {/* Headline + intro */}
  <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
    <div>
      <h2 className="text-3xl sm:text-[32px] font-semibold text-slate-900">
        Unlock your future in Germany
      </h2>
      <p className="mt-2 text-sm sm:text-base text-slate-600 max-w-2xl">
        Turn your experience into a real life in Germany – with language,
        culture and job support on one Evolgrit journey.
      </p>
      <p className="mt-1 text-[13px] text-slate-500 max-w-xl">
        Choose a pathway that fits your strengths. Evolgrit walks beside you
        from first words to your first working day.
      </p>
    </div>
    <div className="hidden sm:flex items-center gap-3 text-sm">
      <a href="#how-it-works" className="text-slate-500 hover:text-slate-900">
        Learn how Evolgrit works →
      </a>
    </div>
  </div>

  {/* Cards wrapper: swipe on mobile, grid on desktop */}
  <div className="mt-8 flex gap-4 overflow-x-auto snap-x snap-mandatory pb-4 md:grid md:grid-cols-3 md:gap-5 md:overflow-visible md:snap-none md:pb-0">
    {/* Logistics card */}
    <article className="snap-center shrink-0 w-[85%] md:w-auto md:shrink-0 md:snap-none rounded-3xl bg-white border border-slate-200 shadow-sm overflow-hidden flex flex-col group transition-transform duration-300 ease-out hover:-translate-y-1 hover:shadow-lg">
      <div className="relative aspect-[4/3] overflow-hidden">
        <Image
          src="/pathways-logistics.jpg"
          alt="International logistics team in a warehouse"
          fill
          sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 85vw"
          className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
        />
      </div>
      <div className="p-5 flex flex-col flex-1">
        <p className="text-[11px] font-medium tracking-[0.18em] text-slate-400 uppercase mb-1">
          Logistics · Warehouses &amp; delivery
        </p>
        <h3 className="text-base sm:text-lg font-semibold text-slate-900 mb-2">
          Logistics: Build a stable start, fast.
        </h3>
        <p className="text-sm text-slate-600 flex-1">
          You enjoy movement, teamwork and clear structures. With Evolgrit you
          learn the German you need for warehouses, scanners, deliveries and
          safety – and we help you into your first contract in Germany.
        </p>
        <a
          href="#phase-2"
          className="mt-4 self-end inline-flex h-9 w-9 items-center justify-center rounded-full bg-slate-900 text-white text-xl leading-none shadow-md shadow-slate-900/30 hover:bg-slate-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-slate-900"
          aria-label="See logistics pathway"
        >
          +
        </a>
      </div>
    </article>

    {/* Professional drivers card */}
    <article className="snap-center shrink-0 w-[85%] md:w-auto md:shrink-0 md:snap-none rounded-3xl bg-white border border-slate-200 shadow-sm overflow-hidden flex flex-col group transition-transform duration-300 ease-out hover:-translate-y-1 hover:shadow-lg">
      <div className="relative aspect-[4/3] overflow-hidden bg-slate-100">
        <Image
          src="/pathways-drivers.jpg"
          alt="Professional bus driver in the driver seat"
          fill
          sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 85vw"
          className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
        />
      </div>
      <div className="p-5 flex flex-col flex-1">
        <p className="text-[11px] font-medium tracking-[0.18em] text-slate-400 uppercase mb-1">
          Professional drivers · People &amp; goods
        </p>
        <h3 className="text-base sm:text-lg font-semibold text-slate-900 mb-2">
          Professional driver: Move people and goods across Europe.
        </h3>
        <p className="text-sm text-slate-600 flex-1">
          You like the road and responsibility. Evolgrit helps you with German
          for routes, passengers, shift plans and safety briefings – so you can
          start in local transport or regional logistics.
        </p>
        <a
          href="#phase-2"
          className="mt-4 self-end inline-flex h-9 w-9 items-center justify-center rounded-full bg-slate-900 text-white text-xl leading-none shadow-md shadow-slate-900/30 hover:bg-slate-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-slate-900"
          aria-label="See professional driver pathway"
        >
          +
        </a>
      </div>
    </article>

    {/* Childcare & care card */}
    <article className="snap-center shrink-0 w-[85%] md:w-auto md:shrink-0 md:snap-none rounded-3xl bg-white border border-slate-200 shadow-sm overflow-hidden flex flex-col group transition-transform duration-300 ease-out hover:-translate-y-1 hover:shadow-lg">
      <div className="relative aspect-[4/3] overflow-hidden">
        <Image
          src="/pathways-care.jpg"
          alt="Childcare and care professionals with children and patients"
          fill
          sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 85vw"
          className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
        />
      </div>
      <div className="p-5 flex flex-col flex-1">
        <p className="text-[11px] font-medium tracking-[0.18em] text-slate-400 uppercase mb-1">
          Childcare &amp; Care · Families &amp; communities
        </p>
        <h3 className="text-base sm:text-lg font-semibold text-slate-900 mb-2">
          Childcare &amp; care: Support families and feel at home.
        </h3>
        <p className="text-sm text-slate-600 flex-1">
          You love working with people. Evolgrit prepares you for conversations
          with children, parents, colleagues and patients – plus cultural
          modules for trust, empathy and everyday life in Germany.
        </p>
        <a
          href="#phase-2"
          className="mt-4 self-end inline-flex h-9 w-9 items-center justify-center rounded-full bg-slate-900 text-white text-xl leading-none shadow-md shadow-slate-900/30 hover:bg-slate-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-slate-900"
          aria-label="See childcare and care pathway"
        >
          +
        </a>
      </div>
    </article>
  </div>
</section>
{/* EXAMPLE JOURNEYS – TYPICAL PATHS */}
<section className="max-w-6xl mx-auto mt-24 px-5">
  <div className="text-center max-w-2xl mx-auto mb-8">
    <h2 className="text-3xl font-semibold text-slate-900 mb-3">
      Example journeys with Evolgrit.
    </h2>
    <p className="text-sm sm:text-base text-slate-600">
      These stories are typical paths – not promises. They show how language,
      culture and work can grow together over 6–12 months.
    </p>
  </div>

  <div className="space-y-4">
    {/* Lucía – Spain */}
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm flex gap-4 items-start">
      <div className="flex flex-col items-center gap-2 shrink-0">
        <div className="h-10 w-10 rounded-full bg-slate-900 text-slate-50 flex items-center justify-center text-sm font-semibold">
          L
        </div>
        <span className="text-xs text-slate-500">🇪🇸 Spain</span>
      </div>
      <div className="space-y-1 text-sm">
        <p className="font-semibold text-slate-900">
          Lucía · 27 · from Spain → Childcare assistant
        </p>
        <p className="text-slate-600">
          Started with A2 German and several years of childcare experience from
          Spain.
        </p>
        <p className="text-slate-600">
          In 9 months: B1, cultural modules for working with parents and
          colleagues, first job as a childcare assistant in a Kindergarten.
        </p>
      </div>
    </div>

    {/* Mihai – Romania */}
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm flex gap-4 items-start">
      <div className="flex flex-col items-center gap-2 shrink-0">
        <div className="h-10 w-10 rounded-full bg-slate-900 text-slate-50 flex items-center justify-center text-sm font-semibold">
          M
        </div>
        <span className="text-xs text-slate-500">🇷🇴 Romania</span>
      </div>
      <div className="space-y-1 text-sm">
        <p className="font-semibold text-slate-900">
          Mihai · 32 · from Romania → Bus driver
        </p>
        <p className="text-slate-600">
          Strong driving experience, but low confidence in German.
        </p>
        <p className="text-slate-600">
          Evolgrit focused on job phrases, shift plans and passenger
          situations – now working as a bus driver in local public transport.
        </p>
      </div>
    </div>

    {/* Eleni – Greece */}
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm flex gap-4 items-start">
      <div className="flex flex-col items-center gap-2 shrink-0">
        <div className="h-10 w-10 rounded-full bg-slate-900 text-slate-50 flex items-center justify-center text-sm font-semibold">
          E
        </div>
        <span className="text-xs text-slate-500">🇬🇷 Greece</span>
      </div>
      <div className="space-y-1 text-sm">
        <p className="font-semibold text-slate-900">
          Eleni · 24 · from Greece → Warehouse &amp; logistics
        </p>
        <p className="text-slate-600">
          Tech-savvy and used to English, but new to German.
        </p>
        <p className="text-slate-600">
          Combined German with scanner &amp; system language and safety vocabulary –
          now working in a logistics hub with room to grow.
        </p>
      </div>
    </div>
  </div>

  <p className="mt-3 text-[11px] text-slate-500">
    These are illustrative stories based on typical learner profiles. Actual
    outcomes depend on each person&apos;s situation and effort.
  </p>
</section>
{/* WHY EVOLGRIT – NOT A NORMAL COURSE */}
<section className="max-w-6xl mx-auto mt-20 px-5">
  <div className="text-center max-w-2xl mx-auto mb-10">
    <h2 className="text-3xl font-semibold text-slate-900 mb-3">
      Why Evolgrit is not a normal German course.
    </h2>
    <p className="text-sm sm:text-base text-slate-600">
      Evolgrit combines language, integration and jobs in one loop – built for
      people who actually want to live and work in Germany, not just pass a test.
    </p>
  </div>

  <div className="grid gap-4 md:grid-cols-3 text-sm">
    {/* Card 1 */}
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm flex flex-col gap-3">
      <div className="flex items-center gap-3">
        <div className="h-9 w-9 rounded-2xl bg-blue-600/10 text-blue-600 flex items-center justify-center text-base font-semibold">
          A
        </div>
        <h3 className="font-semibold text-slate-900">
          Language in real jobs
        </h3>
      </div>
      <p className="text-slate-600 text-sm">
        Practice German in real work situations – childcare, care, logistics,
        drivers – instead of artificial textbook dialogues.
      </p>
    </div>

    {/* Card 2 */}
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm flex flex-col gap-3">
      <div className="flex items-center gap-3">
        <div className="h-9 w-9 rounded-2xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center text-base font-semibold">
          B
        </div>
        <h3 className="font-semibold text-slate-900">
          Integration built-in
        </h3>
      </div>
      <p className="text-slate-600 text-sm">
        Housing, offices, doctors and contracts – everyday situations in Germany
        are part of the learning path, not an afterthought.
      </p>
    </div>

    {/* Card 3 */}
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm flex flex-col gap-3">
      <div className="flex items-center gap-3">
        <div className="h-9 w-9 rounded-2xl bg-violet-500/10 text-violet-600 flex items-center justify-center text-base font-semibold">
          C
        </div>
        <h3 className="font-semibold text-slate-900">
          Job &amp; employer ready
        </h3>
      </div>
      <p className="text-slate-600 text-sm">
        Profiles show language level, skills and reliability signals – so
        employers can see who is ready for which role, not just who has a
        certificate.
      </p>
    </div>
  </div>
</section>
{/* AI LAYER – WHAT IT ACTUALLY DOES */}
<section className="max-w-6xl mx-auto mt-16 px-5">
  <div className="max-w-2xl mb-8">
    <h2 className="text-2xl sm:text-3xl font-semibold text-slate-900 mb-3">
      What the AI in Evolgrit actually does.
    </h2>
    <p className="text-sm sm:text-base text-slate-600">
      AI is not a buzzword for us – it helps learners, mentors and employers
      make better decisions every week.
    </p>
  </div>

  <div className="grid gap-4 md:grid-cols-3 text-sm">
    {/* AI card 1 */}
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm flex flex-col gap-2">
      <div className="flex items-center gap-2">
        <div className="h-8 w-8 rounded-full bg-sky-500/10 text-sky-600 flex items-center justify-center text-sm font-semibold">
          1
        </div>
        <h3 className="font-semibold text-slate-900">
          Personalised practice tasks
        </h3>
      </div>
      <p className="text-slate-600 text-sm">
        Evolgrit adjusts difficulty, topics and feedback to each learner –
        based on their target role, level and pace.
      </p>
    </div>

    {/* AI card 2 */}
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm flex flex-col gap-2">
      <div className="flex items-center gap-2">
        <div className="h-8 w-8 rounded-full bg-emerald-500/10 text-emerald-600 flex items-center justify-center text-sm font-semibold">
          2
        </div>
        <h3 className="font-semibold text-slate-900">
          Always-on language coach
        </h3>
      </div>
      <p className="text-slate-600 text-sm">
        Learners can practice speaking, get corrections and explanations on
        demand – not only during live sessions.
      </p>
    </div>

    {/* AI card 3 */}
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm flex flex-col gap-2">
      <div className="flex items-center gap-2">
        <div className="h-8 w-8 rounded-full bg-amber-500/10 text-amber-600 flex items-center justify-center text-sm font-semibold">
          3
        </div>
        <h3 className="font-semibold text-slate-900">
          Signals for mentors &amp; employers
        </h3>
      </div>
      <p className="text-slate-600 text-sm">
        The AI summarises progress into simple signals – language, cultural
        readiness and reliability – for mentors and partner employers.
      </p>
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
  With Evolgrit, learners build German, cultural confidence and job
  readiness in parallel. AI-guided modules, changing task formats and
  regular human mentoring keep motivation high – and make sure progress
  is real, not just on paper.
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
      {/* PROGRAM TIMELINE / THREE PHASES */}
      <section className="max-w-6xl mx-auto mt-24 px-5">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <h2 className="text-3xl font-semibold text-slate-900 mb-3">
            Three phases – not just a course.
          </h2>
          <p className="text-sm sm:text-base text-slate-600">
            Evolgrit is a structured 3-phase journey – from arrival to job-ready –
            so learners can grow step by step without burning out.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-3 text-sm">
          {/* Phase 1 */}
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm flex flex-col gap-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-2xl bg-blue-600/10 text-blue-600 flex items-center justify-center text-sm font-semibold">
                1
              </div>
              <div>
                <p className="text-[11px] uppercase tracking-[0.18em] text-slate-400">
                  Phase 1 · Arrival &amp; foundations
                </p>
                <h3 className="font-semibold text-slate-900">
                  Land softly in Germany.
                </h3>
              </div>
            </div>

            <ul className="space-y-1.5 text-slate-600 text-sm">
              <li>• Orientation, onboarding and a first language baseline.</li>
              <li>• Everyday German for living and basic work situations.</li>
              <li>• Early contact with mentors and a peer community.</li>
            </ul>

            <div className="mt-auto pt-2">
              <span className="inline-flex items-center rounded-full bg-blue-50 text-blue-700 text-[11px] px-3 py-1">
                Everyday confidence
              </span>
            </div>
          </div>

          {/* Phase 2 */}
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm flex flex-col gap-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-2xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center text-sm font-semibold">
                2
              </div>
              <div>
                <p className="text-[11px] uppercase tracking-[0.18em] text-slate-400">
                  Phase 2 · Deepening &amp; practice
                </p>
                <h3 className="font-semibold text-slate-900">
                  Practice for real jobs and real life.
                </h3>
              </div>
            </div>

            <ul className="space-y-1.5 text-slate-600 text-sm">
              <li>• Job-related German with scenarios and role plays.</li>
              <li>• Job-specific language for logistics, care &amp; childcare.</li>
              <li>• Changing formats and regular feedback from mentors &amp; AI-coach.</li>
            </ul>

            <div className="mt-auto pt-2">
              <span className="inline-flex items-center rounded-full bg-emerald-50 text-emerald-700 text-[11px] px-3 py-1">
                Work-ready language
              </span>
            </div>
          </div>

          {/* Phase 3 */}
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm flex flex-col gap-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-2xl bg-violet-500/10 text-violet-600 flex items-center justify-center text-sm font-semibold">
                3
              </div>
              <div>
                <p className="text-[11px] uppercase tracking-[0.18em] text-slate-400">
                  Phase 3 · Job-ready &amp; matching
                </p>
                <h3 className="font-semibold text-slate-900">
                  Move confidently into work.
                </h3>
              </div>
            </div>

            <ul className="space-y-1.5 text-slate-600 text-sm">
              <li>• Interview preparation and workplace communication.</li>
              <li>• Matching with partner employers or education partners.</li>
              <li>• Clear next steps: job, apprenticeship or further training.</li>
            </ul>

            <div className="mt-auto pt-2">
              <span className="inline-flex items-center rounded-full bg-violet-50 text-violet-700 text-[11px] px-3 py-1">
                Job-ready &amp; matched
              </span>
            </div>
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
            <p className="mt-4 text-sm text-slate-600">
              With Evolgrit you don&apos;t just get a CV – you see:
            </p>
            <ul className="mt-2 text-sm text-slate-600 space-y-1">
              <li>• 🔵 Language level &amp; confidence</li>
              <li>• 🟢 Cultural readiness (everyday life &amp; workplace)</li>
              <li>• 🟣 Reliability signals (attendance, task completion)</li>
            </ul>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm text-sm space-y-3">
            <h3 className="font-semibold text-slate-900">
              What you can expect as a partner
            </h3>
            <p className="text-slate-600">
              We start small with pilot cohorts and align the program with your
              roles, locations and timelines. You get clear expectations on
              language, skills and support.
            </p>
            <p className="text-slate-600">
              In later stages, Evolgrit can plug into your existing talent
              pipeline and help you build a repeatable model for international
              hiring.
            </p>
            <div className="pt-2 flex flex-wrap gap-3">
              <a
                href="mailto:info@evolgrit.com?subject=Evolgrit%20Employer%20Partnership"
                className="inline-flex items-center justify-center rounded-full bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800"
              >
                Talk to us about hiring
              </a>
              <a
                href="mailto:info@evolgrit.com?subject=Employer%20intro%20call"
                className="inline-flex items-center justify-center rounded-full border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-900 hover:bg-slate-50"
              >
                Book an employer intro call
              </a>
            </div>
          </div>
        </div>
      </section>
{/* EMPLOYER TESTIMONIAL – SABRINA */}
<section className="max-w-6xl mx-auto mt-10 px-5">
  <div className="rounded-3xl border border-slate-200 bg-white shadow-sm p-6 sm:p-7 flex flex-col sm:flex-row gap-5 items-start">
    {/* Left: avatar + meta */}
    <div className="flex flex-col items-center sm:items-start gap-3 shrink-0">
      <div className="flex items-center justify-center h-12 w-12 rounded-full bg-emerald-100 text-emerald-700 text-lg font-semibold">
        S
      </div>
      <div className="text-xs text-slate-500 text-center sm:text-left">
        <p className="font-semibold text-slate-700">Sabrina M.</p>
        <p>Kindergarten manager · Berlin</p>
      </div>
      <span className="inline-flex items-center rounded-full bg-emerald-50 text-emerald-700 px-2 py-[3px] text-[11px]">
        Hired via Evolgrit
      </span>
    </div>

    {/* Right: quote */}
    <div className="space-y-3">
      <p className="text-[11px] uppercase tracking-[0.18em] text-slate-400">
        Employer story · Childcare
      </p>
      <p className="text-sm sm:text-base text-slate-900 font-semibold">
        „After three weeks it feels like she has been on the team for years.“
      </p>
      <p className="text-sm text-slate-600 leading-relaxed">
        „Our new colleague Tina joined us through Evolgrit. Her German is
        confident, she understands typical Kindergarten situations – from
        morning drop-offs to parent conversations – and moves through everyday
        life as if she had lived in Germany for years. But she has only been
        with us for three weeks.“
      </p>
    </div>
  </div>
</section>
{/* BRANDING SECTION */}
<section className="max-w-3xl mx-auto mt-10 text-slate-700 leading-relaxed">
  <h2 className="text-2xl font-semibold mb-4">What is Evolgrit?</h2>
  <p className="mb-3">
    We believe every person can improve their future — through evolution{" "}
    <em>(Evol-)</em> and grit <em>(-grit)</em>.
  </p>
  <p>
    Evolgrit stands for the ability to keep going despite challenges, to
    learn, to grow and to build a new life.
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
              Whether you&apos;re a learner, employer or mentor – we&apos;d
              love to explore how Evolgrit can work for you.
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
