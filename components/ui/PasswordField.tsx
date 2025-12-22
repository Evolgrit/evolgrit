"use client";

import { useState } from "react";

type PasswordFieldProps = {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  autoComplete?: string;
  minLength?: number;
  showCopy?: boolean;
  required?: boolean;
};

export default function PasswordField({
  label,
  value,
  onChange,
  placeholder,
  autoComplete,
  minLength,
  showCopy = false,
  required,
}: PasswordFieldProps) {
  const [visible, setVisible] = useState(false);
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    if (!navigator?.clipboard) return;
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      setTimeout(() => setCopied(false), 1600);
    } catch (error) {
      console.error("password copy error", error);
    }
  }

  return (
    <label className="block text-sm">
      <span className="font-medium text-slate-900">{label}</span>
      <div className="relative mt-2">
        <input
        type={visible ? "text" : "password"}
          required={required}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          autoComplete={autoComplete}
          minLength={minLength}
          className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 pr-24 text-sm text-slate-900 placeholder:text-slate-400 caret-slate-900 shadow-sm focus:outline-none focus:ring-2 focus:ring-slate-300"
        />
        <div className="absolute inset-y-0 right-3 flex items-center gap-2 text-xs">
          {showCopy && visible && (
            <button
              type="button"
              onClick={handleCopy}
              className="rounded-full border border-slate-200 bg-white/80 px-2 py-1 text-slate-700 hover:border-slate-300"
            >
              Copy
            </button>
          )}
          <button
            type="button"
            onClick={() => setVisible((v) => !v)}
            aria-pressed={visible}
            className="rounded-full border border-slate-200 bg-white/80 px-2 py-1 text-slate-700 hover:border-slate-300"
          >
            {visible ? "Hide" : "Show"}
          </button>
        </div>
      </div>
      {copied && (
        <p className="mt-1 text-xs text-emerald-600" aria-live="polite">
          Copied
        </p>
      )}
    </label>
  );
}
