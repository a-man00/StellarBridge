"use client";

import { useCallback, useState } from "react";
import { NETWORK_PASSPHRASE } from "@/lib/constants";
import { signWithWallet } from "@/lib/wallet";
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

// Normalize wallet-kit / wallet rejection errors into user-friendly text.
function signErrorText(error: unknown): string {
  if (!error) return "The wallet returned an error.";
  if (typeof error === "string") {
    if (/rejected|cancel|denied|dismissed/i.test(error)) {
      return "You rejected the signature request in your wallet.";
    }
    return error;
  }
  if (error instanceof Error) {
    const msg = error.message ?? "";
    if (/rejected|cancel|denied|dismissed/i.test(msg)) {
      return "You rejected the signature request in your wallet.";
    }
    return msg;
  }
  return "The wallet rejected or failed to sign the transaction.";
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

      const signed = await signWithWallet(xdr, {
        networkPassphrase: NETWORK_PASSPHRASE,
        address: params.sourceAddress,
      });

      const txHash = await submitSignedXdr(signed.signedTxXdr);
      setHash(txHash);
      setStatus("success");
    } catch (err) {
      setStatus("error");
      const friendly = signErrorText(err);
      // Horizon-specific errors override the generic wallet message.
      setError(humanizeError(err) ?? friendly);
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
