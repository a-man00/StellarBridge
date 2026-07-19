"use client";

import { useCallback, useEffect, useState } from "react";
import { fundWithFriendbot, getAccount, humanizeError } from "@/lib/stellar";
import type { AccountState } from "@/lib/types";

const initial: AccountState = {
  loading: false,
  exists: false,
  balance: null,
  error: null,
};

export function useStellarAccount(address: string | null) {
  const [state, setState] = useState<AccountState>(initial);
  const [funding, setFunding] = useState(false);
  const [fundError, setFundError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    if (!address) {
      setState(initial);
      return;
    }
    setState((s) => ({ ...s, loading: true, error: null }));
    try {
      const acct = await getAccount(address);
      setState({
        loading: false,
        exists: acct.exists,
        balance: acct.exists ? acct.nativeBalance : null,
        error: null,
      });
    } catch (err) {
      setState({
        loading: false,
        exists: false,
        balance: null,
        error: humanizeError(err),
      });
    }
  }, [address]);

  // Fetch on address change. refresh() sets state; this is the intended
  // "sync with an external system" (Horizon) pattern.
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    refresh();
  }, [refresh]);

  const fund = useCallback(async () => {
    if (!address) return;
    setFunding(true);
    setFundError(null);
    try {
      const res = await fundWithFriendbot(address);
      if (!res.ok) {
        setFundError(res.message);
      } else {
        await refresh();
      }
    } catch (err) {
      setFundError(humanizeError(err));
    } finally {
      setFunding(false);
    }
  }, [address, refresh]);

  return { ...state, refresh, fund, funding, fundError };
}
