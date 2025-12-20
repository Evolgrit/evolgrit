"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { COUNTRIES } from "@/lib/countries";

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

export default function WaitlistClient() {
  const [form, setForm] = useState<FormState>(initialState);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [status, setStatus] = useState<
    | { type: "idle" }
    | { type: "success" }
    | { type: "error"; message: string }
  >({ type: "idle" });
  const successRef = useRef<HTMLDivElement | null>(null);

  const canSubmit = useMemo(() => {
    return form.full_name.trim().length > 1 && form.email.trim().includes("@");
  }, [form.full_name, form.email]);

  useEffect(() => {
    if (status.type === "success") {
      successRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    }
  }, [status.type]);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!canSubmit || isSubmitting || status.type === "success") return;

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

    const res = await fetch("/api/waitlist", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const data = await res.json();

    if (!res.ok || !data.ok) {
      setStatus({
        type: "error",
        message: "Something went wrong. Please try again in a moment.",
      });
      setIsSubmitting(false);
      return;
    }

    if (data.duplicate) {
      setStatus({
        type: "error",
        message: "You’re already on the list with this email.",
      });
      setIsSubmitting(false);
      return;
    }

    setStatus({ type: "success" });
    setIsSubmitting(false);
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
              Takes ~45 seconds. We’ll reach out when the next batch opens.
            </p>
          </div>

          <div className="rounded-3xl border border-slate-200 bg-white shadow-sm p-6 sm:p-8">
            {status.type === "success" && (
              <div
                ref={successRef}
                className="mb-6 rounded-2xl border border-emerald-200 bg-emerald-50 px-5 py-4 text-sm text-emerald-900"
              >
                <p className="font-semibold">You’re on the list 🎉</p>
                <p className="mt-1 text-emerald-800">
                  Thanks for joining the Evolgrit learner waitlist.
                </p>

                <div className="mt-3 rounded-xl border border-emerald-200/60 bg-white/60 px-4 py-3 text-emerald-900">
                  <p className="text-xs uppercase tracking-[0.18em] text-emerald-700/80">
                    What happens next
                  </p>
                  <ul className="mt-2 space-y-1 text-sm text-emerald-900">
                    <li>• We review your details and batch fit.</li>
                    <li>• We email you when the next batch opens.</li>
                  </ul>
                </div>

                <p className="mt-3 text-xs text-emerald-800">
                  No spam. You can unsubscribe at any time. Your data is never shared.
                </p>

                <div className="mt-4 flex flex-col sm:flex-row gap-2">
                  <Link
                    href="/"
                    className="inline-flex items-center justify-center rounded-full bg-slate-900 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-slate-800"
                  >
                    Back to homepage
                  </Link>
                  <Link
                    href="/employers"
                    className="inline-flex items-center justify-center rounded-full border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-900 hover:border-slate-400"
                  >
                    For employers: talk to us →
                  </Link>
                </div>
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
                    disabled={status.type === "success" || isSubmitting}
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
                    autoFocus
                    disabled={status.type === "success" || isSubmitting}
                  />
                </div>

                <div>
                  <label className="text-sm font-medium text-slate-900">
                    Current country
                  </label>
                  <input
                    list="countries"
                    value={form.country}
                    onChange={(e) =>
                      setForm((s) => ({ ...s, country: e.target.value }))
                    }
                    className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 shadow-sm focus:outline-none focus:ring-2 focus:ring-slate-300"
                    placeholder="Start typing… (e.g., deu → Germany)"
                    autoComplete="country-name"
                    disabled={status.type === "success" || isSubmitting}
                  />

                  <datalist id="countries">
                    {COUNTRIES.map((c) => (
                      <option key={c} value={c} />
                    ))}
                  </datalist>
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
                      disabled={status.type === "success" || isSubmitting}
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
                      disabled={status.type === "success" || isSubmitting}
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
                    disabled={status.type === "success" || isSubmitting}
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
                    disabled={status.type === "success" || isSubmitting}
                  />
                </div>
              </div>

              <div className="pt-2 flex flex-col sm:flex-row gap-3">
                <button
                  type="submit"
                  disabled={!canSubmit || isSubmitting || status.type === "success"}
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
                We’ll only use your details to contact you about Evolgrit
                batches. You can unsubscribe at any time. Your data will never
                be shared.
              </p>
            </form>
          </div>
        </div>
      </div>
    </main>
  );
}
