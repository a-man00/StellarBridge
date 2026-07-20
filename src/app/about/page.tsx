import Link from "next/link";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";

const CHECKLIST = [
  "Freighter wallet connect & disconnect",
  "Stellar testnet only",
  "Fetch & display XLM balance",
  "Friendbot funding for unfunded accounts",
  "Send an XLM payment with optional memo",
  "Pending / success / failure feedback",
  "Transaction hash + explorer link",
  "Transaction history from Horizon",
  "Light & dark mode",
];

const TECH = [
  "Next.js (App Router)",
  "React 19 + TypeScript (strict)",
  "Tailwind CSS v4",
  "@stellar/stellar-sdk",
  "@stellar/freighter-api",
  "next-themes",
];

const ROADMAP = [
  {
    level: "Level 1 — current",
    items: ["Wallet connect", "Balance display", "XLM transfer", "History"],
    done: true,
  },
  {
    level: "Level 2",
    items: [
      "Simulated anchor deposit/withdrawal",
      "Mock SEP-24 flow",
      "Testnet stablecoins",
      "Sender/receiver currency display",
    ],
    done: false,
  },
  {
    level: "Level 3",
    items: [
      "SEP-31 cross-border orchestration",
      "GET /rate quote flow",
      "SEP-12 KYC",
      "Path payments via the Stellar DEX",
    ],
    done: false,
  },
  {
    level: "Advanced",
    items: [
      "CCTP USDC bridging",
      "Soroban escrow / batching / settlement",
      "Refund & recovery flows",
      "Compliance & audit logging",
    ],
    done: false,
  },
];

export default function AboutPage() {
  return (
    <main className="mx-auto w-full max-w-4xl px-4 py-10">
      <header className="mb-10">
        <p className="font-mono text-xs uppercase tracking-widest text-accent">
          About
        </p>
        <h1 className="mt-2 font-display text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
          StellarBridge — Cross-Border Remittance Hub
        </h1>
        <p className="mt-3 max-w-2xl text-muted">
          StellarBridge explores how remittances could move over Stellar rails —
          fast, cheap, and transparent. This Level 1 submission is a focused,
          reliable testnet MVP; advanced remittance infrastructure is documented
          as future roadmap and is <span className="font-medium">not</span>{" "}
          implemented yet.
        </p>
      </header>

      {/* Mission + hackathon level */}
      <section className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        <Card>
          <h2 className="font-display text-lg font-semibold text-foreground">
            Mission
          </h2>
          <p className="mt-2 text-sm text-muted">
            Give anyone a simple way to send value across borders in seconds,
            with on-chain transparency and negligible fees — starting from a
            safe, testnet-only foundation.
          </p>
        </Card>
        <Card>
          <div className="flex items-center gap-2">
            <h2 className="font-display text-lg font-semibold text-foreground">
              Hackathon level
            </h2>
            <Badge tone="info">Level 1 · White Belt</Badge>
          </div>
          <ul className="mt-3 space-y-1.5">
            {CHECKLIST.map((c) => (
              <li key={c} className="flex items-start gap-2 text-sm text-muted">
                <span className="mt-0.5 text-success">✓</span>
                {c}
              </li>
            ))}
          </ul>
        </Card>
      </section>

      {/* Architecture */}
      <section className="mt-6">
        <Card>
          <h2 className="font-display text-lg font-semibold text-foreground">
            Architecture
          </h2>
          <p className="mt-2 text-sm text-muted">
            Frontend-only. There is no backend, database, or authentication.
            Signing happens entirely inside Freighter.
          </p>
          <pre className="mt-4 overflow-x-auto rounded-lg border border-border bg-slate-50 p-4 font-mono text-xs text-foreground dark:bg-slate-900">
{`Browser (StellarBridge UI)
        │
        ▼
   Freighter  ── signs transactions locally (keys never leave)
        │
        ▼
Stellar Testnet Horizon  ── build · submit · read balance & history`}
          </pre>
        </Card>
      </section>

      {/* Tech + security */}
      <section className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2">
        <Card>
          <h2 className="font-display text-lg font-semibold text-foreground">
            Tech stack
          </h2>
          <ul className="mt-3 flex flex-wrap gap-2">
            {TECH.map((t) => (
              <li
                key={t}
                className="rounded-full border border-border px-2.5 py-0.5 font-mono text-xs text-muted"
              >
                {t}
              </li>
            ))}
          </ul>
        </Card>
        <Card>
          <h2 className="font-display text-lg font-semibold text-foreground">
            Security notes
          </h2>
          <ul className="mt-3 space-y-1.5 text-sm text-muted">
            <li>• No secret keys are ever requested or stored.</li>
            <li>• Freighter signs every transaction.</li>
            <li>• Testnet only — no real funds.</li>
            <li>• No real fiat or KYC in the MVP.</li>
          </ul>
        </Card>
      </section>

      {/* Roadmap */}
      <section className="mt-10">
        <h2 className="font-display text-2xl font-bold tracking-tight text-foreground">
          Roadmap
        </h2>
        <p className="mt-2 text-sm text-muted">
          Advanced features below are <span className="font-medium">not</span>{" "}
          implemented in Level 1.
        </p>
        <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
          {ROADMAP.map((r) => (
            <Card key={r.level}>
              <div className="flex items-center gap-2">
                <h3 className="font-display text-sm font-semibold text-foreground">
                  {r.level}
                </h3>
                {r.done && <Badge tone="success">Done</Badge>}
              </div>
              <ul className="mt-2 space-y-1 text-sm text-muted">
                {r.items.map((i) => (
                  <li key={i}>• {i}</li>
                ))}
              </ul>
            </Card>
          ))}
        </div>
      </section>

      <div className="mt-12 flex justify-center">
        <Link
          href="/app"
          className="inline-flex items-center justify-center rounded-lg bg-slate-900 px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-slate-700 dark:bg-slate-100 dark:text-slate-900 dark:hover:bg-white"
        >
          Launch App →
        </Link>
      </div>
    </main>
  );
}
