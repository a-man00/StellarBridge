"use client";

import { useCallback, useState } from "react";
import { signTransaction } from "@stellar/freighter-api";
import { NETWORK_PASSPHRASE } from "@/lib/constants";
import {
  buildXlmPaymentXdr,
  humanizeError,
  submitSignedXdr,
} from "@/lib/stellar";
import type { TxStatus } from "@/lib/types";

interface SendParams {
  sourceAddress: string;
  destination: string;
  amount: string;
  memo?: string;
}

function freighterErrorText(error: unknown): string {
  if (typeof error === "string") return error;
  if (typeof error === "object" && error !== null && "message" in error) {
    const msg = (error as { message?: unknown }).message;
    if (typeof msg === "string") return msg;
  }
  return "Freighter rejected or failed to sign the transaction.";
}

export function useSendXlm() {
  const [status, setStatus] = useState<TxStatus>("idle");
  const [hash, setHash] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [techDetails, setTechDetails] = useState<string | null>(null);

  const reset = useCallback(() => {
    setStatus("idle");
    setHash(null);
    setError(null);
    setTechDetails(null);
  }, []);

  const send = useCallback(async (params: SendParams) => {
    setStatus("pending");
    setHash(null);
    setError(null);
    setTechDetails(null);
    try {
      const xdr = await buildXlmPaymentXdr(params);

      const signed = await signTransaction(xdr, {
        networkPassphrase: NETWORK_PASSPHRASE,
        address: params.sourceAddress,
      });
      if (signed.error) {
        setStatus("error");
        setError(freighterErrorText(signed.error));
        setTechDetails(JSON.stringify(signed.error));
        return;
      }

      const txHash = await submitSignedXdr(signed.signedTxXdr);
      setHash(txHash);
      setStatus("success");
    } catch (err) {
      setStatus("error");
      setError(humanizeError(err));
      try {
        setTechDetails(
          JSON.stringify(
            err,
            Object.getOwnPropertyNames(err ?? {}),
            2,
          ),
        );
      } catch {
        setTechDetails(String(err));
      }
    }
  }, []);

  return { status, hash, error, techDetails, send, reset };
}
