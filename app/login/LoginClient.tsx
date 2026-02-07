"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { createSupabaseBrowserClient } from "@/lib/supabase/browser";
import PasswordField from "@/components/ui/PasswordField";

declare const window:
  | {
      location: { origin: string; href: string; hash?: string };
    }
  | undefined;

type Status = "idle" | "loading" | "success" | "error";
type InviteState = "unknown" | "none" | "pending" | "approved";

type TextInputProps = {
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: string;
  required?: boolean;
  placeholder?: string;
  autoComplete?: string;
  onBlur?: () => void;
};

type TextareaInputProps = {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
};

type ActionButtonProps = {
  text: string;
  loadingText: string;
  type?: "button" | "submit";
  loading?: boolean;
  disabled?: boolean;
};

type BannerProps = {
  kind: "success" | "error" | "warning";
  message: string;
};

export default function LoginClient() {
  const supabase = createSupabaseBrowserClient();
  const router = useRouter();
  const params = useSearchParams();
  const role = useMemo(() => params?.get("role") ?? "learner", [params]);
  const isEmployer = role === "employer";

  const [activeTab, setActiveTab] = useState<"login" | "signup">("login");
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [loginStatus, setLoginStatus] = useState<Status>("idle");
  const [loginError, setLoginError] = useState<string | null>(null);

  const [signupEmail, setSignupEmail] = useState("");
  const [signupPassword, setSignupPassword] = useState("");
  const [signupStatus, setSignupStatus] = useState<Status>("idle");
  const [signupMessage, setSignupMessage] = useState<string | null>(null);
  const passwordRules = getPasswordRules(signupPassword);

  const [magicEmail, setMagicEmail] = useState("");
  const [magicStatus, setMagicStatus] = useState<Status>("idle");
  const [magicMessage, setMagicMessage] = useState<string | null>(null);

  const [inviteState, setInviteState] = useState<InviteState>(
    isEmployer ? "unknown" : "approved"
  );
  const [inviteStatus, setInviteStatus] = useState<Status>("idle");
  const [inviteMessage, setInviteMessage] = useState<string | null>(null);

  const [accessForm, setAccessForm] = useState({
    company_name: "",
    contact_name: "",
    email: "",
    phone: "",
    notes: "",
  });
  const [accessStatus, setAccessStatus] = useState<Status>("idle");
  const [accessMessage, setAccessMessage] = useState<string | null>(null);

  const [showLearnerMagic, setShowLearnerMagic] = useState(false);
  const [oauthStatus, setOauthStatus] =
    useState<"success" | "error" | "warning">("success");
  const [oauthMessage, setOauthMessage] = useState<string | null>(null);

  useEffect(() => {
    if (typeof document === "undefined") return;
    const style = document.createElement("style");
    style.innerHTML = `
      input:-webkit-autofill,
      input:-webkit-autofill:hover,
      input:-webkit-autofill:focus {
        -webkit-text-fill-color: #0f172a !important;
        box-shadow: 0 0 0px 1000px #ffffff inset;
        caret-color: #0f172a;
        transition: background-color 5000s ease-in-out 0s;
      }
    `;
    document.head.appendChild(style);
    return () => {
      document.head.removeChild(style);
    };
  }, []);

  useEffect(() => {
    if (!isEmployer) return;
    setInviteState("unknown");
  }, [loginEmail, magicEmail, isEmployer]);

  const showMagicLink = !isEmployer || inviteState === "approved";

  function handleTabChange(tab: "login" | "signup") {
    setActiveTab(tab);
    setLoginError(null);
    setSignupMessage(null);
    setMagicMessage(null);
  }

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    if (isEmployer) {
      const state = await checkEmployerState(loginEmail);
      if (state !== "approved") return;
    }
    setLoginStatus("loading");
    setLoginError(null);
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email: loginEmail.trim().toLowerCase(),
        password: loginPassword,
      });
      if (error) {
        console.error("login error", error);
        if (isEmployer && error.message.toLowerCase().includes("invalid login")) {
          setLoginError("Account not activated. Use the invite email to set a password.");
          setInviteState("approved");
        } else {
          setLoginError(mapSupabaseError(error.message));
        }
        setLoginStatus("error");
        return;
      }
      router.push("/dashboard");
    } catch (err) {
      console.error("login unexpected error", err);
      setLoginError("Unable to log in. Please try again.");
      setLoginStatus("error");
    }
  }

  async function handleSignup(e: React.FormEvent) {
    e.preventDefault();
    setSignupStatus("loading");
    setSignupMessage(null);
    try {
      const { data, error } = await supabase.auth.signUp({
        email: signupEmail.trim().toLowerCase(),
        password: signupPassword,
      });
      if (error) {
        console.error("signup error", error);
        setSignupMessage(mapSupabaseError(error.message));
        setSignupStatus("error");
        return;
      }
      if (!data.session) {
        setSignupMessage("Check your email to confirm your account.");
        setSignupStatus("success");
        return;
      }
      router.push("/dashboard/onboarding");
    } catch (err) {
      console.error("signup unexpected error", err);
      setSignupMessage("Unable to create account. Please try again.");
      setSignupStatus("error");
    }
  }

  function buildRedirectUrl() {
    if (typeof window === "undefined") return undefined;
    return `${window.location.origin}/auth/callback`;
  }

  async function handleProviderLogin(provider: "google" | "apple") {
    if (typeof window === "undefined") return;
    setOauthStatus("success");
    setOauthMessage(null);
    try {
      const redirectTo = buildRedirectUrl();
      const { error } = await supabase.auth.signInWithOAuth({
        provider,
        options: redirectTo ? { redirectTo } : undefined,
      });
      if (error) {
        throw error;
      }
      setOauthStatus("success");
      setOauthMessage("Redirecting…");
    } catch (error) {
      console.error("oauth login error", error);
      setOauthStatus("error");
      setOauthMessage(
        error instanceof Error && error.message
          ? error.message
          : "Provider not configured yet."
      );
    }
  }

  async function handleMagicLink(e: React.FormEvent) {
    e.preventDefault();
    if (typeof window === "undefined") return;
    if (isEmployer) {
      const state = await checkEmployerState(magicEmail);
      if (state !== "approved") {
        setMagicMessage("Access not approved yet.");
        return;
      }
    }
    setMagicStatus("loading");
    setMagicMessage(null);
    try {
      const origin = window.location.origin;
      const { error } = await supabase.auth.signInWithOtp({
        email: magicEmail.trim().toLowerCase(),
        options: { emailRedirectTo: `${origin}/auth/callback` },
      });
      if (error) {
        console.error("magic link error", error);
        setMagicMessage(mapSupabaseError(error.message));
        setMagicStatus("error");
        return;
      }
      setMagicMessage("Check your email for a magic login link.");
      setMagicStatus("success");
    } catch (err) {
      console.error("magic link unexpected error", err);
      setMagicMessage("Unable to send magic link. Please try again.");
      setMagicStatus("error");
    }
  }

  async function checkEmployerState(emailInput: string) {
    const normalized = emailInput.trim().toLowerCase();
    if (!normalized) {
      setInviteState("none");
      return "none";
    }
    const res = await fetch("/api/employer/check", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: normalized }),
    });
    const data = await res.json();
    if (!res.ok) {
      console.error("employer check error", data.error);
      setInviteState("none");
      return "none";
    }
    setInviteState(data.state ?? "none");
    return data.state ?? "none";
  }

  async function sendAccessRequest(e: React.FormEvent) {
    e.preventDefault();
    setAccessStatus("loading");
    setAccessMessage(null);
    try {
      const res = await fetch("/api/employer/access-request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(accessForm),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Unable to submit request");
      }
      setAccessStatus("success");
      setAccessMessage("Request received. We'll email you soon.");
    } catch (err) {
      console.error("access request error", err);
      setAccessStatus("error");
      setAccessMessage(err instanceof Error ? err.message : "Unable to submit request.");
    }
  }

  async function resendInvite() {
    setInviteStatus("loading");
    setInviteMessage(null);
    try {
      const res = await fetch("/api/employer/invite", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: loginEmail.trim().toLowerCase() }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Unable to send invite.");
      }
      setInviteStatus("success");
      setInviteMessage("Invite sent. Check your email.");
    } catch (err) {
      console.error("invite resend error", err);
      setInviteStatus("error");
      setInviteMessage(err instanceof Error ? err.message : "Unable to send invite.");
    }
  }

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-12 md:px-5 md:py-16">
      <div className="mx-auto w-full max-w-[340px] md:max-w-md rounded-3xl border border-slate-200 bg-white p-5 shadow-sm md:p-8">
        <h1 className="text-xl font-semibold text-slate-900">
          {isEmployer
            ? "Evolgrit employer access"
            : activeTab === "login"
            ? "Log in to Evolgrit"
            : "Create your Evolgrit account"}
        </h1>
        <p className="mt-2 text-sm text-slate-600">
          {isEmployer
            ? "Invite-only access for partner employers."
            : "Choose your preferred login method."}
        </p>

        {!isEmployer && (
          <div className="mt-4 flex rounded-2xl bg-slate-50 p-1 text-sm font-medium text-slate-600">
            <button
              type="button"
              onClick={() => handleTabChange("login")}
              className={`flex-1 rounded-2xl px-4 py-2 ${
                activeTab === "login" ? "bg-white text-slate-900 shadow-sm" : ""
              }`}
            >
              Log in
            </button>
            <button
              type="button"
              onClick={() => handleTabChange("signup")}
              className={`flex-1 rounded-2xl px-4 py-2 ${
                activeTab === "signup" ? "bg-white text-slate-900 shadow-sm" : ""
              }`}
            >
              Create account
            </button>
          </div>
        )}

        {isEmployer ? (
          inviteState === "none" ? (
            <form onSubmit={sendAccessRequest} className="mt-6 space-y-3 md:space-y-4">
              <TextInput
                label="Company name"
                required
                value={accessForm.company_name}
                onChange={(value) =>
                  setAccessForm((prev) => ({ ...prev, company_name: value }))
                }
              />
              <TextInput
                label="Contact name"
                required
                value={accessForm.contact_name}
                onChange={(value) =>
                  setAccessForm((prev) => ({ ...prev, contact_name: value }))
                }
              />
              <TextInput
                label="Email"
                type="email"
                required
                value={accessForm.email}
                onChange={(value) =>
                  setAccessForm((prev) => ({ ...prev, email: value }))
                }
                placeholder="you@company.com"
              />
              <TextInput
                label="Phone (optional)"
                value={accessForm.phone}
                onChange={(value) =>
                  setAccessForm((prev) => ({ ...prev, phone: value }))
                }
                placeholder="+49 …"
              />
              <TextareaInput
                label="Notes"
                value={accessForm.notes}
                onChange={(value) =>
                  setAccessForm((prev) => ({ ...prev, notes: value }))
                }
                placeholder="Tell us more about the roles"
              />
              <ActionButton
                text="Request access"
                loadingText="Sending…"
                type="submit"
                loading={accessStatus === "loading"}
              />
              {accessMessage && (
                <Banner
                  kind={accessStatus === "success" ? "success" : "error"}
                  message={accessMessage}
                />
              )}
            </form>
          ) : (
            <>
              <form onSubmit={handleLogin} className="mt-6 space-y-3 md:space-y-4">
                <TextInput
                  label="Email"
                  type="email"
                  required
                  value={loginEmail}
                  onChange={setLoginEmail}
                  onBlur={() => checkEmployerState(loginEmail)}
                  placeholder="you@company.com"
                />
                <PasswordField
                  label="Password"
                  required
                  value={loginPassword}
                  onChange={setLoginPassword}
                  autoComplete="current-password"
                  placeholder="Password"
                />
                {inviteState === "pending" && (
                  <Banner
                    kind="warning"
                    message="Your request is being reviewed. We’ll notify you once approved."
                  />
                )}
                <ActionButton
                  text="Log in"
                  loadingText="Signing in…"
                  type="submit"
                  loading={loginStatus === "loading"}
                  disabled={inviteState === "pending"}
                />
              </form>
              {showMagicLink && (
                <form
                  onSubmit={handleMagicLink}
                  className="mt-6 space-y-2.5 border-t border-slate-100 pt-4 md:space-y-3"
                >
                  <p className="text-sm font-medium text-slate-900">Magic link</p>
                  <input
                    type="email"
                    required
                    value={magicEmail}
                    onChange={(e) => setMagicEmail(e.target.value)}
                    onBlur={() => checkEmployerState(magicEmail)}
                    className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 caret-slate-900 shadow-sm focus:outline-none focus:ring-2 focus:ring-slate-300"
                    placeholder="you@company.com"
                  />
                  <ActionButton
                    text="Send magic link"
                    loadingText="Sending…"
                    type="submit"
                    loading={magicStatus === "loading"}
                    disabled={inviteState !== "approved"}
                  />
                  {magicMessage && (
                    <Banner
                      kind={magicStatus === "success" ? "success" : "error"}
                      message={magicMessage}
                    />
                  )}
                </form>
              )}
              {loginError && <Banner kind="error" message={loginError} />}
              {inviteState === "approved" && (
                <div className="mt-4 space-y-2 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700">
                  <p>If you never set a password, resend your invite email.</p>
                  <button
                    type="button"
                    onClick={resendInvite}
                    disabled={inviteStatus === "loading"}
                    className="inline-flex items-center rounded-full border border-slate-300 bg-white px-4 py-1.5 text-sm font-medium text-slate-900 hover:border-slate-400 disabled:opacity-50"
                  >
                    {inviteStatus === "loading" ? "Sending…" : "Resend invite"}
                  </button>
                  {inviteMessage && (
                    <p className="text-xs text-slate-500">{inviteMessage}</p>
                  )}
                </div>
              )}
            </>
          )
        ) : (
          <>
            {activeTab === "login" ? (
              <>
                <form onSubmit={handleLogin} className="mt-6 space-y-3 md:space-y-4">
                  <TextInput
                    label="Email"
                    type="email"
                    required
                    autoComplete="email"
                    value={loginEmail}
                    onChange={setLoginEmail}
                    placeholder="you@email.com"
                  />
                  <PasswordField
                    label="Password"
                    required
                    autoComplete="current-password"
                    value={loginPassword}
                    onChange={setLoginPassword}
                    placeholder="••••••••"
                  />
                  <ActionButton
                    text="Sign in"
                    loadingText="Signing in…"
                    type="submit"
                    loading={loginStatus === "loading"}
                  />
                </form>
                <div className="mt-3 flex flex-wrap items-center justify-between text-sm text-slate-600">
                  <Link
                    href="/forgot-password"
                    className="text-blue-600 hover:text-blue-700"
                  >
                    Forgot password?
                  </Link>
                  <button
                    type="button"
                    onClick={() => setShowLearnerMagic((prev) => !prev)}
                    className="text-blue-600 hover:text-blue-700"
                  >
                    {showLearnerMagic ? "Hide magic link" : "Use magic link instead"}
                  </button>
                </div>
                {loginError && <Banner kind="error" message={loginError} />}
                {showLearnerMagic && (
                  <form
                    onSubmit={handleMagicLink}
                    className="mt-6 space-y-2.5 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 md:space-y-3"
                  >
                    <p className="text-sm font-medium text-slate-900">
                      Send a one-time login link
                    </p>
                    <TextInput
                      label="Email"
                      type="email"
                      required
                      autoComplete="email"
                      value={magicEmail}
                      onChange={setMagicEmail}
                    />
                    <ActionButton
                      text="Send magic link"
                      loadingText="Sending…"
                      type="submit"
                      loading={magicStatus === "loading"}
                    />
                    {magicMessage && (
                      <Banner
                        kind={magicStatus === "success" ? "success" : "error"}
                        message={magicMessage}
                      />
                    )}
                  </form>
                )}
              </>
            ) : (
              <LearnerSignup
                signupEmail={signupEmail}
                setSignupEmail={setSignupEmail}
                signupPassword={signupPassword}
                setSignupPassword={setSignupPassword}
                passwordRules={passwordRules}
                signupStatus={signupStatus}
                signupMessage={signupMessage}
                onSignup={handleSignup}
                handleProviderLogin={handleProviderLogin}
                oauthMessage={oauthMessage}
                oauthStatus={oauthStatus}
                onGoToEmployer={() => {
                  if (typeof window === "undefined") return;
                  window.location.href = "/login?role=employer";
                }}
              />
            )}
          </>
        )}
      </div>
    </main>
  );
}

