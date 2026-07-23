"use client";

import { useState } from "react";
import { useWalletKit } from "@/hooks/useWalletKit";
import {
  getRemittanceRouterContractId,
  getFeeRegistryContractId,
  routeRemittanceInterContract,
} from "@/lib/remittanceRouter";
import { DEFAULT_REMITTANCE_CONTRACT_ID } from "@/lib/constants";
import { Card, CardTitle, CardDescription } from "@/components/ui/Card";
import { Label } from "@/components/ui/Label";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Alert } from "@/components/ui/Alert";
import { Badge } from "@/components/ui/Badge";
import { isValidStellarAddress, validateAmount } from "@/lib/validation";

export function RouterContractPanel() {
  const wallet = useWalletKit();
  const [receiver, setReceiver] = useState("");
  const [amount, setAmount] = useState("");
  const [message, setMessage] = useState("");
  const [pending, setPending] = useState(false);
  const [txHash, setTxHash] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [touched, setTouched] = useState(false);

  const routerId = getRemittanceRouterContractId();
  const feeRegistryId = getFeeRegistryContractId();
  const remittanceMessageId =
    process.env.NEXT_PUBLIC_REMITTANCE_MESSAGE_CONTRACT_ID ||
    DEFAULT_REMITTANCE_CONTRACT_ID;

  const receiverErr = isValidStellarAddress(receiver)
    ? null
    : "Invalid recipient address";
  const amountValidation = validateAmount(amount, null);
  const amountErr = amountValidation.valid ? null : amountValidation.error;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setTouched(true);
    if (receiverErr || amountErr || !wallet.address) return;

    setPending(true);
    setTxHash(null);
    setError(null);

    try {
      const stroops = BigInt(Math.floor(parseFloat(amount) * 10_000_000));
      const hash = await routeRemittanceInterContract({
        sender: wallet.address,
        receiver,
        grossAmountStroops: stroops,
        message,
      });
      setTxHash(hash);
      setReceiver("");
      setAmount("");
      setMessage("");
      setTouched(false);
    } catch (err: unknown) {
      setError(
        err instanceof Error ? err.message : "Inter-contract routing failed.",
      );
    } finally {
      setPending(false);
    }
  };

  function shorten(id: string): string {
    return `${id.slice(0, 4)}…${id.slice(-4)}`;
  }

  return (
    <Card className="border-l-4 border-l-brand">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div>
          <Badge tone="info">Level 3 — Inter-Contract Communication</Badge>
          <CardTitle className="mt-1">On-Chain Remittance Router</CardTitle>
        </div>
      </div>

      <CardDescription className="mt-2 text-xs">
        Executes a 3-contract pipeline: <strong>Router</strong> → calls{" "}
        <strong>FeeRegistry</strong> (1% fee quote) → calls{" "}
        <strong>RemittanceMessage</strong> (record net deposit).
      </CardDescription>

      <div className="mt-3 rounded-lg bg-slate-100 p-3 font-mono text-[11px] text-muted dark:bg-slate-900">
        <div className="flex justify-between">
          <span>1. Router:</span>
          <a
            href={`https://stellar.expert/explorer/testnet/contract/${routerId}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-brand hover:underline"
          >
            {shorten(routerId)} ↗
          </a>
        </div>
        <div className="mt-1 flex justify-between">
          <span>2. FeeRegistry:</span>
          <a
            href={`https://stellar.expert/explorer/testnet/contract/${feeRegistryId}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-brand hover:underline"
          >
            {shorten(feeRegistryId)} ↗
          </a>
        </div>
        <div className="mt-1 flex justify-between">
          <span>3. RemittanceMessage:</span>
          <a
            href={`https://stellar.expert/explorer/testnet/contract/${remittanceMessageId}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-brand hover:underline"
          >
            {shorten(remittanceMessageId)} ↗
          </a>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="mt-4 space-y-3" noValidate>
        <div>
          <Label htmlFor="router-receiver">Receiver address</Label>
          <Input
            id="router-receiver"
            placeholder="G..."
            value={receiver}
            onChange={(e) => setReceiver(e.target.value)}
            className="font-mono text-xs"
            disabled={pending}
          />
          {touched && receiverErr && (
            <p className="mt-1 text-xs text-error">{receiverErr}</p>
          )}
        </div>

        <div>
          <Label htmlFor="router-amount">Gross Amount (XLM)</Label>
          <Input
            id="router-amount"
            type="text"
            inputMode="decimal"
            placeholder="100.0"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="font-mono text-xs"
            disabled={pending}
          />
          {touched && amountErr && (
            <p className="mt-1 text-xs text-error">{amountErr}</p>
          )}
        </div>

        <div>
          <Label htmlFor="router-message">Remittance Memo</Label>
          <Input
            id="router-message"
            placeholder="e.g. Level 3 Inter-Contract Test"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="text-xs"
            disabled={pending}
          />
        </div>

        <Button
          type="submit"
          disabled={pending || !wallet.address}
          className="w-full"
        >
          {pending ? "Executing Inter-Contract Call…" : "Route Remittance On-Chain"}
        </Button>
      </form>

      {txHash && (
        <Alert tone="success" className="mt-3" title="Inter-Contract Call Succeeded">
          Successfully executed <strong>Router → FeeRegistry → RemittanceMessage</strong>.
          <p className="mt-1 font-mono text-[11px] break-all">Tx Hash: {txHash}</p>
        </Alert>
      )}

      {error && (
        <Alert tone="error" className="mt-3">
          {error}
        </Alert>
      )}
    </Card>
  );
}
