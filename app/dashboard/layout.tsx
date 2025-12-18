import { ReactNode } from "react";
import Link from "next/link";
import Image from "next/image";
import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase/server";

const navItems = [
  { label: "Overview", href: "/dashboard" },
  { label: "My journey", href: "/dashboard/journey" },
  { label: "Learning modules", href: "/dashboard/modules" },
  { label: "Mentor sessions", href: "/dashboard/mentors" },
  { label: "Jobs & opportunities", href: "/dashboard" },
  { label: "Documents", href: "/dashboard" },
  { label: "Profile", href: "/dashboard/profile" },
];

function getInitials(name?: string | null) {
  if (!name) return "";
  const parts = name.trim().split(" ");
  const [first, second] = parts;
  if (first && second) return `${first[0]}${second[0]}`.toUpperCase();
  return first?.slice(0, 2).toUpperCase() ?? "";
}

export default async function DashboardLayout({
  children,
}: {
  children: ReactNode;
}) {
  const supabase = await createSupabaseServerClient();
  const { data } = await supabase.auth.getUser();

  if (!data.user) redirect("/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("full_name, avatar_url")
    .eq("id", data.user.id)
    .single();

  const initials = getInitials(profile?.full_name) || "EG";

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="mx-auto flex min-h-screen max-w-7xl gap-6 px-4 py-6 sm:px-6 lg:px-8">
        <aside className="hidden w-64 flex-col justify-between rounded-3xl border border-slate-200 bg-white p-6 shadow-sm lg:flex">
          <div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
                Evolgrit
              </p>
              <h1 className="mt-1 text-xl font-semibold text-slate-900">Learner hub</h1>
              <p className="mt-1 text-sm text-slate-500">
                AI-powered batches for life & work in Germany.
              </p>
            </div>

            <nav className="mt-8 space-y-1">
              {navItems.map((item) => (
                <Link
                  key={item.label}
                  href={item.href}
                  className="flex items-center justify-between rounded-2xl px-3 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-100 hover:text-slate-900"
                >
                  {item.label}
                  {item.label === "Overview" && (
                    <span className="text-[10px] uppercase tracking-[0.2em] text-emerald-600">
                      Live
                    </span>
                  )}
                </Link>
              ))}
            </nav>
          </div>

          <div className="rounded-2xl border border-slate-100 bg-slate-900/90 p-4 text-slate-50">
            <p className="text-xs uppercase tracking-[0.22em] text-slate-200">
              Private beta 2026
            </p>
            <p className="mt-1 text-sm text-slate-100">
              Weekly mentor calls · AI coach · cultural readiness.
            </p>
          </div>
        </aside>

        <main className="flex-1">
          <div className="rounded-3xl border border-slate-200 bg-white px-5 py-4 shadow-sm">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <p className="text-xs uppercase tracking-[0.18em] text-slate-400">
                  Batch Alpha · Week 3
                </p>
                <h2 className="mt-1 text-xl font-semibold text-slate-900">
                  Dashboard overview
                </h2>
              </div>

              <Link
                href="/dashboard/profile"
                className="inline-flex items-center gap-3 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-900 shadow-sm hover:border-slate-300"
              >
                <span className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-full border border-slate-200 bg-slate-100 text-xs font-semibold text-slate-700">
                  {profile?.avatar_url ? (
                    <Image
                      src={profile.avatar_url}
                      alt={profile.full_name ?? "Profile avatar"}
                      width={40}
                      height={40}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    initials
                  )}
                </span>
                <div className="text-left">
                  <p className="text-sm font-semibold text-slate-900">
                    {profile?.full_name ?? "Learner"}
                  </p>
                  <p className="text-xs text-blue-600">Edit profile →</p>
                </div>
              </Link>
            </div>
          </div>

          <div className="mt-6">{children}</div>
        </main>
      </div>
    </div>
  );
}
