// StellarWalletsKit initialization and helpers for multi-wallet support.
// This replaces the Freighter-only implementation for Level 2.

import {
  StellarWalletsKit,
  Networks,
  type ISupportedWallet,
} from "@creit.tech/stellar-wallets-kit";
import { defaultModules } from "@creit.tech/stellar-wallets-kit/modules/utils";

// Initialize the kit with all default wallet modules.
// These include: Freighter, xBull, Lobstr, Hana, Albedo, Rabet, and more.
export function initWalletKit(): void {
  StellarWalletsKit.init({
    modules: defaultModules(),
    network: Networks.TESTNET,
  });
}

// Fetch the list of supported wallets and their availability status.
export async function getSupportedWallets(): Promise<ISupportedWallet[]> {
  return await StellarWalletsKit.refreshSupportedWallets();
}

// Sign a transaction XDR with the currently selected wallet module.
export async function signWithWallet(
  xdr: string,
  opts?: { networkPassphrase?: string; address?: string },
): Promise<{ signedTxXdr: string }> {
  return await StellarWalletsKit.signTransaction(xdr, opts);
}

// Re-export the kit for direct access if needed.
export { StellarWalletsKit, Networks };
