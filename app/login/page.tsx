"use client";

import { useState } from "react";
import { createSupabaseBrowserClient } from "@/lib/supabase/browser";

export default function LoginPage() {
  const supabase = createSupabaseBrowserClient();
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");

  async function sendLink(e: React.FormEvent) {
    e.preventDefault();
    setStatus("sending");

    const origin = window.location.origin;

    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: `${origin}/auth/callback`,
      },
    });

    if (error) {
      setStatus("error");
      return;
    }
    setStatus("sent");
  }

  return (
    <main className="min-h-screen bg-slate-50 px-5 py-16">
      <div className="max-w-md mx-auto rounded-3xl border border-slate-200 bg-white shadow-sm p-6">
        <h1 className="text-xl font-semibold text-slate-900">Log in</h1>
        <p className="mt-2 text-sm text-slate-600">
          We&apos;ll send you a secure login link.
        </p>

        <form onSubmit={sendLink} className="mt-6 space-y-4">
          <div>
            <label className="text-sm font-medium text-slate-900">Email</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-slate-300"
              placeholder="you@email.com"
            />
          </div>

          <button
            type="submit"
            disabled={status === "sending"}
            className="w-full rounded-full bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white hover:bg-slate-800 disabled:opacity-50"
          >
            {status === "sending" ? "Sending…" : "Send login link"}
          </button>
        </form>

        {status === "sent" && (
          <div className="mt-4 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-900">
            Link sent. Check your email.
          </div>
        )}

        {status === "error" && (
          <div className="mt-4 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-900">
            Something went wrong. Try again.
          </div>
        )}
      </div>
    </main>
  );
}
