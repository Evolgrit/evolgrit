"use client";

import Image from "next/image";
import { useEffect, useMemo, useRef, useState } from "react";
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

const categorySet = new Set(categories.map((cat) => cat.id));

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
  storage_path: string;
  file_name: string;
  mime_type: string | null;
  size_bytes: number | null;
  created_at: string;
  title: string | null;
};

type UploadTask = {
  id: string;
  category: string;
  fileName: string;
  progress: number;
  status: "uploading" | "processing" | "done" | "error";
  message?: string;
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
  const [activeCategory, setActiveCategory] = useState<string>(categories[0].id);
  const [message, setMessage] = useState<string | null>(null);
  const [messageType, setMessageType] = useState<"success" | "error" | null>(null);
  const [uploadTasks, setUploadTasks] = useState<UploadTask[]>([]);
  const uploadIntervals = useRef<Record<string, number>>({});
  const [previewDoc, setPreviewDoc] = useState<{ url: string; record: DocumentRecord } | null>(
    null
  );

  const docsByCategory = useMemo(() => {
    return categories.map((category) => ({
      ...category,
      documents: documents.filter((doc) => doc.category === category.id),
    }));
  }, [documents]);

  useEffect(() => {
    const intervalMap = uploadIntervals.current;
    return () => {
      Object.values(intervalMap).forEach((intervalId) => {
        if (intervalId) window.clearInterval(intervalId);
      });
    };
  }, []);

  function showMessage(type: "success" | "error", text: string) {
    setMessageType(type);
    setMessage(text);
    window.setTimeout(() => {
      setMessage(null);
      setMessageType(null);
    }, 4000);
  }

  function createUploadTask(categoryId: string, fileName: string) {
    const taskId = crypto.randomUUID();
    setUploadTasks((prev) => [
      ...prev,
      { id: taskId, category: categoryId, fileName, progress: 5, status: "uploading" },
    ]);
    uploadIntervals.current[taskId] = window.setInterval(() => {
      setUploadTasks((prev) =>
        prev.map((task) =>
          task.id === taskId && task.progress < 90
            ? { ...task, progress: task.progress + 5 }
            : task
        )
      );
    }, 200);
    return taskId;
  }

  function finishUploadTask(taskId: string, status: UploadTask["status"], message?: string) {
    if (uploadIntervals.current[taskId]) {
      window.clearInterval(uploadIntervals.current[taskId]);
      delete uploadIntervals.current[taskId];
    }
    setUploadTasks((prev) =>
      prev.map((task) =>
        task.id === taskId
          ? {
              ...task,
              status,
              message,
              progress: status === "error" ? task.progress : 100,
            }
          : task
      )
    );
    if (status !== "error") {
      window.setTimeout(() => {
        setUploadTasks((prev) => prev.filter((task) => task.id !== taskId));
      }, 1000);
    }
  }

  async function handleFileUpload(
    categoryId: string,
    file?: File | null,
    replaceDoc?: DocumentRecord
  ) {
    if (!file) return;
    if (!allowedMimeTypes.includes(file.type)) {
      showMessage("error", "Only PDF or image files are supported.");
      return;
    }
    if (file.size > MAX_FILE_BYTES) {
      showMessage("error", "File is larger than 25 MB.");
      return;
    }
    if (!categorySet.has(categoryId as (typeof categories)[number]["id"])) {
      showMessage("error", "Unsupported category.");
      return;
    }

    const taskId = createUploadTask(categoryId, file.name);
    const safeName = file.name.replace(/[^a-zA-Z0-9.\\-]/g, "_");
    const docId = replaceDoc?.id ?? crypto.randomUUID();
    const storagePath = `${userId}/${categoryId}/${docId}-${safeName}`;
    let uploadCompleted = false;
    try {
      const uploadOptions = replaceDoc
        ? { contentType: file.type, upsert: true }
        : { contentType: file.type };
      const { error: uploadError } = await supabase.storage
        .from("documents")
        .upload(storagePath, file, uploadOptions);
      if (uploadError) throw uploadError;
      uploadCompleted = true;

      if (replaceDoc) {
        const { data: updated, error: updateError } = await supabase
          .from("documents")
          .update({
            category: categoryId,
            storage_path: storagePath,
            file_name: file.name,
            mime_type: file.type,
            size_bytes: file.size,
          })
          .eq("id", replaceDoc.id)
          .select()
          .single();
        if (updateError || !updated) throw updateError;

        if (replaceDoc.storage_path !== storagePath) {
          await supabase.storage.from("documents").remove([replaceDoc.storage_path]);
        }

        setDocuments((prev) =>
          prev.map((doc) => (doc.id === replaceDoc.id ? (updated as DocumentRecord) : doc))
        );
        showMessage("success", `${file.name} replaced.`);
      } else {
        const { data: inserted, error: insertError } = await supabase
          .from("documents")
          .insert({
            id: docId,
            user_id: userId,
            category: categoryId,
            storage_path: storagePath,
            file_name: file.name,
            mime_type: file.type,
            size_bytes: file.size,
          })
          .select()
          .single();
        if (insertError || !inserted) {
          console.error("documents insert error", insertError?.message);
          await supabase.storage.from("documents").remove([storagePath]);
          finishUploadTask(taskId, "error", "Metadata save failed");
          showMessage("error", "Uploaded to storage, but metadata save failed.");
          return;
        }

        setDocuments((prev) => [inserted as DocumentRecord, ...prev]);
        showMessage("success", `${file.name} uploaded.`);
      }

      finishUploadTask(taskId, "done");
    } catch (error) {
      console.error(error);
      const message =
        error instanceof Error && error.message ? error.message : "Upload failed";
      if (uploadCompleted && !replaceDoc) {
        await supabase.storage.from("documents").remove([storagePath]);
      }
      finishUploadTask(taskId, "error", message);
      showMessage("error", message);
    }
  }

  async function handleDelete(doc: DocumentRecord) {
    try {
      const { error: storageError } = await supabase.storage
        .from("documents")
        .remove([doc.storage_path]);
      if (storageError) throw storageError;

      await supabase.from("documents").delete().eq("id", doc.id);
      setDocuments((prev) => prev.filter((item) => item.id !== doc.id));
      showMessage("success", `${doc.file_name} deleted.`);
    } catch (error) {
      console.error(error);
      showMessage("error", "Could not delete document.");
    }
  }

  async function handleView(doc: DocumentRecord) {
    const { data, error } = await supabase.storage
      .from("documents")
      .createSignedUrl(doc.storage_path, 120);
    if (error || !data?.signedUrl) {
      showMessage("error", "Could not create download link.");
      return;
    }
    if (doc.mime_type?.startsWith("image/")) {
      setPreviewDoc({ url: data.signedUrl, record: doc });
    } else {
      window.open(data.signedUrl, "_blank", "noopener,noreferrer");
    }
  }

  function openFilePicker(callback: (file?: File) => void) {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = allowedMimeTypes.join(",");
    input.onchange = (event) => {
      const file = (event.target as HTMLInputElement).files?.[0];
      callback(file);
    };
    input.click();
  }

  return (
    <div className="space-y-6 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-[11px] uppercase tracking-[0.18em] text-slate-400">
            Documents hub
          </p>
          <h1 className="text-2xl font-semibold text-slate-900">
            Keep everything ready for employers and authorities.
          </h1>
          <p className="mt-2 text-sm text-slate-600">
            Upload passports, contracts, diplomas and certificates into one calm place.
          </p>
        </div>
        <div className="flex flex-wrap gap-2 text-sm font-medium text-slate-600">
          <span className="inline-flex items-center rounded-full border border-slate-200 px-4 py-2 text-slate-900">
            {documents.length} files
          </span>
        </div>
      </div>

      {message && (
        <div
          className={`rounded-2xl border px-4 py-3 text-sm ${
            messageType === "success"
              ? "border-emerald-200 bg-emerald-50 text-emerald-900"
              : "border-rose-200 bg-rose-50 text-rose-900"
          }`}
        >
          {message}
        </div>
      )}

      <div className="flex flex-wrap gap-2 rounded-2xl bg-slate-50 p-2 text-sm font-medium text-slate-600">
        {categories.map((category) => (
          <button
            key={category.id}
            type="button"
            onClick={() => setActiveCategory(category.id)}
            className={`rounded-2xl px-4 py-2 transition ${
              category.id === activeCategory ? "bg-white text-slate-900 shadow-sm" : ""
            }`}
          >
            {category.title}
          </button>
        ))}
      </div>

      <div className="space-y-4">
        {uploadTasks
          .filter((task) => task.category === activeCategory)
          .map((task) => (
            <div
              key={task.id}
              className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm"
            >
              <div className="flex items-center justify-between">
                <p className="font-medium text-slate-900">{task.fileName}</p>
                <span className="text-xs text-slate-500">{task.progress}%</span>
              </div>
              <div className="mt-2 h-1.5 rounded-full bg-white">
                <div
                  className={`h-1.5 rounded-full ${
                    task.status === "error" ? "bg-rose-500" : "bg-emerald-500"
                  }`}
                  style={{ width: `${task.progress}%` }}
                />
              </div>
              <p className="mt-2 text-xs text-slate-500">
                {task.status === "uploading"
                  ? "Uploading…"
                  : task.status === "processing"
                  ? "Processing…"
                  : task.status === "error"
                  ? task.message || "Upload failed."
                  : "Uploaded"}
              </p>
            </div>
          ))}
      </div>

      <div className="rounded-3xl border border-slate-200 bg-slate-50 p-5 shadow-sm">
        {docsByCategory
          .filter((category) => category.id === activeCategory)
          .map((category) => (
            <article key={category.id} className="space-y-5">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="text-[11px] uppercase tracking-[0.18em] text-slate-400">
                    {category.title}
                  </p>
                  <p className="text-sm text-slate-600">{category.description}</p>
                </div>
                <button
                  type="button"
                  onClick={() =>
                    openFilePicker((file) => {
                      handleFileUpload(category.id, file);
                    })
                  }
                  className="inline-flex items-center rounded-full border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-900 shadow-sm hover:border-slate-400"
                >
                  Upload document
                </button>
              </div>

              {category.documents.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-slate-200 bg-white p-6 text-sm text-slate-500">
                  No files yet. Upload PDFs or images to keep everything in one calm place.
                </div>
              ) : (
                <div className="space-y-3">
                  {category.documents.map((doc) => (
                    <div
                      key={doc.id}
                      className="rounded-2xl border border-slate-200 bg-white p-4 text-sm"
                    >
                      <div className="flex flex-wrap items-center justify-between gap-3">
                        <div>
                          <p className="font-medium text-slate-900">{doc.file_name}</p>
                          <p className="text-xs text-slate-500">
                            {formatBytes(doc.size_bytes ?? 0)} · {formatDate(doc.created_at)}
                          </p>
                        </div>
                        <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600">
                          {formatType(doc.mime_type)}
                        </span>
                      </div>
                      <div className="mt-3 flex flex-wrap gap-2 text-xs font-semibold">
                        <button
                          type="button"
                          onClick={() => handleView(doc)}
                          className="rounded-full border border-slate-200 bg-white px-3 py-1 text-slate-700 hover:border-slate-300"
                        >
                          View
                        </button>
                        <button
                          type="button"
                          onClick={() =>
                            openFilePicker((file) => handleFileUpload(doc.category, file, doc))
                          }
                          className="rounded-full border border-slate-200 bg-white px-3 py-1 text-slate-700 hover:border-slate-300"
                        >
                          Replace
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDelete(doc)}
                          className="rounded-full border border-rose-200 bg-rose-50 px-3 py-1 text-rose-700 hover:border-rose-300"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </article>
          ))}
      </div>

      {previewDoc && (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-white/70 px-4 backdrop-blur-xl">
          <button
            type="button"
            aria-label="Close preview"
            className="absolute inset-0 cursor-default"
            onClick={() => setPreviewDoc(null)}
          />
          <div className="relative z-10 max-w-3xl rounded-3xl border border-slate-200 bg-white p-6 shadow-2xl">
            <button
              type="button"
              className="absolute right-4 top-4 rounded-full bg-slate-100 px-3 py-1 text-sm text-slate-600 hover:bg-slate-200"
              onClick={() => setPreviewDoc(null)}
            >
              Close
            </button>
            <div className="mt-4">
              <p className="text-sm font-semibold text-slate-900">{previewDoc.record.file_name}</p>
              <p className="text-xs text-slate-500">
                {formatBytes(previewDoc.record.size_bytes ?? 0)} ·{" "}
                {formatDate(previewDoc.record.created_at)}
              </p>
            </div>
            <div className="mt-4">
              <Image
                src={previewDoc.url}
                alt={previewDoc.record.file_name}
                width={900}
                height={600}
                className="h-full w-full rounded-2xl border border-slate-200 object-contain"
              />
            </div>
          </div>
        </div>
      )}
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

function formatDate(dateString: string) {
  const date = new Date(dateString);
  return date.toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

function formatType(mime: string | null) {
  if (!mime) return "FILE";
  if (mime === "application/pdf") return "PDF";
  if (mime.includes("png")) return "PNG";
  if (mime.includes("jpg") || mime.includes("jpeg")) return "JPG";
  return mime.split("/")[1]?.toUpperCase() ?? "FILE";
}
