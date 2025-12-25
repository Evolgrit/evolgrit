"use client";

// Demo-only web chat trigger: keep read-only preview for marketing.
// Full chat/call functionality lives in the in-app experiences (/dashboard, /employer).
import { useState } from "react";
import MentorChatSheet from "@/components/dashboard/MentorChatSheet";
import { MessageCircle } from "@/components/icons/LucideIcons";
import type { MentorMessage } from "@/lib/types/mentor";

type Props = {
  mentorName: string;
  mentorRole: string;
  mentorInitial: string;
  messages: MentorMessage[];
};

export default function DemoMentorChatTrigger({
  mentorName,
  mentorRole,
  mentorInitial,
  messages,
}: Props) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        className="fixed bottom-5 right-5 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-slate-900 text-white shadow-lg transition hover:bg-slate-800 xl:hidden"
        aria-label="Open mentor chat demo"
        onClick={() => setOpen(true)}
      >
        <MessageCircle className="h-6 w-6" />
        <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-emerald-500" />
      </button>
      <MentorChatSheet
        open={open}
        onClose={() => setOpen(false)}
        mentorName={mentorName}
        mentorRole={mentorRole}
        mentorInitial={mentorInitial}
        initialMessages={messages}
        isConfigured={false}
        threadId={null}
        demo
      />
    </>
  );
}
