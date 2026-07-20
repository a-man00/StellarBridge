"use client";

import { useMemo, useState } from "react";
import { BASE_RESERVE_XLM, FEE_BUFFER_XLM } from "@/lib/constants";
import { COUNTRIES, findCountry } from "@/lib/corridors";
import { formatStellarAmount } from "@/lib/format";
import {
  isValidStellarAddress,
  validateAmount,
  validateMemo,
} from "@/lib/validation";
import type { RemittanceContext, TxStatus } from "@/lib/types";
import { Button } from "@/components/ui/Button";
import { Card, CardTitle } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";
import { Select } from "@/components/ui/Select";
import { Alert } from "@/components/ui/Alert";
import { QuotePanel } from "./QuotePanel";

interface Props {
  sourceAddress: string;
  balance: string | null;
  txStatus: TxStatus;
  onSubmit: (values: {
    destination: string;
    amount: string;
    memo: string;
  }) => void;
}

const DEFAULT_REMITTANCE: RemittanceContext = {
  sourceCountry: "US",
  destCountry: "PH",
  sourceCurrency: "USD",
  destCurrency: "PHP",
};

export function SendXlmForm({
  sourceAddress,
  balance,
  txStatus,
  onSubmit,
}: Props) {
  const [destination, setDestination] = useState("");
  const [amount, setAmount] = useState("");
  const [memo, setMemo] = useState("");
  const [touched, setTouched] = useState(false);
  const [remittance, setRemittance] = useState(DEFAULT_REMITTANCE);

  const pending = txStatus === "pending";

  const destError = useMemo(() => {
    if (!destination.trim()) return "Recipient address is required.";
    if (!isValidStellarAddress(destination))
      return "Enter a valid Stellar public key (starts with G).";
    if (destination.trim() === sourceAddress)
      return "You cannot send to your own address.";
    return null;
  }, [destination, sourceAddress]);

  const amountValidation = useMemo(
    () => validateAmount(amount, balance),
    [amount, balance],
  );
  const memoValidation = useMemo(() => validateMemo(memo), [memo]);

  const nearFullBalance =
    balance !== null &&
    amount !== "" &&
    Number(amount) > 0 &&
    Number(amount) > Number(balance) * 0.95 &&
    Number(amount) <= Number(balance);

  const formValid = !destError && amountValidation.valid && memoValidation.valid;

  const fillMax = () => {
    if (balance === null) return;
    // Leave the minimum account reserve (~1 XLM) plus a small fee buffer so the
    // resulting payment can actually succeed instead of hitting op_low_reserve.
    const max = Math.max(0, Number(balance) - BASE_RESERVE_XLM - FEE_BUFFER_XLM);
    setAmount(formatStellarAmount(max));
  };

  const updateCountry = (which: "source" | "dest", code: string) => {
    const country = findCountry(code);
    if (which === "source") {
      setRemittance((r) => ({
        ...r,
        sourceCountry: country.code,
        sourceCurrency: country.currency,
      }));
    } else {
      setRemittance((r) => ({
        ...r,
        destCountry: country.code,
        destCurrency: country.currency,
      }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setTouched(true);
    if (!formValid) return;
    onSubmit({ destination: destination.trim(), amount: amount.trim(), memo });
  };

  return (
    <Card>
      <CardTitle>Send Payment</CardTitle>
      <p className="mt-1 text-xs text-muted">
        Level 1 testnet MVP: transfers are executed as XLM payments. FX
        conversion and anchor payout are simulated.
      </p>

      <form onSubmit={handleSubmit} className="mt-4 space-y-4" noValidate>
        <div>
          <Label htmlFor="destination">Recipient Stellar address</Label>
          <Input
            id="destination"
            placeholder="G..."
            value={destination}
            onChange={(e) => setDestination(e.target.value)}
            onBlur={() => setTouched(true)}
            autoComplete="off"
            spellCheck={false}
            className="font-mono"
          />
          {touched && destError && (
            <p className="mt-1 text-xs text-error">{destError}</p>
          )}
        </div>

        <div>
          <div className="flex items-center justify-between">
            <Label htmlFor="amount">Amount (XLM)</Label>
            <button
              type="button"
              onClick={fillMax}
              disabled={balance === null}
              className="mb-1.5 font-mono text-xs uppercase tracking-widest text-accent underline-offset-2 hover:underline disabled:opacity-50"
            >
              Max
            </button>
          </div>
          <Input
            id="amount"
            type="text"
            inputMode="decimal"
            placeholder="0.0"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            onBlur={() => setTouched(true)}
            className="font-mono"
          />
          {touched && !amountValidation.valid && (
            <p className="mt-1 text-xs text-error">{amountValidation.error}</p>
          )}
          {nearFullBalance && amountValidation.valid && (
            <p className="mt-1 text-xs text-warning">
              This is close to your full balance — leave some XLM for fees and
              the account reserve.
            </p>
          )}
        </div>

        <div>
          <Label htmlFor="memo">Memo (optional)</Label>
          <Input
            id="memo"
            placeholder="e.g. Rent for July"
            value={memo}
            onChange={(e) => setMemo(e.target.value)}
            maxLength={40}
          />
          {!memoValidation.valid && (
            <p className="mt-1 text-xs text-error">{memoValidation.error}</p>
          )}
        </div>

        {/* Simulated remittance context — UI only, does not affect the tx. */}
        <fieldset className="rounded-lg border border-border p-3">
          <legend className="px-1 font-mono text-[10px] uppercase tracking-widest text-muted">
            Simulated remittance corridor (UI only)
          </legend>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div>
              <Label htmlFor="sourceCountry">From</Label>
              <Select
                id="sourceCountry"
                value={remittance.sourceCountry}
                onChange={(e) => updateCountry("source", e.target.value)}
              >
                {COUNTRIES.map((c) => (
                  <option key={c.code} value={c.code}>
                    {c.flag} {c.name} ({c.currency})
                  </option>
                ))}
              </Select>
            </div>
            <div>
              <Label htmlFor="destCountry">To</Label>
              <Select
                id="destCountry"
                value={remittance.destCountry}
                onChange={(e) => updateCountry("dest", e.target.value)}
              >
                {COUNTRIES.map((c) => (
                  <option key={c.code} value={c.code}>
                    {c.flag} {c.name} ({c.currency})
                  </option>
                ))}
              </Select>
            </div>
          </div>
        </fieldset>

        <QuotePanel amount={amount} remittance={remittance} />

        <Alert tone="neutral">
          The corridor and currency selectors above are for demonstration only.
          The real transaction is a native XLM payment on Stellar testnet.
        </Alert>

        <Button
          type="submit"
          disabled={pending || (touched && !formValid)}
          className="w-full"
        >
          {pending ? "Sending…" : "Send XLM"}
        </Button>
      </form>
    </Card>
  );
}
