"use client";

import { useRouter } from "next/navigation";
import { useMemo, useRef, useState } from "react";
import { createSupabaseBrowserClient } from "@/lib/supabase/browser";

export type OnboardingField = {
  name: string;
  label: string;
  type: "text" | "date" | "select";
  required?: boolean;
  placeholder?: string;
  options?: { value: string; label: string }[];
};

export function OnboardingForm({
  fields,
  initialValues,
}: {
  fields: OnboardingField[];
  initialValues: Record<string, string | null | undefined>;
}) {
  const supabase = useMemo(() => createSupabaseBrowserClient(), []);
  const router = useRouter();
  const [formState, setFormState] = useState<Record<string, string>>(() => {
    const state: Record<string, string> = {};
    fields.forEach((field) => {
      const raw = initialValues[field.name];
      state[field.name] = typeof raw === "string" ? raw : "";
    });
    return state;
  });
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [saved, setSaved] = useState(false);
  const fieldRefs = useRef<Record<
    string,
    HTMLInputElement | HTMLSelectElement | null
  >>({});

  const handleChange = (name: string, value: string) => {
    setFormState((prev) => ({ ...prev, [name]: value }));
    if (fieldErrors[name]) {
      setFieldErrors((prev) => {
        const updated = { ...prev };
        delete updated[name];
        return updated;
      });
    }
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (saving) return;
    const validationErrors: Record<string, string> = {};
    fields.forEach((field) => {
      if (!field.required) return;
      const value = formState[field.name];
      if (!value || !value.trim()) {
        validationErrors[field.name] = "Required";
      }
    });
    if (Object.keys(validationErrors).length > 0) {
      setFieldErrors(validationErrors);
      const firstKey = Object.keys(validationErrors)[0];
      const ref = fieldRefs.current[firstKey];
      if (ref) {
        ref.scrollIntoView({ behavior: "smooth", block: "center" });
        ref.focus({ preventScroll: true });
      }
      return;
    }

    setSaving(true);
    setMessage(null);

    const { data } = await supabase.auth.getUser();
    if (!data.user) {
      setMessage("Session expired. Please log in again.");
      setSaving(false);
      return;
    }

    const payload: Record<string, string> = {};
    fields.forEach((field) => {
      payload[field.name] = formState[field.name] ?? "";
    });

    const { error } = await supabase
      .from("profiles")
      .update(payload)
      .eq("id", data.user.id);

    if (error) {
      setMessage(error.message);
      setSaving(false);
      return;
    }

    setMessage(null);
    setSaved(true);
    setSaving(false);
    setTimeout(() => {
      setSaved(false);
      router.refresh();
    }, 600);
  };

  return (
    <form onSubmit={handleSubmit} className="mt-6 space-y-5">
      <div className="space-y-4">
        {fields.map((field) => (
          <div key={field.name} className="space-y-2">
            <label className="text-sm font-medium text-slate-900">
              {field.label}
            </label>
            {field.type === "select" ? (
              <select
                value={formState[field.name] ?? ""}
                onChange={(event) => handleChange(field.name, event.target.value)}
                ref={(element) => {
                  fieldRefs.current[field.name] = element;
                }}
                className={`w-full rounded-2xl border bg-white px-4 py-3 text-sm text-slate-900 shadow-sm focus:outline-none focus:ring-2 ${
                  fieldErrors[field.name]
                    ? "border-rose-300 focus:ring-rose-200"
                    : "border-slate-200 focus:ring-slate-300"
                }`}
              >
                <option value="">Select…</option>
                {field.options?.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            ) : (
              <input
                type={field.type}
                value={formState[field.name] ?? ""}
                onChange={(event) => handleChange(field.name, event.target.value)}
                ref={(element) => {
                  fieldRefs.current[field.name] = element;
                }}
                placeholder={field.placeholder}
                className={`w-full rounded-2xl border bg-white px-4 py-3 text-sm text-slate-900 shadow-sm focus:outline-none focus:ring-2 ${
                  fieldErrors[field.name]
                    ? "border-rose-300 focus:ring-rose-200"
                    : "border-slate-200 focus:ring-slate-300"
                }`}
              />
            )}
            {fieldErrors[field.name] && (
              <p className="text-xs text-rose-600">{fieldErrors[field.name]}</p>
            )}
          </div>
        ))}
      </div>

      {message && (
        <div className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-900">
          {message}
        </div>
      )}

      <div className="space-y-2">
        <button
          type="submit"
          disabled={saving || saved}
          className="inline-flex w-full items-center justify-center rounded-full bg-slate-900 px-5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {saving ? "Saving…" : saved ? "Saved" : "Save & continue →"}
        </button>
        <p className="text-xs text-slate-500">
          All required fields must be filled to continue.
        </p>
      </div>
    </form>
  );
}
