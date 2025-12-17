"use client";

import { useState } from "react";

export function CopyAllEmailsButton({
  label,
  emails,
}: {
  label: string;
  emails: string[];
}) {
  const [copied, setCopied] = useState(false);

  async function copy() {
    const unique = Array.from(new Set(emails.filter(Boolean))).join("\n");
    try {
      await navigator.clipboard.writeText(unique);
      setCopied(true);
      setTimeout(() => setCopied(false), 1200);
    } catch {
      const el = document.createElement("textarea");
      el.value = unique;
      document.body.appendChild(el);
      el.select();
      document.execCommand("copy");
      document.body.removeChild(el);
      setCopied(true);
      setTimeout(() => setCopied(false), 1200);
    }
  }

  return (
    <button
      type="button"
      onClick={copy}
      className="inline-flex items-center rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-sm hover:bg-slate-50"
      title="Copies unique emails as newline-separated list"
    >
      {copied ? "Copied" : label}
    </button>
  );
}
