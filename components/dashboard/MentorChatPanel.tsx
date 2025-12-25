"use client";

import { useState } from "react";

type MentorMessage = {
  id: string;
  sender_type: "learner" | "mentor";
  content: string;
  created_at: string;
};

type Props = {
  mentorName: string;
  mentorRole: string;
  mentorInitial: string;
  isConfigured: boolean;
  threadId: string | null;
  initialMessages: MentorMessage[];
};

export default function MentorChatPanel({
  mentorName,
  mentorRole,
  mentorInitial,
  isConfigured,
  threadId,
  initialMessages,
}: Props) {
  const [messages, setMessages] = useState<MentorMessage[]>(initialMessages);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(null);

  const canSend = isConfigured && Boolean(threadId);

  async function handleSend(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!canSend || !threadId || !input.trim()) return;

    setSending(true);
    setError(null);
    setInfo(null);

    try {
      const response = await fetch("/api/mentor/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ threadId, content: input.trim() }),
      });

      if (!response.ok) {
        const payload = await response.json().catch(() => ({}));
        throw new Error(payload?.error || "Unable to send message");
      }

      const data = (await response.json()) as { message: MentorMessage };
      setMessages((prev) => [...prev, data.message]);
      setInput("");
      setInfo("Sent");
    } catch (err) {
      console.error("mentor message send error", err);
      setError(err instanceof Error ? err.message : "Message failed");
    } finally {
      setSending(false);
      setTimeout(() => setInfo(null), 2000);
    }
  }

  return (
    <div className="space-y-4">
      <article className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-slate-900 text-white text-lg font-semibold">
            {mentorInitial}
          </div>
          <div>
            <p className="text-sm font-semibold text-slate-900">{mentorName}</p>
            <p className="text-xs text-slate-500">{mentorRole}</p>
          </div>
          <span className="ml-auto inline-flex items-center gap-1 text-xs text-emerald-600">
            <span className="h-2 w-2 rounded-full bg-emerald-500" /> Online
          </span>
        </div>
        <p className="mt-3 text-sm text-slate-600">
          Calm weekly guidance for language, culture and next steps.
        </p>
      </article>

      <article className="space-y-3 rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
        <div>
          <p className="text-[11px] uppercase tracking-[0.18em] text-slate-400">
            Video chat
          </p>
          <p className="text-sm text-slate-600">Scheduled inside Evolgrit.</p>
        </div>
        <button
          type="button"
          disabled
          className="w-full rounded-full border border-slate-200 bg-slate-50 px-4 py-2 text-sm font-medium text-slate-500"
        >
          Start a call (coming soon)
        </button>
      </article>

      <article className="space-y-4 rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="flex items-center justify-between">
          <p className="text-[11px] uppercase tracking-[0.18em] text-slate-400">
            Text chat
          </p>
          <span className="text-xs text-slate-500">Mentor replies within a day</span>
        </div>
        {messages.length ? (
          <div className="flex max-h-64 flex-col gap-2 overflow-hidden">
            <div className="flex flex-col gap-2 overflow-y-auto pr-1 text-sm">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`max-w-[85%] rounded-2xl px-3 py-2 text-sm ${
                    message.sender_type === "mentor"
                      ? "bg-slate-100 text-slate-800"
                      : "ml-auto bg-slate-900 text-white"
                  }`}
                >
                  {message.content}
                </div>
              ))}
            </div>
          </div>
        ) : (
          <p className="text-sm text-slate-500">
            Send your mentor a quick update to stay aligned.
          </p>
        )}
        {isConfigured ? (
          <form onSubmit={handleSend} className="space-y-2">
            <div className="flex items-center gap-2">
              <input
                type="text"
                name="message"
                value={input}
                onChange={(event) => setInput(event.target.value)}
                placeholder="Send a note..."
                className="flex-1 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm text-slate-900 shadow-sm focus:outline-none focus:ring-2 focus:ring-slate-300"
              />
              <button
                type="submit"
                disabled={sending || !input.trim()}
                className="rounded-full bg-slate-900 px-4 py-2 text-sm font-semibold text-white disabled:opacity-50"
              >
                Send
              </button>
            </div>
            {error && <p className="text-xs text-rose-600">{error}</p>}
            {info && <p className="text-xs text-emerald-600">{info}</p>}
          </form>
        ) : (
          <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-500">
            Mentor chat unlocks once your mentor is assigned.
          </div>
        )}
      </article>
    </div>
  );
}
