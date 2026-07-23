"use client";

import Link from "next/link";
import { useWallet } from "@/components/providers/WalletProvider";
import { useTransactions } from "@/hooks/useTransactions";
import { TransactionList } from "@/components/history/TransactionList";
import { Card, CardTitle, CardDescription } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Alert } from "@/components/ui/Alert";

export default function HistoryPage() {
  const wallet = useWallet();
  const txs = useTransactions(wallet.address);

  return (
    <main className="mx-auto w-full max-w-4xl px-4 py-10">
      <header className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="font-mono text-xs uppercase tracking-widest text-accent">
            History
          </p>
          <h1 className="mt-2 font-display text-3xl font-bold tracking-tight text-foreground">
            Transaction history
          </h1>
          <p className="mt-2 text-muted">
            Recent payments for your connected testnet account, fetched live from
            Horizon.
          </p>
        </div>
        {wallet.isConnected && (
          <Button variant="secondary" size="sm" onClick={txs.refresh}>
            Refresh
          </Button>
        )}
      </header>

      {!wallet.isConnected ? (
        <Card className="max-w-lg text-center">
          <CardTitle>Connect your wallet</CardTitle>
          <CardDescription className="mx-auto mt-2 max-w-sm">
            Connect your wallet on the{" "}
            <Link href="/app" className="text-accent underline underline-offset-2">
              dashboard
            </Link>{" "}
            to view your transaction history.
          </CardDescription>
        </Card>
      ) : txs.loading ? (
        <p className="font-mono text-sm text-muted">Loading transactions…</p>
      ) : txs.error ? (
        <Alert tone="error">{txs.error}</Alert>
      ) : txs.unfunded ? (
        <Card className="text-center">
          <CardTitle>Account not funded yet</CardTitle>
          <CardDescription className="mx-auto mt-2 max-w-sm">
            This account has no history because it hasn’t been created on the
            network. Fund it with Friendbot on the{" "}
            <Link href="/app" className="text-accent underline underline-offset-2">
              dashboard
            </Link>{" "}
            first.
          </CardDescription>
        </Card>
      ) : txs.records.length === 0 ? (
        <Card className="text-center">
          <CardTitle>No transactions yet</CardTitle>
          <CardDescription className="mx-auto mt-2 max-w-sm">
            Once you send or receive XLM, your payments will appear here. Head to
            the{" "}
            <Link href="/app" className="text-accent underline underline-offset-2">
              dashboard
            </Link>{" "}
            to send your first payment.
          </CardDescription>
        </Card>
      ) : (
        <TransactionList records={txs.records} />
      )}
    </main>
  );
}
