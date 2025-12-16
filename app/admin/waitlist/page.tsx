import Link from "next/link";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export default async function AdminWaitlistPage() {
  const { data, error } = await supabase
    .from("waitlist_signups")
    .select("created_at, full_name, email, country, target, german_level, start_timeframe, whatsapp")
    .order("created_at", { ascending: false })
    .limit(300);

  if (error) {
    return (
      <main className="min-h-screen bg-slate-50 p-6">
        <div className="max-w-6xl mx-auto rounded-2xl border border-slate-200 bg-white p-6">
          <h1 className="text-xl font-semibold text-slate-900">Admin · Waitlist</h1>
          <p className="mt-2 text-sm text-rose-600">Error: {error.message}</p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-50 p-6 text-slate-900">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-baseline justify-between gap-4">
          <div>
            <h1 className="text-2xl font-semibold">Admin · Waitlist signups</h1>
            <p className="mt-1 text-sm text-slate-600">
              Latest {data?.length ?? 0} entries
            </p>
          </div>
          <Link
            href="/"
            className="text-sm text-slate-500 hover:text-slate-900"
          >
            Back to site →
          </Link>
        </div>

        <div className="mt-6 overflow-auto rounded-2xl border border-slate-200 bg-white">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 text-slate-600">
              <tr>
                <th className="p-3 text-left whitespace-nowrap">Created</th>
                <th className="p-3 text-left">Name</th>
                <th className="p-3 text-left">Email</th>
                <th className="p-3 text-left">Country</th>
                <th className="p-3 text-left">Target</th>
                <th className="p-3 text-left">Level</th>
                <th className="p-3 text-left">Timeframe</th>
                <th className="p-3 text-left">WhatsApp</th>
              </tr>
            </thead>
            <tbody>
              {(data ?? []).map((r, i) => (
                <tr key={i} className="border-t border-slate-100">
                  <td className="p-3 whitespace-nowrap">
                    {new Date(r.created_at).toLocaleString()}
                  </td>
                  <td className="p-3">{r.full_name}</td>
                  <td className="p-3">{r.email}</td>
                  <td className="p-3">{r.country ?? ""}</td>
                  <td className="p-3">{r.target ?? ""}</td>
                  <td className="p-3">{r.german_level ?? ""}</td>
                  <td className="p-3">{r.start_timeframe ?? ""}</td>
                  <td className="p-3">{r.whatsapp ?? ""}</td>
                </tr>
              ))}
              {(!data || data.length === 0) && (
                <tr>
                  <td className="p-6 text-slate-500" colSpan={8}>
                    No signups yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <p className="mt-4 text-xs text-slate-500">
          Tip: Use your browser search (Cmd+F) to quickly find an email or name.
        </p>
      </div>
    </main>
  );
}
