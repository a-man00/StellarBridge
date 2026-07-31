"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useWallet } from "@/components/providers/WalletProvider";
import { shortenAddress } from "@/lib/format";
import { explorerAccountUrl } from "@/lib/constants";

// ─── Types ───────────────────────────────────────────────────────────────────

type NotificationType = "connecting" | "connected" | "disconnected" | "error";

interface Notification {
  id: number;
  type: NotificationType;
  address: string | null;
  walletId: string | null;
  network: string | null;
  error?: string;
  phase: "entering" | "visible" | "exiting";
}

// ─── Wallet name lookup ──────────────────────────────────────────────────────

const WALLET_NAMES: Record<string, string> = {
  freighter: "Freighter",
  xbull: "xBull",
  lobstr: "Lobstr",
  albedo: "Albedo",
  rabet: "Rabet",
  hana: "Hana",
};

function getWalletName(walletId: string | null): string {
  if (!walletId) return "";
  return WALLET_NAMES[walletId] ?? walletId;
}

const AUTO_DISMISS_MS = 4000;
const EXIT_ANIM_MS = 300;

// ─── Main component ──────────────────────────────────────────────────────────

export function WalletStatusIndicator() {
  const { address, network, walletId, isConnected, isConnecting, error } =
    useWallet();

  const [notification, setNotification] = useState<Notification | null>(null);

  // Track previous connection states to detect transitions.
  const prevConnecting = useRef(isConnecting);
  const prevError = useRef(error);

  // Dedicated flag: ONLY set to true when we actually SHOW the "connected"
  // notification. This avoids the timing issue where the kit's STATE_UPDATED
  // event flips isConnected=true BEFORE walletId and network are set (they
  // arrive in a separate render), which would otherwise block the real
  // notification via a stale prevConnected ref.
  const shownConnected = useRef(false);

  const idCounter = useRef(0);

  // Timer ref: stores the current auto-dismiss timeout ID.
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const notifRef = useRef<Notification | null>(null);

  // ── Timer helpers ───────────────────────────────────────────────────────

  const clearTimer = useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  const startExitAnimation = useCallback(() => {
    // Mark as exiting so the slide-out CSS transition plays.
    setNotification((prev) =>
      prev ? { ...prev, phase: "exiting" } : prev,
    );
    // Fully remove from DOM after animation completes.
    setTimeout(() => {
      setNotification(null);
      notifRef.current = null;
    }, EXIT_ANIM_MS);
  }, []);

  // ── Core: create a notification with EXPLICITLY passed values ──────────

  const presentNotification = useCallback(
    (
      type: NotificationType,
      /** Pass the wallet values at the moment of the call — no closure capture. */
      walletInfo: {
        address: string | null;
        walletId: string | null;
        network: string | null;
      },
      extra?: { error?: string },
    ) => {
      clearTimer();
      const id = ++idCounter.current;

      const notif: Notification = {
        id,
        type,
        address: walletInfo.address,
        walletId: walletInfo.walletId,
        network: walletInfo.network,
        phase: "entering",
        ...extra,
      };

      setNotification(notif);
      notifRef.current = notif;

      // Next frame: transition the CSS animation from entering → visible.
      requestAnimationFrame(() => {
        setNotification((prev) =>
          prev?.id === id ? { ...prev, phase: "visible" } : prev,
        );
      });

      // Schedule auto-dismiss.
      timerRef.current = setTimeout(startExitAnimation, AUTO_DISMISS_MS);
    },
    [clearTimer, startExitAnimation],
  );

  // ── State transition detection ─────────────────────────────────────────
  // The kit's STATE_UPDATED event can flip isConnected=true BEFORE walletId
  // and network arrive (they come from separate state updates). Using
  // prevConnected would get desynced. Instead, we use a dedicated
  // shownConnected flag that only flips when we actually SHOW the notification.
  // And we require walletId to be truthy before showing "connected".

  useEffect(() => {
    const wasConnecting = prevConnecting.current;
    prevConnecting.current = isConnecting;

    // Connecting just started.
    if (isConnecting && !wasConnecting) {
      presentNotification("connecting", { address, walletId, network });
      return;
    }

    // Just connected — require walletId so we have the wallet name to display.
    if (isConnected && walletId && !shownConnected.current) {
      shownConnected.current = true;
      presentNotification("connected", { address, walletId, network });
      return;
    }

    // Just disconnected.
    if (!isConnected && !isConnecting && shownConnected.current) {
      shownConnected.current = false;
      presentNotification("disconnected", { address, walletId, network });
      return;
    }

    // Catch disconnected edge case (was connecting but never connected).
    if (!isConnected && !isConnecting && !shownConnected.current && wasConnecting) {
      presentNotification("disconnected", { address, walletId, network });
      return;
    }

  }, [isConnected, isConnecting, address, walletId, network, presentNotification]);

  // ── Error notification (only when error string changes) ─────────────────

  useEffect(() => {
    if (error && error !== prevError.current) {
      prevError.current = error;
      presentNotification("error", { address, walletId, network }, { error });
    }
  }, [error, address, walletId, network, presentNotification]);

  // ── Cleanup timer on unmount ────────────────────────────────────────────

  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  // ── Render ──────────────────────────────────────────────────────────────

  if (!notification) return null;

  const entering = notification.phase === "entering";
  const exiting = notification.phase === "exiting";
  const hidden = entering || exiting;

  return (
    <div
      className="fixed bottom-4 right-4 z-40"
      role="status"
      aria-live="polite"
    >
      <div
        onMouseEnter={clearTimer}
        onMouseLeave={() => {
          // Restart timer if notification is still visible.
          if (notification.phase === "visible") {
            timerRef.current = setTimeout(startExitAnimation, AUTO_DISMISS_MS);
          }
        }}
        className={`
          overflow-hidden rounded-lg border border-border bg-card shadow-sm
          transition-all duration-300 ease-out will-change-transform
          ${hidden ? "translate-y-2 opacity-0" : "translate-y-0 opacity-100"}
          ${exiting ? "translate-x-3" : "translate-x-0"}
        `}
      >
        {notification.type === "connected" ? (
          <ConnectedContent notification={notification} />
        ) : notification.type === "disconnected" ? (
          <DisconnectedContent />
        ) : notification.type === "connecting" ? (
          <ConnectingContent />
        ) : (
          <ErrorContent message={notification.error ?? "Unknown error"} />
        )}
      </div>
    </div>
  );
}

