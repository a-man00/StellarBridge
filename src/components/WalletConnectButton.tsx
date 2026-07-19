"use client";

import { useState } from "react";
import { shortenAddress } from "@/lib/format";
import { Button } from "./ui/Button";

interface Props {
  address: string | null;
  status: "idle" | "connecting" | "connected" | "error";
  installed: boolean | null;
  onConnect: () => void;
  onDisconnect: () => void;
}

export function WalletConnectButton({
  address,
  status,
  installed,
  onConnect,
  onDisconnect,
}: Props) {
  const [copied, setCopied] = useState(false);

  if (installed === false) {
    return (
      <a
        href="https://www.freighter.app/"
        target="_blank"
        rel="noopener noreferrer"
      >
        <Button variant="secondary">Install Freighter</Button>
      </a>
    );
  }

  if (status === "connected" && address) {
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
      <div className="flex items-center gap-2">
        <button
          onClick={copy}
          title="Copy address"
          className="rounded-lg border border-slate-200 px-3 py-2 font-mono text-xs text-slate-700 hover:bg-slate-50 dark:border-slate-800 dark:text-slate-300 dark:hover:bg-slate-800"
        >
          {copied ? "Copied!" : shortenAddress(address)}
        </button>
        <Button variant="secondary" onClick={onDisconnect}>
          Disconnect
        </Button>
      </div>
    );
  }

  return (
    <Button onClick={onConnect} disabled={status === "connecting"}>
      {status === "connecting" ? "Connecting…" : "Connect Freighter Wallet"}
    </Button>
  );
}
