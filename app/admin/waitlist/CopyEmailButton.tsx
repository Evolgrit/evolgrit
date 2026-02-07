"use client";

import { useState } from "react";

declare const window:
  | {
      navigator?: { clipboard?: { writeText?: (text: string) => Promise<void> } };
    }
  | undefined;
declare const document:
  | {
      createElement: (tag: string) => {
        value: string;
        style: { position: string; left: string };
        setAttribute: (name: string, value: string) => void;
        select: () => void;
      };
      body: {
        appendChild: (el: unknown) => void;
        removeChild: (el: unknown) => void;
      };
      execCommand: (command: string) => boolean;
    }
  | undefined;

export function CopyEmailButton({ email }: { email: string }) {
  const [copied, setCopied] = useState(false);

  async function copyToClipboard(text: string) {
    if (typeof window === "undefined") return false;
    if (window.navigator?.clipboard?.writeText) {
      await window.navigator.clipboard.writeText(text);
      return true;
    }
    if (!document) return false;
    const el = document.createElement("textarea");
    el.value = text;
    el.setAttribute("readonly", "");
    el.style.position = "fixed";
    el.style.left = "-9999px";
    document.body.appendChild(el);
    el.select();
    const ok = document.execCommand("copy");
    document.body.removeChild(el);
    return ok;
  }

  async function copy() {
    try {
      const ok = await copyToClipboard(email);
      if (ok) {
        setCopied(true);
        setTimeout(() => setCopied(false), 1200);
      }
    } catch {}
  }

  return (
    <button
      type="button"
      onClick={copy}
      className="inline-flex items-center rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-medium text-slate-700 shadow-sm hover:bg-slate-50"
      title="Copy email"
    >
      {copied ? "Copied" : "Copy"}
    </button>
  );
}
