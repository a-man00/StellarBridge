"use client";

import { explorerAccountUrl } from "@/lib/constants";
import { formatStellarAmount, mockUsd, shortenAddress } from "@/lib/format";
import { Button } from "./ui/Button";
import { Card, CardTitle } from "./ui/Card";
import { Alert } from "./ui/Alert";

interface Props {
  address: string;
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
  loading,
  exists,
  balance,
  error,
  funding,
  fundError,
  onRefresh,
  onFund,
}: Props) {
  return (
    <Card>
      <div className="flex items-start justify-between">
        <CardTitle>Wallet Balance</CardTitle>
        <Button
          variant="ghost"
          onClick={onRefresh}
          disabled={loading}
          className="h-8 px-2 text-xs"
        >
          {loading ? "Refreshing…" : "Refresh"}
        </Button>
      </div>

      <a
        href={explorerAccountUrl(address)}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-1 inline-block font-mono text-xs text-slate-500 underline-offset-2 hover:underline dark:text-slate-400"
      >
        {shortenAddress(address, 6)}
      </a>

      <div className="mt-4" aria-live="polite">
        {loading ? (
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Loading balance…
          </p>
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
          <div className="space-y-3">
            <div>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-semibold text-slate-900 dark:text-slate-100">
                  {formatStellarAmount(balance ?? "0")}
                </span>
                <span className="text-sm font-medium text-slate-500 dark:text-slate-400">
                  XLM
                </span>
              </div>
              <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                ≈ ${mockUsd(balance ?? "0")} USD{" "}
                <span className="italic">(mock rate)</span>
              </p>
            </div>
            {fundError && <Alert tone="error">{fundError}</Alert>}
          </div>
        )}
      </div>
    </Card>
  );
}
