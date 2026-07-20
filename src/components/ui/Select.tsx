import { forwardRef } from "react";
import type { SelectHTMLAttributes } from "react";

export const Select = forwardRef<HTMLSelectElement, SelectHTMLAttributes<HTMLSelectElement>>(
  function Select({ className = "", children, ...props }, ref) {
    return (
      <select
        ref={ref}
        className={`w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground transition-colors focus:border-accent focus:outline-none focus-visible:ring-2 focus-visible:ring-accent/30 disabled:opacity-50 ${className}`}
        {...props}
      >
        {children}
      </select>
    );
  },
);
