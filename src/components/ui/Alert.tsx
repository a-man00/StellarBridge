import type { HTMLAttributes, ReactNode } from "react";

type Tone = "neutral" | "success" | "warning" | "error" | "info";

const tones: Record<Tone, string> = {
  neutral: "border-border bg-slate-50 text-foreground dark:bg-slate-900",
  success: "border-success/40 bg-success/10 text-success",
  warning: "border-warning/40 bg-warning/10 text-warning",
  error: "border-error/40 bg-error/10 text-error",
  info: "border-accent/40 bg-accent/10 text-accent",
};

interface AlertProps extends HTMLAttributes<HTMLDivElement> {
  tone?: Tone;
  title?: string;
  children?: ReactNode;
}

export function Alert({
  tone = "neutral",
  title,
  className = "",
  children,
  ...props
}: AlertProps) {
  return (
    <div
      className={`rounded-lg border px-4 py-3 text-sm ${tones[tone]} ${className}`}
      {...props}
    >
      {title && <p className="font-medium">{title}</p>}
      {children && <div className={title ? "mt-1" : ""}>{children}</div>}
    </div>
  );
}
