// app/learner-journey/page.tsx

export default function LearnerJourneyPage() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      {/* Mini-Header nur für diese Seite */}
      <header className="border-b border-slate-200 bg-white/80 backdrop-blur">
        <div className="max-w-6xl mx-auto px-5 py-4 flex items-center justify-between gap-3">
          <a href="/" className="flex items-center gap-2 text-sm font-semibold text-slate-800">
            <div className="w-7 h-7 rounded-xl bg-slate-900 flex items-center justify-center text-[11px] text-slate-100 shadow-sm">
              E
            </div>
            <span className="tracking-[0.18em] uppercase text-[11px] text-slate-500">
              Evolgrit
            </span>
          </a>
          <a
            href="/#product"
            className="text-xs sm:text-sm text-slate-500 hover:text-slate-900"
          >
            ← Back to overview
          </a>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-5 pt-10 pb-24 space-y-16">
        {/* HERO / INTRO */}
        <section className="text-center space-y-4">
          <p className="inline-flex items-center gap-2 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-100 px-3 py-1 text-[11px] font-medium">
            <span className="h-2 w-2 rounded-full bg-emerald-500" />
            Learner journey · 6–12 month program
          </p>
          <h1 className="text-3xl sm:text-4xl font-semibold tracking-tight">
            Your Evolgrit journey from arrival to job‑ready.
          </h1>
          <p className="text-slate-600 text-sm sm:text-base max-w-2xl mx-auto">
            Evolgrit begleitet dich in drei Phasen: Ankommen, Vertiefen und
            Übergang in Job oder Ausbildung – mit Sprache, Kultur und Job‑Skills,
            die zusammen wachsen.
          </p>
        </section>

        {/* 12-MONTH JOURNEY MAP */}
        <section>
          <h2 className="text-xl sm:text-2xl font-semibold text-slate-900 mb-3">
            6–12 month journey at a glance
          </h2>
          <p className="text-slate-600 text-sm sm:text-base mb-6 max-w-2xl">
            The exact length depends on your starting level, but the structure
            stays the same: three phases that build on each other.
          </p>

          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm space-y-8">
            {/* Große 3-Phasen-Timeline */}
            <div>
              <div className="flex justify-between text-[11px] uppercase tracking-[0.16em] text-slate-400 mb-2">
                <span>Month 1</span>
                <span>Month 4</span>
                <span>Month 8</span>
                <span>Month 12</span>
              </div>

              <div className="grid grid-cols-12 h-2 rounded-full overflow-hidden bg-slate-100">
                {/* Phase 1: 1–3 */}
                <div className="col-span-3 bg-blue-500/80" />
                {/* Phase 2: 4–8 */}
                <div className="col-span-5 bg-emerald-500/90" />
                {/* Phase 3: 9–12 */}
                <div className="col-span-4 bg-slate-600/80" />
              </div>

              <div className="grid gap-4 mt-4 text-sm md:grid-cols-3">
                <div>
                  <div className="inline-flex items-center gap-2 rounded-full bg-blue-50 px-3 py-1 text-xs font-medium text-blue-700 mb-2">
                    <span className="h-2 w-2 rounded-full bg-blue-500" />
                    Phase 1 · Arrival & foundations
                  </div>
                  <ul className="text-slate-600 space-y-1">
                    <li>• Orientation, onboarding & first language baseline.</li>
                    <li>• Everyday German & cultural basics.</li>
                    <li>• Building routine with mentors & peers.</li>
                  </ul>
                </div>

                <div>
                  <div className="inline-flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-700 mb-2">
                    <span className="h-2 w-2 rounded-full bg-emerald-500" />
                    Phase 2 · Deepening & practice
                  </div>
                  <ul className="text-slate-600 space-y-1">
                    <li>• Job-related German for logistics, care & childcare.</li>
                    <li>• Alternating tasks & group sessions to stay motivated.</li>
                    <li>• Continuous feedback from mentors & AI coach.</li>
                  </ul>
                </div>

                <div>
                  <div className="inline-flex items-center gap-2 rounded-full bg-slate-50 px-3 py-1 text-xs font-medium text-slate-700 mb-2">
                    <span className="h-2 w-2 rounded-full bg-slate-600" />
                    Phase 3 · Job-ready & matching
                  </div>
                  <ul className="text-slate-600 space-y-1">
                    <li>• Interview prep & workplace communication.</li>
                    <li>• Matching with partner employers or education paths.</li>
                    <li>• Clear next step: job, apprenticeship or training.</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Drei Lern-Tracks */}
            <div className="space-y-3 text-[12px] sm:text-xs">
              {[
                { label: "Language", color: "bg-blue-500" },
                { label: "Culture & integration", color: "bg-emerald-500" },
                { label: "Jobs & careers", color: "bg-slate-600" },
              ].map((track) => (
                <div key={track.label} className="flex items-center gap-3">
                  <div className="w-32 text-slate-500 font-medium">
                    {track.label}
                  </div>
                  <div className="flex-1 grid grid-cols-12 gap-[3px]">
                    <div
                      className={`h-2 rounded-full ${track.color} opacity-70 col-span-3`}
                    />
                    <div
                      className={`h-2 rounded-full ${track.color} opacity-90 col-span-5`}
                    />
                    <div
                      className={`h-2 rounded-full ${track.color} opacity-80 col-span-4`}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Optional: kleine Sektion „What a typical week looks like“ kannst du später ergänzen */}
      </main>
    </div>
  );
}