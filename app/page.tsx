'use client';

import { useState } from "react";
import Image from "next/image";

type EmployerCard = {
  id: string;
  label: string;
  icon: string;
  title: string;
  description: string;
  modalTitle: string;
  modalBody: string;
};

const employerCards: EmployerCard[] = [
  {
    id: "readiness",
    label: "Readiness at a glance",
    icon: "📊",
    title: "See who is really ready – not just who has a CV.",
    description:
      "Language level, cultural readiness and reliability signals in one simple view.",
    modalTitle: "One profile that shows real readiness.",
    modalBody: `Mit Evolgrit sehen Sie nicht nur einen Lebenslauf:

• Sprachlevel und Selbstvertrauen – basierend auf echten Aufgaben.
• Kulturelle Bereitschaft – Alltag, Arbeit und Teamdynamik.
• Zuverlässigkeitssignale – Teilnahme, Aufgabenerfüllung, Engagement.

So erkennen Sie auf einen Blick, welche Kandidat:innen wirklich für Ihre Rollen vorbereitet sind – nicht nur, wer ein Zertifikat besitzt.`,
  },
  {
    id: "risk",
    label: "Onboarding support",
    icon: "🧭",
    title: "Reduce onboarding risk for you and your team.",
    description:
      "Structured support before and after arrival – so people actually stay.",
    modalTitle: "Weniger Onboarding-Risiko, mehr Stabilität.",
    modalBody: `Evolgrit begleitet internationale Talente schon vor dem ersten Vertrag:

• Vorbereitung auf Arbeitsalltag, Schichtpläne und Kommunikation im Team.
• Klärung von Papieren, Wohnung, Versicherungen und Behördenwegen.
• Mentoring in den ersten Wochen im Job – sprachlich und kulturell.

Das senkt Ihr Risiko im Onboarding und erhöht die Chance, dass neue Mitarbeitende langfristig bleiben.`,
  },
  {
    id: "pilots",
    label: "Pilot cohorts",
    icon: "🧪",
    title: "Start with focused pilot cohorts.",
    description:
      "Align roles, locations and timelines – and learn together in small steps.",
    modalTitle: "Gemeinsam mit Pilotkohorten starten.",
    modalBody: `Wir beginnen nicht mit Hunderten Profilen, sondern mit klaren Pilotkohorten:

• Ausrichtung auf Ihre Rollen (z.B. Logistik, Pflege, Busfahrer:innen).
• Abstimmung auf Standorte, Schichten und Saisonverläufe.
• Gemeinsame Definition von Sprache, Skills und Unterstützung.

So können Sie das Modell im Kleinen testen, bevor Sie es skalieren.`,
  },
  {
    id: "pipeline",
    label: "Repeatable pipeline",
    icon: "🔁",
    title: "Build a repeatable international talent pipeline.",
    description:
      "Plug Evolgrit into your existing hiring process – not a separate universe.",
    modalTitle: "Eine wiederholbare Pipeline für internationale Talente.",
    modalBody: `In späteren Phasen kann Evolgrit in Ihre bestehende Talent-Pipeline integriert werden:

• Gemeinsame Definition von Rollenprofilen und Anforderungen.
• Regelmäßige Kohorten, die zu Ihren Einstellungszyklen passen.
• Transparente Kennzahlen zu Sprache, Fortschritt und Verbleib.

Damit wird internationale Einstellung kein einmaliges Projekt, sondern ein wiederholbares System.`,
  },
];
// WHO EVOLGRIT IS BUILT FOR – cards
const whoCards = [
  {
    id: "learners",
    badge: "L",
    label: "Learners",
    title: "Build real German, culture & job readiness.",
    description:
      "6–12 month hybrid journey with AI-guided modules and mentoring – so German, everyday life and job skills grow together.",
    cta: "See learner journey",
    href: "/learner-journey",
  },
  {
    id: "employers",
    badge: "E",
    label: "Employers",
    title: "Hire international talent that’s ready to stay.",
    description:
      "A pipeline of motivated international candidates with transparent readiness – language, culture and reliability signals.",
    cta: "Hire talent",
    href: "#for-employers",
  },
  {
    id: "mentors",
    badge: "M",
    label: "Mentors",
    title: "Support learners in language, culture & mindset.",
    description:
      "Work with motivated learners in 1:1 or group sessions – and help them arrive in Germany with confidence.",
    cta: "Become a mentor",
    href: "mailto:info@evolgrit.com?subject=Mentor%20at%20Evolgrit",
  },
];

