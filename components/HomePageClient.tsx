'use client';

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";

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
    label: "Pilot batches",
    icon: "🧪",
    title: "Start with focused pilot batches.",
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
    label: "Mentors · Batch",
    title: "Mentors and a batch you can grow with.",
    description:
      "Learn together with peers, mentors and employers in one loop – with real people, not just an app.",
    image: "/know-mentors-cohort.jpg",
  },
] as const;

type GetToKnowModalPanel = {
  id: string;
  eyebrow: string;
  image: string;
  bullets: string[];
};

type GetToKnowModalContent = {
  id: string;
  label: string;
  title: string;
  intro: string;
  panels: GetToKnowModalPanel[];
};

const getToKnowModalContent: Record<string, GetToKnowModalContent> = {
  documents: {
    id: "documents",
    label: "Documents · Bureaucracy",
    title: "Finally understand the paperwork.",
    intro:
      "We help you collect, translate and organize the documents that matter — so you move faster and avoid costly mistakes.",
    panels: [
      {
        id: "documents-1",
        eyebrow: "Recognition & forms",
        image: "/get-to-know/gettoknow-documents-paperwork.jpg",
        bullets: [
          "Step-by-step checklists for your case",
          "Reminders for deadlines, appointments, renewals",
          "Clear explanations in simple German",
        ],
      },
      {
        id: "documents-2",
        eyebrow: "Everything in one place",
        image: "/get-to-know/gettoknow-documents-paperwork.jpg",
        bullets: [
          "Upload and store key documents",
          "Share a secure link with mentors (optional)",
        ],
      },
      {
        id: "documents-3",
        eyebrow: "Less stress, more momentum",
        image: "/get-to-know/gettoknow-documents-paperwork.jpg",
        bullets: ["Know what's next, even if the system feels complex"],
      },
    ],
  },
  "family-housing": {
    id: "family-housing",
    label: "Family · Housing",
    title: "Support for you and your family.",
    intro:
      "If you move with family, integration is a team sport. Evolgrit helps you handle the first weeks smoothly.",
    panels: [
      {
        id: "family-1",
        eyebrow: "School & childcare",
        image: "/get-to-know/gettoknow-family-support.jpg",
        bullets: [
          "Guidance for school onboarding and Kita registration",
          "What to prepare before you arrive",
        ],
      },
      {
        id: "family-2",
        eyebrow: "Housing & everyday setup",
        image: "/get-to-know/gettoknow-family-support.jpg",
        bullets: [
          "Basics: Anmeldung, insurance, appointments",
          "Checklists for moving-in and first month",
        ],
      },
      {
        id: "family-3",
        eyebrow: "One plan, not 10 apps",
        image: "/get-to-know/gettoknow-family-support.jpg",
        bullets: ["A single roadmap for your whole household"],
      },
    ],
  },
  "language-jobs": {
    id: "language-jobs",
    label: "Language · Jobs",
    title: "Learn German where you actually use it.",
    intro:
      "Job-specific German and real-life scenarios — so language becomes confidence on the job.",
    panels: [
      {
        id: "language-1",
        eyebrow: "Real scenarios",
        image: "/get-to-know/gettoknow-job-language-busstop.jpg",
        bullets: [
          "Shift handovers, safety briefings, customer conversations",
        ],
      },
      {
        id: "language-2",
        eyebrow: "Role-based vocabulary",
        image: "/get-to-know/gettoknow-job-language-busstop.jpg",
        bullets: [
          "Drivers, logistics, care, hospitality — tailored pathways",
        ],
      },
      {
        id: "language-3",
        eyebrow: "Ready for day one",
        image: "/get-to-know/gettoknow-job-language-busstop.jpg",
        bullets: ["Less guessing, more clarity in real situations"],
      },
    ],
  },
};

type PathwayModalPanel = {
  id: string;
  eyebrow: string;
  image: string;
  bullets: string[];
};

type PathwayModalContent = {
  id: string;
  label: string;
  title: string;
  intro: string;
  panels: PathwayModalPanel[];
};

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

const pathwaysModalContent: Record<string, PathwayModalContent> = {
  drivers: {
    id: "drivers",
    label: "Professional drivers · People & goods",
    title: "Professional driver: Move people and goods across Europe.",
    intro:
      "You like the road and responsibility. Evolgrit helps you with German for routes, passengers, shift plans and safety briefings — so you can start in local transport or regional logistics.",
    panels: [
      {
        id: "drivers-1",
        eyebrow: "Professional drivers · People & goods",
        image: "/get-to-know/gettoknow-documents-paperwork.jpg",
        bullets: [
          "Understand contracts, insurance and work rules",
          "Checklists for permits, onboarding and paperwork",
        ],
      },
      {
        id: "drivers-2",
        eyebrow: "Support for you and your family",
        image: "/get-to-know/gettoknow-family-support.jpg",
        bullets: [
          "School onboarding, childcare and housing setup",
          "What to prepare before you arrive",
        ],
      },
      {
        id: "drivers-3",
        eyebrow: "Job language — day one ready",
        image: "/get-to-know/gettoknow-job-language-busstop.jpg",
        bullets: [
          "Route talk, passenger communication, safety briefings",
          "Shift handovers and real scenarios",
        ],
      },
    ],
  },
};

