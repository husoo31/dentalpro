"use client";
import { useEffect, useRef, useState, type ElementType, type ReactNode } from "react";

interface RevealProps {
  children: ReactNode;
  className?: string;
  /** Stagger offset in ms — applied as transition-delay, not setTimeout, so it costs nothing until it's actually visible. */
  delay?: number;
  as?: ElementType;
  /** "scroll" (default) observes the viewport; "mount" reveals right away — use
   * for above-the-fold content (hero) so it never has a flash-of-hidden frame
   * waiting on an IntersectionObserver callback that's already trivially true. */
  trigger?: "scroll" | "mount";
  [key: string]: unknown;
}

/**
 * One-shot reveal: adds `active` either on mount or once scrolled into view
 * (see `trigger`), then stops watching. Pairs with the `.reveal`/`.reveal.active`
 * pair in globals.css, which already no-ops under prefers-reduced-motion.
 */
export default function Reveal({ children, className = "", delay = 0, as, trigger = "scroll", ...rest }: RevealProps) {
  const Tag = (as || "div") as ElementType;
  const ref = useRef<HTMLElement | null>(null);
  const [active, setActive] = useState(false);

  useEffect(() => {
    if (trigger === "mount") {
      const frame = requestAnimationFrame(() => setActive(true));
      return () => cancelAnimationFrame(frame);
    }
    const node = ref.current;
    if (!node) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setActive(true);
          observer.unobserve(node);
        }
      },
      { threshold: 0.15, rootMargin: "0px 0px -10% 0px" }
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, [trigger]);

  return (
    <Tag
      ref={ref}
      className={`reveal${active ? " active" : ""}${className ? ` ${className}` : ""}`}
      style={delay ? { transitionDelay: `${delay}ms` } : undefined}
      {...rest}
    >
      {children}
    </Tag>
  );
}
