"use client";

// Demo-safe chat sheet for marketing pages: keep interactions read-only and error-free.
// Production chat/call handling belongs in app routes (/dashboard, /employer).
import { useEffect, useMemo, useRef, useState } from "react";
import {
  ArrowUp,
  Camera,
  HelpCircle,
  Paperclip,
  Phone,
  Smile,
  XIcon,
  Mic,
} from "@/components/icons/LucideIcons";
import type { MentorMessage } from "@/lib/types/mentor";
import { MentorMessageBubble } from "./MentorChatPanel";

type MentorChatSheetProps = {
  open: boolean;
  onClose: () => void;
  mentorName: string;
  mentorRole: string;
  mentorInitial: string;
  initialMessages: MentorMessage[];
  isConfigured: boolean;
  threadId: string | null;
  demo?: boolean;
};

export default function MentorChatSheet({
  open,
  onClose,
  mentorName,
  mentorRole,
  mentorInitial,
  initialMessages,
  isConfigured,
  threadId,
  demo = false,
}: MentorChatSheetProps) {
  const [messages, setMessages] = useState<MentorMessage[]>(initialMessages);
  const [input, setInput] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const mentorAvatar = useMemo(() => mentorInitial.toUpperCase(), [mentorInitial]);
  const canSend = !demo && isConfigured && Boolean(threadId);

  useEffect(() => {
    if (!open) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, [open]);

  useEffect(() => {
    if (open && demo) {
      setMessages(initialMessages);
    }
  }, [demo, initialMessages, open]);

  useEffect(() => {
    if (open) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, open]);

  if (!open) return null;

  async function handleSend(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!canSend || !threadId || !input.trim()) return;

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
      setTimeout(() => setInfo(null), 2000);
    }
  }

  return (
    <>
      <button
        type="button"
        className="fixed inset-0 z-40 bg-slate-900/40 backdrop-blur-sm transition xl:hidden"
        aria-label="Close mentor chat"
        onClick={onClose}
      />
      <div className="fixed inset-x-0 bottom-0 z-50 xl:hidden">
        <div className="mx-auto w-full max-w-lg rounded-t-3xl border border-slate-200 bg-white shadow-2xl">
          <header className="flex items-center gap-3 px-4 py-4 sm:px-5">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-slate-900 text-lg font-semibold text-white">
              {mentorAvatar}
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-900">{mentorName}</p>
              <span className="sr-only">{mentorRole}</span>
            </div>
            <span className="ml-auto inline-flex items-center gap-1 rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
              <span className="h-2 w-2 rounded-full bg-emerald-500" />
              Online
            </span>
            <button
              type="button"
              className="rounded-full border border-slate-200 bg-white p-2 text-slate-500"
              onClick={onClose}
              aria-label="Close"
            >
              <XIcon className="h-4 w-4" />
            </button>
          </header>
          <div className="border-t border-slate-200" />

          <section className="space-y-4 border-b border-slate-200 px-4 py-4 sm:px-5">
            <p className="text-[11px] uppercase tracking-[0.18em] text-slate-400">
              Video chat
            </p>
            <div className="rounded-2xl border border-blue-100 bg-blue-50/90 p-4">
              <div className="flex h-36 items-center justify-center rounded-2xl bg-blue-100/70">
                <button
                  type="button"
                  disabled
                  className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm"
                >
                  <Phone className="h-4 w-4 text-emerald-500" />
                  Start a call
                </button>
              </div>
            </div>
          </section>

          <section className="space-y-3 border-b border-slate-200 px-4 py-4 sm:px-5">
            <p className="text-[11px] uppercase tracking-[0.18em] text-slate-400">
              Text chat
            </p>
            <div className="max-h-[45vh] space-y-3 overflow-y-auto pr-1">
              {messages.length ? (
                messages.map((message, index) => (
                  <div
                    key={message.id}
                    className={
                      demo
                        ? "demo-chat-fade-up"
                        : undefined
                    }
                    style={demo ? { animationDelay: `${index * 0.15}s` } : undefined}
                  >
                    <MentorMessageBubble message={message} mentorInitial={mentorAvatar} />
                  </div>
                ))
              ) : (
                <p className="text-sm text-slate-500">
                  Send your mentor a quick update to stay aligned.
                </p>
              )}
              <div ref={messagesEndRef} />
            </div>
          </section>

          <section className="space-y-2 px-4 py-4 pb-6 sm:px-5">
            <form onSubmit={handleSend} className="space-y-3">
              {demo && (
                <p className="text-sm text-slate-500">
                  Chat is available inside the Evolgrit app.
                </p>
              )}
              <input
                type="text"
                name="message"
                value={input}
                onChange={(event) => setInput(event.target.value)}
                placeholder={
                  demo
                    ? "Chat available inside Evolgrit"
                    : canSend
                    ? "Write message..."
                    : "Chat available inside Evolgrit"
                }
                disabled={!canSend}
                className="w-full rounded-full border border-slate-200 bg-white px-4 py-2 text-sm text-slate-900 outline-none placeholder:text-slate-400 disabled:opacity-60"
                onKeyDown={(event) => {
                  if (event.key === "Enter" && !event.shiftKey) {
                    event.preventDefault();
                    event.currentTarget.form?.requestSubmit();
                  }
                }}
              />
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    className="rounded-full border border-slate-200 p-2 text-slate-500 hover:bg-slate-50 disabled:opacity-40"
                    aria-label="Add emoji"
                    disabled={!canSend}
                  >
                    <Smile className="h-4 w-4" />
                  </button>
                  <button
                    type="button"
                    className="rounded-full border border-slate-200 p-2 text-slate-500 hover:bg-slate-50 disabled:opacity-40"
                    aria-label="Attach file"
                    disabled={!canSend}
                  >
                    <Paperclip className="h-4 w-4" />
                  </button>
                  <button
                    type="button"
                    className="rounded-full border border-slate-200 p-2 text-slate-500 hover:bg-slate-50 disabled:opacity-40"
                    aria-label="Open camera"
                    disabled={!canSend}
                  >
                    <Camera className="h-4 w-4" />
                  </button>
                </div>
                <button
                  type="submit"
                  disabled={!canSend || !input.trim()}
                  className="flex h-12 w-12 items-center justify-center rounded-full bg-slate-900 text-white transition hover:bg-slate-800 disabled:opacity-40"
                >
                  {input.trim() ? (
                    <ArrowUp className="h-4 w-4" />
                  ) : (
                    <Mic className="h-4 w-4" />
                  )}
                </button>
              </div>
              {!demo && error && <p className="text-xs text-rose-600">{error}</p>}
              {!demo && info && <p className="text-xs text-emerald-600">{info}</p>}
            </form>
            <div className="flex items-center justify-between border-t border-slate-200 pt-3 text-xs text-slate-500">
              <div className="inline-flex items-center gap-2">
                <HelpCircle className="h-4 w-4" />
                Help center
              </div>
              <button
                type="button"
                className="inline-flex items-center gap-1 text-slate-600 hover:text-slate-900"
              >
                Open
              </button>
            </div>
          </section>
        </div>
      </div>
    </>
  );
}
