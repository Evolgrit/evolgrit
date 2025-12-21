"use client";

import { CSSProperties, useEffect, useRef, useState } from "react";

type RevealProps = {
  children: React.ReactNode;
  className?: string;
  delayMs?: number;
};

export function Reveal({ children, className, delayMs = 0 }: RevealProps) {
  const ref = useRef<HTMLDivElement | null>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const listener = () => setPrefersReducedMotion(media.matches);
    listener();
    media.addEventListener("change", listener);
    return () => media.removeEventListener("change", listener);
  }, []);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(true);
            observer.disconnect();
          }
        });
      },
      { threshold: 0.15 }
    );

    observer.observe(node);

    return () => observer.disconnect();
  }, []);

  const durationMs = 800;
  const baseStyle: CSSProperties = prefersReducedMotion
    ? {}
    : {
        transition: `opacity ${durationMs}ms cubic-bezier(0.16, 1, 0.3, 1), transform ${durationMs}ms cubic-bezier(0.16, 1, 0.3, 1)`,
        transitionDelay: `${delayMs}ms`,
        transform: isVisible ? "translateY(0px)" : "translateY(10px)",
      };

  return (
    <div
      ref={ref}
      className={`will-change-transform ${
        isVisible || prefersReducedMotion ? "opacity-100" : "opacity-0"
      } ${className ?? ""}`}
      style={baseStyle}
    >
      {children}
    </div>
  );
}
