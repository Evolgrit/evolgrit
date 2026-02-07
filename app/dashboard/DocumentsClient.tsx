"use client";

import Image from "next/image";
import { useEffect, useMemo, useRef, useState } from "react";
import { createSupabaseBrowserClient } from "@/lib/supabase/browser";

declare const window:
  | {
      setTimeout: (handler: () => void, timeout?: number) => number;
      setInterval: (handler: () => void, timeout?: number) => number;
      clearInterval: (id?: number) => void;
      addEventListener: (type: string, listener: (event: { key?: string }) => void) => void;
      removeEventListener: (type: string, listener: (event: { key?: string }) => void) => void;
      open: (url?: string, target?: string, features?: string) => void;
    }
  | undefined;
declare const document:
  | {
      createElement: (tag: string) => {
        type?: string;
        accept?: string;
        onchange?: (event: Event) => void;
        click: () => void;
      };
      body: {
        appendChild: (el: unknown) => void;
        removeChild: (el: unknown) => void;
      };
    }
  | undefined;

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
  bucket_id: string;
  object_path: string;
  category: string;
  doc_type: string | null;
  file_name: string;
  mime_type: string | null;
  size_bytes: number | null;
  status: string | null;
  created_at: string;
};

type UploadTask = {
  id: string;
  category: string;
  fileName: string;
  progress: number;
  status: "uploading" | "processing" | "done" | "error";
  message?: string;
};

