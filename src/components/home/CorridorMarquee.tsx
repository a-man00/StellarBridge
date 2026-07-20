import { CORRIDORS, corridorLabel } from "@/lib/corridors";

export function CorridorMarquee() {
  // Duplicate the list so the -50% translate loop is seamless.
  const items = [...CORRIDORS, ...CORRIDORS, ...CORRIDORS, ...CORRIDORS];

  return (
    <div className="marquee-mask overflow-hidden rounded-lg border border-border py-4">
      <div className="marquee-track">
        {items.map((c, i) => (
          <span
            key={`${c.from}-${c.to}-${i}`}
            className="mx-6 font-mono text-sm uppercase tracking-widest text-muted"
          >
            {corridorLabel(c)}
            <span className="mx-6 text-border">•</span>
          </span>
        ))}
      </div>
    </div>
  );
}
