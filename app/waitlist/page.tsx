"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { supabase } from "@/lib/supabaseClient";

type FormState = {
  full_name: string;
  email: string;
  country: string;
  target: "Job" | "Apprenticeship" | "Further training" | "";
  german_level: "A0" | "A1" | "A2" | "B1" | "B2" | "C1" | "";
  start_timeframe: "0–3 months" | "3–6 months" | "6–12 months" | "";
  whatsapp: string;
};

const initialState: FormState = {
  full_name: "",
  email: "",
  country: "",
  target: "",
  german_level: "",
  start_timeframe: "",
  whatsapp: "",
};

export default function WaitlistPage() {
  const [form, setForm] = useState<FormState>(initialState);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [status, setStatus] = useState<
    | { type: "idle" }
    | { type: "success" }
    | { type: "error"; message: string }
  >({ type: "idle" });

  const canSubmit = useMemo(() => {
    return form.full_name.trim().length > 1 && form.email.trim().includes("@");
  }, [form.full_name, form.email]);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!canSubmit || isSubmitting) return;

    setIsSubmitting(true);
    setStatus({ type: "idle" });

    const payload = {
      full_name: form.full_name.trim(),
      email: form.email.trim().toLowerCase(),
      country: form.country.trim() || null,
      target: form.target || null,
      german_level: form.german_level || null,
      start_timeframe: form.start_timeframe || null,
      whatsapp: form.whatsapp.trim() || null,
    };

    const { error } = await supabase.from("waitlist_signups").insert(payload);

    if (error) {
      const msg =
        error.message?.toLowerCase().includes("duplicate") ||
        error.message?.toLowerCase().includes("unique")
          ? "You’re already on the list with this email."
          : "Something went wrong. Please try again in a moment.";
      setStatus({ type: "error", message: msg });
      setIsSubmitting(false);
      return;
    }

    setStatus({ type: "success" });
    setIsSubmitting(false);
    setForm(initialState);
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-50 via-slate-50 to-slate-100 text-slate-900 px-5 py-16 sm:py-20">
      <div className="max-w-6xl mx-auto">
        <div className="max-w-xl mx-auto">
          <div className="mb-8 text-center">
            <p className="text-[11px] uppercase tracking-[0.18em] text-slate-400">
              Learner waitlist
            </p>
            <h1 className="mt-2 text-2xl sm:text-3xl font-semibold tracking-tight text-slate-900">
              Join the Evolgrit learner waitlist
            </h1>
            <p className="mt-2 text-sm sm:text-base text-slate-600">
              Takes ~45 seconds. We’ll reach out when the next cohort opens.
            </p>
          </div>

          <div className="rounded-3xl border border-slate-200 bg-white shadow-sm p-6 sm:p-8">
            {status.type === "success" && (
              <div className="mb-5 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800">
                Thanks — you’re on the list. We’ll contact you when a spot opens.
              </div>
            )}

            {status.type === "error" && (
              <div className="mb-5 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-800">
                {status.message}
              </div>
            )}

            <form onSubmit={onSubmit} className="space-y-5">
              <div className="grid gap-4">
                <div>
                  <label className="text-sm font-medium text-slate-900">
                    Full name *
                  </label>
                  <input
                    value={form.full_name}
                    onChange={(e) =>
                      setForm((s) => ({ ...s, full_name: e.target.value }))
                    }
                    className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 shadow-sm focus:outline-none focus:ring-2 focus:ring-slate-300"
                    placeholder="Your name"
                    required
                  />
                </div>

                <div>
                  <label className="text-sm font-medium text-slate-900">
                    Email *
                  </label>
                  <input
                    type="email"
                    value={form.email}
                    onChange={(e) =>
                      setForm((s) => ({ ...s, email: e.target.value }))
                    }
                    className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 shadow-sm focus:outline-none focus:ring-2 focus:ring-slate-300"
                    placeholder="you@email.com"
                    required
                  />
                </div>

                <div>
                  <label className="text-sm font-medium text-slate-900">
                    Current country
                  </label>
                  <input
                    value={form.country}
                    onChange={(e) =>
                      setForm((s) => ({ ...s, country: e.target.value }))
                    }
                    className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 shadow-sm focus:outline-none focus:ring-2 focus:ring-slate-300"
                    placeholder="e.g., Spain"
                  />
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="text-sm font-medium text-slate-900">
                      Target in Germany
                    </label>
                    <select
                      value={form.target}
                      onChange={(e) =>
                        setForm((s) => ({
                          ...s,
                          target: e.target.value as FormState["target"],
                        }))
                      }
                      className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 shadow-sm focus:outline-none focus:ring-2 focus:ring-slate-300"
                    >
                      <option value="">Select…</option>
                      <option value="Job">Job</option>
                      <option value="Apprenticeship">Apprenticeship</option>
                      <option value="Further training">Further training</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-slate-900">
                      German level
                    </label>
                    <select
                      value={form.german_level}
                      onChange={(e) =>
                        setForm((s) => ({
                          ...s,
                          german_level: e.target.value as FormState["german_level"],
                        }))
                      }
                      className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 shadow-sm focus:outline-none focus:ring-2 focus:ring-slate-300"
                    >
                      <option value="">Select…</option>
                      <option value="A0">A0</option>
                      <option value="A1">A1</option>
                      <option value="A2">A2</option>
                      <option value="B1">B1</option>
                      <option value="B2">B2</option>
                      <option value="C1">C1</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium text-slate-900">
                    Start timeframe
                  </label>
                  <select
                    value={form.start_timeframe}
                    onChange={(e) =>
                      setForm((s) => ({
                        ...s,
                        start_timeframe:
                          e.target.value as FormState["start_timeframe"],
                      }))
                    }
                    className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 shadow-sm focus:outline-none focus:ring-2 focus:ring-slate-300"
                  >
                    <option value="">Select…</option>
                    <option value="0–3 months">0–3 months</option>
                    <option value="3–6 months">3–6 months</option>
                    <option value="6–12 months">6–12 months</option>
                  </select>
                </div>

                <div>
                  <label className="text-sm font-medium text-slate-900">
                    WhatsApp (optional)
                  </label>
                  <input
                    value={form.whatsapp}
                    onChange={(e) =>
                      setForm((s) => ({ ...s, whatsapp: e.target.value }))
                    }
                    className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 shadow-sm focus:outline-none focus:ring-2 focus:ring-slate-300"
                    placeholder="+49 …"
                  />
                </div>
              </div>

              <div className="pt-2 flex flex-col sm:flex-row gap-3">
                <button
                  type="submit"
                  disabled={!canSubmit || isSubmitting}
                  className="inline-flex items-center justify-center rounded-full bg-slate-900 px-5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? "Joining…" : "Join learner waitlist"}
                </button>

                <Link
                  href="/"
                  className="inline-flex items-center justify-center rounded-full border border-slate-300 bg-white px-5 py-2.5 text-sm font-semibold text-slate-900 hover:border-slate-400"
                >
                  Back to homepage
                </Link>
              </div>

              <p className="text-xs text-slate-500">
                By joining, you agree that we may contact you about Evolgrit cohorts.
              </p>
            </form>
          </div>
        </div>
      </div>
    </main>
  );
}
