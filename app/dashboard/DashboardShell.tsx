"use client";

import Link from "next/link";
import Image from "next/image";
import { ReactNode, useMemo } from "react";
import { usePathname } from "next/navigation";

const navItems = [
  { label: "Overview", href: "/dashboard" },
  { label: "My journey", href: "/dashboard/journey" },
  { label: "Learning modules", href: "/dashboard/modules" },
  { label: "Mentor sessions", href: "/dashboard/mentors" },
  { label: "Jobs & opportunities", href: "/dashboard" },
  { label: "Documents", href: "/dashboard" },
  { label: "Profile", href: "/dashboard/profile" },
];

function isRouteActive(pathname: string, href: string) {
  if (href === "/dashboard") {
    return pathname === href;
  }
  return pathname.startsWith(href);
}

export default function DashboardShell({
  children,
  profileName,
  profileAvatar,
  initials,
}: {
  children: ReactNode;
  profileName: string;
  profileAvatar: string | null;
  initials: string;
}) {
  const pathname = usePathname();
  const navWithState = useMemo(
    () =>
      navItems.map((item) => ({
        ...item,
        active: pathname ? isRouteActive(pathname, item.href) : false,
      })),
    [pathname]
  );

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
              {navWithState.map((item) => (
                <Link
                  key={item.label}
                  href={item.href}
                  className={`group relative flex items-center justify-between rounded-2xl px-4 py-2 text-sm transition ${
                    item.active
                      ? "bg-slate-900/5 font-semibold text-slate-900"
                      : "text-slate-600 hover:bg-slate-900/5 hover:text-slate-900"
                  }`}
                >
                  <span className="relative z-10 flex-1">
                    {item.label}
                    {item.label === "Overview" && (
                      <span className="ml-2 rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.2em] text-emerald-700">
                        Live
                      </span>
                    )}
                  </span>
                  <span
                    className={`absolute left-1 top-1/2 h-6 w-1 -translate-y-1/2 rounded-full bg-slate-900 transition ${
                      item.active ? "opacity-100" : "opacity-0 group-hover:opacity-50"
                    }`}
                    aria-hidden="true"
                  />
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
                  {profileAvatar ? (
                    <Image
                      src={profileAvatar}
                      alt={profileName}
                      width={40}
                      height={40}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    initials
                  )}
                </span>
                <div className="text-left">
                  <p className="text-sm font-semibold text-slate-900">{profileName}</p>
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
