"use client";

import { ReactNode } from "react";
import { usePathname } from "next/navigation";

export function MarketingPageShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  return (
    <div key={pathname} className="animate-marketing-fade">
      {children}
    </div>
  );
}