const getToKnowCards = [
  {
    id: "language-jobs",
    label: "Language · Jobs",
    title: "Learn German where you actually use it.",
    description:
      "Job-specific German for care, logistics, childcare and drivers – built into every step of the journey.",
    image: "/know-language-jobs.jpg",
  },
  {
    id: "ai-coach",
    label: "AI coach",
    title: "A language coach that never sleeps.",
    description:
      "Practice speaking, get corrections and explanations in the app – anytime between live sessions.",
    image: "/know-ai-coach.jpg",
  },
  {
    id: "documents",
    label: "Documents · Bureaucracy",
    title: "Finally understand the paperwork.",
    description:
      "Store your documents, get checklists and reminders for visas, contracts, insurance and more.",
    image: "/know-documents-hub.jpg",
  },
  {
    id: "everyday-life",
    label: "Everyday life",
    title: "Learn how Germany really works.",
    description:
      "Supermarket, doctors, public transport, appointments – practise real situations for your new life.",
    image: "/know-everyday-life.jpg",
  },
  {
    id: "family-housing",
    label: "Family · Housing",
    title: "Support for you and your family.",
    description:
      "Guidance for school onboarding, childcare, housing search and understanding local systems – so the whole family can arrive, not just the person with the job.",
    image: "/know-family-housing.jpg",
  },
  {
    id: "live-sessions",
    label: "Live sessions",
    title: "Weekly live sessions that keep you going.",
    description:
      "Real talk about life in Germany, culture, mindset and well-being – not only grammar. Mentors help with stress, homesickness and tricky situations in everyday life.",
    image: "/know-life-sessions.jpg",
  },
  {
    id: "mentors-cohort",
    label: "Mentors · Cohort",
    title: "Mentors and a cohort you can grow with.",
    description:
      "Learn together with peers, mentors and employers in one loop – with real people, not just an app.",
    image: "/know-mentors-cohort.jpg",
  },
] as const;

const pathwaysCards = [
  {
    id: "crafts",
    label: "Crafts · Construction",
    title: "Crafts & construction: Build Germany’s future with your hands.",
    description:
      "You like working with your hands and seeing real results. Evolgrit trains your German for tools, safety and construction sites – and helps you into your first job in trades and construction.",
    image: "/pathways-crafts.jpg",
  },
  {
    id: "facility",
    label: "Facility · Building services",
    title: "Facility & building services: Keep homes and workplaces running.",
    description:
      "From small repairs to larger jobs, you make buildings work. Evolgrit prepares your German for maintenance requests, tools and safety – so you can grow into caretaker and building services roles.",
    image: "/pathways-facility.jpg",
  },
  {
    id: "hospitality",
    label: "Hospitality · Gastronomy",
    title:
      "Hospitality & gastronomy: Create places where people feel welcome.",
    description:
      "You enjoy working with people. Evolgrit trains your German for orders, menus, teamwork and shift plans – so you can start in cafés, restaurants or hotels.",
    image: "/pathways-hospitality.jpg",
  },
  {
    id: "engineering",
    label: "Engineering · Production",
    title:
      "Engineering & production: Use your technical skills in European industry.",
    description:
      "You bring technical or engineering experience. Evolgrit helps you talk about machines, processes and safety in German – and prepares you for entry-level roles in production and technical support.",
    image: "/pathways-engineering.jpg",
  },
  {
    id: "logistics",
    label: "Logistics · Warehouses & delivery",
    title: "Logistics: Build a stable start, fast.",
    description:
      "You enjoy movement, teamwork and clear structures. With Evolgrit you learn the German you need for warehouses, scanners, deliveries and safety – and we help you into your first contract in Germany.",
    image: "/pathways-logistics.jpg",
  },
  {
    id: "drivers",
    label: "Professional drivers · People & goods",
    title: "Professional driver: Move people and goods across Europe.",
    description:
      "You like the road and responsibility. Evolgrit helps you with German for routes, passengers, shift plans and safety briefings – so you can start in local transport or regional logistics.",
    image: "/pathways-drivers.jpg",
  },
  {
    id: "care",
    label: "Childcare & care · Families & communities",
    title: "Childcare & care: Support families and feel at home.",
    description:
      "You love working with people. Evolgrit prepares you for conversations with children, parents, colleagues and patients – plus cultural modules for trust, empathy and everyday life in Germany.",
    image: "/pathways-care.jpg",
  },
] as const;
export default function Home() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [openEmployerCardId, setOpenEmployerCardId] = useState<string | null>(
    null
  );
  const [activePathway, setActivePathway] =
    useState<(typeof pathwaysCards)[number] | null>(null);
  const activeEmployerCard = employerCards.find(
    (card) => card.id === openEmployerCardId
  );
  // EXAMPLE JOURNEYS – IMAGE CARDS
  const journeyCards = [
    {
      id: "lucia",
      name: "Lucía",
      age: "27",
      country: "Spain",
      flag: "🇪🇸",
      route: "Childcare assistant",
      image: "/journey-lucia.jpg",
      short:
        "Started with A2 German and several years of childcare experience from Spain.",
      result:
        "In 9 months: B1, cultural modules for working with parents and colleagues, first job as a childcare assistant in a Kindergarten.",
    },
    {
      id: "mihai",
      name: "Mihai",
      age: "32",
      country: "Romania",
      flag: "🇷🇴",
      route: "Bus driver",
      image: "/journey-mihai.jpg",
      short: "Strong driving experience, but low confidence in German.",
      result:
        "Evolgrit focused on job phrases, shift plans and passenger situations – now working as a bus driver in local public transport.",
    },
    {
      id: "eleni",
      name: "Eleni",
      age: "24",
      country: "Greece",
      flag: "🇬🇷",
      route: "Warehouse & logistics",
      image: "/journey-eleni.jpg",
      short: "Tech-savvy and used to English, but new to German.",
      result:
        "Combined German with scanner & system vocabulary and safety language – now working in a logistics hub with room to grow.",
    },
  ] as const;
  const howItWorksSteps = [
    {
      step: "01",
      title: "Onboarding & profiling",
      body:
        "Learners share their background, target role and current language level – so we can tailor their journey.",
    },
    {
      step: "02",
      title: "Hybrid learning program",
      body:
        "Language and culture are practiced in job-related situations with a mix of digital tasks and live mentor sessions.",
    },
    {
      step: "03",
      title: "Progress & readiness",
      body:
        "We continuously track progress and flag when someone is ready for interviews and new opportunities.",
    },
    {
      step: "04",
      title: "Matching & next steps",
      body:
        "We connect learners with partner employers or education paths – always aligned with skills, language and personal goals.",
    },
  ] as const;
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
    
