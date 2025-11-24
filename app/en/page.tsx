export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-slate-50 to-slate-100 text-slate-900">
      <header className="max-w-6xl mx-auto px-5 pt-6 pb-10">
        {/* NAVBAR */}
        <nav className="flex items-center justify-between gap-4 mb-10">
          <div className="flex items-center gap-2">
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
          </div>

          <div className="hidden sm:flex items-center gap-4 text-sm">
            {/* Language switch */}
            <div className="flex items-center gap-2 pl-3 ml-1 border-l border-slate-200">
              <a href="/" className="text-slate-500 hover:text-slate-900">
                DE
              </a>
              <span className="text-slate-300">·</span>
              <span className="font-semibold text-slate-900">EN</span>
            </div>

            <a href="#product" className="text-slate-500 hover:text-slate-900">
              Product
            </a>
            <a
              href="#how-it-works"
              className="text-slate-500 hover:text-slate-900"
            >
              How it works
            </a>
            <a
              href="#for-employers"
              className="text-slate-500 hover:text-slate-900"
            >
              For employers
            </a>
            <button className="rounded-full border border-slate-200 bg-white/80 px-3 py-1.5 text-sm hover:bg-white shadow-sm">
              Log in
            </button>
            <button className="rounded-full bg-blue-600 px-4 py-1.5 text-sm font-medium text-white shadow-md shadow-blue-500/40 hover:bg-blue-700">
              Join waitlist
            </button>
          </div>
        </nav>

        {/* HERO */}
        <main className="grid gap-10 lg:grid-cols-[1.1fr,1fr] items-center">
          {/* LEFT SIDE */}
          <section>
            <div className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-[11px] text-emerald-700 mb-4">
              <span className="inline-block h-2 w-2 rounded-full bg-emerald-500" />
              New · Private beta 2025 for motivated learners & employers
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-[44px] font-semibold leading-tight tracking-tight mb-3">
              AI-powered{" "}
              <span className="bg-gradient-to-r from-blue-600 to-sky-500 bg-clip-text text-transparent">
                German learning & job coaching
              </span>{" "}
              for international talent.
            </h1>

            <p className="text-sm sm:text-base text-slate-600 max-w-xl mb-6">
              Evolgrit helps people who move to Germany build real-world
              language skills, understand the culture, and find the right job –
              with adaptive learning paths, personal mentoring, and clear
              profiles for employers.
            </p>

            <div className="flex flex-wrap gap-3 mb-3">
              <a
                href="mailto:info@evolgrit.com?subject=Evolgrit%20Beta%20waitlist&body=Hi%20Evolgrit%20team,%0A%0AI'd%20like%20to%20join%20the%20beta.%0A%0AName:%0AGerman%20level:%0AProfessional%20background:%0A"
                className="rounded-full bg-blue-600 px-5 py-2 text-sm font-medium text-white shadow-md shadow-blue-500/40 hover:bg-blue-700 inline-flex items-center justify-center"
              >
                Join the beta waitlist
              </a>
              <a
                href="mailto:info@evolgrit.com?subject=Evolgrit%20Contact"
                className="rounded-full border border-slate-200 bg-white/80 px-4 py-2 text-sm text-slate-800 hover:bg-white shadow-sm inline-flex items-center justify-center"
              >
                Contact us
              </a>
            </div>

            <p className="text-[12px] text-slate-500">
              <span className="text-emerald-600 font-medium">
                Built for people first.
              </span>{" "}
              We start with a small cohort of learners and partner employers to
              shape the product together.
            </p>
          </section>

          {/* RIGHT SIDE – dashboard preview */}
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
                <div className="text-[11px] text-emerald-600">
                  over 12 weeks
                </div>
              </div>
              <div className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2">
                <div className="text-[11px] text-slate-500 mb-1">
                  Job-ready profiles
                </div>
                <div className="text-[17px] font-semibold">24</div>
                <div className="text-[11px] text-slate-500">
                  of 32 learners
                </div>
              </div>
              <div className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2">
                <div className="text-[11px] text-slate-500 mb-1">
                  Employer matches
                </div>
                <div className="text-[17px] font-semibold">17</div>
                <div className="text-[11px] text-slate-500">
                  active pipelines
                </div>
              </div>
            </div>

            <div className="rounded-xl bg-slate-950/95 text-slate-100 px-3 py-3 mb-3">
              <div className="flex items-center justify-between text-[11px] text-slate-400 mb-2">
                <span>German level improvement · cohort</span>
                <span>Last 12 weeks</span>
              </div>
              <div className="relative h-20 overflow-hidden rounded-md bg-slate-900">
                <div className="absolute inset-0 opacity-60 bg-gradient-to-r from-blue-500/10 via-blue-400/70 to-blue-500/60 [clip-path:polygon(0%_70%,20%_60%,40%_50%,60%_55%,80%_40%,100%_45%,100%_100%,0%_100%)]" />
                <div className="absolute inset-0 opacity-40 bg-gradient-to-r from-emerald-400/10 via-emerald-300/70 to-emerald-400/70 [clip-path:polygon(0%_85%,20%_80%,40%_70%,60%_75%,80%_62%,100%_68%,100%_100%,0%_100%)]" />
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
                <span className="font-semibold text-slate-800">
                  Top signals:
                </span>{" "}
                B1+/B2 learners with care, logistics & hospitality background.
              </span>
              <span className="hidden sm:inline-flex items-center rounded-full border border-emerald-200 bg-emerald-50 px-2 py-1 text-[10px] text-emerald-700">
                New · cultural readiness score
              </span>
            </div>
          </aside>
        </main>

        {/* VALUE STRIP */}
        <section
          className="mt-10 grid gap-3 md:grid-cols-3 text-[13px]"
          id="product"
        >
          <div className="flex items-center gap-2 rounded-full border border-slate-200 bg-white/80 px-3 py-2 text-slate-600">
            <span className="h-2 w-2 rounded-full bg-emerald-500" />
            Adaptive German learning based on real job contexts, not textbook
            dialogs.
          </div>
          <div
            className="flex items-center gap-2 rounded-full border border-slate-200 bg-white/80 px-3 py-2 text-slate-600"
            id="how-it-works"
          >
            <span className="h-2 w-2 rounded-full bg-emerald-500" />
            One profile that combines language level, skills and work history –
            ready for employers.
          </div>
          <div
            className="flex items-center gap-2 rounded-full border border-slate-200 bg-white/80 px-3 py-2 text-slate-600"
            id="for-employers"
          >
            <span className="h-2 w-2 rounded-full bg-emerald-500" />
            For employers: pre-screened candidates, transparent progress and
            cultural coaching.
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
      </header>
    </div>
  );
}