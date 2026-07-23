"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import { useWallet } from "@/components/providers/WalletProvider";
import { getSupportedWallets } from "@/lib/wallet";
import type { ISupportedWallet } from "@creit.tech/stellar-wallets-kit";

function WalletIcon({ wallet }: { wallet: ISupportedWallet }) {
  // The kit returns SVG data URLs for most wallets. Fall back to a circle.
  if (wallet.icon && wallet.icon.startsWith("data:image")) {
    return (
      <Image
        src={wallet.icon}
        alt={`${wallet.name} icon`}
        width={32}
        height={32}
        className="h-8 w-8 flex-shrink-0 rounded-md object-contain"
        unoptimized
      />
    );
  }
  return (
    <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-md bg-slate-100 font-mono text-xs font-bold text-slate-500 dark:bg-slate-900 dark:text-slate-400">
      {wallet.name.slice(0, 1).toUpperCase()}
    </div>
  );
}

export function WalletSelectorModal() {
  const { isSelecting, closeSelector, connectWith } = useWallet();
  const [wallets, setWallets] = useState<ISupportedWallet[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isSelecting) return;

    let active = true;

    getSupportedWallets()
      .then((list) => {
        if (!active) return;
        // Prefer installed wallets first, then alphabetical.
        const sorted = [...list].sort((a, b) => {
          if (a.isAvailable === b.isAvailable) {
            return a.name.localeCompare(b.name);
          }
          return a.isAvailable ? -1 : 1;
        });
        setWallets(sorted);
      })
      .catch((err) => {
        if (!active) return;
        setError(err instanceof Error ? err.message : "Failed to load wallets.");
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [isSelecting]);

  if (!isSelecting || typeof document === "undefined") return null;

  return createPortal(
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-labelledby="wallet-selector-title"
      onClick={(e) => {
        if (e.target === e.currentTarget) closeSelector();
      }}
    >
      <div className="w-full max-w-md overflow-hidden rounded-xl border border-border bg-card shadow-sm">
        <div className="flex items-center justify-between border-b border-border px-5 py-4">
          <div>
            <h2
              id="wallet-selector-title"
              className="font-display text-lg font-semibold text-foreground"
            >
              Connect a wallet
            </h2>
            <p className="mt-0.5 text-xs text-muted">
              Choose a Stellar wallet to connect.
            </p>
          </div>
          <button
            onClick={closeSelector}
            className="rounded-md p-1 text-muted transition-colors hover:bg-slate-100 dark:hover:bg-slate-900"
            aria-label="Close"
          >
            ✕
          </button>
        </div>

        <div className="max-h-[60vh] overflow-y-auto p-3">
          {loading && (
            <p className="py-4 text-center font-mono text-sm text-muted">
              Detecting wallets…
            </p>
          )}

          {error && (
            <p className="rounded-lg border border-error/40 bg-error/10 p-3 text-sm text-error">
              {error}
            </p>
          )}

          {!loading && !error && wallets.length === 0 && (
            <p className="py-4 text-center text-sm text-muted">
              No wallets detected. Install a Stellar wallet to continue.
            </p>
          )}

          <ul className="space-y-2">
            {wallets.map((wallet) => (
              <li key={wallet.id}>
                {wallet.isAvailable ? (
                  <button
                    onClick={() => connectWith(wallet.id)}
                    className="flex w-full items-center gap-3 rounded-lg border border-border bg-slate-50 p-3 text-left transition-colors hover:border-accent hover:bg-slate-100 dark:bg-slate-900 dark:hover:bg-slate-950"
                  >
                    <WalletIcon wallet={wallet} />
                    <div className="min-w-0 flex-1">
                      <p className="font-medium text-foreground">{wallet.name}</p>
                      <p className="text-xs text-success">Detected</p>
                    </div>
                    <span className="text-sm font-medium text-accent">Connect</span>
                  </button>
                ) : (
                  <a
                    href={wallet.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex w-full items-center gap-3 rounded-lg border border-border bg-transparent p-3 text-left opacity-75 transition-opacity hover:opacity-100"
                  >
                    <WalletIcon wallet={wallet} />
                    <div className="min-w-0 flex-1">
                      <p className="font-medium text-foreground">{wallet.name}</p>
                      <p className="text-xs text-muted">Not installed</p>
                    </div>
                    <span className="text-sm text-muted">Install</span>
                  </a>
                )}
              </li>
            ))}
          </ul>
        </div>

        <div className="border-t border-border bg-slate-50 px-5 py-3 dark:bg-slate-900">
          <p className="text-xs text-muted">
            Don&apos;t see your wallet? Make sure it is installed and enabled in
            your browser, then reopen this dialog.
          </p>
        </div>
      </div>
    </div>,
    document.body,
  );
}