function TextInput({
  label,
  value,
  onChange,
  type = "text",
  required,
  placeholder,
  autoComplete,
  onBlur,
}: TextInputProps) {
  return (
    <label className="block text-sm">
      <span className="font-medium text-slate-900">{label}</span>
      <input
        type={type}
        required={required}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onBlur={onBlur}
        autoComplete={autoComplete}
        placeholder={placeholder}
        className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 caret-slate-900 shadow-sm focus:outline-none focus:ring-2 focus:ring-slate-300"
      />
    </label>
  );
}

function TextareaInput({ label, value, onChange, placeholder }: TextareaInputProps) {
  return (
    <label className="block text-sm">
      <span className="font-medium text-slate-900">{label}</span>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 caret-slate-900 shadow-sm focus:outline-none focus:ring-2 focus:ring-slate-300"
        rows={3}
      />
    </label>
  );
}

function ActionButton({ text, loadingText, type = "button", loading, disabled }: ActionButtonProps) {
  return (
    <button
      type={type}
      disabled={disabled || loading}
      className="w-full rounded-full bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-slate-800 disabled:opacity-60"
    >
      {loading ? loadingText : text}
    </button>
  );
}
function Banner({ kind, message }: BannerProps) {
  const styles =
    kind === "success"
      ? "border-emerald-200 bg-emerald-50 text-emerald-900"
      : kind === "warning"
      ? "border-amber-200 bg-amber-50 text-amber-900"
      : "border-rose-200 bg-rose-50 text-rose-900";
  return (
    <div className={`mt-4 rounded-2xl border px-4 py-3 text-sm ${styles}`}>
      {message}
    </div>
  );
}

