"use client";

import { useState } from "react";
import Link from "next/link";

export default function EmployersPage() {
  const [company, setCompany] = useState("");
  const [roleTypes, setRoleTypes] = useState("");
  const [email, setEmail] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState<null | "success" | "duplicate" | "error">(null);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (submitting) return;

    setSubmitting(true);
    setResult(null);

    const res = await fetch("/api/employer-leads", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ company, role_types: roleTypes, email }),
    });

    const data = await res.json().catch(() => ({}));

    if (!res.ok || !data.ok) {
      setResult("error");
    } else if (data.duplicate) {
      setResult("duplicate");
    } else {
      setResult("success");
      setCompany("");
      setRoleTypes("");
      setEmail("");
    }

    setSubmitting(false);
  }
  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-50 via-slate-50 to-slate-100 text-slate-900 px-5 py-16 sm:py-20">
      <div className="max-w-6xl mx-auto">
        <div className="max-w-3xl mx-auto text-center">
          <p className="text-[11px] uppercase tracking-[0.18em] text-slate-400">
            For employers
          </p>
          <h1 className="mt-2 text-2xl sm:text-3xl font-semibold tracking-tight text-slate-900">
            Hire international talent that’s ready to stay.
          </h1>
          <p className="mt-3 text-sm sm:text-base text-slate-600">
            Evolgrit connects language, cultural readiness and onboarding support — so hiring becomes repeatable, not risky.
          </p>
        </div>

        <div className="mt-10 max-w-3xl mx-auto rounded-3xl border border-slate-200 bg-white shadow-sm p-6 sm:p-8">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
              <p className="text-[11px] uppercase tracking-[0.18em] text-slate-400">
                Readiness at a glance
              </p>
              <p className="mt-1 text-sm font-semibold text-slate-900">
                Language + culture + reliability signals
              </p>
              <p className="mt-1 text-sm text-slate-600">
                See who is truly ready — not just who has a CV.
              </p>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
              <p className="text-[11px] uppercase tracking-[0.18em] text-slate-400">
                Pilot batches
              </p>
              <p className="mt-1 text-sm font-semibold text-slate-900">
                Start small, learn fast
              </p>
              <p className="mt-1 text-sm text-slate-600">
                Align roles, locations and timelines — then scale.
              </p>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
              <p className="text-[11px] uppercase tracking-[0.18em] text-slate-400">
                Onboarding support
              </p>
              <p className="mt-1 text-sm font-semibold text-slate-900">
                Reduce risk for your team
              </p>
              <p className="mt-1 text-sm text-slate-600">
                Structured support before and after arrival — so people actually stay.
              </p>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
              <p className="text-[11px] uppercase tracking-[0.18em] text-slate-400">
                Repeatable pipeline
              </p>
              <p className="mt-1 text-sm font-semibold text-slate-900">
                Plug into your hiring process
              </p>
              <p className="mt-1 text-sm text-slate-600">
                Build a long-term international hiring channel — not a one-off project.
              </p>
            </div>
          </div>

          <div className="mt-8 rounded-3xl border border-slate-200 bg-white shadow-sm p-6 sm:p-8">
            <div className="text-center">
              <p className="text-[11px] uppercase tracking-[0.18em] text-slate-400">
                Employer interest
              </p>
              <h2 className="mt-2 text-xl sm:text-2xl font-semibold text-slate-900">
                Tell us what you’re hiring for
              </h2>
              <p className="mt-2 text-sm text-slate-600">
                30 seconds. We’ll reply with pilot options and next steps.
              </p>
            </div>

            {result === "success" && (
              <div className="mt-5 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-900">
                <p className="font-semibold">Thanks — we got it.</p>
                <p className="mt-1 text-emerald-800">We’ll reach out shortly.</p>
              </div>
            )}

            {result === "duplicate" && (
              <div className="mt-5 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700">
                You’ve already submitted this email. We’ll be in touch.
              </div>
            )}

            {result === "error" && (
              <div className="mt-5 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-900">
                Something went wrong. Please try again.
              </div>
            )}

            <form onSubmit={submit} className="mt-6 space-y-4">
              <div>
                <label className="text-sm font-medium text-slate-900">Company *</label>
                <input
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
                  className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 shadow-sm focus:outline-none focus:ring-2 focus:ring-slate-300"
                  placeholder="Company name"
                  required
                />
              </div>

              <div>
                <label className="text-sm font-medium text-slate-900">Role types *</label>
                <input
                  value={roleTypes}
                  onChange={(e) => setRoleTypes(e.target.value)}
                  className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 shadow-sm focus:outline-none focus:ring-2 focus:ring-slate-300"
                  placeholder="e.g., logistics, care, hospitality"
                  required
                />
              </div>

              <div>
                <label className="text-sm font-medium text-slate-900">Email *</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 shadow-sm focus:outline-none focus:ring-2 focus:ring-slate-300"
                  placeholder="name@company.com"
                  required
                />
              </div>

              <div className="pt-2 flex flex-col sm:flex-row gap-3 justify-center">
                <button
                  type="submit"
                  disabled={submitting}
                  className="inline-flex items-center justify-center rounded-full bg-slate-900 px-5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-slate-800 disabled:opacity-50"
                >
                  {submitting ? "Sending…" : "Submit"}
                </button>
                <Link
                  href="/"
                  className="inline-flex items-center justify-center rounded-full border border-slate-300 bg-white px-5 py-2.5 text-sm font-semibold text-slate-900 hover:border-slate-400"
                >
                  Back to homepage
                </Link>
              </div>

              <p className="text-center text-xs text-slate-500">
                We’ll only use this to contact you about Evolgrit pilots. No spam.
              </p>
            </form>
          </div>

        </div>
      </div>
    </main>
  );
}
