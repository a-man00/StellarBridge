"use client";

import type { ElementType, ReactNode } from "react";
import { useReveal } from "@/hooks/useReveal";

interface RevealProps {
  children: ReactNode;
  className?: string;
  /** Optional stagger delay in ms. */
  delay?: number;
  as?: ElementType;
}

/**
 * Wraps content in a scroll-reveal container. Fade + small translate on entry,
 * driven by CSS (.reveal / .is-visible) and disabled under prefers-reduced-motion.
 */
export function Reveal({
  children,
  className = "",
  delay = 0,
  as: Tag = "div",
}: RevealProps) {
  const { ref, visible } = useReveal<HTMLElement>();

  return (
    <Tag
      ref={ref}
      className={`reveal ${visible ? "is-visible" : ""} ${className}`}
      style={delay ? { transitionDelay: `${delay}ms` } : undefined}
    >
      {children}
    </Tag>
  );
}
