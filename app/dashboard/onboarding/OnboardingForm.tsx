"use client";

import {
  useEffect,
  useMemo,
  useState,
  type Dispatch,
  type SetStateAction,
} from "react";
import { useRouter } from "next/navigation";
import { createSupabaseBrowserClient } from "@/lib/supabase/browser";

type Stage = "basics" | "language" | "work";

type WizardProps = {
  userId: string;
  stage: Stage | "background" | "goal" | string;
  completion: { completed: number; total: number };
  initialProfile: {
    full_name: string;
    current_country: string;
    target_in_germany: string;
    start_timeframe: string;
  };
};

type ProfileLanguage = {
  id: string;
  kind: "mother_tongue" | "german" | "other";
  language: string | null;
  level: string | null;
};

type Skill = { id: string; skill: string | null };
type Entry = { id: string; title: string | null; subtitle: string | null };

const languageLevels = ["A0", "A1", "A2", "B1", "B2", "C1", "C2"];
const targetOptions = ["job", "apprenticeship", "training", "other"];
const targetLabels: Record<string, string> = {
  job: "Job",
  apprenticeship: "Apprenticeship",
  training: "Further training",
  other: "Other",
};
const timeframeOptions = ["0-3 months", "3-6 months", "6-12 months", "12+ months"];

const steps: Array<{
  id: Stage;
  title: string;
  helper: string;
}> = [
  {
    id: "basics",
    title: "Let’s set up your job-ready profile",
    helper: "This takes about 2 minutes. You can edit everything later.",
  },
  {
    id: "language",
    title: "Language snapshot",
    helper: "We use this to place you in the right Batch and match you faster.",
  },
  {
    id: "work",
    title: "Work readiness",
    helper: "Add what you can do — even if your German isn’t perfect yet.",
  },
];

