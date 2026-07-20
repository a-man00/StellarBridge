const STATS = [
  { value: "~5s", label: "Finality" },
  { value: "~0.00001 XLM", label: "Network fee" },
  { value: "Testnet", label: "Only — no real funds" },
  { value: "Open", label: "Source" },
];

export function StatsStrip() {
  return (
    <div className="grid grid-cols-2 divide-x divide-y divide-border overflow-hidden rounded-lg border border-border sm:grid-cols-4 sm:divide-y-0">
      {STATS.map((s) => (
        <div key={s.label} className="px-4 py-5">
          <p className="font-mono text-lg font-medium text-foreground">
            {s.value}
          </p>
          <p className="mt-1 font-mono text-[10px] uppercase tracking-widest text-muted">
            {s.label}
          </p>
        </div>
      ))}
    </div>
  );
}
