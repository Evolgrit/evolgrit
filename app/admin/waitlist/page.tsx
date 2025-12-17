import Link from "next/link";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export default async function AdminWaitlistPage({
  searchParams,
}: {
  searchParams?: { target?: string; level?: string; time?: string };
}) {
  let query = supabase
    .from("waitlist_signups")
    .select("created_at, full_name, email, country, target, german_level, start_timeframe, whatsapp")
    .order("created_at", { ascending: false })
    .limit(500);

  const target = searchParams?.target?.trim();
  const level = searchParams?.level?.trim();
  const time = searchParams?.time?.trim();

  if (target) query = query.eq("target", target);
  if (level) query = query.eq("german_level", level);
  if (time) query = query.eq("start_timeframe", time);

  const { data, error } = await query;

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
            <div className="mt-4 flex flex-col sm:flex-row gap-3 sm:items-center">
              <form className="flex flex-col sm:flex-row gap-3 sm:items-center" method="GET">
                <select
                  name="target"
                  defaultValue={target ?? ""}
                  className="rounded-2xl border border-slate-200 bg-white px-4 py-2 text-sm text-slate-700 shadow-sm"
                >
                  <option value="">All targets</option>
                  <option value="Job">Job</option>
                  <option value="Apprenticeship">Apprenticeship</option>
                  <option value="Further training">Further training</option>
                </select>

                <select
                  name="level"
                  defaultValue={level ?? ""}
                  className="rounded-2xl border border-slate-200 bg-white px-4 py-2 text-sm text-slate-700 shadow-sm"
                >
                  <option value="">All levels</option>
                  <option value="A0">A0</option>
                  <option value="A1">A1</option>
                  <option value="A2">A2</option>
                  <option value="B1">B1</option>
                  <option value="B2">B2</option>
                  <option value="C1">C1</option>
                </select>

                <select
                  name="time"
                  defaultValue={time ?? ""}
                  className="rounded-2xl border border-slate-200 bg-white px-4 py-2 text-sm text-slate-700 shadow-sm"
                >
                  <option value="">All timeframes</option>
                  <option value="0-3 months">0-3 months</option>
                  <option value="3-6 months">3-6 months</option>
                  <option value="6-12 months">6-12 months</option>
                </select>

                <button
                  type="submit"
                  className="inline-flex items-center justify-center rounded-full bg-slate-900 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-slate-800"
                >
                  Apply
                </button>

                <a
                  href="/admin/waitlist"
                  className="inline-flex items-center justify-center rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-sm hover:bg-slate-50"
                >
                  Reset
                </a>
              </form>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <a
              href="/api/admin/waitlist.csv"
              className="inline-flex items-center rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-sm hover:bg-slate-50"
            >
              Export CSV
            </a>
            <Link
              href="/"
              className="text-sm text-slate-500 hover:text-slate-900"
            >
              Back to site →
            </Link>
          </div>
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
