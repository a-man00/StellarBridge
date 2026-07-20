"use client";

import { useCallback, useEffect, useState } from "react";
import { fetchAccountPayments, humanizeError } from "@/lib/stellar";
import type { PaymentRecord } from "@/lib/stellar";

interface TransactionsState {
  loading: boolean;
  records: PaymentRecord[];
  // "unfunded" distinguishes a 404 account from a genuine fetch error.
  unfunded: boolean;
  error: string | null;
}

const initial: TransactionsState = {
  loading: false,
  records: [],
  unfunded: false,
  error: null,
};

function isNotFound(err: unknown): boolean {
  if (typeof err !== "object" || err === null) return false;
  const e = err as { response?: { status?: number }; name?: string };
  return e.response?.status === 404 || e.name === "NotFoundError";
}

export function useTransactions(address: string | null) {
  const [state, setState] = useState<TransactionsState>(initial);

  const refresh = useCallback(async () => {
    if (!address) {
      setState(initial);
      return;
    }
    setState((s) => ({ ...s, loading: true, error: null }));
    try {
      const records = await fetchAccountPayments(address, 20);
      setState({ loading: false, records, unfunded: false, error: null });
    } catch (err) {
      if (isNotFound(err)) {
        setState({ loading: false, records: [], unfunded: true, error: null });
        return;
      }
      setState({
        loading: false,
        records: [],
        unfunded: false,
        error: humanizeError(err),
      });
    }
  }, [address]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    refresh();
  }, [refresh]);

  return { ...state, refresh };
}