// ─── Content variants ────────────────────────────────────────────────────────

function ConnectingContent() {
  return (
    <div className="flex items-center gap-2.5 px-3.5 py-2.5">
      <span className="relative flex h-2.5 w-2.5">
        <span className="absolute inline-flex h-full w-full animate-pulse rounded-full bg-warning/40" />
        <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-warning" />
      </span>
      <span className="whitespace-nowrap font-mono text-xs font-medium text-foreground">
        Connecting…
      </span>
    </div>
  );
}

function DisconnectedContent() {
  return (
    <div className="flex items-center gap-2.5 px-3.5 py-2.5">
      <span className="relative flex h-2.5 w-2.5">
        <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-error" />
      </span>
      <span className="whitespace-nowrap font-mono text-xs font-medium text-foreground">
        Wallet Disconnected Successfully
      </span>
    </div>
  );
}

function ErrorContent({ message }: { message: string }) {
  return (
    <div className="flex items-center gap-2.5 px-3.5 py-2.5">
      <span className="relative flex h-2.5 w-2.5">
        <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-error" />
      </span>
      <span className="whitespace-nowrap font-mono text-xs font-medium text-error">
        {message}
      </span>
    </div>
  );
}

function ConnectedContent({
  notification,
}: {
  notification: Notification;
}) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!notification.address) return;
    try {
      await navigator.clipboard.writeText(notification.address);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      // ignore
    }
  };

  const walletName = getWalletName(notification.walletId);
  const displayNetwork = notification.network ?? "Testnet";
  const isWrongNetwork = notification.network === "PUBLIC";

  return (
    <div className="px-3.5 py-3">
      {/* Header row */}
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <span className="relative flex h-2.5 w-2.5">
            <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-success" />
          </span>
          <span className="font-mono text-xs font-medium text-foreground">
            Wallet Connected
          </span>
        </div>
      </div>

      {/* Info rows */}
      <div className="mt-3 space-y-2">
        {/* Address */}
        <div className="flex items-center justify-between gap-3">
          <span className="font-mono text-[11px] text-muted">Address</span>
          <div className="flex items-center gap-1.5">
            <a
              href={
                notification.address
                  ? explorerAccountUrl(notification.address)
                  : "#"
              }
              target="_blank"
              rel="noopener noreferrer"
              className="font-mono text-xs text-accent hover:underline underline-offset-2"
              title="View on Explorer"
            >
              {shortenAddress(notification.address ?? "", 5)}
            </a>
            <button
              onClick={handleCopy}
              className="font-mono text-[9px] uppercase tracking-wider text-muted hover:text-foreground transition-colors"
              title="Copy full address"
            >
              {copied ? "Copied" : "Copy"}
            </button>
          </div>
        </div>

        {/* Wallet name */}
        <div className="flex items-center justify-between gap-3">
          <span className="font-mono text-[11px] text-muted">Wallet</span>
          <span className="font-mono text-xs text-foreground">
            {walletName || (
              <span className="text-muted italic">unknown</span>
            )}
          </span>
        </div>

        {/* Network */}
        <div className="flex items-center justify-between gap-3">
          <span className="font-mono text-[11px] text-muted">Network</span>
          <span className="inline-flex items-center gap-1.5 font-mono text-xs text-foreground">
            <span className={`h-1.5 w-1.5 rounded-full ${isWrongNetwork ? "bg-warning" : "bg-success"}`} />
            <span className={isWrongNetwork ? "text-warning" : ""}>
              {displayNetwork}
            </span>
          </span>
        </div>
      </div>
    </div>
  );
}
