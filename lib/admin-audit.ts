import { createClient } from "@supabase/supabase-js";
import { createSupabaseServerClient } from "@/lib/supabase/server";

const adminAuditClient = process.env.SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY
  ? createClient(
      process.env.SUPABASE_URL,
      process.env.SUPABASE_SERVICE_ROLE_KEY
    )
  : null;

export async function getAdminActorId() {
  try {
    const supabase = await createSupabaseServerClient();
    const { data } = await supabase.auth.getUser();
    return data.user?.id ?? null;
  } catch (error) {
    console.error("admin actor fetch error", error);
    return null;
  }
}

type AuditMeta = Record<string, unknown>;

export async function logAdminAudit({
  actorId,
  action,
  target,
  meta,
}: {
  actorId?: string | null;
  action: string;
  target?: string | null;
  meta?: AuditMeta | null;
}) {
  if (!adminAuditClient) {
    console.error("admin audit client not configured");
    return;
  }

  try {
    await adminAuditClient.from("admin_audit_log").insert({
      actor_id: actorId ?? null,
      action,
      target: target ?? null,
      meta: meta ?? null,
    });
  } catch (error) {
    console.error("admin audit log insert error", error);
  }
}
