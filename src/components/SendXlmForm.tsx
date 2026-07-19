"use client";

import { useMemo, useState } from "react";
import { FEE_BUFFER_XLM } from "@/lib/constants";
import { formatStellarAmount } from "@/lib/format";
import {
  isValidStellarAddress,
  validateAmount,
  validateMemo,
} from "@/lib/validation";
import type { RemittanceContext, TxStatus } from "@/lib/types";
import { Button } from "./ui/Button";
import { Card, CardTitle } from "./ui/Card";
import { Input } from "./ui/Input";
import { Label } from "./ui/Label";
import { Select } from "./ui/Select";
import { Alert } from "./ui/Alert";

interface Props {
  sourceAddress: string;
  balance: string | null;
  txStatus: TxStatus;
  remittance: RemittanceContext;
  onRemittanceChange: (r: RemittanceContext) => void;
  onAmountChange: (amount: string) => void;
  onSubmit: (values: {
    destination: string;
    amount: string;
    memo: string;
  }) => void;
}

const COUNTRIES = [
  { code: "US", name: "United States", currency: "USD" },
  { code: "IN", name: "India", currency: "INR" },
  { code: "NG", name: "Nigeria", currency: "NGN" },
  { code: "MX", name: "Mexico", currency: "MXN" },
  { code: "PH", name: "Philippines", currency: "PHP" },
  { code: "GB", name: "United Kingdom", currency: "GBP" },
];

export function SendXlmForm({
  sourceAddress,
  balance,
  txStatus,
  remittance,
  onRemittanceChange,
  onAmountChange,
  onSubmit,
}: Props) {
  const [destination, setDestination] = useState("");
  const [amount, setAmount] = useState("");
  const [memo, setMemo] = useState("");
  const [touched, setTouched] = useState(false);

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

  const formValid =
    !destError && amountValidation.valid && memoValidation.valid;

  const setAmountBoth = (v: string) => {
    setAmount(v);
    onAmountChange(v);
  };

  const fillMax = () => {
    if (balance === null) return;
    const max = Math.max(0, Number(balance) - FEE_BUFFER_XLM);
    setAmountBoth(formatStellarAmount(max));
  };

  const updateCountry = (
    which: "source" | "dest",
    code: string,
  ) => {
    const country = COUNTRIES.find((c) => c.code === code) ?? COUNTRIES[0];
    if (which === "source") {
      onRemittanceChange({
        ...remittance,
        sourceCountry: country.code,
        sourceCurrency: country.currency,
      });
    } else {
      onRemittanceChange({
        ...remittance,
        destCountry: country.code,
        destCurrency: country.currency,
      });
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
      <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
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
          />
          {touched && destError && (
            <p className="mt-1 text-xs text-red-600 dark:text-red-400">
              {destError}
            </p>
          )}
        </div>

        <div>
          <div className="flex items-center justify-between">
            <Label htmlFor="amount">Amount (XLM)</Label>
            <button
              type="button"
              onClick={fillMax}
              disabled={balance === null}
              className="mb-1.5 text-xs font-medium text-slate-500 underline-offset-2 hover:underline disabled:opacity-50 dark:text-slate-400"
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
            onChange={(e) => setAmountBoth(e.target.value)}
            onBlur={() => setTouched(true)}
          />
          {touched && !amountValidation.valid && (
            <p className="mt-1 text-xs text-red-600 dark:text-red-400">
              {amountValidation.error}
            </p>
          )}
          {nearFullBalance && amountValidation.valid && (
            <p className="mt-1 text-xs text-amber-600 dark:text-amber-400">
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
            <p className="mt-1 text-xs text-red-600 dark:text-red-400">
              {memoValidation.error}
            </p>
          )}
        </div>

        {/* Simulated remittance context — UI only, does not affect the tx. */}
        <fieldset className="rounded-lg border border-slate-200 p-3 dark:border-slate-800">
          <legend className="px-1 text-xs font-medium text-slate-500 dark:text-slate-400">
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
                    {c.name} ({c.currency})
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
                    {c.name} ({c.currency})
                  </option>
                ))}
              </Select>
            </div>
          </div>
        </fieldset>

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
