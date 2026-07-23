"use client";

import { createContext, useContext, useState, type ReactNode } from "react";
import { useWalletKit } from "@/hooks/useWalletKit";

// Shape of the wallet context shared across all routes.
interface WalletContextValue {
  address: string | null;
  network: string | null;
  walletId: string | null;
  isConnected: boolean;
  isConnecting: boolean;
  hasWallet: boolean | null;
  isWrongNetwork: boolean;
  error: string | null;
  isSelecting: boolean;
  connect: () => void;
  connectWith: (id: string) => Promise<void>;
  disconnect: () => Promise<void>;
  closeSelector: () => void;
}

const WalletContext = createContext<WalletContextValue | null>(null);

export function WalletProvider({ children }: { children: ReactNode }) {
  const {
    address,
    network,
    walletId,
    status,
    error,
    hasAnyWallet,
    isWrongNetwork,
    connectWith,
    disconnect,
  } = useWalletKit();

  const [isSelecting, setIsSelecting] = useState(false);

  const connect = () => setIsSelecting(true);
  const closeSelector = () => setIsSelecting(false);

  const connectWithId = async (id: string) => {
    setIsSelecting(false);
    await connectWith(id);
  };

  const value: WalletContextValue = {
    address,
    network,
    walletId,
    isConnected: status === "connected" && !!address,
    isConnecting: status === "connecting",
    hasWallet: hasAnyWallet,
    isWrongNetwork,
    error,
    isSelecting,
    connect,
    connectWith: connectWithId,
    disconnect,
    closeSelector,
  };

  return (
    <WalletContext.Provider value={value}>{children}</WalletContext.Provider>
  );
}

// Access the shared wallet connection from any client component.
export function useWallet(): WalletContextValue {
  const ctx = useContext(WalletContext);
  if (!ctx) {
    throw new Error("useWallet must be used within a WalletProvider");
  }
  return ctx;
}
