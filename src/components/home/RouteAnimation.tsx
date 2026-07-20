"use client";

/**
 * Sender → Stellar Network → Recipient route visualization.
 * Three nodes on a line with a dot travelling along it (CSS keyframes) and a
 * pulsing status dot on the Stellar node. Respects prefers-reduced-motion.
 */
export function RouteAnimation() {
  return (
    <div className="mt-4">
      <div className="relative flex items-center justify-between">
        {/* Connecting line */}
        <div className="absolute left-0 right-0 top-1/2 h-px -translate-y-1/2 bg-border" />

        {/* Travelling dot */}
        <div className="pointer-events-none absolute left-0 right-0 top-1/2 -translate-y-1/2">
          <span className="absolute h-2 w-2 animate-route-dot rounded-full bg-accent" />
        </div>

        {[
          { label: "Sender", stellar: false },
          { label: "Stellar", stellar: true },
          { label: "Recipient", stellar: false },
        ].map((node) => (
          <div
            key={node.label}
            className="relative z-10 flex flex-col items-center gap-2"
          >
            <span
              className={`flex h-3 w-3 items-center justify-center rounded-full border bg-background ${
                node.stellar ? "border-accent" : "border-border"
              }`}
            >
              {node.stellar && (
                <span className="h-1.5 w-1.5 animate-pulse-dot rounded-full bg-accent" />
              )}
            </span>
            <span className="font-mono text-[10px] uppercase tracking-widest text-muted">
              {node.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