{/* HERO – MAIN MISSION + COHORT STATS */}
<section className="border-b border-slate-100 bg-gradient-to-b from-slate-50/80 to-white">
  <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24 grid gap-12 lg:grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)] items-start">
    {/* Left: Mission & CTAs */}
    <div className="space-y-6">
      <div className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-medium text-slate-500">
        <span className="inline-flex h-1.5 w-1.5 rounded-full bg-emerald-500" />
        Private beta 2026 · international learners & employers
      </div>

      <div className="space-y-4">
        <h1 className="text-3xl sm:text-4xl lg:text-[2.7rem] font-semibold tracking-tight text-slate-900">
          AI-powered German learning &amp; job coaching for international talent.
        </h1>
        <p className="text-base sm:text-lg text-slate-600 max-w-xl">
          Evolgrit is a 6–12 month hybrid journey that combines AI-powered German learning,
          cultural readiness and job preparation – so international talent can truly arrive
          and stay in Germany, not just pass an exam.
        </p>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <a
          href="/waitlist"
          className="inline-flex items-center justify-center rounded-full bg-slate-900 px-5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-slate-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-900/50"
        >
          Join learner waitlist
        </a>
        <a
          href="#how-it-works"
          className="inline-flex items-center justify-center rounded-full border border-slate-300 bg-white px-5 py-2.5 text-sm font-semibold text-slate-900 hover:border-slate-400"
        >
          See how it works
        </a>
      </div>

      <p className="text-xs uppercase tracking-[0.16em] text-slate-400">
        Built for people first – shaped together with learners and employers.
      </p>
    </div>

    {/* Right: Cohort overview card */}
    <aside className="w-full max-w-md lg:ml-auto">
      <div className="rounded-3xl border border-slate-200 bg-white/80 shadow-sm backdrop-blur-sm p-5 sm:p-6 space-y-5">
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-xs font-semibold tracking-[0.18em] text-slate-400">
              EVOLGRIT · COHORT OVERVIEW
            </p>
            <p className="mt-1 text-sm font-semibold text-slate-900">
              Q1 · Preview cohort
            </p>
          </div>
          <span className="inline-flex items-center rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
            New · cultural readiness score
          </span>
        </div>

        <dl className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
          <div>
            <dt className="text-slate-500">Language progress</dt>
            <dd className="mt-1 text-lg font-semibold text-slate-900">+38%</dd>
            <p className="mt-0.5 text-xs text-slate-500">over 12 weeks</p>
          </div>
          <div>
            <dt className="text-slate-500">Job-ready profiles</dt>
            <dd className="mt-1 text-lg font-semibold text-slate-900">24</dd>
            <p className="mt-0.5 text-xs text-slate-500">of 32 learners</p>
          </div>
          <div>
            <dt className="text-slate-500">Employer matches</dt>
            <dd className="mt-1 text-lg font-semibold text-slate-900">17</dd>
            <p className="mt-0.5 text-xs text-slate-500">active pipelines</p>
          </div>
        </dl>

        <div className="rounded-2xl bg-slate-50 px-4 py-3 text-xs text-slate-600 leading-relaxed">
          Top signals: B1+/B2 learners with care, logistics &amp; hospitality background – plus a
          new cultural readiness score.
        </div>
      </div>
    </aside>
  </div>
