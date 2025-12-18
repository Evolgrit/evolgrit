"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { createSupabaseBrowserClient } from "@/lib/supabase/browser";

export default function MessageComposer({ threadId }: { threadId: string }) {
  const supabase = useMemo(() => createSupabaseBrowserClient(), []);
  const router = useRouter();
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function send(e: React.FormEvent) {
    e.preventDefault();
    if (!message.trim() || sending) return;

    setSending(true);
    setError(null);

    const { error: insertError } = await supabase.from("chat_messages").insert({
      thread_id: threadId,
      sender: "learner",
      content: message.trim(),
    });

    if (insertError) {
      setError("Could not send. Please try again.");
      setSending(false);
      return;
    }

    setMessage("");
    setSending(false);
    router.refresh();
  }

  return (
    <form onSubmit={send} className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm">
      <label className="text-[11px] uppercase tracking-[0.18em] text-slate-400">
        Your message
      </label>
      <textarea
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        rows={3}
        className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-300"
        placeholder="Ask about life, paperwork, German or your tasks..."
      />
      {error && <p className="mt-2 text-xs text-rose-500">{error}</p>}
      <div className="mt-3 flex items-center justify-between">
        <p className="text-xs text-slate-500">
          Mentors typically respond within 24h. No realtime yet — send & refresh.
        </p>
        <button
          type="submit"
          disabled={!message.trim() || sending}
          className="inline-flex items-center rounded-full bg-slate-900 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-slate-800 disabled:opacity-50"
        >
          {sending ? "Sending…" : "Send"}
        </button>
      </div>
    </form>
  );
}
