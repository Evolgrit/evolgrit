"use client";

import { useState } from "react";
import MentorChatSheet from "./MentorChatSheet";
import { MessageCircle } from "@/components/icons/LucideIcons";
import type { MentorMessage } from "@/lib/types/mentor";

type Props = {
  mentorName: string;
  mentorRole: string;
  mentorInitial: string;
  initialMessages: MentorMessage[];
  isConfigured: boolean;
  threadId: string | null;
};

export default function MobileMentorChatTrigger({
  mentorName,
  mentorRole,
  mentorInitial,
  initialMessages,
  isConfigured,
  threadId,
}: Props) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        className="fixed bottom-5 right-5 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-slate-900 text-white shadow-lg transition hover:bg-slate-800 xl:hidden"
        aria-label="Open mentor chat"
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
        initialMessages={initialMessages}
        isConfigured={isConfigured}
        threadId={threadId}
      />
    </>
  );
}
