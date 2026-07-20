"use client";

import { createContext, useContext, type ReactNode } from "react";
import { useFreighter } from "@/hooks/useFreighter";

// Shape of the wallet context shared across all routes.
interface WalletContextValue {
  address: string | null;
  network: string | null;
  isConnected: boolean;
  isConnecting: boolean;
  installed: boolean | null;
  isWrongNetwork: boolean;
  error: string | null;
  connect: () => Promise<void>;
  disconnect: () => void;
}

const WalletContext = createContext<WalletContextValue | null>(null);

export function WalletProvider({ children }: { children: ReactNode }) {
  const wallet = useFreighter();

  const value: WalletContextValue = {
    address: wallet.address,
    network: wallet.network,
    isConnected: wallet.status === "connected" && !!wallet.address,
    isConnecting: wallet.status === "connecting",
    installed: wallet.installed,
    isWrongNetwork: wallet.isWrongNetwork,
    error: wallet.error,
    connect: wallet.connect,
    disconnect: wallet.disconnect,
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