const evolgritPhases = [
  {
    id: "phase-1",
    label: "PHASE 1",
    title: "Arrival & foundations",
    summary:
      "Land softly: orientation, everyday German and a peer group that stays with you.",
    bullets: [
      "Orientation, onboarding and a first language baseline.",
      "Everyday German for living and basic work situations.",
      "Early contact with mentors and a peer community.",
    ],
  },
  {
    id: "phase-2",
    label: "PHASE 2",
    title: "Practice & deepening",
    summary:
      "Real job scenarios, cultural coaching and switching formats to keep energy high.",
    bullets: [
      "Job-related German with scenarios and role plays.",
      "Job-specific language for logistics, care & childcare.",
      "Changing formats and regular mentor feedback.",
    ],
  },
  {
    id: "phase-3",
    label: "PHASE 3",
    title: "Job-ready & matching",
    summary:
      "Mentors, employer signals and matching into work or education paths.",
    bullets: [
      "Interview preparation and workplace communication.",
      "Matching with partner employers or education partners.",
      "Clear next steps: job, apprenticeship or further training.",
    ],
  },
] as const;

const evolgritSteps = [
  {
    id: "step-1",
    number: "01",
    title: "Onboarding & profiling",
    description:
      "We understand your story, level and goals so the batch plan fits you from day one.",
    outcome: "Ready to start Phase 1",
    colSpan: "md:col-span-3 md:col-start-1",
  },
  {
    id: "step-2",
    number: "02",
    title: "Hybrid learning blocks",
    description:
      "Language, culture and job tasks blend across app practice, mentor feedback and live check-ins.",
    outcome: "Momentum inside Phase 2",
    colSpan: "md:col-span-3 md:col-start-4",
  },
  {
    id: "step-3",
    number: "03",
    title: "Progress & readiness signals",
    description:
      "We track language, everyday life and reliability so mentors and employers know when you’re ready.",
    outcome: "Clear readiness scores",
    colSpan: "md:col-span-3 md:col-start-7",
  },
  {
    id: "step-4",
    number: "04",
    title: "Matching & next steps",
    description:
      "Batch graduates move into roles, apprenticeships or further training with partner employers.",
    outcome: "Confident transition",
    colSpan: "md:col-span-3 md:col-start-10",
  },
] as const;

