import { NextRequest, NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export async function POST(
  request: NextRequest,
  context: { params: Promise<{}> }
) {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { threadId, content } = (await request.json().catch(() => ({
    threadId: null,
    content: null,
  }))) as { threadId?: unknown; content?: unknown };

  if (!threadId || typeof content !== "string" || !content.trim()) {
    return NextResponse.json({ error: "Message content missing" }, { status: 400 });
  }

  const { data: thread, error: threadError } = await supabase
    .from("mentor_threads")
    .select("id")
    .eq("id", threadId)
    .eq("learner_id", user.id)
    .maybeSingle();

  if (threadError || !thread) {
    return NextResponse.json({ error: "Thread not found" }, { status: 404 });
  }

  const { data: inserted, error: insertError } = await supabase
    .from("mentor_messages")
    .insert({
      thread_id: threadId,
      sender_type: "learner",
      content: content.trim(),
    })
    .select("id, thread_id, sender_type, content, created_at")
    .single();

  if (insertError || !inserted) {
    console.error("mentor message insert error", insertError);
    return NextResponse.json({ error: "Unable to send" }, { status: 500 });
  }

  return NextResponse.json({ message: inserted });
}
