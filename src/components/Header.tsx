"use client";

import { Badge } from "./ui/Badge";
import { ThemeToggle } from "./ThemeToggle";
import { WalletConnectButton } from "./WalletConnectButton";
import type { WalletState } from "@/lib/types";

interface Props {
  wallet: Pick<WalletState, "address" | "status"> & { installed: boolean | null };
  onConnect: () => void;
  onDisconnect: () => void;
}

export function Header({ wallet, onConnect, onDisconnect }: Props) {
  return (
    <header className="border-b border-slate-200 dark:border-slate-800">
      <div className="mx-auto flex max-w-3xl flex-col gap-4 px-4 py-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
                StellarBridge
              </h1>
              <Badge tone="info">Testnet</Badge>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Cross-Border Remittance Hub
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <ThemeToggle />
          <WalletConnectButton
            address={wallet.address}
            status={wallet.status}
            installed={wallet.installed}
            onConnect={onConnect}
            onDisconnect={onDisconnect}
          />
        </div>
      </div>
    </header>
  );
}
