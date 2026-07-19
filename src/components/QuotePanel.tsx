"use client";

import { MOCK_USD_PER_XLM } from "@/lib/constants";
import type { RemittanceContext } from "@/lib/types";
import { Card, CardTitle } from "./ui/Card";

interface Props {
  amount: string;
  remittance: RemittanceContext;
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between py-1.5 text-sm">
      <span className="text-slate-500 dark:text-slate-400">{label}</span>
      <span className="font-medium text-slate-900 dark:text-slate-100">
        {value}
      </span>
    </div>
  );
}

export function QuotePanel({ amount, remittance }: Props) {
  const n = Number(amount);
  const xlm = Number.isFinite(n) && n > 0 ? n : 0;
  const usd = (xlm * MOCK_USD_PER_XLM).toFixed(2);

  return (
    <Card>
      <CardTitle>Remittance Quote</CardTitle>
      <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
        Simulated FX and routing — for demonstration only.
      </p>

      <div className="mt-3 divide-y divide-slate-100 dark:divide-slate-800">
        <Row
          label="You send"
          value={xlm ? `${xlm} XLM` : "—"}
        />
        <Row
          label="Mock FX rate"
          value={`1 XLM ≈ $${MOCK_USD_PER_XLM.toFixed(2)} USD`}
        />
        <Row label="Recipient receives (mock)" value={xlm ? `$${usd}` : "—"} />
        <Row label="Estimated network fee" value="~0.00001 XLM" />
        <Row label="Estimated arrival" value="~5 seconds" />
        <Row
          label="Corridor"
          value={`${remittance.sourceCurrency} → ${remittance.destCurrency}`}
        />
      </div>

      <p className="mt-3 text-xs text-slate-500 dark:text-slate-400">
        Route: Sender Wallet → Stellar Testnet → Recipient Wallet
      </p>
    </Card>
  );
}