const learnersGetHighlights = [
  {
    id: "structure",
    icon: "✓",
    title: "Multi-month structure",
    body: "A clear multi-month structure with defined phases.",
  },
  {
    id: "formats",
    icon: "↺",
    title: "Changing formats",
    body: "Regular changes in task formats to keep motivation high.",
  },
  {
    id: "mentoring",
    icon: "★",
    title: "Live mentoring",
    body: "Live mentoring for language, culture and career questions.",
  },
  {
    id: "next-step",
    icon: "→",
    title: "Clear next step",
    body: "A clear next step: job, apprenticeship or further training.",
  },
] as const;
export default function HomePageClient() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [openEmployerCardId, setOpenEmployerCardId] = useState<string | null>(
    null
  );
  const [activePathwayModal, setActivePathwayModal] =
    useState<PathwayModalContent | null>(null);
  const pathwaysScrollRef = useRef<HTMLDivElement | null>(null);
  const [pathwaysEdges, setPathwaysEdges] = useState({
    atStart: true,
    atEnd: false,
  });
  useEffect(() => {
    const el = pathwaysScrollRef.current;
    if (!el) return;
    setPathwaysEdges({
      atStart: el.scrollLeft <= 8,
      atEnd: el.scrollLeft + el.clientWidth >= el.scrollWidth - 8,
    });
  }, []);
  const [activeJourneyPhase, setActiveJourneyPhase] =
    useState<(typeof evolgritPhases)[number] | null>(null);
  const journeysScrollRef = useRef<HTMLDivElement | null>(null);
  const journeyDragState = useRef({
    isDragging: false,
    startX: 0,
    scrollLeft: 0,
  });
  const [journeysEdges, setJourneysEdges] = useState({
    atStart: true,
    atEnd: false,
  });
  useEffect(() => {
    const el = journeysScrollRef.current;
    if (!el) return;
    setJourneysEdges({
      atStart: el.scrollLeft <= 8,
      atEnd: el.scrollLeft + el.clientWidth >= el.scrollWidth - 8,
    });
  }, []);
  const getToKnowScrollRef = useRef<HTMLDivElement | null>(null);
  const getToKnowDragState = useRef({
    isDragging: false,
    startX: 0,
    scrollLeft: 0,
  });
  const [getToKnowEdges, setGetToKnowEdges] = useState({
    atStart: true,
    atEnd: false,
  });
  const [activeGetToKnowModal, setActiveGetToKnowModal] =
    useState<GetToKnowModalContent | null>(null);
  useEffect(() => {
    const el = getToKnowScrollRef.current;
    if (!el) return;
    setGetToKnowEdges({
      atStart: el.scrollLeft <= 8,
      atEnd: el.scrollLeft + el.clientWidth >= el.scrollWidth - 8,
    });
  }, []);
  useEffect(() => {
    if (!activePathwayModal) return;
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = originalOverflow;
    };
  }, [activePathwayModal]);
  useEffect(() => {
    if (!activePathwayModal) return;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setActivePathwayModal(null);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [activePathwayModal]);
  useEffect(() => {
    if (!activeGetToKnowModal) return;
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = originalOverflow;
    };
  }, [activeGetToKnowModal]);
  useEffect(() => {
    if (!activeGetToKnowModal) return;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setActiveGetToKnowModal(null);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [activeGetToKnowModal]);
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
              <a href="#journey" className="text-slate-500 hover:text-slate-900">
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
                  <a
                    href="/waitlist"
                    className="rounded-full bg-blue-600 px-4 py-1.5 text-sm font-medium text-white shadow-md shadow-blue-500/40 hover:bg-blue-700"
                  >
                    Join learner waitlist
                  </a>
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
                href="#journey"
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
  <a
    href="/waitlist"
    className="flex-1 rounded-full bg-blue-600 px-3 py-1.5 text-xs font-medium text-white shadow-md shadow-blue-500/40 hover:bg-blue-700 flex items-center justify-center"
    onClick={() => setIsMenuOpen(false)}
  >
    Join learner waitlist
  </a>
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
          German language &amp; job preparation for working in Germany
        </h1>
        <p className="text-base sm:text-lg text-slate-600 max-w-xl">
          Evolgrit is a 6–12 month hybrid journey that combines AI-powered German learning,
          cultural readiness and job preparation – so international talent can truly arrive
          and stay in Germany, not just pass an exam.
        </p>
      </div>

      <div className="mt-8 flex flex-wrap items-center gap-3">
        <a
          href="/waitlist"
          className="inline-flex items-center justify-center rounded-full bg-slate-900 px-5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-slate-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-900/50"
        >
          Join learner waitlist
        </a>
        <Link
          href="/employers"
          className="inline-flex items-center justify-center rounded-full border border-slate-300 bg-white px-5 py-2.5 text-sm font-semibold text-slate-900 hover:border-slate-400"
        >
          Talk to us about hiring
        </Link>
      </div>
      <a
        href="#journey"
        className="mt-3 inline-flex items-center text-sm font-medium text-slate-500 hover:text-slate-900"
      >
        See how it works
        <span className="ml-1" aria-hidden="true">
          →
        </span>
      </a>

      <p className="mt-4 text-xs uppercase tracking-[0.16em] text-slate-400">
        Built for people first – shaped together with learners and employers.
      </p>
    </div>

    {/* Right: Batch overview card */}
    <aside className="w-full max-w-md lg:ml-auto">
      <div className="rounded-3xl border border-slate-200 bg-white/80 shadow-sm backdrop-blur-sm p-5 sm:p-6 space-y-5">
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-xs font-semibold tracking-[0.18em] text-slate-400">
              EVOLGRIT · BATCH OVERVIEW
            </p>
            <p className="mt-1 text-sm font-semibold text-slate-900">
              Q1 · Preview batch
            </p>
          </div>
          <span className="inline-flex items-center rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
            New · cultural readiness score
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="rounded-2xl border border-slate-200 bg-white shadow-sm p-4">
            <p className="text-xs text-slate-500">Language progress</p>
            <p className="mt-1 text-lg font-semibold text-slate-900">+38%</p>
            <p className="mt-0.5 text-xs text-slate-500">over 12 weeks</p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white shadow-sm p-4">
            <p className="text-xs text-slate-500">Job-ready profiles</p>
            <p className="mt-1 text-lg font-semibold text-slate-900">24</p>
            <p className="mt-0.5 text-xs text-slate-500">of 32 learners</p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white shadow-sm p-4">
            <p className="text-xs text-slate-500">Employer matches</p>
            <p className="mt-1 text-lg font-semibold text-slate-900">17</p>
            <p className="mt-0.5 text-xs text-slate-500">active pipelines</p>
          </div>
        </div>

        <div className="rounded-2xl bg-slate-50 border border-slate-200 px-4 py-3 text-xs text-slate-600 leading-relaxed">
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
{/* PATHWAYS – Apple-style cards */}
<section id="pathways" className="mt-24">
  <div className="max-w-6xl mx-auto px-5">
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
        <a href="#journey" className="text-slate-500 hover:text-slate-900">
          Learn how Evolgrit works →
        </a>
      </div>
    </div>
  </div>

  <div className="relative left-1/2 right-1/2 -ml-[50vw] -mr-[50vw] w-screen mt-6">
    <div className="relative px-4 sm:px-6 lg:px-10">
      <div
        ref={pathwaysScrollRef}
        className="flex gap-4 overflow-x-auto pb-4 snap-x snap-mandatory scrollbar-hide"
        onScroll={() => {
          const el = pathwaysScrollRef.current;
          if (!el) return;
          const { scrollLeft, scrollWidth, clientWidth } = el;
          setPathwaysEdges({
            atStart: scrollLeft <= 8,
            atEnd: scrollLeft + clientWidth >= scrollWidth - 8,
          });
        }}
      >
        {pathwaysCards.map((card) => {
          const modalDetail = pathwaysModalContent[card.id];
          const isInteractive = Boolean(modalDetail);
          return (
            <article
              key={card.id}
              role={isInteractive ? "button" : undefined}
              tabIndex={isInteractive ? 0 : -1}
              onClick={() => {
                if (!modalDetail) return;
                setActivePathwayModal(modalDetail);
              }}
              onKeyDown={(event) => {
                if (!modalDetail) return;
                if (event.key === "Enter" || event.key === " ") {
                  event.preventDefault();
                  setActivePathwayModal(modalDetail);
                }
              }}
              className={`flex w-[82%] sm:w-[60%] md:w-[320px] lg:w-[340px] xl:w-[360px] shrink-0 snap-start flex-col overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm transition duration-200 hover:-translate-y-0.5 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-300 ${
                isInteractive ? "cursor-pointer" : ""
              }`}
            >
              <div className="relative aspect-[4/3]">
                <Image
                  src={card.image}
                  alt={card.title}
                  fill
                  className="object-cover"
                  sizes="(min-width:1024px) 33vw, (min-width:768px) 50vw, 100vw"
                />
              </div>
              <div className="flex flex-col gap-2 px-5 pb-5 pt-4">
                <p className="text-[11px] uppercase tracking-[0.18em] text-slate-400">
                  {card.label}
                </p>
                <h3 className="text-base font-semibold text-slate-900 leading-snug">
                  {card.title}
                </h3>
                <p className="text-sm text-slate-600 leading-relaxed line-clamp-3">
                  {card.description}
                </p>
                {isInteractive && (
                  <div className="pt-2 border-t border-slate-100">
                    <span className="inline-flex items-center text-sm font-medium text-blue-600 group-hover:text-blue-700">
                      Learn more
                      <span className="ml-1 text-base" aria-hidden="true">
                        →
                      </span>
                    </span>
                  </div>
                )}
              </div>
            </article>
          );
        })}
      </div>

      <button
        type="button"
        onClick={() => {
          const el = pathwaysScrollRef.current;
          if (!el) return;
          el.scrollBy({ left: -el.clientWidth * 0.8, behavior: "smooth" });
        }}
        className={`hidden md:flex absolute left-6 top-1/2 -translate-y-1/2 h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-700 shadow-sm transition hover:bg-slate-50 ${pathwaysEdges.atStart ? "opacity-0 pointer-events-none" : ""}`}
        aria-label="Scroll pathways left"
      >
        ←
      </button>
      <button
        type="button"
        onClick={() => {
          const el = pathwaysScrollRef.current;
          if (!el) return;
          el.scrollBy({ left: el.clientWidth * 0.8, behavior: "smooth" });
        }}
        className={`hidden md:flex absolute right-6 top-1/2 -translate-y-1/2 h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-700 shadow-sm transition hover:bg-slate-50 ${pathwaysEdges.atEnd ? "opacity-0 pointer-events-none" : ""}`}
        aria-label="Scroll pathways right"
      >
        →
      </button>

      <div className="pointer-events-none absolute inset-y-4 left-0 hidden w-12 bg-gradient-to-r from-white to-transparent lg:block" />
      <div className="pointer-events-none absolute inset-y-4 right-0 hidden w-12 bg-gradient-to-l from-white to-transparent lg:block" />
    </div>
  </div>
</section>
{activePathwayModal && (
  <div className="fixed inset-0 z-50" aria-modal="true" role="dialog">
    <button
      type="button"
      onClick={() => setActivePathwayModal(null)}
      className="absolute inset-0 bg-white/60 backdrop-blur-xl"
      aria-label="Close pathway overlay"
    />
    <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-white/80 via-white/45 to-white/70" />
    <div className="relative z-10 flex min-h-full items-center justify-center px-4 py-8">
      <div className="relative w-[min(980px,calc(100vw-48px))] max-h-[min(820px,calc(100vh-64px))] overflow-hidden rounded-[32px] bg-white shadow-2xl">
        <button
          type="button"
          onClick={() => setActivePathwayModal(null)}
          className="absolute right-4 top-4 z-20 inline-flex h-8 w-8 items-center justify-center rounded-full bg-slate-100 text-slate-500 hover:bg-slate-200 hover:text-slate-700"
          aria-label="Close"
        >
          ×
        </button>
        <div className="max-h-[min(820px,calc(100vh-64px))] overflow-y-auto px-6 sm:px-10 py-10 space-y-10">
          <div className="space-y-3 pt-6">
            <p className="text-xs uppercase tracking-[0.22em] text-slate-500">
              {activePathwayModal.label}
            </p>
            <h3
              id="pathway-modal-title"
              className="text-4xl md:text-5xl font-semibold leading-[1.05] text-slate-900"
            >
              {activePathwayModal.title}
            </h3>
            <p className="text-lg md:text-xl text-slate-600 leading-relaxed">
              {activePathwayModal.intro}
            </p>
          </div>
          {activePathwayModal.panels.map((panel) => (
            <div key={panel.id} className="space-y-3 max-w-[720px] mx-auto">
              <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-slate-500">
                {panel.eyebrow}
              </p>
              <Image
                src={panel.image}
                alt={panel.eyebrow}
                width={1200}
                height={800}
                className="w-full h-[260px] md:h-[320px] rounded-3xl border border-slate-200 object-cover"
              />
              <ul className="list-disc space-y-1.5 text-sm text-slate-600 pl-4">
                {panel.bullets.map((bullet) => (
                  <li key={bullet}>{bullet}</li>
                ))}
              </ul>
            </div>
          ))}
          <div className="pt-2 flex flex-wrap gap-3 justify-center">
            <Link
              href="/waitlist"
              className="inline-flex items-center justify-center rounded-full bg-slate-900 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-slate-800"
            >
              Join learner waitlist
            </Link>
            <button
              type="button"
              onClick={() => setActivePathwayModal(null)}
              className="inline-flex items-center justify-center rounded-full border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
            >
              Close
            </button>
          </div>
        </div>
      </div>
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

  <div className="relative -mx-5 px-5 sm:-mx-6 sm:px-6">
    <div
      ref={journeysScrollRef}
      className="flex gap-4 overflow-x-auto pb-4 snap-x snap-mandatory scrollbar-hide cursor-grab"
      onMouseDown={(event) => {
        const el = journeysScrollRef.current;
        if (!el) return;
        journeyDragState.current.isDragging = true;
        journeyDragState.current.startX = event.pageX - el.offsetLeft;
        journeyDragState.current.scrollLeft = el.scrollLeft;
      }}
      onMouseMove={(event) => {
        const el = journeysScrollRef.current;
        if (!el || !journeyDragState.current.isDragging) return;
        event.preventDefault();
        const x = event.pageX - el.offsetLeft;
        el.scrollLeft =
          journeyDragState.current.scrollLeft - (x - journeyDragState.current.startX) * 1.2;
      }}
      onMouseUp={() => {
        journeyDragState.current.isDragging = false;
      }}
      onMouseLeave={() => {
        journeyDragState.current.isDragging = false;
      }}
      onScroll={() => {
        const el = journeysScrollRef.current;
        if (!el) return;
        const { scrollLeft, scrollWidth, clientWidth } = el;
        setJourneysEdges({
          atStart: scrollLeft <= 8,
          atEnd: scrollLeft + clientWidth >= scrollWidth - 8,
        });
      }}
    >
      {journeyCards.map((card) => (
        <article
          key={card.id}
          className="relative flex w-[82%] sm:w-[60%] md:w-[320px] lg:w-[340px] xl:w-[360px] shrink-0 snap-start flex-col overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm transition duration-200 hover:-translate-y-0.5 hover:shadow-md cursor-pointer"
        >
          <Link
            href="/learner-journey"
            className="absolute inset-0 z-10"
            aria-label={`Learn more about ${card.name}'s journey`}
          />
          <div className="relative aspect-[4/3]">
            <Image
              src={card.image}
              alt={`${card.name} – ${card.route}`}
              fill
              className="object-cover"
              sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
            />
          </div>

          <div className="relative z-20 flex flex-col gap-2 px-5 pb-5 pt-4">
            <p className="text-[11px] uppercase tracking-[0.18em] text-slate-400">
              <span className="mr-1">{card.flag}</span>
              {card.country}
            </p>
            <h3 className="text-sm font-semibold text-slate-900 leading-snug">
              {card.name} · {card.age} · from {card.country} → {card.route}
            </h3>
            <p className="text-xs text-slate-600">{card.short}</p>
            <p className="text-xs text-slate-600">{card.result}</p>
            <div className="pt-2 border-t border-slate-100">
              <span className="inline-flex items-center text-sm font-medium text-blue-600">
                Learn more
                <span className="ml-1 text-base" aria-hidden="true">
                  →
                </span>
              </span>
            </div>
          </div>
        </article>
      ))}
    </div>

    <button
      type="button"
      onClick={() => {
        const el = journeysScrollRef.current;
        if (!el) return;
        el.scrollBy({ left: -el.clientWidth * 0.8, behavior: "smooth" });
      }}
      className={`hidden md:flex absolute left-6 top-1/2 -translate-y-1/2 h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-700 shadow-sm transition hover:bg-slate-50 ${
        journeysEdges.atStart ? "opacity-0 pointer-events-none" : ""
      }`}
      aria-label="Scroll journeys left"
    >
      ←
    </button>
    <button
      type="button"
      onClick={() => {
        const el = journeysScrollRef.current;
        if (!el) return;
        el.scrollBy({ left: el.clientWidth * 0.8, behavior: "smooth" });
      }}
      className={`hidden md:flex absolute right-6 top-1/2 -translate-y-1/2 h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-700 shadow-sm transition hover:bg-slate-50 ${
        journeysEdges.atEnd ? "opacity-0 pointer-events-none" : ""
      }`}
      aria-label="Scroll journeys right"
    >
      →
    </button>

    <div className="pointer-events-none absolute inset-y-4 left-0 hidden w-12 bg-gradient-to-r from-white/70 to-transparent lg:block" />
    <div className="pointer-events-none absolute inset-y-4 right-0 hidden w-12 bg-gradient-to-l from-white/70 to-transparent lg:block" />
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
        href="#journey"
        className="hidden sm:inline-flex items-center text-xs font-medium text-blue-600 hover:text-blue-700"
      >
        Learn how Evolgrit works&nbsp;→
      </a>
    </div>
  </div>

  <div className="relative left-1/2 right-1/2 -ml-[50vw] -mr-[50vw] w-screen mt-8">
    <div className="relative px-4 sm:px-6 lg:px-10">
      <div
        ref={getToKnowScrollRef}
        className="flex gap-5 overflow-x-auto pb-4 snap-x snap-mandatory scrollbar-hide cursor-grab"
        onMouseDown={(event) => {
          const el = getToKnowScrollRef.current;
          if (!el) return;
          getToKnowDragState.current.isDragging = true;
          getToKnowDragState.current.startX = event.pageX - el.offsetLeft;
          getToKnowDragState.current.scrollLeft = el.scrollLeft;
        }}
        onMouseMove={(event) => {
          const el = getToKnowScrollRef.current;
          if (!el || !getToKnowDragState.current.isDragging) return;
          event.preventDefault();
          const x = event.pageX - el.offsetLeft;
          el.scrollLeft =
            getToKnowDragState.current.scrollLeft - (x - getToKnowDragState.current.startX) * 1.1;
        }}
        onMouseUp={() => {
          getToKnowDragState.current.isDragging = false;
        }}
        onMouseLeave={() => {
          getToKnowDragState.current.isDragging = false;
        }}
        onScroll={() => {
          const el = getToKnowScrollRef.current;
          if (!el) return;
          const { scrollLeft, scrollWidth, clientWidth } = el;
          setGetToKnowEdges({
            atStart: scrollLeft <= 8,
            atEnd: scrollLeft + clientWidth >= scrollWidth - 8,
          });
        }}
      >
        {getToKnowCards.map((card) => {
          const modalDetail = getToKnowModalContent[card.id];
          const isInteractive = Boolean(modalDetail);
          return (
            <article
              key={card.id}
              role={isInteractive ? "button" : undefined}
              tabIndex={isInteractive ? 0 : -1}
              onClick={() => {
                if (!modalDetail) return;
                setActiveGetToKnowModal(modalDetail);
              }}
              onKeyDown={(event) => {
                if (!modalDetail) return;
                if (event.key === "Enter" || event.key === " ") {
                  event.preventDefault();
                  setActiveGetToKnowModal(modalDetail);
                }
              }}
              className={`group relative shrink-0 snap-center w-[82%] sm:w-[60%] md:w-[360px] lg:w-[380px] rounded-3xl bg-slate-900 text-slate-50 overflow-hidden shadow-sm transition-transform duration-300 hover:-translate-y-1 hover:shadow-xl pb-14 sm:pb-16 ${
                isInteractive ? "cursor-pointer" : ""
              }`}
            >
              <div className="relative aspect-[4/5]">
                <Image
                  src={card.image}
                  alt={card.title}
                  fill
                  sizes="(min-width:1024px) 360px, (min-width:768px) 60vw, 82vw"
                  className="object-cover"
                />
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
                  {isInteractive && (
                    <div className="mt-3 pt-2 border-t border-white/20 text-xs sm:text-sm font-medium text-slate-100/90 inline-flex items-center gap-1">
                      Learn more
                      <span aria-hidden="true" className="text-base">
                        →
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </article>
          );
        })}
      </div>

      <button
        type="button"
        className={`hidden md:flex absolute left-6 top-1/2 -translate-y-1/2 h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-700 shadow-sm transition hover:bg-slate-50 ${
          getToKnowEdges.atStart ? "opacity-0 pointer-events-none" : ""
        }`}
        onClick={() => {
          const el = getToKnowScrollRef.current;
          if (!el) return;
          el.scrollBy({ left: -el.clientWidth * 0.8, behavior: "smooth" });
        }}
        aria-label="Scroll carousel left"
      >
        ←
      </button>
      <button
        type="button"
        className={`hidden md:flex absolute right-6 top-1/2 -translate-y-1/2 h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-700 shadow-sm transition hover:bg-slate-50 ${
          getToKnowEdges.atEnd ? "opacity-0 pointer-events-none" : ""
        }`}
        onClick={() => {
          const el = getToKnowScrollRef.current;
          if (!el) return;
          el.scrollBy({ left: el.clientWidth * 0.8, behavior: "smooth" });
        }}
        aria-label="Scroll carousel right"
      >
        →
      </button>
      <div className="pointer-events-none absolute inset-y-4 left-0 hidden w-12 bg-gradient-to-r from-slate-50 to-transparent lg:block" />
      <div className="pointer-events-none absolute inset-y-4 right-0 hidden w-12 bg-gradient-to-l from-slate-50 to-transparent lg:block" />
    </div>
  </div>
</section>
{activeGetToKnowModal && (
  <div className="fixed inset-0 z-50" aria-modal="true" role="dialog">
    <button
      type="button"
      onClick={() => setActiveGetToKnowModal(null)}
      className="absolute inset-0 bg-white/70 backdrop-blur-xl"
      aria-label="Close get to know overlay"
    />
    <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-white/80 via-white/40 to-white/70" />
    <div className="relative z-10 flex min-h-full items-center justify-center px-4 py-8">
      <div className="relative w-full max-w-3xl rounded-3xl bg-white shadow-2xl p-6 sm:p-8 space-y-4">
        <button
          type="button"
          onClick={() => setActiveGetToKnowModal(null)}
          className="absolute right-4 top-4 inline-flex h-8 w-8 items-center justify-center rounded-full bg-slate-100 text-slate-500 hover:bg-slate-200 hover:text-slate-700"
          aria-label="Close"
        >
          ×
        </button>
        <p className="text-xs uppercase tracking-[0.18em] text-slate-400">
          {activeGetToKnowModal.label}
        </p>
        <h3 className="text-xl sm:text-2xl font-semibold text-slate-900">
          {activeGetToKnowModal.title}
        </h3>
        <p className="text-sm text-slate-600">{activeGetToKnowModal.intro}</p>
        <div className="mt-4 max-h-[65vh] overflow-y-auto space-y-6 pr-1">
          {activeGetToKnowModal.panels.map((panel) => (
            <div key={panel.id} className="space-y-3">
              <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-slate-400">
                {panel.eyebrow}
              </p>
              <Image
                src={panel.image}
                alt={panel.eyebrow}
                width={1200}
                height={800}
                className="w-full rounded-2xl border border-slate-200 object-cover"
              />
              <ul className="list-disc space-y-1 text-sm text-slate-600 pl-4">
                {panel.bullets.map((bullet) => (
                  <li key={bullet}>{bullet}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="pt-4 flex flex-wrap gap-3">
          <Link
            href="/waitlist"
            className="inline-flex items-center justify-center rounded-full bg-slate-900 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-slate-800"
          >
            Join learner waitlist
          </Link>
          <button
            type="button"
            onClick={() => setActiveGetToKnowModal(null)}
            className="inline-flex items-center justify-center rounded-full border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  </div>
)}

<section id="journey" className="bg-white py-16 sm:py-20 scroll-mt-24">
  <div className="max-w-6xl mx-auto px-4 sm:px-6">
    <div className="text-center space-y-3 mb-10">
      <p className="text-[11px] uppercase tracking-[0.18em] text-slate-400">
        Evolgrit journey
      </p>
      <h2 className="text-2xl sm:text-3xl font-semibold tracking-tight text-slate-900">
        A calm three-phase journey.
      </h2>
      <p className="text-sm sm:text-base text-slate-600 max-w-3xl mx-auto">
        From arrival to job-ready, Evolgrit keeps learners moving step by step without
        burning out.
      </p>
    </div>

    <div className="grid gap-5 md:grid-cols-3">
      {evolgritPhases.map((phase) => (
        <article
          key={phase.id}
          onClick={() => setActiveJourneyPhase(phase)}
          role="button"
          tabIndex={0}
          onKeyDown={(event) => {
            if (event.key === "Enter" || event.key === " ") {
              event.preventDefault();
              setActiveJourneyPhase(phase);
            }
          }}
          className="relative rounded-3xl bg-white border border-slate-200 shadow-sm p-6 space-y-2 cursor-pointer transition duration-200 hover:-translate-y-0.5 hover:shadow-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-300"
        >
          <p className="text-[11px] uppercase tracking-[0.18em] text-slate-400">
            {phase.label}
          </p>
          <h3 className="text-lg font-semibold text-slate-900">
            {phase.title}
          </h3>
          <p className="text-sm text-slate-600">{phase.summary}</p>
          <button
            type="button"
            onClick={(event) => {
              event.stopPropagation();
              setActiveJourneyPhase(phase);
            }}
            className="absolute bottom-4 right-4 inline-flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 bg-white text-lg font-medium text-slate-900 shadow-sm hover:bg-slate-900 hover:text-white transition-colors"
            aria-label={`Learn more about ${phase.title}`}
          >
            +
          </button>
        </article>
      ))}
    </div>

    <div className="mt-10 relative">
      <div className="pointer-events-none absolute inset-y-0 left-0 w-12 bg-gradient-to-r from-white/80 to-transparent md:hidden" />
      <div className="pointer-events-none absolute inset-y-0 right-0 w-12 bg-gradient-to-l from-white/80 to-transparent md:hidden" />
      <div className="flex gap-4 overflow-x-auto snap-x snap-mandatory scrollbar-hide md:grid md:grid-cols-12 md:gap-4 md:overflow-visible md:snap-none">
        {evolgritSteps.map((step) => (
          <article
            key={step.id}
            className={`rounded-3xl border border-slate-200 bg-white shadow-sm p-5 flex flex-col gap-3 shrink-0 w-[80%] sm:w-[60%] md:w-auto snap-start ${step.colSpan}`}
          >
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-900 text-white text-sm font-semibold">
                {step.number}
              </div>
              <p className="text-xs font-medium uppercase tracking-[0.18em] text-slate-400">
                Step {step.number}
              </p>
            </div>
            <h4 className="text-sm font-semibold text-slate-900">{step.title}</h4>
            <p className="text-sm text-slate-600 leading-relaxed">
              {step.description}
            </p>
            <p className="text-xs uppercase tracking-[0.18em] text-slate-400">
              {step.outcome}
            </p>
          </article>
        ))}
      </div>
    </div>
  </div>
</section>
{activeJourneyPhase && (
  <div className="fixed inset-0 z-40">
    <button
      type="button"
      onClick={() => setActiveJourneyPhase(null)}
      className="absolute inset-0 bg-white/70 backdrop-blur-xl active:cursor-pointer"
      aria-label="Close phase details overlay"
    />
    <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-white/80 via-white/40 to-white/70" />
    <div className="relative z-10 flex min-h-full items-center justify-center px-4">
      <div className="relative w-full max-w-xl rounded-3xl bg-white shadow-xl p-6 sm:p-8 space-y-4">
        <button
          type="button"
          onClick={() => setActiveJourneyPhase(null)}
          className="absolute right-4 top-4 inline-flex h-8 w-8 items-center justify-center rounded-full bg-slate-100 text-slate-500 hover:bg-slate-200 hover:text-slate-700"
          aria-label="Close details"
        >
          ×
        </button>
        <p className="text-xs uppercase tracking-[0.18em] text-slate-400">
          {activeJourneyPhase.label}
        </p>
        <h3 className="text-xl sm:text-2xl font-semibold text-slate-900">
          {activeJourneyPhase.title}
        </h3>
        <p className="text-sm text-slate-600">{activeJourneyPhase.summary}</p>
        <ul className="list-disc space-y-2 pl-5 text-sm text-slate-600">
          {activeJourneyPhase.bullets.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
        <div className="pt-4 flex flex-wrap gap-3">
          <Link
            href="/waitlist"
            className="inline-flex items-center justify-center rounded-full bg-slate-900 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-slate-800"
          >
            Join learner waitlist
          </Link>
          <button
            type="button"
            onClick={() => setActiveJourneyPhase(null)}
            className="inline-flex items-center justify-center rounded-full border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  </div>
)}

<section className="py-16 sm:py-20">
  <div className="max-w-6xl mx-auto px-4 sm:px-6">
    <h3 className="text-sm sm:text-base font-semibold text-slate-900 mb-4">
      What learners get with Evolgrit
    </h3>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
      {learnersGetHighlights.map((item) => (
        <article
          key={item.id}
          className="rounded-3xl border border-slate-200 bg-white shadow-sm p-6 space-y-4 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md"
        >
          <div className="flex flex-col gap-3">
            <div className="h-8 w-8 rounded-full bg-slate-50 border border-slate-200 flex items-center justify-center text-xs text-slate-600">
              {item.icon}
            </div>
            <div>
              <h4 className="text-sm font-semibold text-slate-900">
                {item.title}
              </h4>
              <p className="text-sm text-slate-500 leading-relaxed">
                {item.body}
              </p>
            </div>
          </div>
          <div className="pt-3 border-t border-slate-100">
            <span className="inline-flex items-center text-sm font-medium text-blue-600">
              Learn more
              <span className="ml-1" aria-hidden="true">
                →
              </span>
            </span>
          </div>
        </article>
      ))}
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

            <Link
              href="/employers"
              className="hidden sm:inline-flex items-center justify-center rounded-full bg-slate-900 px-5 py-2 text-sm font-medium text-slate-50 shadow-md shadow-slate-900/40 hover:bg-slate-800"
            >
              Talk to us about hiring
            </Link>
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
            <Link
              href="/employers"
              className="inline-flex w-full items-center justify-center rounded-full bg-slate-900 px-5 py-2.5 text-sm font-medium text-slate-50 shadow-md shadow-slate-900/40 hover:bg-slate-800"
            >
              Talk to us about hiring
            </Link>
          </div>
        </div>
      </section>
{activeEmployerCard && (
  <div className="fixed inset-0 z-40">
    <button
      type="button"
      onClick={() => setOpenEmployerCardId(null)}
      className="absolute inset-0 bg-white/70 backdrop-blur-xl active:cursor-pointer"
      aria-label="Close employer details overlay"
    />
    <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-white/80 via-white/40 to-white/70" />
    <div
      className="relative z-10 flex min-h-full items-center justify-center px-4"
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
{/* BRAND HERO – WHAT IS EVOLGRIT */}
<section className="max-w-6xl mx-auto mt-16 px-5 mb-14 sm:mb-20">
  <div className="max-w-4xl mx-auto rounded-3xl bg-slate-900 text-slate-50 shadow-xl px-8 py-8 sm:px-12 sm:py-10 text-center">
    <h2 className="text-2xl sm:text-3xl font-semibold tracking-tight">
      What is Evolgrit?
    </h2>

    <p className="mt-4 text-base sm:text-lg text-slate-300 leading-relaxed">
      We believe every person can improve their future — through evolution{" "}
      <span className="italic">(Evol-)</span> and grit{" "}
      <span className="italic">(-grit)</span>.
      <br className="hidden sm:block" />
      Evolgrit is the ability to keep going, to learn, to grow — and to build a new life.
    </p>

    <p className="mt-6 text-[11px] uppercase tracking-[0.28em] text-slate-500">
      Built with patience, courage and consistency.
    </p>
  </div>
</section>
      {/* FINAL CTA BAR */}
      <section className="max-w-6xl mx-auto mt-16 px-5">
        <div className="rounded-2xl bg-slate-900 text-slate-50 px-6 py-6 sm:px-8 sm:py-7 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl sm:text-2xl font-semibold mb-1">
              Ready to shape the next Evolgrit batch?
            </h2>
            <p className="text-slate-300 text-sm sm:text-base">
              Whether you&apos;re a learner, employer or mentor – we&apos;d
              love to explore how Evolgrit can work for you.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <a
              href="/waitlist"
              className="rounded-full bg-blue-500 px-4 py-2 text-sm font-medium text-white hover:bg-blue-600"
            >
              Join learner waitlist
            </a>
            <Link
              href="/employers"
              className="rounded-full border border-slate-500 px-4 py-2 text-sm font-medium text-slate-50 hover:bg-slate-800"
            >
              Talk to us about hiring
            </Link>
          </div>
          <a
            href="mailto:info@evolgrit.com?subject=Mentor%20at%20Evolgrit"
            className="text-xs font-medium text-slate-300 hover:text-slate-50 inline-flex items-center gap-1"
          >
            Become a mentor
            <span aria-hidden="true">→</span>
          </a>
        </div>
      </section>
            </main>
    </div>
  );
}
