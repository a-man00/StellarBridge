import type { ReactNode } from "react";

interface SectionHeadingProps {
  eyebrow?: string;
  title: ReactNode;
  description?: ReactNode;
  className?: string;
}

/** Consistent section header: mono uppercase eyebrow + display title. */
export function SectionHeading({
  eyebrow,
  title,
  description,
  className = "",
}: SectionHeadingProps) {
  return (
    <div className={className}>
      {eyebrow && (
        <p className="mb-3 font-mono text-xs uppercase tracking-widest text-accent">
          {eyebrow}
        </p>
      )}
      <h2 className="font-display text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
        {title}
      </h2>
      {description && (
        <p className="mt-3 max-w-xl text-base text-muted">{description}</p>
      )}
    </div>
  );
}
