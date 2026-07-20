"use client";

import { explorerAccountUrl, explorerTxUrl } from "@/lib/constants";
import { formatStellarAmount, formatTimestamp, shortenAddress } from "@/lib/format";
import type { PaymentRecord } from "@/lib/stellar";
import { Badge } from "@/components/ui/Badge";

const TYPE_LABEL: Record<PaymentRecord["type"], string> = {
  sent: "Sent",
  received: "Received",
  created: "Account created",
  other: "Operation",
};

const TYPE_TONE: Record<
  PaymentRecord["type"],
  "info" | "success" | "neutral"
> = {
  sent: "info",
  received: "success",
  created: "neutral",
  other: "neutral",
};

export function TransactionList({ records }: { records: PaymentRecord[] }) {
  return (
    <div className="overflow-hidden rounded-lg border border-border">
      {/* Header (desktop) */}
      <div className="hidden grid-cols-12 gap-4 border-b border-border bg-slate-50 px-4 py-2 font-mono text-[10px] uppercase tracking-widest text-muted sm:grid dark:bg-slate-900">
        <span className="col-span-2">Type</span>
        <span className="col-span-3">Amount</span>
        <span className="col-span-3">Counterparty</span>
        <span className="col-span-2">When</span>
        <span className="col-span-2 text-right">Tx</span>
      </div>

      <ul className="divide-y divide-border">
        {records.map((r) => (
          <li
            key={r.id}
            className="grid grid-cols-1 gap-2 px-4 py-3 text-sm sm:grid-cols-12 sm:items-center sm:gap-4"
          >
            <div className="sm:col-span-2">
              <Badge tone={TYPE_TONE[r.type]}>{TYPE_LABEL[r.type]}</Badge>
            </div>
            <div className="font-mono tabular-nums text-foreground sm:col-span-3">
              {r.amount ? `${formatStellarAmount(r.amount)} ${r.asset}` : "—"}
            </div>
            <div className="font-mono text-xs text-muted sm:col-span-3">
              {r.counterparty ? (
                <a
                  href={explorerAccountUrl(r.counterparty)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline-offset-4 hover:text-accent hover:underline"
                >
                  {shortenAddress(r.counterparty, 5)}
                </a>
              ) : (
                "—"
              )}
            </div>
            <div className="text-xs text-muted sm:col-span-2">
              {formatTimestamp(r.createdAt)}
            </div>
            <div className="font-mono text-xs sm:col-span-2 sm:text-right">
              <a
                href={explorerTxUrl(r.txHash)}
                target="_blank"
                rel="noopener noreferrer"
                className="text-accent underline-offset-4 hover:underline"
              >
                {shortenAddress(r.txHash, 4)}
              </a>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