export default function OnboardingForm({
  userId,
  stage,
  completion,
  initialProfile,
}: WizardProps) {
  const supabase = useMemo(() => createSupabaseBrowserClient(), []);
  const router = useRouter();
  const resolvedStage: Stage =
    stage === "language" || stage === "work"
      ? (stage as Stage)
      : stage === "background"
      ? "language"
      : stage === "goal"
      ? "work"
      : "basics";
  const [currentStep, setCurrentStep] = useState<Stage>(resolvedStage);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [stepError, setStepError] = useState<string | null>(null);

  // Basics state
  const [basics, setBasics] = useState({
    full_name: initialProfile.full_name,
    current_country: initialProfile.current_country,
    target_in_germany: initialProfile.target_in_germany?.toLowerCase() ?? "",
    start_timeframe: initialProfile.start_timeframe,
  });

  // Language states
  const [languages, setLanguages] = useState<ProfileLanguage[]>([]);
  const [motherTongue, setMotherTongue] = useState("");
  const [germanLevel, setGermanLevel] = useState("");
  const [otherLangInput, setOtherLangInput] = useState({ language: "", level: "" });

  // Work readiness
  const [targetRoles, setTargetRoles] = useState<string[]>([]);
  const [roleInput, setRoleInput] = useState("");
  const [skills, setSkills] = useState<Skill[]>([]);
  const [skillInput, setSkillInput] = useState("");
  const [workEntries, setWorkEntries] = useState<Entry[]>([]);
  const [educationEntries, setEducationEntries] = useState<Entry[]>([]);
  const [workForm, setWorkForm] = useState({ company: "", role: "" });
  const [educationForm, setEducationForm] = useState({
    institution: "",
    degree: "",
  });
  const [workAdded, setWorkAdded] = useState(false);
  const [educationAdded, setEducationAdded] = useState(false);

  useEffect(() => {
    async function loadData() {
      const [
        { data: langs },
        { data: skillRows },
        { data: workRows },
        { data: eduRows },
        { data: profileRow },
      ] = await Promise.all([
          supabase
            .from("profile_languages")
            .select("id, kind, language, level")
            .eq("profile_id", userId),
          supabase.from("profile_skills").select("id, skill").eq("profile_id", userId),
          supabase
            .from("work_experience_entries")
            .select("id, company, title")
            .eq("profile_id", userId)
            .limit(3)
            .order("created_at", { ascending: false }),
          supabase
            .from("education_entries")
            .select("id, institution, degree")
            .eq("profile_id", userId)
            .limit(3)
            .order("created_at", { ascending: false }),
          supabase
            .from("profiles")
            .select("target_roles")
            .eq("id", userId)
            .maybeSingle(),
        ]);
      if (langs) {
        const normalized = (langs as Array<
          Omit<ProfileLanguage, "kind"> & { kind: string }
        >).map((lang) => {
          const nextKind =
            lang.kind === "mother" ? "mother_tongue" : (lang.kind as ProfileLanguage["kind"]);
          return { ...lang, kind: nextKind };
        });
        setLanguages(normalized);
        const mother = normalized.find((l) => l.kind === "mother_tongue");
        setMotherTongue(mother?.language ?? "");
        const german = normalized.find((l) => l.kind === "german");
        setGermanLevel(german?.level ?? "");
      }
      if (skillRows) setSkills(skillRows as Skill[]);
      if (workRows)
        setWorkEntries(
          workRows.map((row) => ({
            id: row.id,
            title: row.company,
            subtitle: row.title,
          }))
        );
      if (eduRows)
        setEducationEntries(
          eduRows.map((row) => ({
            id: row.id,
            title: row.institution,
            subtitle: row.degree,
          }))
        );
      const roles = (profileRow?.target_roles as string[] | null | undefined) ?? [];
      setTargetRoles(roles);
    }
    loadData();
  }, [supabase, userId]);

  const stepIndex = steps.findIndex((s) => s.id === currentStep);

  async function ensureSession() {
    const { data } = await supabase.auth.getUser();
    if (!data.user) throw new Error("Session expired");
    return data.user;
  }

  function validateBasics() {
    if (!basics.full_name.trim()) return "Full name required.";
    if (!basics.current_country.trim()) return "Current country required.";
    if (!basics.target_in_germany) return "Select your goal in Germany.";
    if (!basics.start_timeframe) return "Select your preferred start timeframe.";
    return null;
  }

  async function handleBasicsNext() {
    const validationMessage = validateBasics();
    if (validationMessage) {
      setStepError(validationMessage);
      return;
    }
    setSaving(true);
    setError(null);
    setStepError(null);
    try {
      await ensureSession();
      const { error: updateError } = await supabase
        .from("profiles")
        .update({
          full_name: basics.full_name || null,
          current_country: basics.current_country || null,
          target_in_germany: basics.target_in_germany || null,
          start_timeframe: basics.start_timeframe || null,
        })
        .eq("id", userId);
      if (updateError) throw updateError;
      setCurrentStep("language");
      setStepError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to save basics.");
    } finally {
      setSaving(false);
    }
  }

  function validateLanguage() {
    if (!motherTongue.trim()) return "Mother tongue required.";
    if (!germanLevel) return "Select your German level.";
    return null;
  }

  async function saveMotherTongue() {
    const trimmed = motherTongue.trim();
    const existing = languages.find((l) => l.kind === "mother_tongue");
    const payload = {
      id: existing?.id,
      profile_id: userId,
      kind: "mother_tongue",
      language: trimmed || null,
      level: null,
    };
    const { data, error } = await supabase
      .from("profile_languages")
      .upsert(payload, { onConflict: "id" })
      .select()
      .single();
    if (error) throw error;
    setLanguages((prev) => {
      const others = prev.filter((l) => l.kind !== "mother_tongue");
      return data ? [...others, data as ProfileLanguage] : others;
    });
  }

  async function saveGermanLevel() {
    const existing = languages.find((l) => l.kind === "german");
    const payload = {
      id: existing?.id,
      profile_id: userId,
      kind: "german",
      language: "German",
      level: germanLevel || null,
    };
    const { data, error } = await supabase
      .from("profile_languages")
      .upsert(payload, { onConflict: "id" })
      .select()
      .single();
    if (error) throw error;
    setLanguages((prev) => {
      const others = prev.filter((l) => l.kind !== "german");
      return data ? [...others, data as ProfileLanguage] : others;
    });
  }

  async function addOtherLanguage() {
    if (!otherLangInput.language.trim()) return;
    const { data, error } = await supabase
      .from("profile_languages")
      .insert({
        profile_id: userId,
        kind: "other",
        language: otherLangInput.language.trim(),
        level: otherLangInput.level.trim() || null,
      })
      .select()
      .single();
    if (error) throw error;
    setLanguages((prev) => [...prev, data as ProfileLanguage]);
    setOtherLangInput({ language: "", level: "" });
  }

  async function removeLanguage(id: string) {
    const { error } = await supabase
      .from("profile_languages")
      .delete()
      .eq("id", id)
      .eq("profile_id", userId);
    if (error) throw error;
    setLanguages((prev) => prev.filter((lang) => lang.id !== id));
  }

  async function handleLanguageNext() {
    const validationMessage = validateLanguage();
    if (validationMessage) {
      setStepError(validationMessage);
      return;
    }
    setSaving(true);
    setError(null);
    try {
      await ensureSession();
      await saveMotherTongue();
      await saveGermanLevel();
      setCurrentStep("work");
      setStepError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to save languages.");
    } finally {
      setSaving(false);
    }
  }

  async function addSkill() {
    const trimmed = skillInput.trim();
    if (!trimmed) return;
    const { data, error } = await supabase
      .from("profile_skills")
      .insert({ profile_id: userId, skill: trimmed })
      .select()
      .single();
    if (error) {
      if (
        error.message.toLowerCase().includes("duplicate") ||
        error.message.toLowerCase().includes("unique")
      ) {
        setError("Skill already added.");
        return;
      }
      throw error;
    }
    setSkills((prev) => [...prev, data as Skill]);
    setSkillInput("");
    setError(null);
    setStepError(null);
  }

  async function removeSkill(id: string) {
    const { error } = await supabase
      .from("profile_skills")
      .delete()
      .eq("id", id)
      .eq("profile_id", userId);
    if (error) throw error;
    setSkills((prev) => prev.filter((skill) => skill.id !== id));
  }

  async function addWorkEntry() {
    if (!workForm.company.trim() || !workForm.role.trim()) return;
    const { data, error } = await supabase
      .from("work_experience_entries")
      .insert({
        profile_id: userId,
        company: workForm.company.trim(),
        title: workForm.role.trim(),
      })
      .select()
      .single();
    if (error) {
      setError(error.message);
      return;
    }
    setWorkEntries((prev) => [
      ...prev,
      { id: data.id, title: data.company, subtitle: data.title },
    ]);
    setWorkForm({ company: "", role: "" });
    setWorkAdded(true);
    setError(null);
  }

  async function addEducationEntry() {
    if (!educationForm.institution.trim() || !educationForm.degree.trim()) return;
    const { data, error } = await supabase
      .from("education_entries")
      .insert({
        profile_id: userId,
        institution: educationForm.institution.trim(),
        degree: educationForm.degree.trim(),
      })
      .select()
      .single();
    if (error) {
      setError(error.message);
      return;
    }
    setEducationEntries((prev) => [
      ...prev,
      { id: data.id, title: data.institution, subtitle: data.degree },
    ]);
    setEducationForm({ institution: "", degree: "" });
    setEducationAdded(true);
    setError(null);
  }

  function validateWorkReadiness() {
    if (targetRoles.length < 1) return "Add at least one target role.";
    if (skills.length < 3) return "Add at least three skills.";
    return null;
  }

  async function handleFinish() {
    const validationMessage = validateWorkReadiness();
    if (validationMessage) {
      setStepError(validationMessage);
      return;
    }
    setSaving(true);
    setError(null);
    try {
      await ensureSession();
      const { error: profileUpdateError } = await supabase
        .from("profiles")
        .update({
          target_roles: targetRoles,
          onboarding_completed_at: new Date().toISOString(),
        })
        .eq("id", userId);
      if (profileUpdateError) throw profileUpdateError;

      const events = [];
      events.push({ user_id: userId, type: "onboarding_completed" });
      if (germanLevel) {
        events.push({
          user_id: userId,
          type: "language_german_set",
          metadata: { level: germanLevel },
        });
      }
      if (targetRoles.length) {
        events.push({
          user_id: userId,
          type: "target_roles_set",
          metadata: { count: targetRoles.length },
        });
      }
      if (skills.length >= 3) {
        events.push({
          user_id: userId,
          type: "skills_added",
          metadata: { count: skills.length },
        });
      }
      if (workAdded) {
        events.push({
          user_id: userId,
          type: "work_added",
          metadata: { count: workEntries.length },
        });
      }
      if (educationAdded) {
        events.push({
          user_id: userId,
          type: "education_added",
          metadata: { count: educationEntries.length },
        });
      }
      if (events.length) {
        await supabase.from("readiness_events").insert(events);
      }
      router.replace("/dashboard?onboarding=done");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to complete onboarding.");
    } finally {
      setSaving(false);
    }
  }

  function addTargetRole() {
    const trimmed = roleInput.trim();
    if (!trimmed || targetRoles.includes(trimmed)) return;
    setTargetRoles((prev) => [...prev, trimmed]);
    setRoleInput("");
    setStepError(null);
  }

  function removeTargetRole(role: string) {
    setTargetRoles((prev) => prev.filter((r) => r !== role));
    setStepError(null);
  }

  return (
    <main className="min-h-screen bg-slate-50 px-5 py-10">
      <div className="mx-auto max-w-3xl space-y-6">
        <div>
          <div className="flex items-center justify-between text-xs uppercase tracking-[0.18em] text-slate-400">
            <span>
              Step {stepIndex + 1} of {steps.length}
            </span>
            <span>
              {completion.completed} of {completion.total} details complete
            </span>
          </div>
          <div className="mt-3 h-1.5 rounded-full bg-slate-200">
            <div
              className="h-full rounded-full bg-slate-900 transition-all"
              style={{ width: `${((stepIndex + 1) / steps.length) * 100}%` }}
            />
          </div>
          <div className="mt-4 flex items-center gap-2 text-sm text-slate-600">
            {steps.map((step, index) => (
              <div key={step.id} className="flex items-center gap-2">
                <span
                  className={`h-8 w-8 rounded-full text-center text-xs font-semibold leading-8 ${
                    index <= stepIndex
                      ? "bg-slate-900 text-white"
                      : "bg-slate-200 text-slate-500"
                  }`}
                >
                  {index + 1}
                </span>
                {index < steps.length - 1 && (
                  <span className="h-px w-8 bg-slate-200" aria-hidden="true" />
                )}
              </div>
            ))}
          </div>
          <h1 className="mt-4 text-3xl font-semibold text-slate-900">
            {steps[stepIndex].title}
          </h1>
          <p className="mt-2 text-sm text-slate-600">{steps[stepIndex].helper}</p>
        </div>

        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          {currentStep === "basics" && (
            <div className="space-y-4">
              <InputField
                label="Full name"
                value={basics.full_name}
                onChange={(v) => setBasics((prev) => ({ ...prev, full_name: v }))}
              />
              <InputField
                label="Current country"
                value={basics.current_country}
                onChange={(v) => setBasics((prev) => ({ ...prev, current_country: v }))}
              />
              <SelectField
                label="Target in Germany"
                value={basics.target_in_germany}
                onChange={(v) =>
                  setBasics((prev) => ({ ...prev, target_in_germany: v }))
                }
                options={targetOptions.map((value) => ({
                  value,
                  label: targetLabels[value],
                }))}
              />
              <SelectField
                label="Preferred start timeframe"
                value={basics.start_timeframe}
                onChange={(v) =>
                  setBasics((prev) => ({ ...prev, start_timeframe: v }))
                }
                options={timeframeOptions.map((value) => ({
                  value,
                  label: value,
                }))}
              />
              <div className="pt-2">
                <button
                  type="button"
                  onClick={handleBasicsNext}
                  disabled={saving}
                  className="w-full rounded-full bg-slate-900 px-5 py-3 text-sm font-semibold text-white hover:bg-slate-800 disabled:opacity-50"
                >
                  Continue
                </button>
              </div>
            </div>
          )}

          {currentStep === "language" && (
            <div className="space-y-5">
              <InputField
                label="Mother tongue"
                value={motherTongue}
                onChange={setMotherTongue}
              />
              <SelectField
                label="German level"
                value={germanLevel}
                onChange={setGermanLevel}
                options={languageLevels.map((value) => ({ value, label: value }))}
              />
              <div>
                <p className="text-sm font-medium text-slate-900">Other languages</p>
                <div className="mt-2 space-y-2">
                  {languages.filter((l) => l.kind === "other").map((lang) => (
                    <div
                      key={lang.id}
                      className="flex items-center justify-between rounded-2xl border border-slate-100 bg-slate-50 px-3 py-2 text-sm"
                    >
                      <span>
                        {lang.language} {lang.level ? `· ${lang.level}` : ""}
                      </span>
                      <button
                        type="button"
                        onClick={() => removeLanguage(lang.id)}
                        className="text-xs text-slate-500 hover:text-rose-600"
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                  {languages.filter((l) => l.kind === "other").length === 0 && (
                    <p className="text-xs text-slate-500">Add any extra languages.</p>
                  )}
                </div>
                <div className="mt-3 flex flex-col gap-2 sm:flex-row">
                  <input
                    value={otherLangInput.language}
                    onChange={(e) =>
                      setOtherLangInput((prev) => ({
                        ...prev,
                        language: e.target.value,
                      }))
                    }
                    placeholder="Language"
                    className="flex-1 rounded-2xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-900 shadow-sm focus:outline-none focus:ring-2 focus:ring-slate-300"
                  />
                  <input
                    value={otherLangInput.level}
                    onChange={(e) =>
                      setOtherLangInput((prev) => ({ ...prev, level: e.target.value }))
                    }
                    placeholder="Level"
                    className="flex-1 rounded-2xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-900 shadow-sm focus:outline-none focus:ring-2 focus:ring-slate-300"
                  />
                  <button
                    type="button"
                    onClick={addOtherLanguage}
                    className="rounded-full bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-800"
                  >
                    Add
                  </button>
                </div>
              </div>
              <button
                type="button"
                onClick={handleLanguageNext}
                disabled={saving}
                className="w-full rounded-full bg-slate-900 px-5 py-3 text-sm font-semibold text-white hover:bg-slate-800 disabled:opacity-50"
              >
                Continue
              </button>
            </div>
          )}

          {currentStep === "work" && (
            <div className="space-y-6">
              <div>
                <p className="text-sm font-medium text-slate-900">Target roles</p>
                <div className="mt-2 flex flex-wrap gap-2">
                  {targetRoles.length === 0 && (
                    <span className="text-xs text-slate-500">Add roles you are aiming for.</span>
                  )}
                  {targetRoles.map((role) => (
                    <button
                      key={role}
                      type="button"
                      onClick={() => removeTargetRole(role)}
                      className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs text-slate-700 shadow-sm hover:border-slate-300"
                    >
                      {role} ×
                    </button>
                  ))}
                </div>
                <div className="mt-3 flex gap-2">
                  <input
                    value={roleInput}
                    onChange={(e) => setRoleInput(e.target.value)}
                    placeholder="e.g., Childcare assistant"
                    className="flex-1 rounded-2xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-900 shadow-sm focus:outline-none focus:ring-2 focus:ring-slate-300"
                  />
                  <button
                    type="button"
                    onClick={addTargetRole}
                    className="rounded-full bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-800"
                  >
                    Add
                  </button>
                </div>
              </div>

              <div>
                <p className="text-sm font-medium text-slate-900">Skills</p>
                <div className="mt-2 flex flex-wrap gap-2">
                  {skills.length === 0 && (
                    <span className="text-xs text-slate-500">
                      Add a few skills so employers understand your strengths.
                    </span>
                  )}
                  {skills.map((skill) => (
                    <button
                      key={skill.id}
                      type="button"
                      onClick={() => removeSkill(skill.id)}
                      className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs text-slate-700 shadow-sm hover:border-slate-300"
                    >
                      {skill.skill} ×
                    </button>
                  ))}
                </div>
                <div className="mt-3 flex gap-2">
                  <input
                    value={skillInput}
                    onChange={(e) => setSkillInput(e.target.value)}
                    placeholder="Add a skill"
                    className="flex-1 rounded-2xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-900 shadow-sm focus:outline-none focus:ring-2 focus:ring-slate-300"
                  />
                  <button
                    type="button"
                    onClick={addSkill}
                    className="rounded-full bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-800"
                  >
                    Add
                  </button>
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <QuickEntryCard
                  title="Add education"
                  entries={educationEntries}
                  form={educationForm}
                  onChange={(next) => {
                    const value =
                      typeof next === "function" ? next(educationForm) : next;
                    setEducationForm({
                      institution: value.institution ?? "",
                      degree: value.degree ?? "",
                    });
                  }}
                  onAdd={addEducationEntry}
                  fields={[
                    { name: "institution", placeholder: "Institution" },
                    { name: "degree", placeholder: "Degree" },
                  ]}
                />
                <QuickEntryCard
                  title="Add work"
                  entries={workEntries}
                  form={workForm}
                  onChange={(next) => {
                    const value =
                      typeof next === "function" ? next(workForm) : next;
                    setWorkForm({
                      company: value.company ?? "",
                      role: value.role ?? "",
                    });
                  }}
                  onAdd={addWorkEntry}
                  fields={[
                    { name: "company", placeholder: "Company" },
                    { name: "role", placeholder: "Role" },
                  ]}
                />
              </div>

              <button
                type="button"
                onClick={handleFinish}
                disabled={saving}
                className="w-full rounded-full bg-slate-900 px-5 py-3 text-sm font-semibold text-white hover:bg-slate-800 disabled:opacity-50"
              >
                Finish onboarding
              </button>
            </div>
          )}
          {stepError && <p className="mt-4 text-sm text-rose-600">{stepError}</p>}
          {error && <p className="mt-2 text-sm text-rose-600">{error}</p>}
        </div>
      </div>
    </main>
  );
}

function InputField({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <div className="space-y-2">
      <label className="text-sm font-medium text-slate-900">{label}</label>
      <input
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-900 shadow-sm focus:outline-none focus:ring-2 focus:ring-slate-300"
      />
    </div>
  );
}

type SelectOption = { value: string; label: string };

function SelectField({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: SelectOption[];
}) {
  return (
    <div className="space-y-2">
      <label className="text-sm font-medium text-slate-900">{label}</label>
      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-900 shadow-sm focus:outline-none focus:ring-2 focus:ring-slate-300"
      >
        <option value="">Select…</option>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
}

function QuickEntryCard({
  title,
  entries,
  form,
  onChange,
  onAdd,
  fields,
}: {
  title: string;
  entries: Entry[];
  form: Record<string, string>;
  onChange: Dispatch<SetStateAction<Record<string, string>>>;
  onAdd: () => Promise<void> | void;
  fields: Array<{ name: string; placeholder: string }>;
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
      <p className="text-sm font-semibold text-slate-900">{title}</p>
      <div className="mt-3 space-y-2">
        {entries.map((entry) => (
          <div key={entry.id} className="rounded-xl border border-slate-100 bg-white px-3 py-2">
            <p className="text-sm font-medium text-slate-900">{entry.title}</p>
            <p className="text-xs text-slate-500">{entry.subtitle}</p>
          </div>
        ))}
        {entries.length === 0 && (
          <p className="text-xs text-slate-500">No entries yet.</p>
        )}
      </div>
      <div className="mt-3 space-y-2">
        {fields.map((field) => (
          <input
            key={field.name}
            value={form[field.name] ?? ""}
            onChange={(event) =>
              onChange((prev) => ({
                ...prev,
                [field.name]: event.target.value,
              }))
            }
            placeholder={field.placeholder}
            className="w-full rounded-2xl border border-white bg-white px-3 py-2 text-xs text-slate-900 shadow-sm focus:outline-none focus:ring"
          />
        ))}
      </div>
      <button
        type="button"
        onClick={() => void onAdd()}
        className="mt-3 w-full rounded-full bg-white px-3 py-2 text-xs font-semibold text-slate-900 shadow-sm hover:bg-slate-100"
      >
        Quick add
      </button>
    </div>
  );
}
