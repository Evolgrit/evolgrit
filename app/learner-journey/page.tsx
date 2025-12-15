'use client';

import Image from "next/image";
import { useState } from "react";

export default function LearnerJourneyPage() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const journeyProgress = 0.6; // 60%
  const journeyProgressDegrees = journeyProgress * 360;

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      {/* HEADER / NAVBAR – gleiches Design wie Startseite */}
      <header className="sticky top-0 z-50 backdrop-blur bg-white/70 border-b border-slate-200/50">
        <div className="max-w-6xl mx-auto px-5 py-4">
          <nav className="flex items-center justify-between gap-4">
            {/* Logo + Title */}
            <a href="/" className="flex items-center gap-2 cursor-pointer">
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

              <a href="/#product" className="text-slate-500 hover:text-slate-900">
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

      {/* MAIN CONTENT – Learner dashboard preview */}
      <main className="max-w-6xl mx-auto px-5 pt-10 pb-24">
        {/* LEARNER DASHBOARD PREVIEW */}
        <section
          aria-labelledby="dashboard-preview-title"
          className="bg-slate-50 py-16 sm:py-20"
        >
          <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
            <div className="mb-8 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-400">
                  Produkt-Einblick · Lernende
                </p>
                <h2
                  id="dashboard-preview-title"
                  className="mt-2 text-2xl sm:text-3xl font-semibold tracking-tight text-slate-900"
                >
                  Wie sich Evolgrit für Lernende anfühlt.
                </h2>
                <p className="mt-2 max-w-2xl text-sm text-slate-500">
                  Eine 6–12-Monats-Reise mit klaren Phasen, wöchentlichen Meilensteinen
                  und Aufgaben aus dem echten Alltag – nicht nur Grammatikübungen.
                </p>
              </div>
              <p className="text-xs text-slate-500">
                Vorschau ·{" "}
                <span className="font-medium text-slate-700">
                  Lina, 26 – Kinderbetreuung
                </span>
              </p>
            </div>

            <div className="grid gap-6 lg:grid-cols-[260px,1fr]">
              <div className="flex flex-col gap-6">
                <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
                  <div className="flex items-center gap-3">
                    <div className="h-11 w-11 overflow-hidden rounded-full bg-slate-100">
                      <Image
                        src="/lina-avatar.png"
                        alt="Lina Avatar"
                        width={44}
                        height={44}
                        className="h-full w-full object-cover"
                      />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-slate-900">
                        Hi, Lina 👋
                      </p>
                      <p className="text-xs text-slate-500">
                        Deine 6–12-Monats-Reise mit Evolgrit.
                      </p>
                    </div>
                  </div>

                  <div className="mt-5 space-y-2">
                    <p className="text-xs font-medium text-slate-500">
                      Reise-Fortschritt
                    </p>
                    <div className="h-1.5 w-full rounded-full bg-slate-100">
                      <div className="h-1.5 w-3/5 rounded-full bg-gradient-to-r from-sky-500 to-emerald-400" />
                    </div>
                    <p className="text-xs text-slate-500">
                      <span className="font-semibold text-slate-900">60 %</span> deiner
                      Reise.
                    </p>
                  </div>

                  <div className="mt-4 flex flex-wrap gap-2">
                    <span className="inline-flex items-center rounded-full bg-slate-50 px-2.5 py-1 text-[11px] font-medium text-slate-700">
                      Deutsch · A2 → B1
                    </span>
                    <span className="inline-flex items-center rounded-full bg-slate-50 px-2.5 py-1 text-[11px] font-medium text-slate-700">
                      Integration &amp; Alltag
                    </span>
                    <span className="inline-flex items-center rounded-full bg-slate-50 px-2.5 py-1 text-[11px] font-medium text-slate-700">
                      Wöchentliches Mentoring
                    </span>
                  </div>
                </div>

                <div className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm">
                  <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-400">
                    Bereiche
                  </p>
                  <div className="flex flex-col gap-1.5 text-xs">
                    <span className="inline-flex items-center justify-between rounded-2xl bg-slate-900 px-3 py-2 text-slate-50">
                      <span>Übersicht</span>
                      <span className="text-[11px] text-slate-200">Heute</span>
                    </span>
                    <span className="inline-flex items-center justify-between rounded-2xl px-3 py-2 text-slate-600">
                      <span>Meine Reise</span>
                      <span className="text-[11px] text-slate-400">Phase 1</span>
                    </span>
                    <span className="inline-flex items-center justify-between rounded-2xl px-3 py-2 text-slate-600">
                      <span>Lernmodule</span>
                      <span className="text-[11px] text-slate-400">3 offen</span>
                    </span>
                    <span className="inline-flex items-center justify-between rounded-2xl px-3 py-2 text-slate-600">
                      <span>Mentor-Sessions</span>
                      <span className="text-[11px] text-slate-400">Do · 18:00</span>
                    </span>
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div className="space-y-1">
                      <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-400">
                        Aktuelle Phase · Woche 3 von 8
                      </p>
                      <h3 className="text-lg sm:text-xl font-semibold tracking-tight text-slate-900">
                        Phase 1 · Ankommen &amp; Grundlagen
                      </h3>
                      <p className="max-w-xl text-sm text-slate-500">
                        Fokus auf Alltagssprache, Orientierung in Deutschland und erste
                        Kontakte mit deiner Kohorte.
                      </p>
                    </div>
                    <div className="flex flex-col items-end gap-2 text-right">
                      <p className="text-xs font-medium text-slate-500">
                        Reise-Fortschritt Phase 1
                      </p>
                      <div className="h-1.5 w-40 rounded-full bg-slate-100">
                        <div className="h-1.5 w-1/3 rounded-full bg-emerald-400" />
                      </div>
                      <p className="text-xs text-slate-500">
                        <span className="font-semibold text-slate-900">25 %</span> dieser
                        Phase.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="grid gap-6 md:grid-cols-2">
                  <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
                    <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-400">
                      Heute
                    </p>
                    <h4 className="mt-2 text-sm font-semibold text-slate-900">
                      Deine nächsten Schritte
                    </h4>
                    <p className="mt-1 text-xs text-slate-500">
                      Drei kurze Aktivitäten – wähle, womit du heute starten möchtest.
                    </p>

                    <div className="mt-4 space-y-3">
                      <div className="flex items-start gap-3 rounded-2xl bg-slate-50 px-3 py-2.5">
                        <div className="mt-0.5 h-7 w-7 rounded-full bg-sky-100 text-[13px] leading-7 text-sky-700 text-center">
                          🎧
                        </div>
                        <div className="flex-1">
                          <p className="text-xs font-medium text-slate-900">
                            Sprachmemo „Arbeitstag“
                          </p>
                          <p className="text-[11px] text-slate-500">
                            Nimm 15 Minuten Audio zu deinem heutigen Arbeitstag auf.
                          </p>
                        </div>
                        <span className="text-[11px] font-medium text-emerald-600">
                          Sprechen · 15&nbsp;min
                        </span>
                      </div>

                      <div className="flex items-start gap-3 rounded-2xl bg-slate-50 px-3 py-2.5">
                        <div className="mt-0.5 h-7 w-7 rounded-full bg-indigo-100 text-[13px] leading-7 text-indigo-700 text-center">
                          🛒
                        </div>
                        <div className="flex-1">
                          <p className="text-xs font-medium text-slate-900">
                            Mini-Quiz: Supermarkt
                          </p>
                          <p className="text-[11px] text-slate-500">
                            10 kurze Fragen zu typischen Situationen im Supermarkt.
                          </p>
                        </div>
                        <span className="text-[11px] font-medium text-slate-500">
                          Wortschatz · 5&nbsp;min
                        </span>
                      </div>

                      <div className="flex items-start gap-3 rounded-2xl bg-slate-50 px-3 py-2.5">
                        <div className="mt-0.5 h-7 w-7 rounded-full bg-rose-100 text-[13px] leading-7 text-rose-700 text-center">
                          💬
                        </div>
                        <div className="flex-1">
                          <p className="text-xs font-medium text-slate-900">
                            Fragen für deinen Mentor
                          </p>
                          <p className="text-[11px] text-slate-500">
                            Notiere 2–3 Dinge, über die du in der nächsten Session
                            sprechen möchtest.
                          </p>
                        </div>
                        <span className="text-[11px] font-medium text-slate-500">
                          Reflexion · 10&nbsp;min
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
                    <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-400">
                      Diese Woche
                    </p>
                    <h4 className="mt-2 text-sm font-semibold text-slate-900">
                      Fällige Meilensteine
                    </h4>
                    <p className="mt-1 text-xs text-slate-500">
                      Dein Überblick für diese Woche – was schon geschafft ist und was
                      noch kommt.
                    </p>

                    <div className="mt-4 space-y-3">
                      <div className="flex items-start gap-3 rounded-2xl bg-emerald-50 px-3 py-2.5">
                        <div className="mt-0.5 h-7 w-7 rounded-full bg-emerald-500 text-[13px] leading-7 text-white text-center">
                          ✓
                        </div>
                        <div className="flex-1">
                          <p className="text-xs font-medium text-slate-900">
                            Einstufungstest Phase&nbsp;1
                          </p>
                          <p className="text-[11px] text-slate-600">
                            Dein Ausgangspunkt ist klar – perfekte Basis für die nächsten
                            Wochen.
                          </p>
                        </div>
                        <span className="text-[11px] font-medium text-emerald-700">
                          erledigt
                        </span>
                      </div>

                      <div className="flex items-start gap-3 rounded-2xl bg-slate-50 px-3 py-2.5">
                        <div className="mt-0.5 h-7 w-7 rounded-full bg-amber-100 text-[13px] leading-7 text-amber-700 text-center">
                          📚
                        </div>
                        <div className="flex-1">
                          <p className="text-xs font-medium text-slate-900">
                            Sprachmodule der Woche
                          </p>
                          <p className="text-[11px] text-slate-500">
                            Bleibt noch ein Modul – ideal für einen ruhigen Abend.
                          </p>
                          <div className="mt-2 h-1.5 w-full rounded-full bg-slate-100">
                            <div className="h-1.5 w-2/3 rounded-full bg-amber-400" />
                          </div>
                        </div>
                        <span className="text-[11px] font-medium text-slate-500">
                          2 / 3 erledigt
                        </span>
                      </div>

                      <div className="flex items-start gap-3 rounded-2xl bg-slate-50 px-3 py-2.5">
                        <div className="mt-0.5 h-7 w-7 rounded-full bg-violet-100 text-[13px] leading-7 text-violet-700 text-center">
                          👥
                        </div>
                        <div className="flex-1">
                          <p className="text-xs font-medium text-slate-900">
                            Gruppensession mit Mentor
                          </p>
                          <p className="text-[11px] text-slate-500">
                            Offene Fragen zu Alltag, Sprache oder Papieren – alles ist
                            willkommen.
                          </p>
                        </div>
                        <span className="text-[11px] font-medium text-violet-700">
                          Do · 18:00
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
