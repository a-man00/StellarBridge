"use client";

import { useCallback, useEffect, useState } from "react";
import { rpc } from "@stellar/stellar-sdk";
import {
  getRemittanceReadClient,
  getRemittanceClient,
  SOROBAN_RPC_URL,
  type RemittanceRecord,
} from "@/lib/remittanceMessage";
import type { TxStatus } from "@/lib/types";

export interface UseRemittanceRecordsResult {
  records: RemittanceRecord[];
  loading: boolean;
  error: string | null;
  refresh: () => void;
}

export function useRemittanceRecords(
  enabled: boolean,
): UseRemittanceRecordsResult {
  const [records, setRecords] = useState<RemittanceRecord[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    if (!enabled) {
      setRecords([]);
      setError(null);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const client = await getRemittanceReadClient();
      const tx = await client.get_records();
      const result = await tx.simulate();
      setRecords(result.result ?? []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load records.");
      setRecords([]);
    } finally {
      setLoading(false);
    }
  }, [enabled]);

  useEffect(() => {
    // Fetch initial records; refresh() syncs with the external Soroban RPC.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    refresh();
  }, [refresh]);

  return { records, loading, error, refresh };
}

export interface SendRemittanceParams {
  sender: string;
  receiver: string;
  amount: bigint;
  message: string;
}

export interface UseSendRemittanceResult {
  status: TxStatus;
  hash: string | null;
  error: string | null;
  send: (params: SendRemittanceParams, onSuccess?: () => void) => Promise<void>;
  reset: () => void;
}

export function useSendRemittance(): UseSendRemittanceResult {
  const [status, setStatus] = useState<TxStatus>("idle");
  const [hash, setHash] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const reset = useCallback(() => {
    setStatus("idle");
    setHash(null);
    setError(null);
  }, []);

  const send = useCallback(
    async (params: SendRemittanceParams, onSuccess?: () => void) => {
      setStatus("pending");
      setHash(null);
      setError(null);
      try {
        const client = await getRemittanceClient(params.sender);
        const tx = await client.send_message({
          sender: params.sender,
          receiver: params.receiver,
          amount: params.amount,
          message: params.message,
        });
        const sent = await tx.signAndSend();
        setHash(sent.sendTransactionResponse?.hash ?? null);
        setStatus("success");
        onSuccess?.();
      } catch (err) {
        setStatus("error");
        setError(err instanceof Error ? err.message : "Contract call failed.");
      }
    },
    [],
  );

  return { status, hash, error, send, reset };
}

// Poll Soroban events for the RemittanceMessage contract after a transaction.
export async function waitForContractEvent(
  txHash: string,
  timeoutMs = 30000,
): Promise<boolean> {
  const server = new rpc.Server(SOROBAN_RPC_URL);
  const start = Date.now();
  while (Date.now() - start < timeoutMs) {
    try {
      const events = await server.getEvents({
        startLedger: 0,
        filters: [
          {
            type: "contract",
            contractIds: [],
          },
        ],
        limit: 10,
      });
      if (events.events.some((e) => e.txHash === txHash)) {
        return true;
      }
    } catch {
      // Ignore transient RPC errors.
    }
    await new Promise((resolve) => setTimeout(resolve, 2000));
  }
  return false;
}
