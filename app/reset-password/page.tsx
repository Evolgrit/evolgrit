"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { createSupabaseBrowserClient } from "@/lib/supabase/browser";
import PasswordField from "@/components/ui/PasswordField";

declare const window:
  | {
      location: { hash?: string };
    }
  | undefined;

export default function ResetPasswordPage() {
  const supabase = createSupabaseBrowserClient();
  const router = useRouter();
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [status, setStatus] = useState<"idle" | "saving">("idle");
  const [error, setError] = useState<string | null>(null);
  const [sessionReady, setSessionReady] = useState(false);

  useEffect(() => {
    let mounted = true;
    async function ensureSession() {
      const { data } = await supabase.auth.getSession();
      if (data.session) {
        if (mounted) setSessionReady(true);
        return;
      }
      if (typeof window !== "undefined" && window.location.hash) {
        const params = new URLSearchParams(window.location.hash.replace(/^#/, ""));
        const access_token = params.get("access_token");
        const refresh_token = params.get("refresh_token");
        if (access_token && refresh_token) {
          await supabase.auth.setSession({ access_token, refresh_token });
          const { data: sessionData } = await supabase.auth.getSession();
          if (sessionData.session) {
            if (mounted) setSessionReady(true);
            return;
          }
        }
      }
      router.replace("/forgot-password");
    }
    ensureSession();
    return () => {
      mounted = false;
    };
  }, [router, supabase]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (newPassword.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }
    if (newPassword !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    setStatus("saving");
    const { error: updateError } = await supabase.auth.updateUser({
      password: newPassword,
    });
    if (updateError) {
      console.error("reset password update error", updateError);
      setError(updateError.message || "Unable to set password.");
      setStatus("idle");
      return;
    }
    router.replace("/dashboard");
  }

  return (
    <main className="min-h-screen bg-slate-50 px-5 py-16">
      <div className="mx-auto max-w-md rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <h1 className="text-xl font-semibold text-slate-900">Set a new password</h1>
        <p className="mt-2 text-sm text-slate-600">
          Choose a strong password to secure your account.
        </p>
        <form onSubmit={handleSubmit} className="mt-6 space-y-4" hidden={!sessionReady}>
          <PasswordField
            label="New password"
            required
            autoComplete="new-password"
            value={newPassword}
            onChange={setNewPassword}
            placeholder="Enter new password"
          />
          <PasswordField
            label="Confirm password"
            required
            autoComplete="new-password"
            value={confirmPassword}
            onChange={setConfirmPassword}
            placeholder="Confirm new password"
          />
          <button
            type="submit"
            disabled={status === "saving"}
            className="w-full rounded-full bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white hover:bg-slate-800 disabled:opacity-50"
          >
            {status === "saving" ? "Updating…" : "Set password"}
          </button>
        </form>
        {error && (
          <div className="mt-4 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-900">
            {error}
          </div>
        )}
        {!sessionReady && (
          <div className="mt-6 text-center text-sm text-slate-500">Preparing reset link…</div>
        )}
      </div>
    </main>
  );
}
