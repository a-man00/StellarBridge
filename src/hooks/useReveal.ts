"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Reveals an element on scroll using IntersectionObserver. Returns a ref to
 * attach and a boolean once it has entered the viewport. Reveal-once by design.
 * Motion itself is CSS-driven (.reveal / .is-visible) and honors
 * prefers-reduced-motion via globals.css.
 */
export function useReveal<T extends HTMLElement = HTMLDivElement>(
  options?: IntersectionObserverInit,
) {
  const ref = useRef<T | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    // If IntersectionObserver is unavailable, reveal on the next tick so we
    // don't setState synchronously inside the effect body.
    if (typeof IntersectionObserver === "undefined") {
      const id = window.setTimeout(() => setVisible(true), 0);
      return () => window.clearTimeout(id);
    }

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setVisible(true);
            observer.unobserve(entry.target);
          }
        }
      },
      { threshold: 0.15, rootMargin: "0px 0px -40px 0px", ...options },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [options]);

  return { ref, visible };
}
