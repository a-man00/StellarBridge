"use client";

import { useCallback, useEffect, useState } from "react";
import {
  StellarWalletsKit,
  KitEventType,
} from "@creit.tech/stellar-wallets-kit";
import type { WalletState } from "@/lib/types";
import { EXPECTED_NETWORK } from "@/lib/constants";

const STORAGE_KEY = "stellarbridge:walletId";
const STORAGE_CONNECTED = "stellarbridge:connected";

// Map common wallet kit error messages to user-friendly text.
function classifyError(err: unknown): string {
  if (!err) return "Wallet returned an error.";
  if (typeof err === "string") return err;
  if (typeof err === "object") {
    const e = err as {
      code?: number;
      message?: string;
      error?: { code?: number; message?: string };
    };
    const msg = e.error?.message ?? e.message ?? "";

    // User rejected the signature or connection request.
    if (
      /reject|cancel|denied|dismissed/i.test(msg) ||
      e.code === 4001 ||
      e.error?.code === 4001
    ) {
      return "You rejected the request in your wallet.";
    }
    if (msg) return msg;
  }
  return "Unexpected wallet error.";
}

import { initWalletKit, getSupportedWallets } from "@/lib/wallet";

const initialState: WalletState = {
  address: null,
  network: null,
  status: "idle",
  error: null,
};

export function useWalletKit() {
  const [state, setState] = useState<WalletState>(initialState);
  const [walletId, setWalletId] = useState<string | null>(null);
  const [hasAnyWallet, setHasAnyWallet] = useState<boolean | null>(null);

  // Detect if at least one wallet module is available on mount.
  useEffect(() => {
    // Ensure the kit is initialized before querying wallets. This is safe to
    // call multiple times because init() just resets the active module list.
    initWalletKit();

    let active = true;
    (async () => {
      try {
        const supported = await getSupportedWallets();
        if (active) {
          setHasAnyWallet(supported.some((w) => w.isAvailable));
        }
      } catch {
        if (active) setHasAnyWallet(false);
      }
    })();
    return () => {
      active = false;
    };
  }, []);

  // Read the current network from the active wallet module.
  const refreshNetwork = useCallback(async (): Promise<string | null> => {
    try {
      const net = await StellarWalletsKit.getNetwork();
      return net.network;
    } catch {
      return null;
    }
  }, []);

  // Listen for kit events (disconnect, state updates).
  useEffect(() => {
    const unsubDisconnect = StellarWalletsKit.on(
      KitEventType.DISCONNECT,
      () => {
        if (typeof window !== "undefined") {
          window.localStorage.removeItem(STORAGE_CONNECTED);
          window.localStorage.removeItem(STORAGE_KEY);
        }
        setWalletId(null);
        setState(initialState);
      },
    );

    const unsubState = StellarWalletsKit.on(
      KitEventType.STATE_UPDATED,
      (event) => {
        const newAddress = event.payload.address;
        if (newAddress && newAddress !== state.address) {
          setState((s) => ({
            ...s,
            address: newAddress,
            status: "connected",
          }));
        }
      },
    );

    return () => {
      unsubDisconnect();
      unsubState();
    };
    // Only run on mount/unmount; the kit handles its own event lifecycle.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Silent reconnect if the user previously connected and we have a saved wallet.
  useEffect(() => {
    if (hasAnyWallet !== true) return;
    if (typeof window === "undefined") return;
    if (window.localStorage.getItem(STORAGE_CONNECTED) !== "1") return;

    const savedWallet = window.localStorage.getItem(STORAGE_KEY);
    if (!savedWallet) return;

    let active = true;
    (async () => {
      try {
        StellarWalletsKit.setWallet(savedWallet);
        const result = await StellarWalletsKit.fetchAddress();
        const net = await refreshNetwork();
        if (!active) return;
        setWalletId(savedWallet);
        setState({
          address: result.address,
          network: net,
          status: "connected",
          error: null,
        });
      } catch {
        // Silent reconnect failed; clear persisted state.
        if (typeof window !== "undefined") {
          window.localStorage.removeItem(STORAGE_CONNECTED);
          window.localStorage.removeItem(STORAGE_KEY);
        }
      }
    })();
    return () => {
      active = false;
    };
  }, [hasAnyWallet, refreshNetwork]);

  // Connect using a specific wallet module (by ID).
  const connectWith = useCallback(
    async (id: string) => {
      setState((s) => ({ ...s, status: "connecting", error: null }));
      try {
        StellarWalletsKit.setWallet(id);
        const result = await StellarWalletsKit.fetchAddress();
        const net = await refreshNetwork();

        if (typeof window !== "undefined") {
          window.localStorage.setItem(STORAGE_KEY, id);
          window.localStorage.setItem(STORAGE_CONNECTED, "1");
        }

        setWalletId(id);
        setState({
          address: result.address,
          network: net,
          status: "connected",
          error: null,
        });
      } catch (err) {
        setState({
          address: null,
          network: null,
          status: "error",
          error: classifyError(err),
        });
      }
    },
    [refreshNetwork],
  );

  const disconnect = useCallback(async () => {
    try {
      await StellarWalletsKit.disconnect();
    } catch {
      // Ignore disconnect errors; clear local state regardless.
    }
    if (typeof window !== "undefined") {
      window.localStorage.removeItem(STORAGE_CONNECTED);
      window.localStorage.removeItem(STORAGE_KEY);
    }
    setWalletId(null);
    setState(initialState);
  }, []);

  const isWrongNetwork =
    state.status === "connected" &&
    state.network !== null &&
    state.network !== EXPECTED_NETWORK;

  return {
    ...state,
    walletId,
    hasAnyWallet,
    isWrongNetwork,
    connectWith,
    disconnect,
    refreshNetwork,
  };
}
