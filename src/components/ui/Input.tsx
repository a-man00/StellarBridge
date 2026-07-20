import { forwardRef } from "react";
import type { InputHTMLAttributes } from "react";

export const Input = forwardRef<HTMLInputElement, InputHTMLAttributes<HTMLInputElement>>(
  function Input({ className = "", ...props }, ref) {
    return (
      <input
        ref={ref}
        className={`w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted/60 transition-colors focus:border-accent focus:outline-none focus-visible:ring-2 focus-visible:ring-accent/30 disabled:opacity-50 ${className}`}
        {...props}
      />
    );
  },
);
