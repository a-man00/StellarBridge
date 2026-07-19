"use client";

import { useCallback, useEffect, useState } from "react";
import {
  getAddress,
  getNetwork,
  isConnected,
  isAllowed,
  requestAccess,
} from "@stellar/freighter-api";
import { EXPECTED_NETWORK } from "@/lib/constants";
import type { WalletState } from "@/lib/types";

const STORAGE_KEY = "stellarbridge:connected";

// Freighter v6 returns an error object ({ message, code }) rather than a string.
function freighterErrorText(error: unknown): string {
  if (!error) return "Freighter returned an error.";
  if (typeof error === "string") return error;
  if (typeof error === "object" && error !== null && "message" in error) {
    const msg = (error as { message?: unknown }).message;
    if (typeof msg === "string") return msg;
  }
  return "Freighter returned an error.";
}

const initialState: WalletState = {
  address: null,
  network: null,
  status: "idle",
  error: null,
};

export function useFreighter() {
  const [state, setState] = useState<WalletState>(initialState);
  const [installed, setInstalled] = useState<boolean | null>(null);

  // Detect Freighter presence on mount.
  useEffect(() => {
    let active = true;
    (async () => {
      try {
        const res = await isConnected();
        if (active) setInstalled(res.isConnected);
      } catch {
        if (active) setInstalled(false);
      }
    })();
    return () => {
      active = false;
    };
  }, []);

  const refreshNetwork = useCallback(async () => {
    const net = await getNetwork();
    if (net.error) return null;
    return net.network;
  }, []);

  // Silently reconnect if the user previously connected and still allows us.
  useEffect(() => {
    if (installed !== true) return;
    if (typeof window === "undefined") return;
    if (window.localStorage.getItem(STORAGE_KEY) !== "1") return;

    let active = true;
    (async () => {
      try {
        const allowed = await isAllowed();
        if (!allowed.isAllowed) return;
        const addr = await getAddress();
        if (addr.error || !addr.address) return;
        const net = await refreshNetwork();
        if (!active) return;
        setState({
          address: addr.address,
          network: net,
          status: "connected",
          error: null,
        });
      } catch {
        // ignore silent reconnect failures
      }
    })();
    return () => {
      active = false;
    };
  }, [installed, refreshNetwork]);

  const connect = useCallback(async () => {
    setState((s) => ({ ...s, status: "connecting", error: null }));
    try {
      const access = await requestAccess();
      if (access.error) {
        setState({
          address: null,
          network: null,
          status: "error",
          error: freighterErrorText(access.error),
        });
        return;
      }
      const net = await refreshNetwork();
      if (typeof window !== "undefined") {
        window.localStorage.setItem(STORAGE_KEY, "1");
      }
      setState({
        address: access.address,
        network: net,
        status: "connected",
        error: null,
      });
    } catch (err: unknown) {
      const msg =
        err instanceof Error ? err.message : "Failed to connect to Freighter.";
      setState({ address: null, network: null, status: "error", error: msg });
    }
  }, [refreshNetwork]);

  const disconnect = useCallback(() => {
    if (typeof window !== "undefined") {
      window.localStorage.removeItem(STORAGE_KEY);
    }
    setState(initialState);
  }, []);

  const isWrongNetwork =
    state.status === "connected" &&
    state.network !== null &&
    state.network !== EXPECTED_NETWORK;

  return {
    ...state,
    installed,
    isWrongNetwork,
    connect,
    disconnect,
  };
}
