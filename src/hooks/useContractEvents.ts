"use client";

import { useEffect, useState } from "react";
import { rpc } from "@stellar/stellar-sdk";
import {
  getRemittanceContractId,
  SOROBAN_RPC_URL,
} from "@/lib/remittanceMessage";

export type ContractEventStatus = "idle" | "received" | "timeout";

interface UseContractEventsOptions {
  enabled: boolean;
  txHash?: string | null;
  timeoutMs?: number;
  pollIntervalMs?: number;
}

// Poll Soroban RPC events for the RemittanceMessage contract.
// When a matching event is found (optionally tied to a specific txHash), the
// status flips to "received".
export function useContractEvents({
  enabled,
  txHash,
  timeoutMs = 30000,
  pollIntervalMs = 2000,
}: UseContractEventsOptions) {
  const [status, setStatus] = useState<ContractEventStatus>("idle");
  const contractId = getRemittanceContractId();

  useEffect(() => {
    if (!enabled || !contractId) return;

    const timeoutId = setTimeout(() => {
      setStatus("timeout");
    }, timeoutMs);

    const server = new rpc.Server(SOROBAN_RPC_URL);

    const check = async () => {
      try {
        const latestLedgerResponse = await server.getLatestLedger();
        const startLedger = Math.max(
          0,
          Number(latestLedgerResponse.sequence) - 17280,
        );

        const events = await server.getEvents({
          startLedger,
          filters: [
            {
              type: "contract",
              contractIds: [contractId],
            },
          ],
          limit: 10,
        });

        const matched = txHash
          ? events.events.some((event) => event.txHash === txHash)
          : events.events.length > 0;

        if (matched) {
          clearTimeout(timeoutId);
          setStatus("received");
          return true;
        }
      } catch {
        // Ignore transient RPC errors and keep polling.
      }
      return false;
    };

    const intervalId = setInterval(async () => {
      const found = await check();
      if (found) {
        clearInterval(intervalId);
      }
    }, pollIntervalMs);

    check();

    return () => {
      clearInterval(intervalId);
      clearTimeout(timeoutId);
    };
  }, [enabled, txHash, contractId, timeoutMs, pollIntervalMs]);

  return { status, contractId };
}
