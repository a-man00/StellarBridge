import type { HTMLAttributes } from "react";

type Tone = "neutral" | "success" | "warning" | "error" | "info";

const tones: Record<Tone, string> = {
  neutral: "border-border bg-slate-50 text-muted dark:bg-slate-900",
  success: "border-success/40 bg-success/10 text-success",
  warning: "border-warning/40 bg-warning/10 text-warning",
  error: "border-error/40 bg-error/10 text-error",
  info: "border-accent/40 bg-accent/10 text-accent",
};

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  tone?: Tone;
}

export function Badge({ tone = "neutral", className = "", ...props }: BadgeProps) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 font-mono text-[10px] font-medium uppercase tracking-widest ${tones[tone]} ${className}`}
      {...props}
    />
  );
}