function mapSupabaseError(message: string) {
  const normalized = message.toLowerCase();
  if (normalized.includes("invalid login")) return "Invalid email or password.";
  if (normalized.includes("email not confirmed"))
    return "Please confirm your email before signing in.";
  if (normalized.includes("rate limit"))
    return "Too many attempts. Please try again in a moment.";
  if (normalized.includes("password")) return "Please check your password and try again.";
  return "Something went wrong. Please try again.";
}

type PasswordRules = {
  length: boolean;
  upper: boolean;
  lower: boolean;
  number: boolean;
  symbol: boolean;
  allValid: boolean;
};

function getPasswordRules(value: string): PasswordRules {
  const length = value.length >= 12;
  const upper = /[A-Z]/.test(value);
  const lower = /[a-z]/.test(value);
  const number = /[0-9]/.test(value);
  const symbol = /[^A-Za-z0-9]/.test(value);
  const allValid = length && upper && lower && number && symbol;
  return { length, upper, lower, number, symbol, allValid };
}

function PasswordChecklist({ rules }: { rules: PasswordRules }) {
  const items = [
    { label: "12+ characters", valid: rules.length },
    { label: "Uppercase letter", valid: rules.upper },
    { label: "Lowercase letter", valid: rules.lower },
    { label: "Number", valid: rules.number },
    { label: "Symbol", valid: rules.symbol },
  ];
  return (
    <div className="space-y-1.5 rounded-2xl border border-slate-100 bg-slate-50 px-4 py-3 text-xs text-slate-600">
      {items.map((item) => (
        <p key={item.label} className="flex items-center gap-2">
          <span
            className={`inline-flex h-4 w-4 items-center justify-center rounded-full border ${
              item.valid
                ? "border-emerald-400 bg-emerald-100 text-emerald-700"
                : "border-slate-200 text-slate-400"
            } text-[10px] font-semibold`}
          >
            {item.valid ? "✓" : "○"}
          </span>
          {item.label}
        </p>
      ))}
    </div>
  );
}

