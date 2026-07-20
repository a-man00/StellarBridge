import type { HTMLAttributes } from "react";

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  /** Adds a subtle hover interaction (border + tiny translate). */
  interactive?: boolean;
}

export function Card({
  className = "",
  interactive = false,
  ...props
}: CardProps) {
  const hover = interactive
    ? "transition-all hover:-translate-y-0.5 hover:border-slate-300 dark:hover:border-slate-700"
    : "";
  return (
    <div
      className={`rounded-lg border border-border bg-card p-6 ${hover} ${className}`}
      {...props}
    />
  );
}

export function CardTitle({
  className = "",
  ...props
}: HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h2
      className={`font-display text-base font-semibold text-foreground ${className}`}
      {...props}
    />
  );
}

export function CardDescription({
  className = "",
  ...props
}: HTMLAttributes<HTMLParagraphElement>) {
  return <p className={`text-sm text-muted ${className}`} {...props} />;
}