</section>

      {/* LEARNER STORY – TINA */}
      <section
        aria-labelledby="tina-story-heading"
        className="max-w-6xl mx-auto mt-6 px-5"
      >
        <div
          className="
      rounded-3xl border border-slate-200 bg-white shadow-sm
      p-6 sm:p-7 lg:p-8
      flex flex-col gap-6 lg:flex-row lg:items-stretch
    "
        >
          {/* Linke Seite: Story-Text */}
          <div className="flex-1 space-y-3">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-emerald-600">
              Learner story · Childcare
            </p>

            <h3
              id="tina-story-heading"
              className="text-lg sm:text-xl font-semibold tracking-tight text-slate-900"
            >
              Tina · 24 · von Kosovo → Kinder­garten­assistentin in Berlin
            </h3>

            <p className="text-sm sm:text-base text-slate-600">
              In nur drei Wochen ist Tina vom unsicheren Deutsch zu einer Kollegin
              geworden, die Kinder, Eltern und Team sicher durch den Alltag
              begleitet – als wäre sie schon seit Jahren dabei.
            </p>

            <p className="text-sm sm:text-base text-slate-900 italic">
              „Vor Evolgrit hatte ich Angst vor Gesprächen mit Eltern. Jetzt kann ich
              den Tag erklären, Wünsche verstehen und Konflikte ruhig ansprechen –
              auf Deutsch.“
            </p>

            {/* kleine Chips wie bei Apple-Tags */}
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

          {/* Rechte Seite: kompaktes Profil / Meta */}
          <aside
            className="
        w-full lg:w-64
        lg:border-l lg:border-slate-100 lg:pl-6
        flex flex-col gap-4
        text-sm text-slate-600
      "
          >
            {/* Avatar + Kurzinfo */}
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-100 text-emerald-700 text-sm font-semibold">
                T
              </div>
              <div>
                <p className="text-xs uppercase tracking-[0.16em] text-slate-400">
                  Profil
                </p>
                <p className="text-sm font-medium text-slate-900">
                  Tina, 24 · Kinder­garten­assistenz
                </p>
              </div>
            </div>

            {/* kleine Fakten-Liste */}
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
                <dd className="font-medium text-slate-900">
                  AI-Coach + 1:1 Mentoring
                </dd>
              </div>
            </dl>
          </aside>
        </div>
      </section>
<section
  id="who"
  className="bg-slate-50 py-16 sm:py-20"
>
  <div className="max-w-6xl mx-auto px-5">
    {/* Eyebrow */}
    <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
      Who Evolgrit is built for
    </p>

    {/* Headline + Intro */}
    <div className="mt-3 flex flex-col gap-3 sm:flex-row sm:items-baseline sm:justify-between">
      <div className="max-w-2xl">
        <h2 className="text-2xl sm:text-3xl font-semibold tracking-tight text-slate-900">
          Who Evolgrit is built for.
        </h2>
        <p className="mt-2 text-sm sm:text-base text-slate-600">
          Evolgrit connects learners, employers and mentors in one shared
          journey – so language, culture and work preparation happen together.
        </p>
      </div>
    </div>

    {/* Karten – gleiches Layout wie Arbeitgeber-Block */}
    <div
      className="
        mt-8
        flex gap-4 overflow-x-auto pb-2 -mx-5 px-5
        md:mx-0 md:px-0 md:grid md:grid-cols-3 md:gap-6 md:overflow-visible
      "
    >
      {whoCards.map((card) => (
        <article
          key={card.id}
          className="
            group relative w-[260px] shrink-0
            rounded-3xl border border-slate-200 bg-white shadow-sm
            p-5 sm:p-6 flex flex-col justify-between
            transition-transform duration-200
            hover:-translate-y-1 hover:shadow-lg
            md:w-auto
          "
        >
          {/* Kopf mit Badge + Label */}
          <div className="flex items-center gap-3 mb-4">
            <div
              className="
                flex h-9 w-9 items-center justify-center
                rounded-2xl bg-slate-900 text-slate-50 text-sm font-semibold
                shadow-sm shadow-slate-900/30
              "
            >
              {card.badge}
            </div>
            <div className="text-xs font-medium uppercase tracking-[0.18em] text-slate-400">
              {card.label}
            </div>
          </div>

          {/* Titel + Beschreibung */}
          <div className="space-y-2">
            <h3 className="text-sm sm:text-base font-semibold text-slate-900">
              {card.title}
            </h3>
            <p className="text-sm text-slate-600">
              {card.description}
            </p>
          </div>

          {/* CTA-Link unten */}
          <div className="mt-4 pt-3 border-t border-slate-100">
            <a
              href={card.href}
              className="inline-flex items-center text-sm font-medium text-blue-600 hover:text-blue-700"
            >
              {card.cta}
              <span className="ml-1 text-base" aria-hidden="true">
                →
              </span>
            </a>
          </div>
        </article>
      ))}
    </div>
  </div>
</section>

