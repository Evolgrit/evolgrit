"use client";

import { useState } from "react";
import Link from "next/link";

type MarketingTopbarProps = {
  loggedIn?: boolean;
  onLogout?: () => void | Promise<void>;
};

const navLinks = [
  { label: "Product", href: "#product" },
  { label: "Learner journey (Demo)", href: "/learner-journey" },
  { label: "How it works", href: "/how-it-works" },
  { label: "For employers", href: "/for-employers" },
];

export default function MarketingTopbar({
  loggedIn = false,
  onLogout,
}: MarketingTopbarProps) {
  const [open, setOpen] = useState(false);
  const container = "mx-auto w-full max-w-[1280px] px-4 sm:px-6 lg:px-8";

  const scrollToTop = () => {
    if (typeof window !== "undefined") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const closeMenu = () => setOpen(false);

  const handleLogoutClick = async () => {
    if (onLogout) {
      await onLogout();
      setOpen(false);
    }
  };

  return (
    <header className="sticky top-0 z-[120] border-b border-slate-200/50 bg-white/80 backdrop-blur">
      <div className={`${container} flex flex-col py-4`}>
        <div className="flex items-center justify-between gap-4">
          <button
            type="button"
            onClick={scrollToTop}
            className="flex items-center gap-2"
            aria-label="Scroll to top"
          >
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-slate-900 text-sm font-semibold text-slate-50 shadow-lg shadow-slate-900/30">
              E
            </div>
            <div className="text-left">
              <div className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-900">
                Evolgrit
              </div>
              <div className="text-[11px] text-slate-500">Language · Jobs · AI</div>
            </div>
          </button>

          <div className="hidden items-center gap-4 text-sm sm:flex">
            <div className="flex items-center gap-2 pl-3 text-xs text-slate-400">
              EN
            </div>
            {navLinks.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className="text-slate-500 transition hover:text-slate-900"
              >
                {item.label}
              </Link>
            ))}
            {loggedIn ? (
              <button
                type="button"
                onClick={handleLogoutClick}
                className="rounded-full border border-slate-200 bg-white/80 px-3 py-1.5 text-sm text-slate-700 shadow-sm hover:bg-white"
              >
                Log out
              </button>
            ) : (
              <Link
                href="/login"
                className="rounded-full border border-slate-200 bg-white/80 px-3 py-1.5 text-sm text-slate-700 shadow-sm hover:bg-white"
              >
                Log in
              </Link>
            )}
            <Link
              href="/waitlist"
              className="rounded-full bg-blue-600 px-4 py-1.5 text-sm font-medium text-white shadow-md shadow-blue-500/40 hover:bg-blue-700"
            >
              Join learner waitlist
            </Link>
          </div>

          <button
            type="button"
            className="inline-flex items-center justify-center rounded-full border border-slate-200 bg-white/80 px-3 py-2 text-xs text-slate-700 shadow-sm hover:bg-white sm:hidden"
            onClick={() => setOpen((value) => !value)}
            aria-label="Toggle navigation"
          >
            <span className="flex flex-col gap-[3px]">
              <span className="h-[2px] w-4 rounded-full bg-slate-700" />
              <span className="h-[2px] w-4 rounded-full bg-slate-700" />
              <span className="h-[2px] w-4 rounded-full bg-slate-700" />
            </span>
          </button>
        </div>

        {open && (
          <div className="mt-4 space-y-3 rounded-2xl border border-slate-200 bg-white/95 p-4 text-sm text-slate-700 sm:hidden">
            <div className="flex items-center gap-2 text-xs text-slate-400">
              Language
              <span className="rounded-full bg-slate-100 px-2 py-0.5 text-slate-600">
                EN
              </span>
            </div>
            {navLinks.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                onClick={closeMenu}
                className="block rounded-md px-2 py-1 hover:bg-slate-50"
              >
                {item.label}
              </Link>
            ))}
            <div className="flex gap-2 pt-2">
              {loggedIn ? (
                <button
                  type="button"
                  onClick={handleLogoutClick}
                  className="flex-1 rounded-full border border-slate-200 bg-white px-3 py-1.5 text-center text-xs text-slate-700 shadow-sm"
                >
                  Log out
                </button>
              ) : (
                <Link
                  href="/login"
                  onClick={closeMenu}
                  className="flex-1 rounded-full border border-slate-200 bg-white px-3 py-1.5 text-center text-xs text-slate-700 shadow-sm"
                >
                  Log in
                </Link>
              )}
              <Link
                href="/waitlist"
                onClick={closeMenu}
                className="flex-1 rounded-full bg-blue-600 px-3 py-1.5 text-center text-xs font-medium text-white shadow-md shadow-blue-500/40"
              >
                Join learner waitlist
              </Link>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
