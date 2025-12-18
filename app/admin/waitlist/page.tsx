export const dynamic = "force-dynamic";
export const revalidate = 0;

import type { Metadata } from "next";
import Link from "next/link";
import { createClient } from "@supabase/supabase-js";
import { unstable_noStore as noStore } from "next/cache";
import { ContactedToggle } from "./ContactedToggle";
import { CopyEmailButton } from "./CopyEmailButton";

export const metadata: Metadata = {
  title: "Admin",
  robots: { index: false, follow: false },
};

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export default async function AdminWaitlistPage({
  searchParams,
}: {
  searchParams?: { target?: string; level?: string; time?: string; contacted?: string };
}) {
  noStore();
  const now = new Date();
  const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const sevenDaysAgo = new Date(now);
  sevenDaysAgo.setDate(now.getDate() - 7);

  const startOfTodayISO = startOfToday.toISOString();
  const sevenDaysAgoISO = sevenDaysAgo.toISOString();

  const [{ count: totalCount }, { count: todayCount }, { count: weekCount }] =
    await Promise.all([
      supabase
        .from("waitlist_signups")
        .select("*", { count: "exact", head: true }),
      supabase
        .from("waitlist_signups")
        .select("*", { count: "exact", head: true })
        .gte("created_at", startOfTodayISO),
      supabase
        .from("waitlist_signups")
        .select("*", { count: "exact", head: true })
        .gte("created_at", sevenDaysAgoISO),
    ]);
  let query = supabase
    .from("waitlist_signups")
    .select(
      "id, created_at, full_name, email, country, target, german_level, start_timeframe, whatsapp, contacted, contacted_at, followup_3d_sent_at"
    )
    .order("created_at", { ascending: false })
    .limit(500);

  const target = searchParams?.target?.trim();
  const level = searchParams?.level?.trim();
  const time = searchParams?.time?.trim();
  const contacted = searchParams?.contacted?.trim();
  console.log({ target, level, time });

  if (target) query = query.ilike("target", target);
  if (level) query = query.ilike("german_level", level);
  if (time) query = query.ilike("start_timeframe", time);
  if (contacted === "1") query = query.eq("contacted", true);
  if (contacted === "0") query = query.eq("contacted", false);

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
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-semibold">Admin · Waitlist signups</h1>
            <p className="mt-1 text-sm text-slate-600">
              Latest {data?.length ?? 0} entries
            </p>
            <div className="mt-4 sticky top-0 z-10 bg-slate-50/90 backdrop-blur border-b border-slate-100 py-3">
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

                <select
                  name="contacted"
                  defaultValue={searchParams?.contacted ?? ""}
                  className="rounded-2xl border border-slate-200 bg-white px-4 py-2 text-sm text-slate-700 shadow-sm"
                >
                  <option value="">All statuses</option>
                  <option value="0">Open</option>
                  <option value="1">Contacted</option>
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
          <div className="flex flex-wrap items-center gap-3">
            <div className="rounded-2xl border border-slate-200 bg-white px-4 py-2 shadow-sm">
              <p className="text-[11px] uppercase tracking-[0.18em] text-slate-400">Total</p>
              <p className="text-lg font-semibold text-slate-900">{totalCount ?? 0}</p>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white px-4 py-2 shadow-sm">
              <p className="text-[11px] uppercase tracking-[0.18em] text-slate-400">Today</p>
              <p className="text-lg font-semibold text-slate-900">{todayCount ?? 0}</p>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white px-4 py-2 shadow-sm">
              <p className="text-[11px] uppercase tracking-[0.18em] text-slate-400">Last 7 days</p>
              <p className="text-lg font-semibold text-slate-900">{weekCount ?? 0}</p>
            </div>

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
                <th className="p-3 text-left">Status</th>
                <th className="p-3 text-left whitespace-nowrap">Follow-up</th>
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
                  <td className="p-3 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      <span
                        className={[
                          "inline-flex items-center rounded-full px-2 py-[2px] text-[11px] border",
                          r.contacted
                            ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                            : "bg-slate-50 text-slate-600 border-slate-200",
                        ].join(" ")}
                      >
                        {r.contacted ? "Contacted" : "Open"}
                      </span>
                      <ContactedToggle id={r.id} initial={Boolean(r.contacted)} />
                    </div>
                  </td>
                  <td className="p-3 whitespace-nowrap">
                    {r.followup_3d_sent_at ? "Sent" : "—"}
                  </td>
                  <td className="p-3">{r.full_name}</td>
                  <td className="p-3">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs text-slate-700">{r.email}</span>
                      <CopyEmailButton email={r.email} />
                    </div>
                  </td>
                  <td className="p-3">{r.country ?? ""}</td>
                  <td className="p-3">{r.target ?? ""}</td>
                  <td className="p-3">{r.german_level ?? ""}</td>
                  <td className="p-3">{r.start_timeframe ?? ""}</td>
                  <td className="p-3">{r.whatsapp ?? ""}</td>
                </tr>
              ))}
              {(!data || data.length === 0) && (
                <tr>
                  <td className="p-6 text-slate-500" colSpan={10}>
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
