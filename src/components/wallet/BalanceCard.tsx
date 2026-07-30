"use client";

import { useState } from "react";
import { explorerAccountUrl } from "@/lib/constants";
import { formatStellarAmount, mockUsd, shortenAddress } from "@/lib/format";
import { Button } from "@/components/ui/Button";
import { Card, CardTitle } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Alert } from "@/components/ui/Alert";

interface Props {
  address: string;
  network: string | null;
  loading: boolean;
  exists: boolean;
  balance: string | null;
  error: string | null;
  funding: boolean;
  fundError: string | null;
  onRefresh: () => void;
  onFund: () => void;
}

export function BalanceCard({
  address,
  network,
  loading,
  exists,
  balance,
  error,
  funding,
  fundError,
  onRefresh,
  onFund,
}: Props) {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(address);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      // ignore
    }
  };

  return (
    <Card>
      <div className="flex items-start justify-between">
        <CardTitle>Wallet Balance</CardTitle>
        <Badge tone={network === "PUBLIC" ? "warning" : "info"}>
          <span className={`h-1.5 w-1.5 animate-pulse-dot rounded-full ${network === "PUBLIC" ? "bg-warning" : "bg-accent"}`} />
          {network ?? "Testnet"}
        </Badge>
      </div>

      {/* Address + copy */}
      <div className="mt-3 flex flex-wrap items-center gap-2">
        <a
          href={explorerAccountUrl(address)}
          target="_blank"
          rel="noopener noreferrer"
          className="font-mono text-xs text-muted underline-offset-4 transition-colors hover:text-accent hover:underline"
        >
          {shortenAddress(address, 6)}
        </a>
        <button
          onClick={copy}
          className="font-mono text-[10px] uppercase tracking-widest text-muted transition-colors hover:text-foreground"
        >
          {copied ? "Copied" : "Copy"}
        </button>
      </div>

      <div className="mt-4" aria-live="polite">
        {loading ? (
          <p className="font-mono text-sm text-muted">Loading balance…</p>
        ) : error ? (
          <Alert tone="error">{error}</Alert>
        ) : !exists ? (
          <div className="space-y-3">
            <Alert tone="warning" title="Account not funded">
              This address has no testnet XLM yet. Fund it with Friendbot to get
              started.
            </Alert>
            <Button onClick={onFund} disabled={funding}>
              {funding ? "Funding…" : "Fund Testnet Wallet"}
            </Button>
            {fundError && <Alert tone="error">{fundError}</Alert>}
          </div>
        ) : (
          <div className="space-y-4">
            <div>
              <div className="flex items-baseline gap-2">
                <span className="font-mono text-4xl font-medium tabular-nums text-foreground">
                  {formatStellarAmount(balance ?? "0")}
                </span>
                <span className="font-mono text-sm text-muted">XLM</span>
              </div>
              <p className="mt-1 font-mono text-xs text-muted">
                ≈ ${mockUsd(balance ?? "0")} USD{" "}
                <span className="italic">(mock rate)</span>
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              <Button variant="secondary" size="sm" onClick={onRefresh}>
                Refresh
              </Button>
              <Button variant="secondary" size="sm" onClick={onFund} disabled={funding}>
                {funding ? "Funding…" : "Fund via Friendbot"}
              </Button>
            </div>
            {fundError && <Alert tone="error">{fundError}</Alert>}
          </div>
        )}
      </div>
    </Card>
  );
}
