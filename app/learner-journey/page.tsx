'use client';

import { useState } from "react";

export default function LearnerJourneyPage() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      {/* HEADER / NAVBAR – gleiches Design wie Startseite */}
      <header className="sticky top-0 z-50 backdrop-blur bg-white/70 border-b border-slate-200/50">
        <div className="max-w-6xl mx-auto px-5 py-4">
          <nav className="flex items-center justify-between gap-4">
            {/* Logo + Title */}
<a
  href="/"
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
</a>
            {/* Desktop Menu */}
            <div className="hidden sm:flex items-center gap-4 text-sm">
              <div className="flex items-center gap-2 pl-3 ml-1 border-l border-slate-200 text-xs text-slate-400">
                EN
              </div>

              <a
                href="/#product"
                className="text-slate-500 hover:text-slate-900"
              >
                Product
              </a>
              <a
                href="/#how-it-works"
                className="text-slate-500 hover:text-slate-900"
              >
                How it works
              </a>
              <a
                href="/#for-employers"
                className="text-slate-500 hover:text-slate-900"
              >
                For employers
              </a>

              <a
                href="/login"
                className="rounded-full border border-slate-200 bg-white/80 px-3 py-1.5 text-sm hover:bg-white shadow-sm"
              >
                Log in
              </a>
              <a
                href="mailto:info@evolgrit.com?subject=Evolgrit%20beta%20waitlist"
                className="rounded-full bg-blue-600 px-4 py-1.5 text-sm font-medium text-white shadow-md shadow-blue-500/40 hover:bg-blue-700"
              >
                Join waitlist
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
                href="/#product"
                className="block text-slate-700 hover:text-slate-900"
                onClick={() => setIsMenuOpen(false)}
              >
                Product
              </a>
              <a
                href="/#how-it-works"
                className="block text-slate-700 hover:text-slate-900"
                onClick={() => setIsMenuOpen(false)}
              >
                How it works
              </a>
              <a
                href="/#for-employers"
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
                  href="mailto:info@evolgrit.com?subject=Evolgrit%20beta%20waitlist"
                  className="flex-1 rounded-full bg-blue-600 px-3 py-1.5 text-xs font-medium text-white shadow-md shadow-blue-500/40 hover:bg-blue-700 flex items-center justify-center"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Join waitlist
                </a>
              </div>
            </div>
          )}
        </div>
      </header>

      {/* MAIN CONTENT – dein Dashboard */}
      <main className="max-w-6xl mx-auto px-4 lg:px-6 py-6 lg:py-10 flex gap-6">
        {/* SIDEBAR – nur ab md sichtbar */}
        <aside className="hidden md:flex flex-col w-56 shrink-0 rounded-3xl bg-white/80 border border-slate-200 shadow-sm p-4">
          <div className="mb-6">
            <p className="text-xs uppercase tracking-[0.18em] text-slate-400 mb-1">
              Dashboard
            </p>
            <h1 className="text-lg font-semibold text-slate-900">
              Hi, Lina 👋
            </h1>
            <p className="text-xs text-slate-500">
              Deine 6–12‑Monats‑Reise mit Evolgrit.
            </p>
          </div>

          <nav className="space-y-1 text-sm">
            <button className="w-full flex items-center justify-between rounded-xl px-3 py-2 bg-slate-900 text-slate-50">
              <span>Übersicht</span>
              <span className="text-[11px] rounded-full bg-slate-800 px-2 py-[2px]">
                Heute
              </span>
            </button>
            <button className="w-full text-left rounded-xl px-3 py-2 hover:bg-slate-100">
              Meine Reise
            </button>
            <button className="w-full text-left rounded-xl px-3 py-2 hover:bg-slate-100">
              Lernmodule
            </button>
            <button className="w-full text-left rounded-xl px-3 py-2 hover:bg-slate-100">
              Mentor‑Sessions
            </button>
            <button className="w-full text-left rounded-xl px-3 py-2 hover:bg-slate-100">
              Jobs & Chancen
            </button>
            <button className="w-full text-left rounded-xl px-3 py-2 hover:bg-slate-100">
              Dokumente
            </button>
          </nav>

          <div className="mt-auto pt-4 border-t border-slate-100">
            <div className="rounded-2xl bg-emerald-50 text-emerald-800 px-3 py-3 text-xs">
              <p className="font-semibold mb-1">Community</p>
              <p>Teile Fragen mit anderen Lernenden aus deiner Kohorte.</p>
            </div>
          </div>
        </aside>

        {/* MITTLERE SPALTE + RECHTE SPALTE */}
        <main className="flex-1 grid gap-6 lg:grid-cols-[minmax(0,2fr),minmax(260px,1.3fr)]">
          {/* MITTLERE SPALTE – PHASEN & AUFGABEN */}
          <section className="space-y-6">
            {/* Aktuelle Phase */}
            <div className="rounded-3xl bg-white border border-slate-200 shadow-sm p-5 sm:p-6">
              <div className="flex items-start justify-between gap-3 mb-4">
                <div>
                  <p className="text-xs uppercase tracking-[0.18em] text-slate-400 mb-1">
                    Aktuelle Phase
                  </p>
                  <h2 className="text-lg sm:text-xl font-semibold text-slate-900">
                    Phase 1 · Ankommen & Grundlagen
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-500 mt-1">
                    Fokus auf Alltagssprache, Orientierung in Deutschland und
                    erste Kontakte mit deiner Kohorte.
                  </p>
                </div>
                <div className="text-right">
                  <span className="inline-flex items-center rounded-full bg-blue-50 px-3 py-1 text-[11px] font-medium text-blue-700">
                    Woche 3 von 8
                  </span>
                  <p className="mt-1 text-xs text-slate-400">
                    26% deiner Gesamt‑Reise
                  </p>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="mb-4">
                <div className="flex justify-between text-[11px] text-slate-500 mb-1">
                  <span>Reise‑Fortschritt</span>
                  <span>25%</span>
                </div>
                <div className="h-2 rounded-full bg-slate-100 overflow-hidden">
                  <div className="h-full w-1/4 rounded-full bg-gradient-to-r from-blue-500 to-emerald-400" />
                </div>
              </div>

              {/* Phasen-Badges */}
              <div className="flex flex-wrap gap-2 text-[11px]">
                <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-3 py-1 text-slate-700">
                  <span className="h-1.5 w-1.5 rounded-full bg-blue-500" />
                  Deutsch · A2 → B1
                </span>
                <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-3 py-1 text-slate-700">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                  Integration & Alltag
                </span>
                <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-3 py-1 text-slate-700">
                  <span className="h-1.5 w-1.5 rounded-full bg-purple-500" />
                  Wöchentliches Mentoring
                </span>
              </div>
            </div>

            {/* Heute / Diese Woche */}
            <div className="grid gap-4 md:grid-cols-2">
              {/* Heute */}
              <div className="rounded-3xl bg-white border border-slate-200 shadow-sm p-4">
                <p className="text-xs uppercase tracking-[0.18em] text-slate-400 mb-2">
                  Heute
                </p>
                <h3 className="text-sm font-semibold text-slate-900 mb-3">
                  Deine nächsten Schritte
                </h3>
                <ul className="space-y-2 text-xs sm:text-sm text-slate-600">
                  <li className="flex items-start gap-2">
                    <span className="mt-1 h-2 w-2 rounded-full bg-emerald-500" />
                    <span>
                      15 Minuten Sprachnotizen zum Thema „Arbeitstag“
                      aufnehmen.
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="mt-1 h-2 w-2 rounded-full bg-emerald-500" />
                    <span>
                      Ein Mini‑Quiz zu Deutsch im Supermarkt abschließen.
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="mt-1 h-2 w-2 rounded-full bg-slate-300" />
                    <span>
                      Fragen für deine nächste Mentor‑Session vorbereiten.
                    </span>
                  </li>
                </ul>
              </div>

              {/* Diese Woche */}
              <div className="rounded-3xl bg-white border border-slate-200 shadow-sm p-4">
                <p className="text-xs uppercase tracking-[0.18em] text-slate-400 mb-2">
                  Diese Woche
                </p>
                <h3 className="text-sm font-semibold text-slate-900 mb-3">
                  Fällige Meilensteine
                </h3>
                <ul className="space-y-2 text-xs sm:text-sm text-slate-600">
                  <li>✅ Einstufungstest Phase 1 abgeschlossen</li>
                  <li>🟩 2 / 3 Sprachmodule der Woche erledigt</li>
                  <li>🟨 1 Gruppensession geplant · Donnerstag 18:00</li>
                </ul>
              </div>
            </div>

            {/* Nächste Phasen-Kacheln */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              <div className="rounded-3xl bg-white border border-slate-200 shadow-sm p-4 text-xs sm:text-sm">
                <p className="mb-1 text-[11px] uppercase tracking-[0.18em] text-slate-400">
                  Phase 1
                </p>
                <h3 className="font-semibold text-slate-900 mb-1">
                  Ankommen & Alltag
                </h3>
                <p className="text-slate-600 mb-3">
                  Sicherheit im Alltag: Einkaufen, Arzt, Behörde, öffentlicher
                  Verkehr.
                </p>
                <p className="text-[11px] text-slate-500">
                  4 von 8 Wochen abgeschlossen.
                </p>
              </div>

              <div className="rounded-3xl bg-white border border-slate-200 shadow-sm p-4 text-xs sm:text-sm">
                <p className="mb-1 text-[11px] uppercase tracking-[0.18em] text-slate-400">
                  Phase 2
                </p>
                <h3 className="font-semibold text-slate-900 mb-1">
                  Job‑Sprache & Szenarien
                </h3>
                <p className="text-slate-600 mb-3">
                  Rollenspiele und Aufgaben für deinen Zielbereich
                  (Logistik, Care, Tech, …).
                </p>
                <p className="text-[11px] text-slate-500">
                  Startet nach Phase&nbsp;1 · geplant Q3.
                </p>
              </div>

              <div className="rounded-3xl bg-slate-900 text-slate-50 shadow-sm p-4 text-xs sm:text-sm">
                <p className="mb-1 text-[11px] uppercase tracking-[0.18em] text-slate-400">
                  Phase 3
                </p>
                <h3 className="font-semibold mb-1">
                  Matching & Einstieg in den Job
                </h3>
                <p className="text-slate-200 mb-3">
                  Bewerbungen, Interviews, Onboarding – mit klaren nächsten
                  Schritten.
                </p>
                <p className="text-[11px] text-emerald-300">
                  Ziel: Dein erster Job in Deutschland, der zu dir passt.
                </p>
              </div>
            </div>
          </section>

          {/* RECHTE SPALTE – OVERVIEW */}
          <section className="space-y-4 lg:space-y-5">
            <div className="rounded-3xl bg-white border border-slate-200 shadow-sm p-4 sm:p-5">
              <p className="text-xs uppercase tracking-[0.18em] text-slate-400 mb-2">
                Überblick
              </p>
              <h2 className="text-sm font-semibold text-slate-900 mb-4">
                Dein aktuelles Profil
              </h2>

              {/* Sprachlevel */}
              <div className="mb-4">
                <div className="flex justify-between text-xs text-slate-500 mb-1">
                  <span>Deutsch‑Level</span>
                  <span>A2 · auf dem Weg zu B1</span>
                </div>
                <div className="h-2 rounded-full bg-slate-100 overflow-hidden">
                  <div className="h-full w-2/3 rounded-full bg-blue-500" />
                </div>
                <p className="mt-1 text-[11px] text-slate-500">
                  Konzentriere dich auf Hör‑ und Sprechübungen, um B1 zu
                  erreichen.
                </p>
              </div>

              {/* Integration */}
              <div className="mb-4">
                <div className="flex justify-between text-xs text-slate-500 mb-1">
                  <span>Integration & Alltag</span>
                  <span>45%</span>
                </div>
                <div className="h-2 rounded-full bg-slate-100 overflow-hidden">
                  <div className="h-full w-[45%] rounded-full bg-emerald-500" />
                </div>
                <p className="mt-1 text-[11px] text-slate-500">
                  Nächster Schritt: Modul „Gesundheitssystem“ abschließen.
                </p>
              </div>

              {/* Job-readiness */}
              <div>
                <div className="flex justify-between text-xs text-slate-500 mb-1">
                  <span>Job‑Bereitschaft</span>
                  <span>35%</span>
                </div>
                <div className="h-2 rounded-full bg-slate-100 overflow-hidden">
                  <div className="h-full w-[35%] rounded-full bg-amber-500" />
                </div>
                <p className="mt-1 text-[11px] text-slate-500">
                  Lebenslauf‑Profil vervollständigen und erste Job‑Simulation
                  starten.
                </p>
              </div>
            </div>

            {/* Nächste Session */}
            <div className="rounded-3xl bg-white border border-slate-200 shadow-sm p-4 sm:p-5 text-xs sm:text-sm">
              <p className="text-[11px] uppercase tracking-[0.18em] text-slate-400 mb-2">
                Nächste Session
              </p>
              <h3 className="font-semibold text-slate-900 mb-1">
                Gruppensession mit deinem Mentor
              </h3>
              <p className="text-slate-600 mb-3">
                Donnerstag · 18:00–19:00 Uhr (online)
              </p>
              <ul className="text-slate-600 space-y-1 mb-3">
                <li>• Check‑in: Wie läuft dein Alltag in Deutschland?</li>
                <li>• Sprachübung: Situationen im Job.</li>
                <li>• Fragen zu Papieren, Wohnung, Verträgen.</li>
              </ul>
              <button className="w-full rounded-full bg-slate-900 text-slate-50 py-2 text-xs font-medium hover:bg-slate-800">
                Zoom‑Link anzeigen
              </button>
            </div>

            {/* Zieljob / Tags */}
            <div className="rounded-3xl bg-white border border-slate-200 shadow-sm p-4 text-xs sm:text-sm">
              <p className="text-[11px] uppercase tracking-[0.18em] text-slate-400 mb-2">
                Dein Ziel
              </p>
              <h3 className="font-semibold text-slate-900 mb-1">
                Zielrolle: Kundenservice / Logistikkoordination
              </h3>
              <p className="text-slate-600 mb-3">
                Wir bereiten dich auf Rollen vor, die Sprache, digitale Tools
                und Teamarbeit kombinieren.
              </p>
              <div className="flex flex-wrap gap-2 text-[11px]">
                <span className="rounded-full bg-slate-100 px-3 py-1">
                  Deutsch mit Kunden
                </span>
                <span className="rounded-full bg-slate-100 px-3 py-1">
                  Digitale Tools
                </span>
                <span className="rounded-full bg-slate-100 px-3 py-1">
                  Team & Kommunikation
                </span>
              </div>
            </div>

            {/* Warum Evolgrit */}
            <div className="rounded-3xl bg-slate-900 text-slate-50 shadow-sm p-4 sm:p-5 text-xs sm:text-sm">
              <p className="text-[11px] uppercase tracking-[0.18em] text-slate-400 mb-2">
                Warum Evolgrit
              </p>
              <p className="font-semibold mb-2">
                Wir glauben, dass jeder Mensch seine Zukunft verbessern kann —
                durch Entwicklung (Evol-) und Ausdauer (-grit).
              </p>
              <p className="text-slate-200">
                Evolgrit steht für die Fähigkeit, trotz Herausforderungen
                weiterzugehen, zu lernen, zu wachsen und ein neues Leben
                aufzubauen. Dieses Dashboard ist dein persönlicher Blick auf
                diese Reise.
              </p>
            </div>
          </section>
        </main>
      </main>
    </div>
  );
}