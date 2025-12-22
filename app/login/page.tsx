"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { createSupabaseBrowserClient } from "@/lib/supabase/browser";

type AccessState = "unknown" | "none" | "pending" | "approved";

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
  const [passwordAccessState, setPasswordAccessState] = useState<AccessState>("unknown");
  const [magicAccessState, setMagicAccessState] = useState<AccessState>("unknown");
  const [canResendInvite, setCanResendInvite] = useState(false);
  const [inviteStatus, setInviteStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [inviteMessage, setInviteMessage] = useState<string | null>(null);

  useEffect(() => {
    setPasswordAccessState("unknown");
    setErrorMessage(null);
    setCanResendInvite(false);
    setInviteStatus("idle");
    setInviteMessage(null);
  }, [email]);

  useEffect(() => {
    setMagicAccessState("unknown");
    setMagicError(null);
  }, [magicEmail]);

  async function handlePasswordLogin(e: React.FormEvent) {
    e.preventDefault();
    setPasswordStatus("loading");
    setErrorMessage(null);
    setCanResendInvite(false);
    try {
      const state = await checkAccess(email);
      setPasswordAccessState(state);
      if (state === "none") {
        setErrorMessage("No account yet. Apply as a learner or employer to receive access.");
        setPasswordStatus("idle");
        return;
      }
      if (state === "pending") {
        setErrorMessage("Your access is being reviewed. We'll notify you once approved.");
        setPasswordStatus("idle");
        return;
      }
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) {
        console.error("password login error", error);
        if (error.message?.toLowerCase().includes("invalid login credentials")) {
          setErrorMessage("Incorrect email or password.");
          setCanResendInvite(true);
        } else {
          setErrorMessage(error.message || "Unable to log in.");
        }
        setPasswordStatus("idle");
        return;
      }
      router.push("/dashboard");
    } catch (error) {
      console.error("password access check error", error);
      setErrorMessage("Unable to verify access. Try again.");
      setPasswordStatus("idle");
    }
  }

  async function resendInvite() {
    setInviteStatus("sending");
    setInviteMessage(null);
    try {
      const res = await fetch("/api/access/invite", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Unable to send invite.");
      }
      setInviteStatus("sent");
      setInviteMessage("Invite email sent.");
      setCanResendInvite(false);
    } catch (error) {
      console.error("invite resend error", error);
      setInviteStatus("error");
      setInviteMessage(error instanceof Error ? error.message : "Unable to send invite.");
    }
  }

  async function sendLink(e: React.FormEvent) {
    e.preventDefault();
    setMagicStatus("sending");
    setMagicError(null);
    try {
      const state = await checkAccess(magicEmail);
      setMagicAccessState(state);
      if (state === "none") {
        setMagicError("No account yet. Apply first to receive access.");
        setMagicStatus("error");
        return;
      }
      if (state === "pending") {
        setMagicError("Your access request is pending approval.");
        setMagicStatus("error");
        return;
      }

      const origin = window.location.origin;
      const { error } = await supabase.auth.signInWithOtp({
        email: magicEmail,
        options: {
          emailRedirectTo: `${origin}/auth/callback`,
        },
      });
      if (error) {
        console.error("magic link error", error);
        setMagicError(error.message || "Something went wrong.");
        setMagicStatus("error");
        return;
      }
      setMagicStatus("sent");
    } catch (error) {
      console.error("magic access check error", error);
      setMagicError("Unable to verify access. Try again.");
      setMagicStatus("error");
    }
  }

  async function checkAccess(emailInput: string) {
    const normalized = emailInput.trim().toLowerCase();
    if (!normalized) throw new Error("Email required");
    const res = await fetch("/api/access/check", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: normalized }),
    });
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.error || "Unable to check access");
    }
    return (data.state as AccessState) ?? "none";
  }

  function renderAccessNotice(state: AccessState) {
    if (state === "none") {
      return (
        <div className="mt-4 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700">
          <p>No account yet. Apply as a learner or employer to receive access.</p>
          <div className="mt-3 flex flex-wrap gap-2">
            <Link
              href="/waitlist?type=learner"
              className="rounded-full border border-slate-300 bg-white px-4 py-1.5 text-sm font-medium text-slate-900 hover:border-slate-400"
            >
              Apply as learner
            </Link>
            <Link
              href="/employers?intent=apply"
              className="rounded-full border border-slate-300 bg-white px-4 py-1.5 text-sm font-medium text-slate-900 hover:border-slate-400"
            >
              Apply as employer
            </Link>
          </div>
        </div>
      );
    }
    if (state === "pending") {
      return (
        <div className="mt-4 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
          Your access request is being reviewed. We&apos;ll notify you once it&apos;s approved.
        </div>
      );
    }
    return null;
  }

  const passwordDisabled =
    passwordStatus === "loading" || passwordAccessState === "pending";
  const magicDisabled = magicStatus === "sending" || magicAccessState === "pending";

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
                inputMode="email"
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
            {renderAccessNotice(passwordAccessState)}
            <button
              type="submit"
              disabled={passwordDisabled}
              className="w-full rounded-full bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white hover:bg-slate-800 disabled:opacity-50"
            >
              {passwordStatus === "loading" ? "Signing in…" : "Log in"}
            </button>
            <div className="text-right">
              <Link
                href="/forgot-password"
                className="text-xs font-medium text-blue-600 hover:text-blue-700"
              >
                Forgot password?
              </Link>
            </div>
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
                inputMode="email"
                className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-slate-300"
                placeholder="you@email.com"
              />
            </div>
            {renderAccessNotice(magicAccessState)}
            <button
              type="submit"
              disabled={magicDisabled}
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
        {canResendInvite && activeTab === "password" && (
          <div className="mt-4 space-y-2 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700">
            <p>Password not set yet. Send yourself a fresh invite.</p>
            <button
              type="button"
              onClick={resendInvite}
              disabled={inviteStatus === "sending"}
              className="inline-flex items-center rounded-full border border-slate-300 bg-white px-4 py-1.5 text-sm font-medium text-slate-900 hover:border-slate-400 disabled:opacity-50"
            >
              {inviteStatus === "sending" ? "Sending…" : "Send invite again"}
            </button>
            {inviteMessage && (
              <p className="text-xs text-slate-500">{inviteMessage}</p>
            )}
          </div>
        )}
        {magicStatus === "sent" && activeTab === "magic" && (
          <div className="mt-4 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-900">
            Check your email.
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
