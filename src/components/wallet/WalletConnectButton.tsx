"use client";

import { useEffect, useRef, useState } from "react";
import { explorerAccountUrl } from "@/lib/constants";
import { shortenAddress } from "@/lib/format";
import { useWallet } from "@/components/providers/WalletProvider";
import { Button } from "@/components/ui/Button";

export function WalletConnectButton() {
  const { address, isConnected, isConnecting, installed, connect, disconnect } =
    useWallet();
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const menuRef = useRef<HTMLDivElement | null>(null);

  // Close the dropdown on outside click.
  useEffect(() => {
    if (!open) return;
    const onClick = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, [open]);

  if (installed === false) {
    return (
      <a
        href="https://www.freighter.app/"
        target="_blank"
        rel="noopener noreferrer"
      >
        <Button variant="secondary" size="sm">
          Install Freighter
        </Button>
      </a>
    );
  }

  if (!isConnected || !address) {
    return (
      <Button size="sm" onClick={connect} disabled={isConnecting}>
        {isConnecting ? "Connecting…" : "Connect Wallet"}
      </Button>
    );
  }

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(address);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      // clipboard may be unavailable; ignore
    }
  };

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setOpen((v) => !v)}
        className="inline-flex items-center gap-2 rounded-lg border border-border px-3 py-1.5 font-mono text-xs text-foreground transition-colors hover:bg-slate-50 dark:hover:bg-slate-900"
        aria-haspopup="menu"
        aria-expanded={open}
      >
        <span className="h-2 w-2 animate-pulse-dot rounded-full bg-success" />
        {shortenAddress(address)}
      </button>

      {open && (
        <div
          role="menu"
          className="absolute right-0 z-50 mt-2 w-64 rounded-lg border border-border bg-card p-3 shadow-sm"
        >
          <p className="mb-1 font-mono text-[10px] uppercase tracking-widest text-muted">
            Connected address
          </p>
          <p className="break-all font-mono text-xs text-foreground">{address}</p>
          <div className="mt-3 flex flex-col gap-2">
            <Button variant="secondary" size="sm" onClick={copy}>
              {copied ? "Copied" : "Copy address"}
            </Button>
            <a
              href={explorerAccountUrl(address)}
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button variant="secondary" size="sm" className="w-full">
                View on Explorer
              </Button>
            </a>
            <Button
              variant="danger"
              size="sm"
              onClick={() => {
                disconnect();
                setOpen(false);
              }}
            >
              Disconnect
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
