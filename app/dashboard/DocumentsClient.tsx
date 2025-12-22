"use client";

import { useMemo, useRef, useState } from "react";
import Link from "next/link";
import { createSupabaseBrowserClient } from "@/lib/supabase/browser";

const categories = [
  {
    id: "personal",
    title: "Personal",
    description: "Passport / ID, residence permit, family documents.",
  },
  {
    id: "work",
    title: "Work & contracts",
    description: "Work contracts, payslips, employment confirmations.",
  },
  {
    id: "education",
    title: "Education",
    description: "Diplomas, transcripts, reference letters.",
  },
  {
    id: "certifications",
    title: "Certifications",
    description: "Driver license, forklift cards, language certificates.",
  },
] as const;

const allowedMimeTypes = [
  "application/pdf",
  "image/png",
  "image/jpeg",
  "image/jpg",
];

const MAX_FILE_BYTES = 25 * 1024 * 1024;

type DocumentRecord = {
  id: string;
  category: string;
  path: string;
  filename: string;
  mime_type: string | null;
  size: number | null;
  created_at: string;
};

export default function DocumentsClient({
  initialDocuments,
  userId,
}: {
  initialDocuments: DocumentRecord[];
  userId: string;
}) {
  const supabase = createSupabaseBrowserClient();
  const [documents, setDocuments] = useState<DocumentRecord[]>(initialDocuments);
  const [loadingCategory, setLoadingCategory] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [messageType, setMessageType] = useState<"success" | "error" | null>(null);
  const fileInputs = useRef<Record<string, HTMLInputElement | null>>({});

  const docsByCategory = useMemo(() => {
    return categories.map((category) => ({
      ...category,
      documents: documents.filter((doc) => doc.category === category.id),
    }));
  }, [documents]);

  function showMessage(type: "success" | "error", text: string) {
    setMessageType(type);
    setMessage(text);
    window.setTimeout(() => {
      setMessage(null);
      setMessageType(null);
    }, 4000);
  }

  async function handleUpload(categoryId: string, file?: File | null) {
    if (!file) return;
    if (!allowedMimeTypes.includes(file.type)) {
      showMessage("error", "Only PDF or image files are supported.");
      return;
    }
    if (file.size > MAX_FILE_BYTES) {
      showMessage("error", "File is larger than 25 MB.");
      return;
    }

    setLoadingCategory(categoryId);
    try {
      const safeName = file.name.replace(/[^a-zA-Z0-9.\-]/g, "_");
      const path = `${userId}/${categoryId}/${Date.now()}-${safeName}`;
      const { error: uploadError } = await supabase.storage
        .from("documents")
        .upload(path, file, { contentType: file.type });
      if (uploadError) throw uploadError;

      const { data: inserted, error: insertError } = await supabase
        .from("documents")
        .insert({
          user_id: userId,
          category: categoryId,
          path,
          filename: file.name,
          mime_type: file.type,
          size: file.size,
        })
        .select()
        .single();
      if (insertError || !inserted) throw insertError;

      setDocuments((prev) => [inserted as DocumentRecord, ...prev]);
      showMessage("success", `${file.name} uploaded.`);
    } catch (error) {
      console.error(error);
      showMessage("error", "Upload failed. Please try again.");
    } finally {
      setLoadingCategory(null);
    }
  }

  async function handleDelete(doc: DocumentRecord) {
    setLoadingCategory(doc.id);
    try {
      const { error: storageError } = await supabase.storage
        .from("documents")
        .remove([doc.path]);
      if (storageError) throw storageError;

      await supabase.from("documents").delete().eq("id", doc.id);

      setDocuments((prev) => prev.filter((item) => item.id !== doc.id));
      showMessage("success", `${doc.filename} deleted.`);
    } catch (error) {
      console.error(error);
      showMessage("error", "Could not delete document.");
    } finally {
      setLoadingCategory(null);
    }
  }

  async function handleView(doc: DocumentRecord) {
    const { data, error } = await supabase.storage
      .from("documents")
      .createSignedUrl(doc.path, 60);
    if (error || !data?.signedUrl) {
      showMessage("error", "Could not create download link.");
      return;
    }
    window.open(data.signedUrl, "_blank", "noopener,noreferrer");
  }

  return (
    <div className="space-y-6">
      <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-[11px] uppercase tracking-[0.18em] text-slate-400">
              Documents hub
            </p>
            <h1 className="text-2xl font-semibold text-slate-900">
              Keep everything ready for employers and authorities.
            </h1>
            <p className="mt-2 text-sm text-slate-600">
              Upload scanned PDFs or images once storage is enabled. For now, organize what
              you already have and track missing items.
            </p>
          </div>
          <Link
            href="/dashboard/modules"
            className="text-sm font-medium text-blue-600 hover:text-blue-700"
          >
            Finish onboarding tasks →
          </Link>
        </div>

        {message && (
          <div
            className={`mt-4 rounded-2xl border px-4 py-3 text-sm ${
              messageType === "success"
                ? "border-emerald-200 bg-emerald-50 text-emerald-900"
                : "border-rose-200 bg-rose-50 text-rose-900"
            }`}
          >
            {message}
          </div>
        )}

        <div className="mt-6 space-y-6">
          {docsByCategory.map((category) => (
            <article
              key={category.id}
              className="rounded-3xl border border-slate-200 bg-slate-50 p-5 shadow-sm"
            >
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="text-[11px] uppercase tracking-[0.18em] text-slate-400">
                    {category.title}
                  </p>
                  <p className="text-sm text-slate-600">{category.description}</p>
                </div>
                <button
                  type="button"
                  onClick={() => fileInputs.current[category.id]?.click()}
                  className="inline-flex items-center rounded-full border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-900 shadow-sm hover:border-slate-400"
                  disabled={loadingCategory === category.id}
                >
                  {loadingCategory === category.id ? "Uploading…" : "Upload document"}
                </button>
                <input
                  type="file"
                  accept="application/pdf,image/png,image/jpeg"
                  className="hidden"
                  ref={(el) => {
                    fileInputs.current[category.id] = el;
                  }}
                  onChange={(event) => {
                    const file = event.target.files?.[0];
                    handleUpload(category.id, file);
                    event.target.value = "";
                  }}
                />
              </div>
              <div className="mt-4 space-y-3">
                {category.documents.length === 0 && (
                  <div className="rounded-2xl border border-dashed border-slate-200 bg-white p-4 text-sm text-slate-500">
                    No files yet. Upload PDFs or images when you are ready.
                  </div>
                )}
                {category.documents.map((doc) => (
                  <div
                    key={doc.id}
                    className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm"
                  >
                    <div>
                      <p className="font-medium text-slate-900">{doc.filename}</p>
                      <p className="text-xs text-slate-500">
                        {formatBytes(doc.size ?? 0)} · {new Date(doc.created_at).toLocaleString()}
                      </p>
                    </div>
                    <div className="flex gap-2 text-xs font-semibold">
                      <button
                        type="button"
                        onClick={() => handleView(doc)}
                        className="rounded-full border border-slate-200 bg-white px-3 py-1 text-slate-700 hover:border-slate-300"
                      >
                        View
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDelete(doc)}
                        className="rounded-full border border-rose-200 bg-rose-50 px-3 py-1 text-rose-700 hover:border-rose-300"
                        disabled={loadingCategory === doc.id}
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}

function formatBytes(bytes: number) {
  if (!bytes) return "0 B";
  const units = ["B", "KB", "MB", "GB"];
  const index = Math.min(
    Math.floor(Math.log(bytes) / Math.log(1024)),
    units.length - 1
  );
  return `${(bytes / Math.pow(1024, index)).toFixed(1)} ${units[index]}`;
}
