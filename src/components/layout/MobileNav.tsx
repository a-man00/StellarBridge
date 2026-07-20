"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { NAV_LINKS } from "@/lib/constants";

export function MobileNav() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <div className="sm:hidden">
      <button
        type="button"
        aria-label="Toggle navigation menu"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
        className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-border text-muted transition-colors hover:text-foreground"
      >
        <svg
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          aria-hidden="true"
        >
          {open ? (
            <path d="M18 6 6 18M6 6l12 12" />
          ) : (
            <path d="M4 7h16M4 12h16M4 17h16" />
          )}
        </svg>
      </button>

      {open && (
        <div className="absolute inset-x-0 top-full z-40 border-b border-border bg-background">
          <nav className="mx-auto flex max-w-6xl flex-col gap-1 px-4 py-3">
            {NAV_LINKS.map((link) => {
              const active = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className={`rounded-lg px-3 py-2 text-sm transition-colors ${
                    active
                      ? "bg-slate-100 font-medium text-foreground dark:bg-slate-900"
                      : "text-muted hover:text-foreground"
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>
        </div>
      )}
    </div>
  );
}
