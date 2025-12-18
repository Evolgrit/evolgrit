import type { Metadata } from "next";
import Link from "next/link";
import { createClient } from "@supabase/supabase-js";
import { CopyEmailButton } from "./waitlist/CopyEmailButton";
import { CopyAllEmailsButton } from "./CopyAllEmailsButton";

export const metadata: Metadata = {
  title: "Admin",
  robots: { index: false, follow: false },
};

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export default async function AdminHomePage() {
  const now = new Date();
  const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate()).toISOString();

  const [
    { count: learnersTotal },
    { count: employersTotal },
    { count: learnersToday },
    { count: employersToday },
  ] = await Promise.all([
    supabase.from("waitlist_signups").select("*", { count: "exact", head: true }),
    supabase.from("employer_leads").select("*", { count: "exact", head: true }),
    supabase.from("waitlist_signups").select("*", { count: "exact", head: true }).gte("created_at", startOfToday),
    supabase.from("employer_leads").select("*", { count: "exact", head: true }).gte("created_at", startOfToday),
  ]);

  const [{ data: learners }, { data: employers }] = await Promise.all([
    supabase
      .from("waitlist_signups")
      .select("created_at, full_name, email, country, target, german_level, start_timeframe, contacted")
      .order("created_at", { ascending: false })
      .limit(50),
    supabase
      .from("employer_leads")
      .select("created_at, company, role_types, email")
      .order("created_at", { ascending: false })
      .limit(50),
  ]);
  const learnerEmails = (learners ?? []).map((r) => r.email);
  const employerEmails = (employers ?? []).map((r) => r.email);

  return (
    <main className="min-h-screen bg-slate-50 p-6 text-slate-900">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl font-semibold">Admin</h1>
            <p className="mt-1 text-sm text-slate-600">
              Learners + Employers overview (latest 50 each)
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <CopyAllEmailsButton label="Copy learner emails" emails={learnerEmails} />
            <CopyAllEmailsButton label="Copy employer emails" emails={employerEmails} />
            <Link href="/admin/waitlist" className="text-sm text-slate-600 hover:text-slate-900">Waitlist →</Link>
            <Link href="/admin/employers" className="text-sm text-slate-600 hover:text-slate-900">Employers →</Link>
            <Link href="/" className="text-sm text-slate-600 hover:text-slate-900">Back to site →</Link>
          </div>
        </div>
        <div className="mt-6 grid grid-cols-2 lg:grid-cols-4 gap-3">
          <div className="rounded-2xl border border-slate-200 bg-white px-4 py-3 shadow-sm">
            <p className="text-[11px] uppercase tracking-[0.18em] text-slate-400">Learners</p>
            <p className="mt-1 text-xl font-semibold text-slate-900">{learnersTotal ?? 0}</p>
            <p className="mt-0.5 text-xs text-slate-500">total</p>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-white px-4 py-3 shadow-sm">
            <p className="text-[11px] uppercase tracking-[0.18em] text-slate-400">Learners</p>
            <p className="mt-1 text-xl font-semibold text-slate-900">{learnersToday ?? 0}</p>
            <p className="mt-0.5 text-xs text-slate-500">today</p>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-white px-4 py-3 shadow-sm">
            <p className="text-[11px] uppercase tracking-[0.18em] text-slate-400">Employers</p>
            <p className="mt-1 text-xl font-semibold text-slate-900">{employersTotal ?? 0}</p>
            <p className="mt-0.5 text-xs text-slate-500">total</p>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-white px-4 py-3 shadow-sm">
            <p className="text-[11px] uppercase tracking-[0.18em] text-slate-400">Employers</p>
            <p className="mt-1 text-xl font-semibold text-slate-900">{employersToday ?? 0}</p>
            <p className="mt-0.5 text-xs text-slate-500">today</p>
          </div>
        </div>

        <div className="mt-8 grid gap-4 sm:grid-cols-2">
          <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
            <p className="text-[11px] uppercase tracking-[0.18em] text-slate-400">Learners</p>
            <p className="mt-1 text-lg font-semibold text-slate-900">{learners?.length ?? 0} latest entries</p>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
            <p className="text-[11px] uppercase tracking-[0.18em] text-slate-400">Employers</p>
            <p className="mt-1 text-lg font-semibold text-slate-900">{employers?.length ?? 0} latest leads</p>
          </div>
        </div>

        {/* Learners */}
        <div className="mt-8">
          <div className="flex items-baseline justify-between">
            <h2 className="text-lg font-semibold">Learners (Waitlist)</h2>
            <Link href="/admin/waitlist" className="text-sm text-blue-600 hover:text-blue-700">Open full list →</Link>
          </div>
          <div className="mt-3 overflow-auto rounded-2xl border border-slate-200 bg-white">
            <table className="w-full text-sm">
              <thead className="bg-slate-50 text-slate-600">
                <tr>
                  <th className="p-3 text-left">Created</th>
                  <th className="p-3 text-left">Name</th>
                  <th className="p-3 text-left">Email</th>
                  <th className="p-3 text-left">Target</th>
                  <th className="p-3 text-left">Level</th>
                  <th className="p-3 text-left">Timeframe</th>
                  <th className="p-3 text-left">Status</th>
                </tr>
              </thead>
              <tbody>
                {(learners ?? []).map((r, i) => (
                  <tr key={i} className="border-t border-slate-100">
                    <td className="p-3 whitespace-nowrap">{new Date(r.created_at).toLocaleString()}</td>
                    <td className="p-3">{r.full_name}</td>
                  <td className="p-3">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs text-slate-700">{r.email}</span>
                      <CopyEmailButton email={r.email} />
                    </div>
                  </td>
                    <td className="p-3">{r.target ?? ""}</td>
                    <td className="p-3">{r.german_level ?? ""}</td>
                    <td className="p-3">{r.start_timeframe ?? ""}</td>
                    <td className="p-3">{r.contacted ? "Contacted" : "Open"}</td>
                  </tr>
                ))}
                {(!learners || learners.length === 0) && (
                  <tr><td className="p-6 text-slate-500" colSpan={7}>No learner signups yet.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Employers */}
        <div className="mt-10">
          <div className="flex items-baseline justify-between">
            <h2 className="text-lg font-semibold">Employers (Leads)</h2>
            <Link href="/admin/employers" className="text-sm text-blue-600 hover:text-blue-700">Open full list →</Link>
          </div>
          <div className="mt-3 overflow-auto rounded-2xl border border-slate-200 bg-white">
            <table className="w-full text-sm">
              <thead className="bg-slate-50 text-slate-600">
                <tr>
                  <th className="p-3 text-left">Created</th>
                  <th className="p-3 text-left">Company</th>
                  <th className="p-3 text-left">Role types</th>
                  <th className="p-3 text-left">Email</th>
                </tr>
              </thead>
              <tbody>
                {(employers ?? []).map((r, i) => (
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
                  </tr>
                ))}
                {(!employers || employers.length === 0) && (
                  <tr><td className="p-6 text-slate-500" colSpan={4}>No employer leads yet.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </main>
  );
}
