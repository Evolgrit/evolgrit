"use client";

import { useRouter } from "next/navigation";
import { useMemo, useRef, useState } from "react";
import { createSupabaseBrowserClient } from "@/lib/supabase/browser";
import { COUNTRIES } from "@/lib/countries";
const countryFieldNames = new Set(["current_country", "origin_country"]);
export type OnboardingStage = "basics" | "background" | "goal";
const FIELD_LABELS: Record<string, string> = {
  full_name: "Full name",
  mother_tongue: "Mother tongue",
  other_languages: "Other languages",
  german_level: "German level",
  current_country: "Current country",
  origin_country: "Country of origin",
  birthday: "Birthday",
  target: "Target",
  avatar_url: "Profile photo",
};

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
  currentStage,
}: {
  fields: OnboardingField[];
  initialValues: Record<string, string | null | undefined>;
  currentStage: OnboardingStage;
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
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [infoMessage, setInfoMessage] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const fieldRefs = useRef<Record<
    string,
    HTMLInputElement | HTMLSelectElement | null
  >>({});
  const [activeSuggestions, setActiveSuggestions] = useState<
    Record<string, string[]>
  >({});
  const [highlightIndex, setHighlightIndex] = useState<
    Record<string, number>
  >({});

  const handleChange = (name: string, value: string) => {
    setFormState((prev) => ({ ...prev, [name]: value }));
    if (fieldErrors[name]) {
      setFieldErrors((prev) => {
        const updated = { ...prev };
        delete updated[name];
        return updated;
      });
    }
    if (value && value.length > 0 && countryFieldNames.has(name)) {
      const subset = COUNTRIES.filter((country) =>
        country.toLowerCase().includes(value.toLowerCase())
      ).slice(0, 6);
      setActiveSuggestions((prev) => ({ ...prev, [name]: subset }));
      setHighlightIndex((prev) => ({ ...prev, [name]: 0 }));
    } else if (countryFieldNames.has(name)) {
      setActiveSuggestions((prev) => {
        const updated = { ...prev };
        delete updated[name];
        return updated;
      });
    }
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (isSaving) return;
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

    setIsSaving(true);
    setMessage(null);
    setInfoMessage(null);

    const { data } = await supabase.auth.getUser();
    if (!data.user) {
      setMessage("Session expired. Please log in again.");
      setIsSaving(false);
      return;
    }

    const payload: Record<string, string | null> = {};
    fields.forEach((field) => {
      const value = formState[field.name]?.trim() || null;
      payload[field.name] = value;
    });
    if (process.env.NODE_ENV !== "production") {
      console.log("payload", payload);
    }

    const { error } = await supabase
      .from("profiles")
      .update(payload)
      .eq("id", data.user.id);

    if (error) {
      setMessage(error.message);
      setIsSaving(false);
      return;
    }

    const { data: progressRow, error: progressError } = await supabase
      .from("v_onboarding_progress")
      .select("next_step, missing_fields")
      .eq("user_id", data.user.id)
      .maybeSingle();

    if (progressError) {
      setMessage(progressError.message);
      setIsSaving(false);
      return;
    }

    if (progressRow?.next_step === "done") {
      router.replace("/dashboard?onboarding=done");
      return;
    }

    if (progressRow?.next_step && progressRow.next_step !== currentStage) {
      router.replace("/dashboard/onboarding");
      return;
    }

    if (progressRow?.next_step === currentStage) {
      if (progressRow.missing_fields?.length) {
        const friendly = progressRow.missing_fields
.map((field: string) => FIELD_LABELS[field] ?? field)
          .join(", ");
        setInfoMessage(`Missing: ${friendly}`);
      } else {
        setInfoMessage(null);
      }
    }

    setIsSaving(false);
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
                onKeyDown={(event) => {
                  if (!activeSuggestions[field.name]?.length) return;
                  if (event.key === "ArrowDown" || event.key === "ArrowUp") {
                    event.preventDefault();
                    setHighlightIndex((prev) => {
                      const items = activeSuggestions[field.name] ?? [];
                      if (!items.length) return prev;
                      const delta = event.key === "ArrowDown" ? 1 : -1;
                      const next =
                        ((prev[field.name] ?? 0) + delta + items.length) %
                        items.length;
                      return { ...prev, [field.name]: next };
                    });
                  } else if (event.key === "Enter") {
                    const items = activeSuggestions[field.name] ?? [];
                    const selected =
                      items[(highlightIndex[field.name] ?? 0)] ?? null;
                    if (selected) {
                      event.preventDefault();
                      handleChange(field.name, selected);
                      setActiveSuggestions((prev) => {
                        const updated = { ...prev };
                        delete updated[field.name];
                        return updated;
                      });
                      setHighlightIndex((prev) => {
                        const updated = { ...prev };
                        delete updated[field.name];
                        return updated;
                      });
                    }
                  } else if (event.key === "Escape") {
                    setActiveSuggestions((prev) => {
                      const updated = { ...prev };
                      delete updated[field.name];
                      return updated;
                    });
                  }
                }}
                onFocus={() => {
                  const value = formState[field.name];
                  if (countryFieldNames.has(field.name) && value) {
                    handleChange(field.name, value);
                  }
                }}
              />
            )}
            {fieldErrors[field.name] && (
              <p className="text-xs text-rose-600">{fieldErrors[field.name]}</p>
            )}
            {countryFieldNames.has(field.name) &&
              activeSuggestions[field.name]?.length ? (
              <div className="relative z-20">
                <ul className="absolute mt-1 w-full rounded-2xl border border-slate-200 bg-white shadow-lg">
                  {activeSuggestions[field.name].map((suggestion, index) => (
                    <li
                      key={suggestion}
                      className={`px-4 py-2 text-sm text-slate-900 transition ${
                        highlightIndex[field.name] === index
                          ? "bg-slate-100"
                          : "bg-white hover:bg-slate-50"
                      }`}
                      onMouseDown={(event) => {
                        event.preventDefault();
                        handleChange(field.name, suggestion);
                        setActiveSuggestions((prev) => {
                          const updated = { ...prev };
                          delete updated[field.name];
                          return updated;
                        });
                      }}
                    >
                      {suggestion}
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}
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
          disabled={isSaving}
          className="inline-flex w-full items-center justify-center rounded-full bg-slate-900 px-5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isSaving ? "Saving…" : "Save & continue →"}
        </button>
        <p className="text-xs text-slate-500">
          All required fields must be filled to continue.
        </p>
        {infoMessage && (
          <p className="text-xs font-medium text-slate-600">{infoMessage}</p>
        )}
      </div>
    </form>
  );
}