export default function DocumentsClient({ initialDocuments }: { initialDocuments: DocumentRecord[] }) {
  const supabase = createSupabaseBrowserClient();
  const [documents, setDocuments] = useState<DocumentRecord[]>(initialDocuments);
  const [activeCategory, setActiveCategory] = useState<string>(categories[0].id);
  const [message, setMessage] = useState<string | null>(null);
  const [messageType, setMessageType] = useState<"success" | "error" | null>(null);
  const [uploadTasks, setUploadTasks] = useState<UploadTask[]>([]);
  const uploadIntervals = useRef<Record<string, number>>({});
  const hasWindow = typeof window !== "undefined";
  const [previewDoc, setPreviewDoc] = useState<{ url: string; record: DocumentRecord } | null>(
    null
  );
  const [pendingDeleteId, setPendingDeleteId] = useState<string | null>(null);

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
        if (intervalId && hasWindow) window.clearInterval(intervalId);
      });
    };
  }, [hasWindow]);

  function showMessage(type: "success" | "error", text: string) {
    setMessageType(type);
    setMessage(text);
    if (!hasWindow) return;
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
    if (!hasWindow) return taskId;
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
    if (uploadIntervals.current[taskId] && hasWindow) {
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
    if (status !== "error" && hasWindow) {
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
    const docId = replaceDoc?.id ?? crypto.randomUUID();
    const docType = getDocType(file.type);
    let uploadCompleted = false;
    let objectPath = "";
    try {
      const { data: authData, error: authError } = await supabase.auth.getUser();
      if (authError || !authData.user) {
        throw new Error(authError?.message || "Not authenticated");
      }
      const authedUserId = authData.user.id;
      objectPath = `${authedUserId}/${categoryId}/${crypto.randomUUID()}-${file.name}`;
      const uploadOptions = replaceDoc
        ? { contentType: file.type, upsert: true }
        : { contentType: file.type };
      const { error: uploadError } = await supabase.storage
        .from("documents")
        .upload(objectPath, file, uploadOptions);
      if (uploadError) {
        console.error("documents storage upload error", uploadError);
        throw uploadError;
      }
      uploadCompleted = true;

      if (replaceDoc) {
        const { data: updated, error: updateError } = await supabase
          .from("documents")
          .update({
            category: categoryId,
            bucket_id: "documents",
            object_path: objectPath,
            doc_type: docType,
            file_name: file.name,
            mime_type: file.type,
            size_bytes: file.size,
            status: "uploaded",
          })
          .eq("id", replaceDoc.id)
          .select()
          .single();
        if (updateError || !updated) throw updateError;

        if (replaceDoc.object_path !== objectPath) {
          await supabase.storage.from("documents").remove([replaceDoc.object_path]);
        }

        setDocuments((prev) =>
          prev.map((doc) => (doc.id === replaceDoc.id ? (updated as DocumentRecord) : doc))
        );
        showMessage("success", "Document ready.");
      } else {
        const { data: inserted, error: insertError } = await supabase
          .from("documents")
          .insert({
            id: docId,
            user_id: authedUserId,
            category: categoryId,
            bucket_id: "documents",
            object_path: objectPath,
            doc_type: docType,
            file_name: file.name,
            mime_type: file.type,
            size_bytes: file.size,
            status: "uploaded",
          })
          .select()
          .single();
        if (insertError || !inserted) {
          console.error("documents insert error", {
            code: insertError?.code,
            message: insertError?.message,
            details: insertError?.details,
            hint: insertError?.hint,
            payload: {
              user_id: authedUserId,
              category: categoryId,
              bucket_id: "documents",
              object_path: objectPath,
              doc_type: docType,
            },
          });
          await supabase.storage.from("documents").remove([objectPath]);
          finishUploadTask(taskId, "error", "Metadata save failed");
          const metaMessage =
            insertError?.message || "Uploaded to storage, but metadata save failed.";
          showMessage("error", metaMessage);
          return;
        }

        setDocuments((prev) => [inserted as DocumentRecord, ...prev]);
        showMessage("success", "Document ready.");
      }

      finishUploadTask(taskId, "done");
    } catch (error) {
      console.error(error);
      const message =
        error instanceof Error && error.message ? error.message : "Upload failed";
      if (uploadCompleted && !replaceDoc) {
        await supabase.storage.from("documents").remove([objectPath]);
      }
      finishUploadTask(taskId, "error", message);
      showMessage("error", message);
    }
  }

  async function handleDelete(doc: DocumentRecord) {
    try {
      const { error: storageError } = await supabase.storage
        .from("documents")
        .remove([doc.object_path]);
      if (storageError) throw storageError;

      await supabase.from("documents").delete().eq("id", doc.id);
      setDocuments((prev) => prev.filter((item) => item.id !== doc.id));
      showMessage("success", `${doc.file_name} deleted.`);
    } catch (error) {
      console.error(error);
      showMessage("error", "Could not delete document.");
    }
  }

  useEffect(() => {
    if (!hasWindow) return;
    function onKey(event: { key?: string }) {
      if (event.key === "Escape") {
        setPreviewDoc(null);
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [hasWindow]);

  async function handleView(doc: DocumentRecord) {
    const { data, error } = await supabase.storage
      .from("documents")
      .createSignedUrl(doc.object_path, 600);
    if (error || !data?.signedUrl) {
      showMessage("error", "Could not create download link.");
      return;
    }
    if (doc.mime_type?.startsWith("image/") || doc.mime_type === "application/pdf") {
      setPreviewDoc({ url: data.signedUrl, record: doc });
    } else if (hasWindow) {
      window.open(data.signedUrl, "_blank", "noopener,noreferrer");
    }
  }

  function openFilePicker(callback: (file?: File) => void) {
    if (typeof document === "undefined") return;
    const input = document.createElement("input");
    input.type = "file";
    input.accept = allowedMimeTypes.join(",");
    input.onchange = (event) => {
      const target = event.target as { files?: { 0?: File } | null };
      const file = target?.files?.[0];
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
                    <div key={doc.id} className="rounded-2xl border border-slate-200 bg-white p-4 text-sm">
                      <div className="flex flex-wrap items-center justify-between gap-3">
                        <div>
                          <p className="font-medium text-slate-900">{doc.file_name}</p>
                          <p className="text-xs text-slate-500">
                            {formatBytes(doc.size_bytes ?? 0)} · {formatDate(doc.created_at)}
                          </p>
                        </div>
                        <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600">
                          {formatDocType(doc.doc_type)}
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
                          onClick={() => {
                            if (pendingDeleteId === doc.id) {
                              setPendingDeleteId(null);
                              handleDelete(doc);
                            } else {
                              setPendingDeleteId(doc.id);
                              if (hasWindow) {
                                window.setTimeout(() => {
                                  setPendingDeleteId((current) =>
                                    current === doc.id ? null : current
                                  );
                                }, 5000);
                              }
                            }
                          }}
                          className={`rounded-full border px-3 py-1 ${
                            pendingDeleteId === doc.id
                              ? "border-rose-400 bg-rose-50 text-rose-700"
                              : "border-rose-200 bg-rose-50 text-rose-700 hover:border-rose-300"
                          }`}
                        >
                          {pendingDeleteId === doc.id ? "Confirm delete" : "Delete"}
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
          <div className="relative z-10 max-w-5xl w-full rounded-3xl border border-slate-200 bg-white p-6 shadow-2xl">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-sm font-semibold text-slate-900">{previewDoc.record.file_name}</p>
                <p className="text-xs text-slate-500">
                  {formatBytes(previewDoc.record.size_bytes ?? 0)} · {formatDate(previewDoc.record.created_at)}
                </p>
              </div>
              <div className="flex gap-2">
                <a
                  href={previewDoc.url}
                  target="_blank"
                  rel="noreferrer"
                  className="rounded-full border border-slate-200 bg-white px-3 py-1 text-sm font-medium text-slate-700 hover:border-slate-300"
                >
                  Download
                </a>
                <button
                  type="button"
                  className="rounded-full bg-slate-100 px-3 py-1 text-sm text-slate-600 hover:bg-slate-200"
                  onClick={() => setPreviewDoc(null)}
                >
                  Close
                </button>
              </div>
            </div>
            <div className="mt-4">
              {previewDoc.record.mime_type === "application/pdf" ? (
                <iframe
                  src={previewDoc.url}
                  className="h-[80vh] w-full rounded-2xl border border-slate-200"
                  title={previewDoc.record.file_name}
                />
              ) : (
                <Image
                  src={previewDoc.url}
                  alt={previewDoc.record.file_name}
                  width={1200}
                  height={800}
                  className="mx-auto max-h-[80vh] w-auto rounded-2xl border border-slate-200 object-contain"
                />
              )}
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

function getDocType(mime: string | null) {
  if (!mime) return "other";
  if (mime.toLowerCase().includes("pdf")) return "pdf";
  if (mime.toLowerCase().startsWith("image/")) return "image";
  return "other";
}

function formatDocType(type: string | null) {
  if (type === "pdf") return "PDF";
  if (type === "image") return "IMG";
  return "FILE";
}