function LearnerSignup({
  signupEmail,
  setSignupEmail,
  signupPassword,
  setSignupPassword,
  passwordRules,
  signupStatus,
  signupMessage,
  onSignup,
  handleProviderLogin,
  oauthMessage,
  oauthStatus,
  onGoToEmployer,
}: {
  signupEmail: string;
  setSignupEmail: (value: string) => void;
  signupPassword: string;
  setSignupPassword: (value: string) => void;
  passwordRules: PasswordRules;
  signupStatus: Status;
  signupMessage: string | null;
  onSignup: (e: React.FormEvent) => Promise<void>;
  handleProviderLogin: (provider: "google" | "apple") => Promise<void>;
  oauthMessage: string | null;
  oauthStatus: "success" | "error" | "warning";
  onGoToEmployer: () => void;
}) {
  const [role, setRole] = useState<"learner" | "employer">("learner");

  if (role === "employer") {
    return (
      <div className="mt-6 space-y-4 rounded-3xl border border-slate-200 bg-white px-4 py-6 shadow-sm">
        <div className="space-y-2">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
            I’m joining as
          </p>
          <div className="flex items-center gap-2 text-sm font-medium text-slate-900">
            <button
              type="button"
              onClick={() => setRole("learner")}
              className="rounded-full border border-slate-200 px-3 py-1 text-xs text-slate-600 hover:text-slate-900"
            >
              Learner
            </button>
            <button
              type="button"
              className="inline-flex items-center gap-1 rounded-full border border-slate-900 px-3 py-1 text-xs font-semibold text-slate-900"
            >
              Employer <span className="text-[11px] text-slate-500">🔒 Invite-only</span>
            </button>
          </div>
        </div>
        <p className="text-sm text-slate-600">
          Employer access is invite-only. Request access and we’ll reach out.
        </p>
        <button
          type="button"
          onClick={onGoToEmployer}
          className="inline-flex w-full items-center justify-center rounded-full bg-slate-900 px-5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-slate-800"
        >
          Request employer access
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={onSignup} className="mt-6 space-y-3 md:space-y-4">
      <div className="space-y-2">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
          I’m joining as
        </p>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => setRole("learner")}
            className="inline-flex flex-1 items-center justify-center rounded-2xl border border-slate-200 bg-slate-900/5 px-4 py-2 text-xs font-semibold text-slate-900"
          >
            Learner
          </button>
          <button
            type="button"
            onClick={() => setRole("employer")}
            className="inline-flex flex-1 items-center justify-center gap-1 rounded-2xl border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-600"
          >
            Employer <span className="text-[10px] text-slate-400">🔒 Invite-only</span>
          </button>
        </div>
      </div>
      <TextInput
        label="Email"
        type="email"
        required
        autoComplete="email"
        value={signupEmail}
        onChange={setSignupEmail}
        placeholder="you@email.com"
      />
      <PasswordField
        label="Password"
        required
        autoComplete="new-password"
        value={signupPassword}
        onChange={setSignupPassword}
        placeholder="Create a password"
        minLength={12}
        showCopy
      />
      <PasswordChecklist rules={passwordRules} />
      <ActionButton
        text="Create account"
        loadingText="Creating…"
        type="submit"
        loading={signupStatus === "loading"}
        disabled={!passwordRules.allValid}
      />
      {signupMessage && (
        <Banner
          kind={signupStatus === "success" ? "success" : "error"}
          message={signupMessage}
        />
      )}
      <div className="space-y-2.5">
        <div className="py-2 text-center text-xs uppercase tracking-[0.2em] text-slate-400">
          or
        </div>
        <button
          type="button"
          onClick={() => handleProviderLogin("google")}
          className="flex w-full items-center justify-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-900 shadow-sm hover:border-slate-300"
        >
          Continue with Google
        </button>
        <button
          type="button"
          onClick={() => handleProviderLogin("apple")}
          className="flex w-full items-center justify-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-900 shadow-sm hover:border-slate-300"
        >
          Continue with Apple
        </button>
        {oauthMessage && <Banner kind={oauthStatus} message={oauthMessage} />}
      </div>
    </form>
  );
}
