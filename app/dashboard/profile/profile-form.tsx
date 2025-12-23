"use client";

import { useMemo, useState, useEffect } from "react";
import Image from "next/image";
import type { SupabaseClient } from "@supabase/supabase-js";
import { createSupabaseBrowserClient } from "@/lib/supabase/browser";

type Profile = {
  full_name?: string | null;
  birthday?: string | null;
  mother_tongue?: string | null;
  other_languages?: string | null;
  german_level?: string | null;
  origin_country?: string | null;
  current_country?: string | null;
  avatar_url?: string | null;
};

type ProfileLanguage = {
  id: string;
  kind: "mother" | "german" | "other";
  language: string | null;
  level: string | null;
};

type ProfileSkill = {
  id: string;
  skill: string | null;
};

type EducationEntry = {
  id: string;
  institution: string | null;
  degree: string | null;
  start_date: string | null;
  end_date: string | null;
};

type WorkEntry = {
  id: string;
  company: string | null;
  title: string | null;
  start_date: string | null;
  end_date: string | null;
};

export default function ProfileForm({
  initialProfile,
  initialLanguages,
  initialSkills,
  initialEducation,
  initialWork,
}: {
  initialProfile: Profile;
  initialLanguages: ProfileLanguage[];
  initialSkills: ProfileSkill[];
  initialEducation: EducationEntry[];
  initialWork: WorkEntry[];
}) {
  const supabase = useMemo(() => createSupabaseBrowserClient(), []);
  const [form, setForm] = useState<Profile>({
    full_name: initialProfile.full_name ?? "",
    birthday: initialProfile.birthday ?? "",
    mother_tongue: initialProfile.mother_tongue ?? "",
    other_languages: initialProfile.other_languages ?? "",
    german_level: initialProfile.german_level ?? "",
    origin_country: initialProfile.origin_country ?? "",
    current_country: initialProfile.current_country ?? "",
    avatar_url: initialProfile.avatar_url ?? "",
  });

  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState<null | { type: "ok" | "err"; text: string }>(null);
  const [uploading, setUploading] = useState(false);

  async function save() {
    setSaving(true);
    setMsg(null);

    const { data: userRes } = await supabase.auth.getUser();
    const user = userRes.user;
    if (!user) {
      setMsg({ type: "err", text: "Not logged in." });
      setSaving(false);
      return;
    }

    const { error } = await supabase
      .from("profiles")
      .update({
        full_name: form.full_name || null,
        birthday: form.birthday || null,
        mother_tongue: form.mother_tongue || null,
        other_languages: form.other_languages || null,
        german_level: form.german_level || null,
        origin_country: form.origin_country || null,
        current_country: form.current_country || null,
        avatar_url: form.avatar_url || null,
      })
      .eq("id", user.id);

    if (error) setMsg({ type: "err", text: error.message });
    else setMsg({ type: "ok", text: "Saved." });

    setSaving(false);
  }

  async function onAvatarChange(file: File) {
    setUploading(true);
    setMsg(null);

    const { data: userRes } = await supabase.auth.getUser();
    const user = userRes.user;
    if (!user) {
      setMsg({ type: "err", text: "Not logged in." });
      setUploading(false);
      return;
    }

    const ext = file.name.split(".").pop()?.toLowerCase() || "jpg";
    const path = `${user.id}/avatar.${ext}`;

    const { error: upErr } = await supabase.storage
      .from("avatars")
      .upload(path, file, { upsert: true, contentType: file.type });

    if (upErr) {
      setMsg({ type: "err", text: upErr.message });
      setUploading(false);
      return;
    }

    const { data: signed, error: signErr } = await supabase.storage
      .from("avatars")
      .createSignedUrl(path, 60 * 60);

    if (signErr || !signed?.signedUrl) {
      setMsg({ type: "err", text: signErr?.message || "Could not create signed URL." });
      setUploading(false);
      return;
    }

    setForm((s) => ({ ...s, avatar_url: signed.signedUrl }));
    setMsg({ type: "ok", text: "Avatar uploaded. Click Save to store it." });

    setUploading(false);
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <div className="h-16 w-16 overflow-hidden rounded-2xl border border-slate-200 bg-slate-50">
          {form.avatar_url ? (
            <Image
              src={form.avatar_url}
              alt="Avatar"
              width={64}
              height={64}
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="h-full w-full flex items-center justify-center text-xs text-slate-400">
              No photo
            </div>
          )}
        </div>

        <label className="inline-flex cursor-pointer items-center rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-sm hover:bg-slate-50">
          {uploading ? "Uploading…" : "Upload photo"}
          <input
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => {
              const f = e.target.files?.[0];
              if (f) onAvatarChange(f);
            }}
            disabled={uploading}
          />
        </label>

        <p className="text-xs text-slate-500">JPG/PNG, recommended square.</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Full name" value={form.full_name ?? ""} onChange={(v) => setForm((s) => ({ ...s, full_name: v }))} />
        <Field label="Birthday" type="date" value={form.birthday ?? ""} onChange={(v) => setForm((s) => ({ ...s, birthday: v }))} />

        <Field label="Mother tongue" value={form.mother_tongue ?? ""} onChange={(v) => setForm((s) => ({ ...s, mother_tongue: v }))} />
        <Field label="Other languages" value={form.other_languages ?? ""} onChange={(v) => setForm((s) => ({ ...s, other_languages: v }))} />

        <Field label="German level" placeholder="A0–C2" value={form.german_level ?? ""} onChange={(v) => setForm((s) => ({ ...s, german_level: v }))} />
        <Field label="Current country" value={form.current_country ?? ""} onChange={(v) => setForm((s) => ({ ...s, current_country: v }))} />

        <Field label="Country of origin" value={form.origin_country ?? ""} onChange={(v) => setForm((s) => ({ ...s, origin_country: v }))} />
      </div>

      {msg && (
        <div
          className={[
            "rounded-2xl border px-4 py-3 text-sm",
            msg.type === "ok"
              ? "border-emerald-200 bg-emerald-50 text-emerald-900"
              : "border-rose-200 bg-rose-50 text-rose-900",
          ].join(" ")}
        >
          {msg.text}
        </div>
      )}

      <div className="flex gap-3">
        <button
          type="button"
          onClick={save}
          disabled={saving}
          className="rounded-full bg-slate-900 px-5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-slate-800 disabled:opacity-50"
        >
          {saving ? "Saving…" : "Save profile"}
        </button>
        <a
          href="/dashboard"
          className="rounded-full border border-slate-200 bg-white px-5 py-2.5 text-sm font-semibold text-slate-900 hover:border-slate-300"
        >
          Back
        </a>
      </div>

      <LanguagesCard supabase={supabase} initialLanguages={initialLanguages} />
      <SkillsCard supabase={supabase} initialSkills={initialSkills} />
      <EducationCard supabase={supabase} initialEntries={initialEducation} />
      <WorkCard supabase={supabase} initialEntries={initialWork} />
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  type = "text",
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
  placeholder?: string;
}) {
  return (
    <div>
      <label className="text-sm font-medium text-slate-900">{label}</label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-slate-300"
      />
    </div>
  );
}

