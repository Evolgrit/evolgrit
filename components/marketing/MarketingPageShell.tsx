"use client";

import { ReactNode, useEffect, useState } from "react";
import { usePathname } from "next/navigation";

export function MarketingPageShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const [renderPath, setRenderPath] = useState(pathname);

  useEffect(() => {
    let frame: number;
    if (pathname !== renderPath) {
      frame = window.requestAnimationFrame(() => setRenderPath(pathname));
    }
    return () => {
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, [pathname, renderPath]);

  return (
    <div key={renderPath} className="animate-marketing-fade">
      {children}
    </div>
  );
}
