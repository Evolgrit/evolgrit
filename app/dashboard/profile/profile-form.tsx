"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
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

export default function ProfileForm({ initialProfile }: { initialProfile: Profile }) {
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
