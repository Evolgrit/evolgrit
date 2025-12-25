"use client";

import { ReactNode, useEffect, useMemo, useState } from "react";
import { usePathname } from "next/navigation";
import { motion } from "@/lib/ui/motion";

export function MarketingPageShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const [renderPath, setRenderPath] = useState(pathname);
  const marketingPaths = useMemo(
    () =>
      new Set([
        "/",
        "/learner-journey",
        "/how-it-works",
        "/for-employers",
        "/waitlist",
        "/employers",
      ]),
    []
  );

  useEffect(() => {
    let frame: number;
    if (pathname !== renderPath) {
      frame = window.requestAnimationFrame(() => setRenderPath(pathname));
    }
    return () => {
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, [pathname, renderPath]);

  useEffect(() => {
    if (!marketingPaths.has(pathname)) return;
    const hash = window.location.hash;
    if (hash) {
      window.requestAnimationFrame(() => {
        const targetId = hash.replace("#", "");
        const el = document.getElementById(targetId);
        if (el) {
          el.scrollIntoView({ behavior: "smooth", block: "start" });
        }
      });
      return;
    }
    window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
  }, [pathname, marketingPaths]);

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
