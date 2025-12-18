import { redirect } from "next/navigation";
import Link from "next/link";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import MessageComposer from "./message-composer";

type ChatThread = {
  id: string;
  mentor_name: string | null;
  mentor_role: string | null;
};

type ChatMessage = {
  id: string;
  sender: string | null;
  content: string | null;
  created_at: string;
};

function formatTime(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "now";
  return date.toLocaleString("en-GB", {
    day: "numeric",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default async function MentorsPage() {
  const supabase = await createSupabaseServerClient();
  const { data } = await supabase.auth.getUser();
  if (!data.user) redirect("/login");

  let threadRes = await supabase
    .from("chat_threads")
    .select("id, mentor_name, mentor_role")
    .eq("user_id", data.user.id)
    .maybeSingle();

  if (threadRes.error) {
    console.error("Error fetching chat thread", threadRes.error);
  }

  let thread = threadRes.data as ChatThread | null;

  if (!thread) {
    const created = await supabase
      .from("chat_threads")
      .insert({
        user_id: data.user.id,
        mentor_name: "Lina K.",
        mentor_role: "Cultural readiness mentor",
      })
      .select("id, mentor_name, mentor_role")
      .single();

    thread = created.data as ChatThread | null;
  }

  if (!thread) {
    return (
      <div className="rounded-3xl border border-rose-200 bg-rose-50 p-6 text-rose-900">
        Could not load your mentor chat. Please try again later.
      </div>
    );
  }

  const { data: messages, error: messageError } = await supabase
    .from("chat_messages")
    .select("id, sender, content, created_at")
    .eq("thread_id", thread.id)
    .order("created_at", { ascending: true });

  if (messageError) {
    console.error("Error loading chat messages", messageError);
  }

  const list = messages ?? [];

  return (
    <div className="space-y-6">
      <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-[11px] uppercase tracking-[0.18em] text-slate-400">
              Mentor chat
            </p>
            <h1 className="text-2xl font-semibold text-slate-900">
              Ask your mentor anything about life, language or work.
            </h1>
            <p className="mt-2 text-sm text-slate-600">
              This channel keeps everything in one place — notes, tasks, feedback,
              cultural questions. Replies arrive within 24 hours (refresh after
              sending to see new messages).
            </p>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-600">
            <p className="text-xs uppercase tracking-[0.18em] text-slate-500">
              Your mentor
            </p>
            <p className="mt-1 text-base font-semibold text-slate-900">
              {thread.mentor_name ?? "Your mentor"}
            </p>
            <p className="text-xs text-slate-500">{thread.mentor_role ?? "Mentor"}</p>
            <p className="mt-3 text-xs text-slate-500">
              Typical hours: Mon–Fri · 09:00–19:00 CET
            </p>
          </div>
        </div>
      </section>

      <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-[11px] uppercase tracking-[0.18em] text-slate-400">
              Thread
            </p>
            <h2 className="text-xl font-semibold text-slate-900">Messages</h2>
          </div>
          <Link href="/dashboard/journey" className="text-sm text-blue-600 hover:text-blue-700">
            Add to journey →
          </Link>
        </div>

        <div className="mt-4 space-y-3">
          {list.length ? (
            list.map((msg) => {
              const isLearner = msg.sender !== "mentor";
              return (
                <div
                  key={msg.id}
                  className={`flex ${isLearner ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-xl rounded-3xl border px-4 py-3 shadow-sm ${
                      isLearner
                        ? "border-slate-900 bg-slate-900 text-white"
                        : "border-slate-100 bg-slate-50 text-slate-900"
                    }`}
                  >
                    <p className="text-sm leading-relaxed">
                      {msg.content || "(no content)"}
                    </p>
                    <p
                      className={`mt-2 text-[11px] ${
                        isLearner ? "text-slate-200" : "text-slate-500"
                      }`}
                    >
                      {isLearner ? "You" : thread.mentor_name ?? "Mentor"} · {formatTime(msg.created_at)}
                    </p>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="rounded-3xl border border-dashed border-slate-200 bg-slate-50 p-6 text-center text-sm text-slate-500">
              No messages yet. Send the first question to your mentor.
            </div>
          )}
        </div>

        <div className="mt-6">
          <MessageComposer threadId={thread.id} />
        </div>
      </section>
    </div>
  );
}