{/* WHY EVOLGRIT IS NEEDED NOW */}
<section className="bg-white py-12 sm:py-14">
  <div className="max-w-6xl mx-auto px-5">
    <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
      Why now
    </p>
    <div className="mt-3 grid gap-4 md:grid-cols-[minmax(0,1.4fr),minmax(0,1fr)] md:items-start">
      <div className="space-y-3">
        <h2 className="text-2xl sm:text-3xl font-semibold tracking-tight text-slate-900">
          Why Evolgrit is needed now.
        </h2>
        <p className="text-sm sm:text-base text-slate-600">
          In many frontline and care roles – from logistics and construction to childcare
          and hospitality – there are more open jobs than people. At the same time,
          international talent often loses months to language, paperwork and unclear
          expectations.
        </p>
        <p className="text-sm sm:text-base text-slate-600">
          Evolgrit connects language, everyday life and job preparation in one guided
          journey – so people can start faster and are more likely to stay.
        </p>
      </div>
      <ul className="space-y-2 text-sm text-slate-600 mt-2 md:mt-0">
        <li>• <span className="font-medium">Real demand:</span> roles in care, logistics, trades and service keep growing.</li>
        <li>• <span className="font-medium">Real friction:</span> language, bureaucracy and everyday life slow people down.</li>
        <li>• <span className="font-medium">Real opportunity:</span> programmes that combine language and life setup make a difference.</li>
      </ul>
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

  {/* PATHWAYS – SLIDER */}
  <div className="relative -mx-5 px-5 sm:-mx-6 sm:px-6 mt-10 sm:mt-12">
    <div className="flex gap-4 overflow-x-auto pb-4 snap-x snap-mandatory scrollbar-hide">
      {pathwaysCards.map((card) => (
        <article
          key={card.id}
          className="group relative snap-center shrink-0 w-[80%] sm:w-[360px] lg:w-[380px] rounded-3xl bg-slate-900 text-slate-50 overflow-hidden shadow-sm border border-slate-800/60 transition-transform duration-300 hover:-translate-y-1 hover:shadow-lg pb-14 sm:pb-16"
        >
          <div className="relative aspect-[3/4] overflow-hidden">
            <Image
              src={card.image}
              alt={card.title}
              fill
              className="object-cover"
              sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 85vw"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-slate-900/45 to-transparent" />
          </div>

          <div className="absolute inset-0 z-10 flex flex-col justify-end p-6 sm:p-7 text-white">
            <p className="text-[11px] font-semibold tracking-[0.18em] uppercase text-slate-200">
              {card.label}
            </p>
            <h3 className="mt-2 text-lg sm:text-xl font-semibold leading-snug">
              {card.title}
            </h3>
            <p className="mt-2 text-sm sm:text-[15px] leading-relaxed text-slate-100/90">
              {card.description}
            </p>
          </div>

          {/* Plus-Button für Details (Modal) */}
          <button
            type="button"
            onClick={() => setActivePathway(card)}
            className="absolute bottom-4 right-4 z-10 inline-flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-900 text-xl shadow-sm transition hover:scale-105"
            aria-label={`More about ${card.title}`}
          >
            +
          </button>
        </article>
      ))}
    </div>
  </div>
</section>
{activePathway && (
  <div
    className="fixed inset-0 z-40 flex items-center justify-center bg-slate-900/60 px-4"
    role="dialog"
    aria-modal="true"
    aria-labelledby="pathway-modal-title"
  >
    <div className="relative w-full max-w-xl rounded-3xl bg-white shadow-xl p-6 sm:p-8">
      <button
        type="button"
        onClick={() => setActivePathway(null)}
        className="absolute right-4 top-4 inline-flex h-8 w-8 items-center justify-center rounded-full bg-slate-100 text-slate-500 hover:bg-slate-200 hover:text-slate-700"
        aria-label="Close details"
      >
        ×
      </button>
      <p className="text-xs uppercase tracking-[0.18em] text-slate-400">
        {activePathway.label}
      </p>
      <h3
        id="pathway-modal-title"
        className="mt-2 text-xl sm:text-2xl font-semibold text-slate-900"
      >
        {activePathway.title}
      </h3>
      <p className="mt-3 text-sm text-slate-600">{activePathway.description}</p>
    </div>
  </div>
)}

<section
  aria-labelledby="example-journeys-heading"
  className="max-w-6xl mx-auto px-4 lg:px-6 py-16"
