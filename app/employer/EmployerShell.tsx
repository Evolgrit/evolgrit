"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { createSupabaseBrowserClient } from "@/lib/supabase/browser";

const navItems = [
  { label: "Overview", href: "/employer" },
  { label: "Matches", href: "/employer/matches" },
  { label: "Pilots", href: "/employer/pilots" },
  { label: "Company profile", href: "/employer/profile" },
  { label: "Settings", href: "/employer/settings" },
];

function isActive(pathname: string, href: string) {
  if (href === "/employer") return pathname === href;
  return pathname.startsWith(href);
}

export default function EmployerShell({
  children,
  profileName,
  profileAvatar,
  initials,
}: {
  children: React.ReactNode;
  profileName: string;
  profileAvatar: string | null;
  initials: string;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const supabase = createSupabaseBrowserClient();
  const nav = useMemo(
    () =>
      navItems.map((item) => ({
        ...item,
        active: pathname ? isActive(pathname, item.href) : false,
      })),
    [pathname]
  );

  async function handleLogout() {
    await supabase.auth.signOut();
    router.push("/login?role=employer");
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/90 px-4 py-3 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-400">
              Evolgrit
            </p>
            <p className="text-base font-semibold text-slate-900">Employer hub</p>
          </div>
          <ProfileMenu
            profileName={profileName}
            profileAvatar={profileAvatar}
            initials={initials}
            onLogout={handleLogout}
          />
        </div>
        <nav className="mt-3 flex gap-2 overflow-x-auto text-sm text-slate-600 lg:hidden">
          {nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`rounded-full px-3 py-1.5 ${
                item.active ? "bg-slate-900/5 text-slate-900" : "hover:text-slate-900"
              }`}
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </header>

      <div className="mx-auto flex min-h-[calc(100vh-64px)] max-w-6xl gap-6 px-4 py-6">
        <aside className="hidden w-64 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm lg:block">
          <nav className="space-y-1">
            {nav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`block rounded-2xl px-4 py-2 text-sm ${
                  item.active
                    ? "bg-slate-900/5 font-semibold text-slate-900"
                    : "text-slate-600 hover:bg-slate-900/5 hover:text-slate-900"
                }`}
              >
                {item.label}
              </Link>
            ))}
          </nav>
          <button
            type="button"
            onClick={handleLogout}
            className="mt-6 text-sm font-medium text-slate-500 hover:text-slate-900"
          >
            Log out
          </button>
        </aside>
        <main className="flex-1">{children}</main>
      </div>
    </div>
  );
}

function ProfileMenu({
  profileName,
  profileAvatar,
  initials,
  onLogout,
}: {
  profileName: string;
  profileAvatar: string | null;
  initials: string;
  onLogout: () => Promise<void>;
}) {
  const [open, setOpen] = useState(false);
  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-1.5 text-sm font-medium text-slate-900 shadow-sm hover:border-slate-300"
      >
        <span className="flex h-9 w-9 items-center justify-center overflow-hidden rounded-full border border-slate-200 bg-slate-100 text-xs font-semibold text-slate-700">
          {profileAvatar ? (
            <Image src={profileAvatar} alt={profileName} width={36} height={36} className="h-full w-full object-cover" />
          ) : (
            initials
          )}
        </span>
        <div className="text-left">
          <p className="text-sm font-semibold text-slate-900">{profileName}</p>
          <p className="text-[11px] text-blue-600">{open ? "Close" : "Options"}</p>
        </div>
      </button>
      {open && (
        <div className="absolute right-0 z-50 mt-2 w-48 rounded-2xl border border-slate-200 bg-white p-2 text-sm shadow-xl">
          <Link
            href="/employer/profile"
            className="block rounded-xl px-3 py-2 text-slate-700 hover:bg-slate-50"
            onClick={() => setOpen(false)}
          >
            Company profile
          </Link>
          <button
            type="button"
            onClick={async () => {
              setOpen(false);
              await onLogout();
            }}
            className="block w-full rounded-xl px-3 py-2 text-left text-slate-700 hover:bg-slate-50"
          >
            Log out
          </button>
        </div>
      )}
    </div>
  );
}
