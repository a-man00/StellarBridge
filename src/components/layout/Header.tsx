"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { NAV_LINKS } from "@/lib/constants";
import { ThemeToggle } from "./ThemeToggle";
import { MobileNav } from "./MobileNav";
import { WalletConnectButton } from "@/components/wallet/WalletConnectButton";
import { useWallet } from "@/components/providers/WalletProvider";

export function Header() {
  const pathname = usePathname();
  const { network, isConnected } = useWallet();
  const displayNetwork = isConnected ? (network ?? null) : null;

  return (
    <header className="sticky top-0 z-30 border-b border-border bg-background/90 backdrop-blur-sm">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3">
        {/* Wordmark */}
        <Link href="/home" className="flex items-center gap-2.5">
          <span
            className="flex h-8 w-8 items-center justify-center rounded-lg border border-border font-display text-sm font-bold text-foreground"
            aria-hidden="true"
          >
            SB
          </span>
          <span className="hidden flex-col leading-none sm:flex">
            <span className="font-display text-sm font-bold tracking-tight text-foreground">
              StellarBridge
            </span>
            <span className="mt-0.5 font-mono text-[10px] uppercase tracking-widest text-muted">
              Remittance Hub
            </span>
          </span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden items-center gap-1 sm:flex">
          {NAV_LINKS.map((link) => {
            const active = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                aria-current={active ? "page" : undefined}
                className={`rounded-lg px-3 py-1.5 text-sm transition-colors ${
                  active
                    ? "font-medium text-foreground"
                    : "text-muted hover:text-foreground"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-2">
          {displayNetwork && (
            <span className="hidden items-center gap-1.5 rounded-full border border-border px-2.5 py-0.5 font-mono text-[10px] uppercase tracking-widest md:inline-flex"
              data-network={displayNetwork}>
              <span className={`h-1.5 w-1.5 animate-pulse-dot rounded-full ${displayNetwork === "PUBLIC" ? "bg-warning" : "bg-accent"}`} />
              <span className={displayNetwork === "PUBLIC" ? "text-warning" : "text-muted"}>
                {displayNetwork}
              </span>
            </span>
          )}
          <ThemeToggle />
          <div className="hidden sm:block">
            <WalletConnectButton />
          </div>
          <MobileNav />
        </div>
      </div>

      {/* Wallet button below the bar on mobile for reachability */}
      <div className="border-t border-border px-4 py-2 sm:hidden">
        <WalletConnectButton />
      </div>
    </header>
  );
}