>
  <div className="mb-8 text-center">
    <h2
      id="example-journeys-heading"
      className="text-2xl sm:text-3xl font-semibold tracking-tight text-slate-900"
    >
      Example journeys with Evolgrit.
    </h2>
    <p className="mt-2 text-sm text-slate-500 max-w-2xl mx-auto">
      These stories are typical paths – not promises. They show how language, culture
      and work can grow together over 6–12 months.
    </p>
  </div>

  <div className="grid gap-6 md:grid-cols-3">
    {journeyCards.map((card) => (
      <article
        key={card.id}
        className="rounded-3xl bg-white border border-slate-200 shadow-sm overflow-hidden flex flex-col"
      >
        <div className="relative aspect-[4/3]">
          <Image
            src={card.image}
            alt={`${card.name} – ${card.route}`}
            fill
            className="object-cover"
            sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
          />
        </div>

        <div className="flex-1 px-5 pb-5 pt-4 flex flex-col">
          <p className="text-[11px] uppercase tracking-[0.18em] text-slate-400 mb-1">
            <span className="mr-1">{card.flag}</span>
            {card.country}
          </p>
          <h3 className="text-sm font-semibold text-slate-900 mb-1">
            {card.name} · {card.age} · from {card.country} → {card.route}
          </h3>
          <p className="text-xs text-slate-600 mb-1">{card.short}</p>
          <p className="text-xs text-slate-600">{card.result}</p>
        </div>
      </article>
    ))}
  </div>

  <p className="mt-4 text-[11px] text-slate-400 text-center">
    These are illustrative stories based on typical learner profiles. Actual outcomes
    depend on each person&apos;s situation and effort.
  </p>
</section>
{/* GET TO KNOW EVOLGRIT */}
<section
  id="get-to-know"
  aria-labelledby="get-to-know-title"
  className="bg-slate-50 py-16 sm:py-20"
>
  <div className="max-w-6xl mx-auto px-4 sm:px-6">
    <div className="flex items-baseline justify-between gap-4">
      <div>
        <h2
          id="get-to-know-title"
          className="text-2xl sm:text-3xl font-semibold tracking-tight text-slate-900"
        >
          Get to know Evolgrit.
        </h2>
        <p className="mt-2 text-sm sm:text-base text-slate-600 max-w-xl">
          Evolgrit is not a normal German course. We combine language, everyday life and
          job preparation in one journey – so you can actually live and work in Germany,
          not just pass an exam.
        </p>
        <p className="mt-1 text-xs sm:text-sm text-slate-500 max-w-xl">
          These seven pillars show how: from job-specific German and an AI-coach to
          real-life mentoring, family support and help with documents.
        </p>
      </div>
      <a
        href="#how-it-works"
        className="hidden sm:inline-flex items-center text-xs font-medium text-blue-600 hover:text-blue-700"
      >
        Learn how Evolgrit works&nbsp;→
      </a>
    </div>

    {/* Horizontale, swipebare Kartenleiste */}
    <div className="mt-8 flex gap-5 overflow-x-auto pb-4 snap-x snap-mandatory">
      {getToKnowCards.map((card) => (
        <article
          key={card.id}
          className="group relative shrink-0 snap-center w-[82%] sm:w-[60%] md:w-[360px] lg:w-[380px] rounded-3xl bg-slate-900 text-slate-50 overflow-hidden shadow-sm transition-transform duration-300 hover:-translate-y-1 hover:shadow-xl pb-14 sm:pb-16"
        >
          <div className="relative aspect-[4/5]">
            <Image
              src={card.image}
              alt={card.title}
              fill
              sizes="(min-width:1024px) 360px, (min-width:768px) 60vw, 82vw"
              className="object-cover"
            />
            {/* dunkler Verlauf für bessere Lesbarkeit */}
            <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-slate-900/40 to-slate-900/10" />

            <div className="absolute inset-x-5 bottom-4 sm:bottom-6">
              <p className="text-[11px] uppercase tracking-[0.18em] text-slate-300">
                {card.label}
              </p>
              <h3 className="mt-1 text-base sm:text-lg font-semibold leading-snug">
                {card.title}
              </h3>
              <p className="mt-2 text-xs sm:text-sm text-slate-100/90 line-clamp-3">
                {card.description}
              </p>
            </div>
          </div>

          {/* Plus-Button wie bei Apple, ohne spezielle Funktion (noch) */}
          <button
            type="button"
            className="absolute bottom-4 right-4 inline-flex h-9 w-9 items-center justify-center rounded-full bg-white/90 text-slate-900 shadow-sm ring-1 ring-slate-200/80 transition group-hover:scale-105 group-hover:bg-white"
            aria-label="More about this Evolgrit feature"
          >
            <span className="text-lg leading-none">+</span>
          </button>
        </article>
      ))}
    </div>
  </div>
</section>

{/* HOW IT WORKS SECTION */}
<section id="how-it-works" className="scroll-mt-24 py-16 sm:py-20">
  <div className="max-w-6xl mx-auto px-6 sm:px-8">
    <div className="text-center space-y-2 mb-10">
      <p className="text-[11px] uppercase tracking-[0.18em] text-slate-400">
        Learner journey
      </p>
      <h2 className="text-2xl sm:text-3xl font-semibold tracking-tight text-slate-900">
        How Evolgrit works for learners
      </h2>
    </div>

    <div className="grid gap-4 sm:gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
      {howItWorksSteps.map((step) => (
        <article
          key={step.step}
          className="rounded-3xl border border-slate-200 bg-white shadow-sm p-5 sm:p-6 space-y-3"
        >
          <span className="inline-flex items-center rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-[11px] uppercase tracking-[0.18em] text-slate-500">
            Step {step.step}
          </span>
          <h3 className="text-sm font-semibold text-slate-900">
            {step.title}
          </h3>
          <p className="text-sm text-slate-500 leading-relaxed">
            {step.body}
          </p>
        </article>
      ))}
    </div>

    <div className="mt-10 rounded-3xl border border-slate-200 bg-white shadow-sm p-5 sm:p-6">
      <h3 className="text-sm sm:text-base font-semibold text-slate-900 mb-2">
        What learners get with Evolgrit
      </h3>
      <ul className="text-sm text-slate-500 leading-relaxed space-y-1.5">
        <li>• A clear multi-month structure with defined phases.</li>
        <li>• Regular changes in task formats to keep motivation high.</li>
        <li>• Live mentoring for language, culture and career questions.</li>
        <li>• A clear next step: job, apprenticeship or further training.</li>
      </ul>
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

