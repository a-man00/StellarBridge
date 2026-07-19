"use client";

import { useState } from "react";
import { explorerTxUrl } from "@/lib/constants";
import { shortenAddress } from "@/lib/format";
import type { TxStatus } from "@/lib/types";
import { Alert } from "./ui/Alert";

interface Props {
  status: TxStatus;
  hash: string | null;
  error: string | null;
  techDetails: string | null;
}

export function TransactionStatus({ status, hash, error, techDetails }: Props) {
  const [showDetails, setShowDetails] = useState(false);

  if (status === "idle") return null;

  return (
    <div aria-live="polite" className="space-y-2">
      {status === "pending" && (
        <Alert tone="neutral" title="Transaction pending">
          Building, signing, and submitting your payment to Stellar testnet…
        </Alert>
      )}

      {status === "success" && hash && (
        <Alert tone="success" title="Payment sent successfully">
          <p className="mt-1">
            Transaction hash:{" "}
            <span className="font-mono">{shortenAddress(hash, 8)}</span>
          </p>
          <a
            href={explorerTxUrl(hash)}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-1 inline-block font-medium underline underline-offset-2"
          >
            View on Stellar Expert →
          </a>
        </Alert>
      )}

      {status === "error" && (
        <Alert tone="error" title="Transaction failed">
          <p className="mt-1">{error ?? "An unexpected error occurred."}</p>
          {techDetails && (
            <div className="mt-2">
              <button
                onClick={() => setShowDetails((v) => !v)}
                className="text-xs font-medium underline underline-offset-2"
              >
                {showDetails ? "Hide" : "Show"} technical details
              </button>
              {showDetails && (
                <pre className="mt-2 max-h-48 overflow-auto rounded-md bg-slate-900 p-3 text-xs text-slate-100 dark:bg-slate-950">
                  {techDetails}
                </pre>
              )}
            </div>
          )}
        </Alert>
      )}
    </div>
  );
}
