export const dynamic = "force-dynamic";
export const revalidate = 0;

import type { Metadata } from "next";
import Link from "next/link";
import { createClient } from "@supabase/supabase-js";
import { unstable_noStore as noStore } from "next/cache";
import { CopyEmailButton } from "../waitlist/CopyEmailButton";

export const metadata: Metadata = {
  title: "Admin",
  robots: { index: false, follow: false },
};

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export default async function AdminEmployersPage() {
  noStore();
  const { data, error } = await supabase
    .from("employer_leads")
    .select("created_at, company, role_types, email, email_confirmed_at, followup_2d_sent_at")
    .order("created_at", { ascending: false })
    .limit(500);

  if (error) {
    return (
      <main className="min-h-screen bg-slate-50 p-6">
        <div className="max-w-6xl mx-auto rounded-2xl border border-slate-200 bg-white p-6">
          <h1 className="text-xl font-semibold text-slate-900">Admin · Employer leads</h1>
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
            <h1 className="text-2xl font-semibold">Admin · Employer leads</h1>
            <p className="mt-1 text-sm text-slate-600">
              Latest {data?.length ?? 0} entries
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <a
              href="/api/admin/employer-leads.csv"
              className="inline-flex items-center rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-sm hover:bg-slate-50"
            >
              Export CSV
            </a>
            <Link href="/admin/waitlist" className="text-sm text-slate-500 hover:text-slate-900">
              Waitlist →
            </Link>
            <Link href="/" className="text-sm text-slate-500 hover:text-slate-900">
              Back to site →
            </Link>
          </div>
        </div>

        <div className="mt-6 overflow-auto rounded-2xl border border-slate-200 bg-white">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 text-slate-600">
              <tr>
                <th className="p-3 text-left whitespace-nowrap">Created</th>
                <th className="p-3 text-left">Company</th>
                <th className="p-3 text-left">Role types</th>
                <th className="p-3 text-left">Email</th>
                <th className="p-3 text-left whitespace-nowrap">Confirmed</th>
                <th className="p-3 text-left whitespace-nowrap">Follow-up</th>
              </tr>
            </thead>
            <tbody>
              {(data ?? []).map((r, i) => (
                <tr key={i} className="border-t border-slate-100">
                  <td className="p-3 whitespace-nowrap">{new Date(r.created_at).toLocaleString()}</td>
                  <td className="p-3">{r.company}</td>
                  <td className="p-3">{r.role_types}</td>
                  <td className="p-3">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs text-slate-700">{r.email}</span>
                      <CopyEmailButton email={r.email} />
                    </div>
                  </td>
                  <td className="p-3 whitespace-nowrap">
                    {r.email_confirmed_at ? "Sent" : "—"}
                  </td>
                  <td className="p-3 whitespace-nowrap">
                    {r.followup_2d_sent_at ? "Sent" : "—"}
                  </td>
                </tr>
              ))}
              {(!data || data.length === 0) && (
                <tr>
                  <td className="p-6 text-slate-500" colSpan={6}>
                    No employer leads yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <p className="mt-4 text-xs text-slate-500">
          Tip: Use browser search (Cmd+F) to find a company or email quickly.
        </p>
      </div>
    </main>
  );
}
