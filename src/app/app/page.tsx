"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";
import { useWallet } from "@/components/providers/WalletProvider";
import { useStellarAccount } from "@/hooks/useStellarAccount";
import { useSendXlm } from "@/hooks/useSendXlm";
import { BalanceCard } from "@/components/wallet/BalanceCard";
import { SendXlmForm } from "@/components/wallet/SendXlmForm";
import { TransactionStatus } from "@/components/wallet/TransactionStatus";
import { RemittanceMessagePanel } from "@/components/wallet/RemittanceMessagePanel";
import { RouterContractPanel } from "@/components/wallet/RouterContractPanel";
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
          Connect a Stellar wallet, fund your account with Friendbot, check your
          balance, and send a payment — with a simulated cross-border remittance
          context.
        </p>
      </header>

      <Alert tone="neutral" className="mb-8">
        <span className="font-medium">Level 2:</span> Multi-wallet support via
        StellarWalletsKit and the RemittanceMessage Soroban contract. Select a
        wallet to connect, send XLM, and store remittance records on-chain.
      </Alert>

      {/* No wallet installed */}
      {wallet.hasWallet === false && (
        <Alert tone="warning" title="No wallet detected" className="mb-8">
          Install a Stellar wallet such as{" "}
          <a
            href="https://www.freighter.app/"
            target="_blank"
            rel="noopener noreferrer"
            className="font-medium underline underline-offset-2"
          >
            Freighter
          </a>
          , xBull, or Lobstr to connect. See the{" "}
          <Link href="/guide" className="font-medium underline underline-offset-2">
            setup guide
          </Link>
          .
        </Alert>
      )}

      {/* Wrong network */}
      {wallet.isWrongNetwork && (
        <Alert tone="warning" title="Wrong network" className="mb-8">
          Your wallet is set to{" "}
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
            StellarBridge never sees your secret key — your chosen wallet signs
            every transaction. New to Stellar wallets? Follow the{" "}
            <Link href="/guide" className="text-accent underline underline-offset-2">
              step-by-step guide
            </Link>
            .
          </CardDescription>
          <div className="mt-5">
            <Button
              onClick={wallet.connect}
              disabled={wallet.isConnecting}
            >
              {wallet.isConnecting ? "Connecting…" : "Connect Wallet"}
            </Button>
          </div>
        </Card>
      ) : (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-5">
          <div className="lg:col-span-2">
            <BalanceCard
              address={wallet.address!}
              network={wallet.network}
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

            <RemittanceMessagePanel />

            <RouterContractPanel />
          </div>
        </div>
      )}
    </main>
  );
}
