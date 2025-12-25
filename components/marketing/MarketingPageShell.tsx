"use client";

import { ReactNode, useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { motion } from "@/lib/ui/motion";

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
    <div
      key={renderPath}
      style={{
        animationDuration: `${motion.page.fadeMs}ms`,
        animationTimingFunction: motion.easing.smooth,
        animationFillMode: "both",
        animationName: "marketing-fade",
      }}
    >
      {children}
    </div>
  );
}
