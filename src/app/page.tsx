"use client";

import { useEffect, useRef, useState } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { BalanceCard } from "@/components/BalanceCard";
import { SendXlmForm } from "@/components/SendXlmForm";
import { QuotePanel } from "@/components/QuotePanel";
import { TransactionStatus } from "@/components/TransactionStatus";
import { Card, CardTitle, CardDescription } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Alert } from "@/components/ui/Alert";
import { useFreighter } from "@/hooks/useFreighter";
import { useStellarAccount } from "@/hooks/useStellarAccount";
import { useSendXlm } from "@/hooks/useSendXlm";
import type { RemittanceContext } from "@/lib/types";

const DEFAULT_REMITTANCE: RemittanceContext = {
  sourceCountry: "US",
  destCountry: "IN",
  sourceCurrency: "USD",
  destCurrency: "INR",
};

export default function Home() {
  const wallet = useFreighter();
  const account = useStellarAccount(wallet.address);
  const tx = useSendXlm();

  const [remittance, setRemittance] = useState(DEFAULT_REMITTANCE);
  const [quoteAmount, setQuoteAmount] = useState("");

  const connected = wallet.status === "connected" && wallet.address;

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
    <>
      <Header
        wallet={{
          address: wallet.address,
          status: wallet.status,
          installed: wallet.installed,
        }}
        onConnect={wallet.connect}
        onDisconnect={() => {
          wallet.disconnect();
          tx.reset();
        }}
      />

      <main className="mx-auto w-full max-w-3xl flex-1 px-4 py-8">
        <Alert tone="neutral" className="mb-6">
          <span className="font-medium">Level 1 MVP:</span> This demo sends XLM
          on Stellar testnet. Anchor deposits, fiat payout, FX conversion, KYC,
          and stablecoin swaps are planned for future levels.
        </Alert>

        {wallet.installed === false && (
          <Alert tone="warning" title="Freighter not detected" className="mb-6">
            Install the{" "}
            <a
              href="https://www.freighter.app/"
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium underline underline-offset-2"
            >
              Freighter browser extension
            </a>{" "}
            to connect a Stellar wallet, then reload this page.
          </Alert>
        )}

        {wallet.isWrongNetwork && (
          <Alert tone="warning" title="Wrong network" className="mb-6">
            Freighter is set to{" "}
            <span className="font-medium">{wallet.network}</span>. Switch it to{" "}
            <span className="font-medium">Testnet</span> to use StellarBridge.
          </Alert>
        )}

        {wallet.error && (
          <Alert tone="error" className="mb-6">
            {wallet.error}
          </Alert>
        )}

        {!connected ? (
          <Card>
            <CardTitle>Send money across borders on Stellar</CardTitle>
            <CardDescription className="mt-2">
              StellarBridge is a cross-border remittance hub built on the Stellar
              network. Connect your Freighter wallet to fund a testnet account,
              check your XLM balance, and send a payment in seconds — with a
              simulated FX and anchor payout experience.
            </CardDescription>
            <div className="mt-5">
              <Button
                onClick={wallet.connect}
                disabled={
                  wallet.status === "connecting" || wallet.installed === false
                }
              >
                {wallet.status === "connecting"
                  ? "Connecting…"
                  : "Connect Freighter Wallet"}
              </Button>
            </div>
          </Card>
        ) : (
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-5">
            <div className="space-y-6 lg:col-span-3">
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

              {account.exists && (
                <SendXlmForm
                  sourceAddress={wallet.address!}
                  balance={account.balance}
                  txStatus={tx.status}
                  remittance={remittance}
                  onRemittanceChange={setRemittance}
                  onAmountChange={setQuoteAmount}
                  onSubmit={handleSubmit}
                />
              )}

              <TransactionStatus
                status={tx.status}
                hash={tx.hash}
                error={tx.error}
                techDetails={tx.techDetails}
              />
            </div>

            <div className="lg:col-span-2">
              <QuotePanel amount={quoteAmount} remittance={remittance} />
            </div>
          </div>
        )}
      </main>

      <Footer />
    </>
  );
}
