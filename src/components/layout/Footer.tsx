const LINKS = [
  { href: "https://www.stellar.org/", label: "Stellar" },
  { href: "https://www.freighter.app/", label: "Freighter" },
  { href: "https://horizon-testnet.stellar.org/", label: "Horizon Testnet" },
  { href: "https://stellar.expert/explorer/testnet", label: "Stellar Expert" },
];

export function Footer() {
  return (
    <footer className="border-t border-border">
      <div className="mx-auto flex max-w-6xl flex-col gap-4 px-4 py-6 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="font-display text-sm font-semibold text-foreground">
            StellarBridge
          </p>
          <p className="mt-0.5 font-mono text-xs text-muted">
            Built for the Stellar Level 1 Hackathon · Testnet only — no real funds
          </p>
        </div>
        <nav className="flex flex-wrap gap-x-4 gap-y-1">
          {LINKS.map((l) => (
            <a
              key={l.href}
              href={l.href}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-muted underline-offset-4 transition-colors hover:text-accent hover:underline"
            >
              {l.label}
            </a>
          ))}
        </nav>
      </div>
    </footer>
  );
}
