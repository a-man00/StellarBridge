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

// Fetch the list of supported wallets and verify their actual extension availability on the device.
export async function getSupportedWallets(): Promise<ISupportedWallet[]> {
  const list = await StellarWalletsKit.refreshSupportedWallets();
  if (typeof window === "undefined") return list;

  const win = window as unknown as Record<string, unknown>;

  return list.map((wallet) => {
    let installed = wallet.isAvailable;

    switch (wallet.id) {
      case "freighter":
        installed =
          !!win.freighter ||
          (win.stellar as { provider?: string })?.provider === "freighter" ||
          wallet.isAvailable;
        break;
      case "xbull":
        installed = !!win.xBullWallet || !!win.xBull;
        break;
      case "albedo":
        installed = !!win.albedo;
        break;
      case "rabet":
        installed = !!win.rabet;
        break;
      case "hana":
        installed = !!win.hana;
        break;
      case "lobstr":
        installed = !!win.lobstr;
        break;
      default:
        break;
    }

    return {
      ...wallet,
      isAvailable: installed,
    };
  });
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
