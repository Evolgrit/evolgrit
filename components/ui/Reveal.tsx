"use client";

import {
  Children,
  CSSProperties,
  ReactElement,
  ReactNode,
  cloneElement,
  isValidElement,
  useEffect,
  useRef,
  useState,
} from "react";

type RevealProps = {
  children: ReactNode;
  className?: string;
  delayMs?: number;
  durationMs?: number;
  distance?: number;
  once?: boolean;
  threshold?: number;
  staggerChildren?: boolean;
  staggerMs?: number;
};

export function Reveal({
  children,
  className,
  delayMs = 0,
  durationMs = 260,
  distance = 12,
  once = true,
  threshold = 0.08,
  staggerChildren = false,
  staggerMs = 120,
}: RevealProps) {
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
            if (once) {
              observer.unobserve(entry.target);
            }
          } else if (!once) {
            setIsVisible(false);
          }
        });
      },
      { threshold }
    );

    observer.observe(node);

    return () => observer.disconnect();
  }, [once, threshold]);

  const transitionDelay = prefersReducedMotion
    ? undefined
    : `calc(${delayMs}ms + var(--reveal-stagger-index, 0) * ${staggerMs}ms)`;

  const baseStyle: CSSProperties = prefersReducedMotion
    ? { transition: "opacity 150ms linear" }
    : {
        transition: `opacity ${durationMs}ms cubic-bezier(0.22, 1, 0.36, 1), transform ${durationMs}ms cubic-bezier(0.22, 1, 0.36, 1), filter ${durationMs}ms cubic-bezier(0.22, 1, 0.36, 1)`,
        transitionDelay,
        transform: isVisible ? "translateY(0px)" : `translateY(${distance}px)`,
        filter: isVisible ? "blur(0px)" : "blur(6px)",
      };

  const processedChildren =
    staggerChildren && !prefersReducedMotion
      ? Children.map(children, (child, index) => {
          if (!isValidElement(child)) return child;
          const el = child as ReactElement<{ style?: CSSProperties }>;
          const existingStyle = el.props.style ?? {};
          const styleWithVar: CSSProperties & {
            "--reveal-stagger-index"?: number;
          } = {
            ...existingStyle,
            "--reveal-stagger-index": index,
          };
          return cloneElement(el, {
            style: styleWithVar,
          });
        })
      : children;

  return (
    <div
      ref={ref}
      className={`will-change-transform ${
        isVisible || prefersReducedMotion ? "opacity-100" : "opacity-0"
      } ${className ?? ""}`}
      style={baseStyle}
    >
      {processedChildren}
    </div>
  );
}
