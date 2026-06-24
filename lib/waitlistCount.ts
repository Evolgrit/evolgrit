import { createClient } from "@supabase/supabase-js";

export type WaitlistCountSource = "supabase" | "fallback";

const LOCAL_MVP_WAITLIST_FALLBACK = 1247;

export function getConfiguredWaitlistFallbackCount() {
  const raw = process.env.WAITLIST_FALLBACK_COUNT ?? process.env.NEXT_PUBLIC_WAITLIST_FALLBACK_COUNT;
  const parsed = raw ? Number.parseInt(raw, 10) : Number.NaN;
  if (Number.isFinite(parsed) && parsed >= 0) return parsed;

  return process.env.NODE_ENV === "production" ? 0 : LOCAL_MVP_WAITLIST_FALLBACK;
}

export async function getWaitlistCount(): Promise<{ count: number; source: WaitlistCountSource }> {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (url && key) {
    try {
      const supabase = createClient(url, key);
      const { count, error } = await supabase
        .from("waitlist_signups")
        .select("*", { count: "exact", head: true });

      if (!error && typeof count === "number") {
        return { count, source: "supabase" };
      }
    } catch {
      // Fall back to configured MVP count below.
    }
  }

  return { count: getConfiguredWaitlistFallbackCount(), source: "fallback" };
}
