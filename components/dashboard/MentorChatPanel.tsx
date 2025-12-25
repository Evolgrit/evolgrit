"use client";

import { useMemo, useState } from "react";

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
  const mentorAvatar = useMemo(() => mentorInitial.toUpperCase(), [mentorInitial]);

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
    <div className="rounded-3xl border border-slate-200 bg-white shadow-sm">
      <div className="flex items-center gap-3 p-5">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-slate-900 text-white text-lg font-semibold">
          {mentorAvatar}
        </div>
        <div>
          <p className="text-sm font-semibold text-slate-900">{mentorName}</p>
          <p className="text-xs text-slate-500">{mentorRole}</p>
        </div>
        <span className="ml-auto inline-flex items-center gap-1 rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
          <span className="h-2 w-2 rounded-full bg-emerald-500" />
          Online
        </span>
        <button
          type="button"
          className="rounded-full border border-slate-200 bg-white p-2 text-xs text-slate-500 hover:bg-slate-50"
          aria-label="Mentor options"
        >
          ···
        </button>
      </div>
      <div className="border-t border-slate-200" />

      <div className="space-y-3 border-b border-slate-200 p-5">
        <div>
          <p className="text-[11px] uppercase tracking-[0.18em] text-slate-400">
            Video chat
          </p>
          <p className="text-sm text-slate-600">Scheduled inside Evolgrit.</p>
        </div>
        <div className="rounded-2xl bg-blue-50 p-4 text-center text-sm text-slate-600">
          Video calls are available during mentor sessions.
        </div>
        <button
          type="button"
          disabled
          className="inline-flex w-full items-center justify-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-4 py-2 text-sm font-medium text-slate-500"
        >
          📞 Start a call (coming soon)
        </button>
      </div>

      <div className="flex flex-col border-b border-slate-200 p-5">
        <div className="mb-3 flex items-center justify-between">
          <p className="text-[11px] uppercase tracking-[0.18em] text-slate-400">
            Text chat
          </p>
          <span className="text-xs text-slate-500">Mentor replies within a day</span>
        </div>
        {messages.length ? (
          <div className="flex max-h-64 flex-col gap-3 overflow-hidden">
            <div className="flex flex-col gap-3 overflow-y-auto pr-1 text-sm">
              {messages.map((message) => (
                <MessageBubble
                  key={message.id}
                  message={message}
                  mentorInitial={mentorAvatar}
                />
              ))}
            </div>
          </div>
        ) : (
          <p className="text-sm text-slate-500">
            Send your mentor a quick update to stay aligned.
          </p>
        )}
      </div>

      <div className="space-y-3 p-5">
        {isConfigured ? (
          <form onSubmit={handleSend} className="space-y-2">
            <div className="flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-1">
              <button
                type="button"
                className="rounded-full p-2 text-slate-500 hover:text-slate-700"
                aria-label="Add emoji"
              >
                🙂
              </button>
              <button
                type="button"
                className="rounded-full p-2 text-slate-500 hover:text-slate-700"
                aria-label="Attach file"
              >
                📎
              </button>
              <input
                type="text"
                name="message"
                value={input}
                onChange={(event) => setInput(event.target.value)}
                placeholder="Write message..."
                className="flex-1 bg-transparent text-sm text-slate-900 outline-none placeholder:text-slate-400"
              />
              <button
                type="submit"
                disabled={sending || !input.trim()}
                className="rounded-full bg-slate-900 p-2 text-white disabled:opacity-50"
              >
                ↑
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
        <div className="flex items-center justify-between border-t border-slate-200 pt-3 text-xs text-slate-500">
          <span>Help center</span>
          <button
            type="button"
            className="rounded-full border border-slate-200 px-2 py-1 text-slate-600 hover:bg-slate-50"
          >
            ?
          </button>
        </div>
      </div>
    </div>
  );
}

function MessageBubble({
  message,
  mentorInitial,
}: {
  message: MentorMessage;
  mentorInitial: string;
}) {
  const isMentor = message.sender_type === "mentor";
  return (
    <div
      className={`flex items-start gap-3 ${
        isMentor ? "" : "flex-row-reverse text-right"
      }`}
    >
      <div
        className={`flex h-8 w-8 items-center justify-center rounded-full border border-slate-200 bg-white text-xs font-semibold ${
          isMentor ? "text-slate-900" : "text-slate-900"
        }`}
      >
        {isMentor ? mentorInitial : "You"}
      </div>
      <div className="flex max-w-[80%] flex-col gap-1 text-left">
        <div
          className={`rounded-2xl px-3 py-2 text-sm ${
            isMentor ? "bg-slate-100 text-slate-800" : "bg-slate-900 text-white"
          }`}
        >
          {message.content}
        </div>
        <span className="text-[11px] text-slate-400">
          {new Date(message.created_at).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          })}
        </span>
      </div>
    </div>
  );
}