{/* READINESS SCORE EXPLAINER */}
<section className="bg-slate-50 py-12 sm:py-14 border-t border-slate-100">
  <div className="max-w-6xl mx-auto px-5">
    <div className="max-w-2xl">
      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
        Readiness score
      </p>
      <h2 className="mt-2 text-2xl sm:text-3xl font-semibold tracking-tight text-slate-900">
        See more than just a language level.
      </h2>
      <p className="mt-2 text-sm sm:text-base text-slate-600">
        The Evolgrit Readiness Score brings language, everyday life and job skills
        together in one simple view – so employers can see who is truly ready for a role,
        and learners can see how far they have come.
      </p>
    </div>

    <div className="mt-5 grid gap-3 sm:grid-cols-2 text-sm">
      <div className="rounded-2xl border border-slate-200 bg-white p-4">
        <p className="text-xs font-medium text-slate-500 mb-1">
          Language &amp; communication
        </p>
        <p className="text-sm text-slate-700">
          Not just a CEFR level – but confidence in real workplace and everyday
          situations.
        </p>
      </div>
      <div className="rounded-2xl border border-slate-200 bg-white p-4">
        <p className="text-xs font-medium text-slate-500 mb-1">
          Everyday life &amp; culture
        </p>
        <p className="text-sm text-slate-700">
          How well someone understands expectations in teams, with customers,
          parents or patients.
        </p>
      </div>
      <div className="rounded-2xl border border-slate-200 bg-white p-4">
        <p className="text-xs font-medium text-slate-500 mb-1">
          Job skills &amp; work language
        </p>
        <p className="text-sm text-slate-700">
          Practice in job-specific scenarios – from shift handovers to safety
          briefings and customer conversations.
        </p>
      </div>
      <div className="rounded-2xl border border-slate-200 bg-white p-4">
        <p className="text-xs font-medium text-slate-500 mb-1">
          Reliability signals
        </p>
        <p className="text-sm text-slate-700">
          Engagement, task completion and feedback over time – to see who really
          shows up.
        </p>
      </div>
    </div>
  </div>
