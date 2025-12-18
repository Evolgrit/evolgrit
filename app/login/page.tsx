import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Login",
  robots: { index: false, follow: false },
};

export default function Page() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 flex items-center justify-center px-4">
      <div className="w-full max-w-md rounded-3xl bg-white/80 border border-slate-200 shadow-lg shadow-slate-900/5 p-6 sm:p-8">
        {/* Header */}
        <div className="mb-6">
          <p className="text-xs uppercase tracking-[0.18em] text-slate-400 mb-1">
            Evolgrit
          </p>
          <h1 className="text-2xl font-semibold text-slate-900">
            Log in to your journey
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            In this beta phase, accounts are invite-only. We&apos;ll gradually
            open access for more learners and employers.
          </p>
        </div>

        {/* Form – noch ohne echte Funktionalität */}
        <form className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">
              Email
            </label>
            <input
              type="email"
              placeholder="you@example.com"
              className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">
              Password
            </label>
            <input
              type="password"
              className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <button
            type="button"
            className="w-full rounded-full bg-slate-900 text-slate-50 py-2.5 text-sm font-medium hover:bg-slate-800"
          >
            Log in (coming soon)
          </button>
        </form>

        {/* Beta-Zugang per Mail */}
        <p className="mt-4 text-[11px] text-slate-500">
          No account yet?{" "}
          <a
            href="mailto:info@evolgrit.com?subject=Evolgrit%20beta%20access"
            className="text-blue-600 hover:underline"
          >
            Request beta access
          </a>
          .
        </p>

        {/* Mission-Text */}
        <p className="mt-6 text-[11px] text-slate-400">
          We believe every person can improve their future — through evolution
          (Evol-) and grit (-grit).
        </p>

        {/* Footer links */}
        <div className="mt-4 flex items-center justify-between text-[11px] text-slate-500">
          <Link href="/" className="hover:text-slate-700">
            ← Back to homepage
          </Link>
          <span>Private beta · 2026</span>
        </div>
      </div>
    </div>
  );
}
