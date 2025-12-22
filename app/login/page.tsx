"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { createSupabaseBrowserClient } from "@/lib/supabase/browser";

export default function LoginPage() {
  const supabase = createSupabaseBrowserClient();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<"password" | "magic">("password");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordStatus, setPasswordStatus] = useState<"idle" | "loading">("idle");
  const [magicEmail, setMagicEmail] = useState("");
  const [magicStatus, setMagicStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [magicError, setMagicError] = useState<string | null>(null);

  async function handlePasswordLogin(e: React.FormEvent) {
    e.preventDefault();
    setPasswordStatus("loading");
    setErrorMessage(null);

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setErrorMessage(error.message || "Unable to log in.");
      setPasswordStatus("idle");
      return;
    }

    router.push("/dashboard");
  }

  async function sendLink(e: React.FormEvent) {
    e.preventDefault();
    setMagicStatus("sending");
    setMagicError(null);

    const origin = window.location.origin;

    const { error } = await supabase.auth.signInWithOtp({
      email: magicEmail,
      options: {
        emailRedirectTo: `${origin}/auth/callback`,
      },
    });

    if (error) {
      setMagicError(error.message || "Something went wrong.");
      setMagicStatus("error");
      return;
    }
    setMagicStatus("sent");
  }

  return (
    <main className="min-h-screen bg-slate-50 px-5 py-16">
      <div className="mx-auto max-w-md rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <h1 className="text-xl font-semibold text-slate-900">Log in</h1>
        <p className="mt-2 text-sm text-slate-600">
          Choose your preferred login method.
        </p>

        <div className="mt-4 flex rounded-2xl bg-slate-50 p-1 text-sm font-medium text-slate-600">
          <button
            type="button"
            onClick={() => setActiveTab("password")}
            className={`flex-1 rounded-2xl px-4 py-2 ${
              activeTab === "password" ? "bg-white text-slate-900 shadow-sm" : ""
            }`}
          >
            Password
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("magic")}
            className={`flex-1 rounded-2xl px-4 py-2 ${
              activeTab === "magic" ? "bg-white text-slate-900 shadow-sm" : ""
            }`}
          >
            Magic link
          </button>
        </div>

        {activeTab === "password" ? (
          <form onSubmit={handlePasswordLogin} className="mt-6 space-y-4">
            <div>
              <label className="text-sm font-medium text-slate-900">Email</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
                className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-slate-300"
                placeholder="you@email.com"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-slate-900">Password</label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
                className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-slate-300"
                placeholder="Your password"
              />
            </div>
            <button
              type="submit"
              disabled={passwordStatus === "loading"}
              className="w-full rounded-full bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white hover:bg-slate-800 disabled:opacity-50"
            >
              {passwordStatus === "loading" ? "Signing in…" : "Log in"}
            </button>
          </form>
        ) : (
          <form onSubmit={sendLink} className="mt-6 space-y-4">
            <div>
              <label className="text-sm font-medium text-slate-900">Email</label>
              <input
                type="email"
                required
                value={magicEmail}
                onChange={(e) => setMagicEmail(e.target.value)}
                autoComplete="email"
                className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-slate-300"
                placeholder="you@email.com"
              />
            </div>

            <button
              type="submit"
              disabled={magicStatus === "sending"}
              className="w-full rounded-full bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white hover:bg-slate-800 disabled:opacity-50"
            >
              {magicStatus === "sending" ? "Sending…" : "Send login link"}
            </button>
          </form>
        )}

        {errorMessage && activeTab === "password" && (
          <div className="mt-4 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-900">
            {errorMessage}
          </div>
        )}
        {magicStatus === "sent" && activeTab === "magic" && (
          <div className="mt-4 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-900">
            Link sent. Check your email.
          </div>
        )}
        {magicStatus === "error" && magicError && activeTab === "magic" && (
          <div className="mt-4 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-900">
            {magicError}
          </div>
        )}
      </div>
    </main>
  );
}