</section>

      <section
        id="for-employers"
        className="bg-slate-50 py-16 sm:py-20"
      >
        <div className="max-w-6xl mx-auto px-4 lg:px-6">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-10">
            <div>
              <p className="text-xs font-semibold tracking-[0.18em] text-slate-400 uppercase">
                For employers
              </p>
              <h2 className="mt-2 text-2xl sm:text-3xl font-semibold text-slate-900">
                For employers who need international talent to actually stay.
              </h2>
              <p className="mt-3 text-sm sm:text-base text-slate-600 max-w-2xl">
                Evolgrit gives you access to motivated international candidates who are
                not only learning German – they are actively preparing for life and
                work in your organisation.
              </p>
            </div>

            <a
              href="mailto:info@evolgrit.com?subject=Evolgrit%20for%20employers"
              className="hidden sm:inline-flex items-center justify-center rounded-full bg-slate-900 px-5 py-2 text-sm font-medium text-slate-50 shadow-md shadow-slate-900/40 hover:bg-slate-800"
            >
              Talk to us about hiring
            </a>
          </div>

          {/* Swipeable cards */}
          <div className="relative">
            <div className="flex gap-4 overflow-x-auto pb-4 -mx-4 px-4 md:mx-0 md:px-0 md:overflow-visible snap-x snap-mandatory">
              {employerCards.map((card) => (
                <article
                  key={card.id}
                  onClick={() => setOpenEmployerCardId(card.id)}
                  className="group snap-center shrink-0 w-[80%] sm:w-[320px] md:w-1/4 rounded-3xl bg-white border border-slate-200 shadow-sm hover:shadow-lg transition-transform duration-300 hover:-translate-y-1 cursor-pointer relative flex flex-col justify-between p-5 pb-14 sm:pb-16"
                >
                  <div className="flex items-start gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-2xl bg-slate-900 text-base text-slate-50">
                      <span aria-hidden="true">{card.icon}</span>
                    </div>
                    <div className="space-y-1">
                      <p className="text-[11px] uppercase tracking-[0.18em] text-slate-400">
                        {card.label}
                      </p>
                      <h3 className="text-sm font-semibold text-slate-900">
                        {card.title}
                      </h3>
                    </div>
                  </div>

                  <p className="mt-3 text-xs sm:text-sm text-slate-600">
                    {card.description}
                  </p>

                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setOpenEmployerCardId(card.id);
                    }}
                    aria-label={`Open details for: ${card.title}`}
                    className="absolute bottom-4 right-4 inline-flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 bg-white text-lg font-medium text-slate-900 shadow-sm group-hover:bg-slate-900 group-hover:text-slate-50 transition-colors"
                  >
                    +
                  </button>
                </article>
              ))}
            </div>
          </div>

          {/* Mobile CTA unterhalb der Cards */}
          <div className="mt-6 sm:hidden">
            <a
              href="mailto:info@evolgrit.com?subject=Evolgrit%20for%20employers"
              className="inline-flex w-full items-center justify-center rounded-full bg-slate-900 px-5 py-2.5 text-sm font-medium text-slate-50 shadow-md shadow-slate-900/40 hover:bg-slate-800"
            >
              Talk to us about hiring
            </a>
          </div>
        </div>
      </section>
      {activeEmployerCard && (
        <div
          className="fixed inset-0 z-40 flex items-center justify-center bg-slate-900/60 px-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby="employer-modal-title"
        >
          <div className="relative w-full max-w-lg rounded-3xl bg-white shadow-xl p-6 sm:p-8">
            <button
              type="button"
              onClick={() => setOpenEmployerCardId(null)}
              className="absolute right-4 top-4 inline-flex h-8 w-8 items-center justify-center rounded-full bg-slate-100 text-slate-500 hover:bg-slate-200 hover:text-slate-700"
              aria-label="Close details"
            >
              ×
            </button>

            <p className="text-xs uppercase tracking-[0.18em] text-slate-400">
              {activeEmployerCard.label}
            </p>
            <h3
              id="employer-modal-title"
              className="mt-2 text-xl sm:text-2xl font-semibold text-slate-900"
            >
              {activeEmployerCard.modalTitle}
            </h3>
            <p className="mt-3 whitespace-pre-line text-sm text-slate-600">
              {activeEmployerCard.modalBody}
            </p>

            <div className="mt-5 flex flex-wrap gap-3">
              <a
                href="mailto:info@evolgrit.com?subject=Evolgrit%20for%20employers"
                className="inline-flex items-center justify-center rounded-full bg-slate-900 px-4 py-2 text-sm font-medium text-slate-50 shadow-md shadow-slate-900/40 hover:bg-slate-800"
              >
                Speak with an employer specialist
              </a>
              <button
                type="button"
                onClick={() => setOpenEmployerCardId(null)}
                className="inline-flex items-center justify-center rounded-full border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
      {/* EMPLOYER TESTIMONIAL – Sabrina & Tina */}
      <section className="max-w-5xl mx-auto px-5 sm:px-6 lg:px-8 pt-12 sm:pt-16">
        <div className="rounded-3xl bg-white border border-slate-200 shadow-sm overflow-hidden">
          {/* Bild oben */}
          <div className="relative aspect-[16/9] sm:aspect-[21/9]">
            <Image
              src="/testimonial-tina.jpg"
              alt="Tina arbeitet mit Kindern in einem Kindergarten"
              fill
              className="object-cover"
              sizes="(min-width: 1024px) 832px, 100vw"
            />
          </div>

          {/* Text darunter */}
          <div className="p-6 sm:p-8">
            <p className="text-xs uppercase tracking-[0.18em] text-slate-400 mb-2">
              Arbeitgebergeschichte · Kinderbetreuung
            </p>

            <p className="text-lg sm:text-xl font-semibold text-slate-900 mb-3">
              „Nach drei Wochen fühlt es sich an, als wäre sie schon seit Jahren im Team.“
            </p>

            <p className="text-sm text-slate-600 mb-4">
              „Unsere neue Kollegin Tina kam über Evolgrit zu uns. Ihr Deutsch ist sicher,
              sie kennt die typischen Situationen im Kindergarten – vom Elterngespräch bis
              zur Übergabe am Morgen – und bewegt sich kulturell so, als hätte sie schon
              lange in Deutschland gelebt. Dabei ist sie erst seit drei Wochen in unserer
              Einrichtung.“
            </p>

            <div className="flex items-center gap-3 text-xs text-slate-500">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-100 text-emerald-700 text-sm font-semibold">
                S
              </div>
              <div>
                <p className="font-semibold text-slate-700">Sabrina M.</p>
                <p>Kindergartenleiterin · Berlin</p>
              </div>
              <span className="ml-auto inline-flex items-center rounded-full bg-emerald-50 text-emerald-700 px-2 py-[2px] text-[11px]">
                Über Evolgrit angestellt
              </span>
            </div>
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
