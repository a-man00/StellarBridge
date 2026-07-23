"use client";

import { useState } from "react";
import { useWallet } from "@/components/providers/WalletProvider";
import { useRemittanceRecords, useSendRemittance } from "@/hooks/useRemittanceContract";
import { useContractEvents } from "@/hooks/useContractEvents";
import { Card, CardTitle, CardDescription } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";
import { Alert } from "@/components/ui/Alert";
import { getRemittanceContractId } from "@/lib/remittanceMessage";
import { isValidStellarAddress } from "@/lib/validation";

export function RemittanceMessagePanel() {
  const wallet = useWallet();
  const contractId = getRemittanceContractId();
  const { records, loading, error: readError, refresh } = useRemittanceRecords(
    wallet.isConnected && !!contractId,
  );
  const { status, hash, error: writeError, send } = useSendRemittance();

  const eventStatus = useContractEvents({
    enabled: status === "success" && !!hash,
    txHash: hash,
    timeoutMs: 30000,
  });

  const [receiver, setReceiver] = useState("");
  const [amount, setAmount] = useState("");
  const [message, setMessage] = useState("");
  const [touched, setTouched] = useState(false);

  const pending = status === "pending";

  const receiverError = touched
    ? receiver.trim() === ""
      ? "Recipient address is required."
      : !isValidStellarAddress(receiver)
        ? "Enter a valid Stellar public key (starts with G)."
        : null
    : null;

  const amountNum = Number(amount);
  const amountError = touched
    ? amount.trim() === ""
      ? "Amount is required."
      : Number.isNaN(amountNum) || amountNum <= 0
        ? "Amount must be greater than zero."
        : null
    : null;

  const valid = !receiverError && !amountError && wallet.address;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setTouched(true);
    if (!valid || !wallet.address) return;

    const stroops = BigInt(Math.round(amountNum * 10_000_000));

    await send(
      {
        sender: wallet.address,
        receiver: receiver.trim(),
        amount: stroops,
        message: message.trim(),
      },
      () => {
        // Refresh the on-chain records once the write succeeds.
        refresh();
      },
    );

    setReceiver("");
    setAmount("");
    setMessage("");
    setTouched(false);
  };

  if (!contractId) {
    return (
      <Card>
        <CardTitle>Contract not configured</CardTitle>
        <CardDescription className="mt-2">
          Deploy the RemittanceMessage contract to testnet and set its ID in
          the environment variable{" "}
          <code className="rounded bg-slate-100 px-1 font-mono text-xs dark:bg-slate-900">
            NEXT_PUBLIC_REMITTANCE_MESSAGE_CONTRACT_ID
          </code>
          .
        </CardDescription>
      </Card>
    );
  }

  return (
    <Card>
      <CardTitle>Remittance Message Contract</CardTitle>
      <CardDescription className="mt-2">
        Store a remittance record on-chain: sender, receiver, amount, and a
        short message.
      </CardDescription>

      <form onSubmit={handleSubmit} className="mt-4 space-y-4" noValidate>
        <div>
          <Label htmlFor="contract-receiver">Receiver address</Label>
          <Input
            id="contract-receiver"
            placeholder="G..."
            value={receiver}
            onChange={(e) => setReceiver(e.target.value)}
            className="font-mono"
            disabled={pending}
          />
          {touched && receiverError && (
            <p className="mt-1 text-xs text-error">{receiverError}</p>
          )}
        </div>

        <div>
          <Label htmlFor="contract-amount">Amount (XLM)</Label>
          <Input
            id="contract-amount"
            type="text"
            inputMode="decimal"
            placeholder="0.0"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="font-mono"
            disabled={pending}
          />
          {touched && amountError && (
            <p className="mt-1 text-xs text-error">{amountError}</p>
          )}
        </div>

        <div>
          <Label htmlFor="contract-message">Message</Label>
          <Input
            id="contract-message"
            placeholder="e.g. Rent for July"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            disabled={pending}
          />
        </div>

        <Button type="submit" disabled={pending || !wallet.address} className="w-full">
          {pending ? "Storing…" : "Store Record"}
        </Button>
      </form>

      {status === "success" && (
        <Alert tone="success" className="mt-4">
          Record stored successfully.
          {hash && (
            <p className="mt-1 font-mono text-xs break-all">Hash: {hash}</p>
          )}
        </Alert>
      )}
      {eventStatus.status === "received" && (
        <Alert tone="success" className="mt-4" title="Event received">
          The contract emitted a <strong>send_message</strong> event that was
          picked up from Soroban RPC.
        </Alert>
      )}
      {eventStatus.status === "timeout" && (
        <Alert tone="warning" className="mt-4" title="Event not detected">
          The transaction succeeded but no event was detected within 30 seconds.
          This can happen if the contract was not deployed yet or if the RPC
          event window already passed.
        </Alert>
      )}
      {status === "error" && (
        <Alert tone="error" className="mt-4">
          {writeError ?? "Failed to store record."}
        </Alert>
      )}

      <div className="mt-6 border-t border-border pt-4">
        <div className="flex items-center justify-between">
          <h3 className="font-display font-semibold text-foreground">Stored records</h3>
          <Button variant="secondary" size="sm" onClick={refresh} disabled={loading}>
            {loading ? "Loading…" : "Refresh"}
          </Button>
        </div>

        {readError && <Alert tone="error" className="mt-3">{readError}</Alert>}

        {!readError && records.length === 0 && !loading && (
          <p className="mt-3 text-sm text-muted">No records stored yet.</p>
        )}

        <ul className="mt-3 space-y-2">
          {records.map((record, i) => (
            <li
              key={i}
              className="rounded-lg border border-border bg-slate-50 p-3 text-sm dark:bg-slate-900"
            >
              <p className="font-mono text-xs text-muted">
                From {shorten(record.sender)} → {shorten(record.receiver)}
              </p>
              <p className="mt-1 font-mono text-foreground">
                {formatXlm(record.amount)} XLM
              </p>
              {record.message && (
                <p className="mt-1 text-muted">“{record.message}”</p>
              )}
              <p className="mt-1 font-mono text-[10px] text-muted">
                {formatTimestamp(record.timestamp)}
              </p>
            </li>
          ))}
        </ul>
      </div>
    </Card>
  );
}

function shorten(address: string): string {
  return `${address.slice(0, 4)}…${address.slice(-4)}`;
}

function formatXlm(stroops: bigint): string {
  const xlm = Number(stroops) / 10_000_000;
  return xlm.toLocaleString(undefined, { maximumFractionDigits: 7 });
}

function formatTimestamp(timestamp: bigint): string {
  try {
    return new Date(Number(timestamp) * 1000).toLocaleString();
  } catch {
    return String(timestamp);
  }
}
