"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";
import { useWallet } from "@/components/providers/WalletProvider";
import { useStellarAccount } from "@/hooks/useStellarAccount";
import { useSendXlm } from "@/hooks/useSendXlm";
import { BalanceCard } from "@/components/wallet/BalanceCard";
import { SendXlmForm } from "@/components/wallet/SendXlmForm";
import { TransactionStatus } from "@/components/wallet/TransactionStatus";
import { Card, CardTitle, CardDescription } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Alert } from "@/components/ui/Alert";

export default function AppPage() {
  const wallet = useWallet();
  const account = useStellarAccount(wallet.address);
  const tx = useSendXlm();

  // Refresh balance once when a send transitions to success.
  const lastHash = useRef<string | null>(null);
  useEffect(() => {
    if (tx.status === "success" && tx.hash && tx.hash !== lastHash.current) {
      lastHash.current = tx.hash;
      account.refresh();
    }
  }, [tx.status, tx.hash, account]);

  const handleSubmit = async (values: {
    destination: string;
    amount: string;
    memo: string;
  }) => {
    if (!wallet.address) return;
    await tx.send({
      sourceAddress: wallet.address,
      destination: values.destination,
      amount: values.amount,
      memo: values.memo,
    });
  };

  return (
    <main className="mx-auto w-full max-w-6xl px-4 py-10">
      <header className="mb-8">
        <p className="font-mono text-xs uppercase tracking-widest text-accent">
          Dashboard
        </p>
        <h1 className="mt-2 font-display text-3xl font-bold tracking-tight text-foreground">
          Send XLM on Stellar testnet
        </h1>
        <p className="mt-2 max-w-2xl text-muted">
          Connect Freighter, fund your account with Friendbot, check your
          balance, and send a payment — with a simulated cross-border remittance
          context.
        </p>
      </header>

      <Alert tone="neutral" className="mb-8">
        <span className="font-medium">Level 1 MVP:</span> This demo sends XLM on
        Stellar testnet. Anchor deposits, fiat payout, FX conversion, KYC, and
        stablecoin swaps are planned for future levels.
      </Alert>

      {/* Freighter not installed */}
      {wallet.installed === false && (
        <Alert tone="warning" title="Freighter not detected" className="mb-8">
          Install the{" "}
          <a
            href="https://www.freighter.app/"
            target="_blank"
            rel="noopener noreferrer"
            className="font-medium underline underline-offset-2"
          >
            Freighter browser extension
          </a>{" "}
          to connect a Stellar wallet, then reload this page. See the{" "}
          <Link href="/guide" className="font-medium underline underline-offset-2">
            setup guide
          </Link>
          .
        </Alert>
      )}

      {/* Wrong network */}
      {wallet.isWrongNetwork && (
        <Alert tone="warning" title="Wrong network" className="mb-8">
          Freighter is set to{" "}
          <span className="font-medium">{wallet.network}</span>. Switch it to{" "}
          <span className="font-medium">Testnet</span> to use StellarBridge.
        </Alert>
      )}

      {wallet.error && (
        <Alert tone="error" className="mb-8">
          {wallet.error}
        </Alert>
      )}

      {!wallet.isConnected ? (
        <Card className="mx-auto max-w-lg text-center">
          <CardTitle>Connect your wallet to begin</CardTitle>
          <CardDescription className="mx-auto mt-2 max-w-sm">
            StellarBridge never sees your secret key — Freighter signs every
            transaction. New to Freighter? Follow the{" "}
            <Link href="/guide" className="text-accent underline underline-offset-2">
              step-by-step guide
            </Link>
            .
          </CardDescription>
          <div className="mt-5">
            <Button
              onClick={wallet.connect}
              disabled={
                wallet.isConnecting || wallet.installed === false
              }
            >
              {wallet.isConnecting
                ? "Connecting…"
                : "Connect Freighter Wallet"}
            </Button>
          </div>
        </Card>
      ) : (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-5">
          <div className="lg:col-span-2">
            <BalanceCard
              address={wallet.address!}
              loading={account.loading}
              exists={account.exists}
              balance={account.balance}
              error={account.error}
              funding={account.funding}
              fundError={account.fundError}
              onRefresh={account.refresh}
              onFund={account.fund}
            />
          </div>

          <div className="space-y-6 lg:col-span-3">
            {account.exists ? (
              <SendXlmForm
                sourceAddress={wallet.address!}
                balance={account.balance}
                txStatus={tx.status}
                onSubmit={handleSubmit}
              />
            ) : (
              <Card>
                <CardTitle>Fund your account to send</CardTitle>
                <CardDescription className="mt-2">
                  Your testnet account isn’t funded yet. Use the{" "}
                  <span className="font-medium">Fund Testnet Wallet</span> button
                  to receive test XLM from Friendbot, then the send form will
                  appear here.
                </CardDescription>
              </Card>
            )}

            <TransactionStatus
              status={tx.status}
              hash={tx.hash}
              error={tx.error}
              techDetails={tx.techDetails}
            />
          </div>
        </div>
      )}
    </main>
  );
}
