"use client";

import { MOCK_USD_PER_XLM } from "@/lib/constants";
import type { RemittanceContext } from "@/lib/types";

interface Props {
  amount: string;
  remittance: RemittanceContext;
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between py-1.5 text-sm">
      <span className="text-muted">{label}</span>
      <span className="font-mono tabular-nums text-foreground">{value}</span>
    </div>
  );
}

export function QuotePanel({ amount, remittance }: Props) {
  const n = Number(amount);
  const xlm = Number.isFinite(n) && n > 0 ? n : 0;
  const usd = (xlm * MOCK_USD_PER_XLM).toFixed(2);

  return (
    <div className="rounded-lg border border-border bg-slate-50 p-4 dark:bg-slate-900">
      <p className="mb-2 font-mono text-[10px] uppercase tracking-widest text-accent">
        Simulated quote
      </p>
      <div className="divide-y divide-border">
        <Row label="You send" value={xlm ? `${xlm} XLM` : "—"} />
        <Row
          label="Mock FX rate"
          value={`1 XLM ≈ $${MOCK_USD_PER_XLM.toFixed(2)}`}
        />
        <Row label="Recipient gets (mock)" value={xlm ? `$${usd}` : "—"} />
        <Row label="Est. network fee" value="~0.00001 XLM" />
        <Row label="Est. arrival" value="~5 seconds" />
        <Row
          label="Corridor"
          value={`${remittance.sourceCurrency} → ${remittance.destCurrency}`}
        />
      </div>
      <p className="mt-3 font-mono text-[11px] text-muted">
        Route: Sender Wallet → Stellar Testnet → Recipient Wallet
      </p>
    </div>
  );
}