function LanguagesCard({
  supabase,
  initialLanguages,
}: {
  supabase: SupabaseClient;
  initialLanguages: ProfileLanguage[];
}) {
  const [languages, setLanguages] = useState(initialLanguages);
  const [status, setStatus] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [motherInput, setMotherInput] = useState(
    initialLanguages.find((l) => l.kind === "mother")?.language ?? ""
  );
  const [germanLevel, setGermanLevel] = useState(
    initialLanguages.find((l) => l.kind === "german")?.level ?? ""
  );
  const [otherLang, setOtherLang] = useState({ language: "", level: "" });

  const motherRow = languages.find((l) => l.kind === "mother");
  const germanRow = languages.find((l) => l.kind === "german");
  const otherRows = languages.filter((l) => l.kind === "other");

  useEffect(() => {
    setMotherInput(motherRow?.language ?? "");
  }, [motherRow?.language]);

  useEffect(() => {
    setGermanLevel(germanRow?.level ?? "");
  }, [germanRow?.level]);

  async function getUserId() {
    const { data } = await supabase.auth.getUser();
    if (!data.user) throw new Error("Not logged in.");
    return data.user.id;
  }

  async function saveMother() {
    setStatus(null);
    try {
      const userId = await getUserId();
      const { data, error } = await supabase
        .from("profile_languages")
        .upsert(
          {
            id: motherRow?.id,
            profile_id: userId,
            kind: "mother",
            language: motherInput.trim() || null,
            level: null,
          },
          { onConflict: "id" }
        )
        .select()
        .single();
      if (error) throw error;
      setLanguages((prev) => {
        const others = prev.filter((l) => l.kind !== "mother");
        return data ? [...others, data as ProfileLanguage] : others;
      });
      setStatus({ type: "success", text: "Saved mother tongue." });
    } catch (error) {
      setStatus({
        type: "error",
        text: error instanceof Error ? error.message : "Unable to save mother tongue.",
      });
    }
  }

  async function saveGerman() {
    setStatus(null);
    try {
      const userId = await getUserId();
      const { data, error } = await supabase
        .from("profile_languages")
        .upsert(
          {
            id: germanRow?.id,
            profile_id: userId,
            kind: "german",
            language: "German",
            level: germanLevel || null,
          },
          { onConflict: "id" }
        )
        .select()
        .single();
      if (error) throw error;
      setLanguages((prev) => {
        const others = prev.filter((l) => l.kind !== "german");
        return data ? [...others, data as ProfileLanguage] : others;
      });
      setStatus({ type: "success", text: "Saved German level." });
    } catch (error) {
      setStatus({
        type: "error",
        text: error instanceof Error ? error.message : "Unable to save German level.",
      });
    }
  }

  async function addOtherLanguage() {
    setStatus(null);
    if (!otherLang.language.trim()) {
      setStatus({ type: "error", text: "Language name required." });
      return;
    }
    try {
      const userId = await getUserId();
      const { data, error } = await supabase
        .from("profile_languages")
        .insert({
          profile_id: userId,
          kind: "other",
          language: otherLang.language.trim(),
          level: otherLang.level.trim() || null,
        })
        .select()
        .single();
      if (error) throw error;
      setLanguages((prev) => [...prev, data as ProfileLanguage]);
      setOtherLang({ language: "", level: "" });
      setStatus({ type: "success", text: "Language added." });
    } catch (error) {
      setStatus({
        type: "error",
        text: error instanceof Error ? error.message : "Unable to add language.",
      });
    }
  }

  async function removeOtherLanguage(id: string) {
    setStatus(null);
    try {
      await supabase.from("profile_languages").delete().eq("id", id);
      setLanguages((prev) => prev.filter((l) => l.id !== id));
      setStatus({ type: "success", text: "Removed language." });
    } catch (error) {
      setStatus({
        type: "error",
        text: error instanceof Error ? error.message : "Unable to remove language.",
      });
  }
}

  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
            Languages
          </p>
          <h2 className="mt-1 text-lg font-semibold text-slate-900">How you communicate</h2>
        </div>
      </div>

      <div className="mt-4 space-y-5">
        <div>
          <label className="text-sm font-medium text-slate-900">Mother tongue</label>
          <div className="mt-2 flex gap-2">
            <input
              value={motherInput}
              onChange={(e) => setMotherInput(e.target.value)}
              placeholder="e.g., Spanish"
              className="flex-1 rounded-2xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-900 shadow-sm focus:outline-none focus:ring-2 focus:ring-slate-300"
            />
            <button
              type="button"
              onClick={saveMother}
              className="rounded-full bg-slate-900 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-slate-800"
            >
              Save
            </button>
          </div>
        </div>

        <div>
          <label className="text-sm font-medium text-slate-900">German level</label>
          <div className="mt-2 flex gap-2">
            <select
              value={germanLevel}
              onChange={(e) => setGermanLevel(e.target.value)}
              className="flex-1 rounded-2xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-900 shadow-sm focus:outline-none focus:ring-2 focus:ring-slate-300"
            >
              <option value="">Select level…</option>
              {["A0", "A1", "A2", "B1", "B2", "C1", "C2"].map((level) => (
                <option key={level} value={level}>
                  {level}
                </option>
              ))}
            </select>
            <button
              type="button"
              onClick={saveGerman}
              className="rounded-full bg-slate-900 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-slate-800"
            >
              Save
            </button>
          </div>
        </div>

        <div>
          <p className="text-sm font-medium text-slate-900">Other languages</p>
          <ul className="mt-2 space-y-2 text-sm text-slate-700">
            {otherRows.length === 0 && (
              <li className="text-xs text-slate-500">No other languages added.</li>
            )}
            {otherRows.map((lang) => (
              <li
                key={lang.id}
                className="flex items-center justify-between rounded-2xl border border-slate-100 bg-slate-50 px-3 py-2"
              >
                <span>
                  {lang.language} {lang.level ? `· ${lang.level}` : null}
                </span>
                <button
                  type="button"
                  onClick={() => removeOtherLanguage(lang.id)}
                  className="text-xs text-slate-500 hover:text-rose-600"
                >
                  Remove
                </button>
              </li>
            ))}
          </ul>
          <div className="mt-3 flex flex-col gap-2 sm:flex-row">
            <input
              value={otherLang.language}
              onChange={(e) => setOtherLang((s) => ({ ...s, language: e.target.value }))}
              placeholder="Language"
              className="flex-1 rounded-2xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-900 shadow-sm focus:outline-none focus:ring-2 focus:ring-slate-300"
            />
            <input
              value={otherLang.level}
              onChange={(e) => setOtherLang((s) => ({ ...s, level: e.target.value }))}
              placeholder="Level"
              className="flex-1 rounded-2xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-900 shadow-sm focus:outline-none focus:ring-2 focus:ring-slate-300"
            />
            <button
              type="button"
              onClick={addOtherLanguage}
              className="rounded-full bg-slate-900 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-slate-800"
            >
              Add
            </button>
          </div>
        </div>
      </div>
      {status && (
        <p
          className={`mt-4 text-sm ${
            status.type === "success" ? "text-emerald-600" : "text-rose-600"
          }`}
        >
          {status.text}
        </p>
      )}
    </div>
  );
}

function SkillsCard({
  supabase,
  initialSkills,
}: {
  supabase: SupabaseClient;
  initialSkills: ProfileSkill[];
}) {
  const [skills, setSkills] = useState<ProfileSkill[]>(initialSkills);
  const [newSkill, setNewSkill] = useState("");
  const [status, setStatus] = useState<{ type: "success" | "error"; text: string } | null>(
    null
  );
  const [confirmingId, setConfirmingId] = useState<string | null>(null);

  async function getUserId() {
    const { data } = await supabase.auth.getUser();
    if (!data.user) throw new Error("Not logged in.");
    return data.user.id;
  }

  async function addSkill() {
    const trimmed = newSkill.trim();
    if (!trimmed) {
      setStatus({ type: "error", text: "Skill name required." });
      return;
    }
    setStatus(null);
    try {
      const userId = await getUserId();
      const { data, error } = await supabase
        .from("profile_skills")
        .insert({ profile_id: userId, skill: trimmed })
        .select()
        .single();
      if (error) throw error;
      setSkills((prev) => [...prev, data as ProfileSkill]);
      setNewSkill("");
      setStatus({ type: "success", text: "Skill added." });
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message.includes("duplicate")
            ? "Skill already added."
            : error.message
          : "Unable to add skill.";
      setStatus({ type: "error", text: message });
    }
  }

  async function removeSkill(id: string) {
    setStatus(null);
    try {
      await supabase.from("profile_skills").delete().eq("id", id);
      setSkills((prev) => prev.filter((s) => s.id !== id));
      setStatus({ type: "success", text: "Skill removed." });
    } catch (error) {
      setStatus({
        type: "error",
        text: error instanceof Error ? error.message : "Unable to remove skill.",
      });
    }
  }

  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
            Skills
          </p>
          <h2 className="mt-1 text-lg font-semibold text-slate-900">What you bring</h2>
        </div>
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        {skills.length === 0 && (
          <span className="text-xs text-slate-500">No skills added yet.</span>
        )}
        {skills.map((skill) => (
          <button
            key={skill.id}
            type="button"
            onClick={() =>
              confirmingId === skill.id
                ? removeSkill(skill.id)
                : setConfirmingId(skill.id)
            }
            onBlur={() => setConfirmingId(null)}
            className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-medium shadow-sm transition ${
              confirmingId === skill.id
                ? "border-rose-200 bg-rose-50 text-rose-700"
                : "border-slate-200 bg-slate-50 text-slate-700 hover:border-slate-300"
            }`}
          >
            {confirmingId === skill.id ? "Confirm remove" : skill.skill}
          </button>
        ))}
      </div>

      <div className="mt-4 flex flex-col gap-2 sm:flex-row">
        <input
          value={newSkill}
          onChange={(e) => setNewSkill(e.target.value)}
          placeholder="Add a skill"
          className="flex-1 rounded-2xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-900 shadow-sm focus:outline-none focus:ring-2 focus:ring-slate-300"
        />
        <button
          type="button"
          onClick={addSkill}
          className="rounded-full bg-slate-900 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-slate-800"
        >
          Add skill
        </button>
      </div>

      {status && (
        <p
          className={`mt-3 text-sm ${
            status.type === "success" ? "text-emerald-600" : "text-rose-600"
          }`}
        >
          {status.text}
        </p>
      )}
    </div>
  );
}

type EntryForm = {
  institution?: string;
  degree?: string;
  start_date?: string;
  end_date?: string;
  company?: string;
  title?: string;
};

function EducationCard({
  supabase,
  initialEntries,
}: {
  supabase: SupabaseClient;
  initialEntries: EducationEntry[];
}) {
  const [entries, setEntries] = useState(initialEntries);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState<EntryForm>({
    institution: "",
    degree: "",
    start_date: "",
    end_date: "",
  });
  const [status, setStatus] = useState<{ type: "success" | "error"; text: string } | null>(
    null
  );

  async function getUserId() {
    const { data } = await supabase.auth.getUser();
    if (!data.user) throw new Error("Not logged in.");
    return data.user.id;
  }

  function closeModal() {
    setShowModal(false);
    setForm({ institution: "", degree: "", start_date: "", end_date: "" });
  }

  async function submit() {
    if (!form.institution?.trim() || !form.degree?.trim()) {
      setStatus({ type: "error", text: "Institution and degree required." });
      return;
    }
    setStatus(null);
    try {
      const userId = await getUserId();
      const { data, error } = await supabase
        .from("education_entries")
        .insert({
          profile_id: userId,
          institution: form.institution.trim(),
          degree: form.degree.trim(),
          start_date: form.start_date || null,
          end_date: form.end_date || null,
        })
        .select()
        .single();
      if (error) throw error;
      setEntries((prev) => [...prev, data as EducationEntry]);
      closeModal();
      setStatus({ type: "success", text: "Education added." });
    } catch (error) {
      setStatus({
        type: "error",
        text: error instanceof Error ? error.message : "Unable to add education.",
      });
    }
  }

  async function remove(id: string) {
    setStatus(null);
    try {
      await supabase.from("education_entries").delete().eq("id", id);
      setEntries((prev) => prev.filter((entry) => entry.id !== id));
      setStatus({ type: "success", text: "Entry removed." });
    } catch (error) {
      setStatus({
        type: "error",
        text: error instanceof Error ? error.message : "Unable to remove entry.",
      });
    }
  }

  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
            Education
          </p>
          <h2 className="mt-1 text-lg font-semibold text-slate-900">Where you learned</h2>
        </div>
        <button
          type="button"
          onClick={() => setShowModal(true)}
          className="text-sm font-semibold text-slate-900 hover:text-slate-600"
        >
          Add education
        </button>
      </div>

      <div className="mt-4 space-y-3">
        {entries.length === 0 && (
          <p className="text-sm text-slate-500">No education entries yet.</p>
        )}
        {entries.map((entry) => (
          <div
            key={entry.id}
            className="rounded-2xl border border-slate-100 bg-slate-50 px-4 py-3 text-sm text-slate-700"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="font-semibold text-slate-900">{entry.institution}</p>
                <p>{entry.degree}</p>
                <p className="text-xs text-slate-500">
                  {[entry.start_date, entry.end_date].filter(Boolean).join(" – ")}
                </p>
              </div>
              <button
                type="button"
                onClick={() => remove(entry.id)}
                className="text-xs text-slate-500 hover:text-rose-600"
              >
                Remove
              </button>
            </div>
          </div>
        ))}
      </div>

      {status && (
        <p
          className={`mt-3 text-sm ${
            status.type === "success" ? "text-emerald-600" : "text-rose-600"
          }`}
        >
          {status.text}
        </p>
      )}

      {showModal && (
        <EntryModal
          title="Add education"
          form={form}
          setForm={setForm}
          onClose={closeModal}
          onSubmit={submit}
          fields={[
            { name: "institution", label: "Institution", type: "text" },
            { name: "degree", label: "Degree", type: "text" },
            { name: "start_date", label: "Start date", type: "date" },
            { name: "end_date", label: "End date", type: "date" },
          ]}
        />
      )}
    </div>
  );
}

function WorkCard({
  supabase,
  initialEntries,
}: {
  supabase: SupabaseClient;
  initialEntries: WorkEntry[];
}) {
  const [entries, setEntries] = useState(initialEntries);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState<EntryForm>({
    company: "",
    title: "",
    start_date: "",
    end_date: "",
  });
  const [status, setStatus] = useState<{ type: "success" | "error"; text: string } | null>(
    null
  );

  async function getUserId() {
    const { data } = await supabase.auth.getUser();
    if (!data.user) throw new Error("Not logged in.");
    return data.user.id;
  }

  function closeModal() {
    setShowModal(false);
    setForm({ company: "", title: "", start_date: "", end_date: "" });
  }

  async function submit() {
    if (!form.company?.trim() || !form.title?.trim()) {
      setStatus({ type: "error", text: "Company and role required." });
      return;
    }
    setStatus(null);
    try {
      const userId = await getUserId();
      const { data, error } = await supabase
        .from("work_experience_entries")
        .insert({
          profile_id: userId,
          company: form.company.trim(),
          title: form.title.trim(),
          start_date: form.start_date || null,
          end_date: form.end_date || null,
        })
        .select()
        .single();
      if (error) throw error;
      setEntries((prev) => [...prev, data as WorkEntry]);
      closeModal();
      setStatus({ type: "success", text: "Work experience added." });
    } catch (error) {
      setStatus({
        type: "error",
        text: error instanceof Error ? error.message : "Unable to add work entry.",
      });
    }
  }

  async function remove(id: string) {
    setStatus(null);
    try {
      await supabase.from("work_experience_entries").delete().eq("id", id);
      setEntries((prev) => prev.filter((entry) => entry.id !== id));
      setStatus({ type: "success", text: "Entry removed." });
    } catch (error) {
      setStatus({
        type: "error",
        text: error instanceof Error ? error.message : "Unable to remove entry.",
      });
    }
  }

  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
            Work experience
          </p>
          <h2 className="mt-1 text-lg font-semibold text-slate-900">Where you’ve worked</h2>
        </div>
        <button
          type="button"
          onClick={() => setShowModal(true)}
          className="text-sm font-semibold text-slate-900 hover:text-slate-600"
        >
          Add work
        </button>
      </div>

      <div className="mt-4 space-y-3">
        {entries.length === 0 && (
          <p className="text-sm text-slate-500">No work entries yet.</p>
        )}
        {entries.map((entry) => (
          <div
            key={entry.id}
            className="rounded-2xl border border-slate-100 bg-slate-50 px-4 py-3 text-sm text-slate-700"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="font-semibold text-slate-900">{entry.company}</p>
                <p>{entry.title}</p>
                <p className="text-xs text-slate-500">
                  {[entry.start_date, entry.end_date].filter(Boolean).join(" – ")}
                </p>
              </div>
              <button
                type="button"
                onClick={() => remove(entry.id)}
                className="text-xs text-slate-500 hover:text-rose-600"
              >
                Remove
              </button>
            </div>
          </div>
        ))}
      </div>

      {status && (
        <p
          className={`mt-3 text-sm ${
            status.type === "success" ? "text-emerald-600" : "text-rose-600"
          }`}
        >
          {status.text}
        </p>
      )}

      {showModal && (
        <EntryModal
          title="Add work"
          form={form}
          setForm={setForm}
          onClose={closeModal}
          onSubmit={submit}
          fields={[
            { name: "company", label: "Company", type: "text" },
            { name: "title", label: "Role", type: "text" },
            { name: "start_date", label: "Start date", type: "date" },
            { name: "end_date", label: "End date", type: "date" },
          ]}
        />
      )}
    </div>
  );
}

type EntryModalField = {
  name: keyof EntryForm;
  label: string;
  type: "text" | "date";
};

function EntryModal({
  title,
  form,
  setForm,
  onClose,
  onSubmit,
  fields,
}: {
  title: string;
  form: EntryForm;
  setForm: (value: EntryForm) => void;
  onClose: () => void;
  onSubmit: () => void;
  fields: EntryModalField[];
}) {
  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center bg-slate-900/20 px-4">
      <div className="absolute inset-0" onClick={onClose} />
      <div className="relative z-10 w-full max-w-lg rounded-3xl border border-slate-200 bg-white p-6 shadow-xl">
        <div className="flex items-start justify-between">
          <div>
            <h3 className="text-lg font-semibold text-slate-900">{title}</h3>
            <p className="text-sm text-slate-500">Add details and save.</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-sm text-slate-500 hover:text-slate-900"
          >
            Close
          </button>
        </div>
        <div className="mt-4 space-y-3">
          {fields.map((field) => (
            <div key={field.name}>
              <label className="text-sm font-medium text-slate-900">{field.label}</label>
              <input
                type={field.type}
                value={(form[field.name] as string) ?? ""}
                onChange={(e) => setForm({ ...form, [field.name]: e.target.value })}
                className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-900 shadow-sm focus:outline-none focus:ring-2 focus:ring-slate-300"
              />
            </div>
          ))}
        </div>
        <div className="mt-5 flex justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="rounded-full border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 hover:border-slate-300"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onSubmit}
            className="rounded-full bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-800"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}
