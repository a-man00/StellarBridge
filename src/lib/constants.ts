// Stellar testnet configuration. All values are public; no secrets here.

export const HORIZON_URL =
  process.env.NEXT_PUBLIC_HORIZON_URL ?? "https://horizon-testnet.stellar.org";

export const NETWORK_PASSPHRASE =
  process.env.NEXT_PUBLIC_STELLAR_NETWORK_PASSPHRASE ??
  "Test SDF Network ; September 2015";

export const EXPLORER_URL =
  process.env.NEXT_PUBLIC_STELLAR_EXPLORER_URL ??
  "https://stellar.expert/explorer/testnet";

export const FRIENDBOT_URL =
  process.env.NEXT_PUBLIC_FRIENDBOT_URL ??
  "https://friendbot.stellar.org/?addr=";

// Human-readable network name Freighter reports on testnet.
export const EXPECTED_NETWORK = "TESTNET";

// Mock FX rate for the remittance quote panel (UI only, never affects tx).
export const MOCK_USD_PER_XLM = 0.11;

// Max XLM memo text length (Stellar MEMO_TEXT limit is 28 bytes).
export const MEMO_TEXT_MAX_BYTES = 28;

// Minimum stroops-based amount and reserve buffer.
export const BASE_RESERVE_XLM = 1; // simplified; real reserve depends on entries
export const FEE_BUFFER_XLM = 0.001; // leave room for fee on "max" button

export function explorerTxUrl(hash: string): string {
  return `${EXPLORER_URL}/tx/${hash}`;
}

export function explorerAccountUrl(address: string): string {
  return `${EXPLORER_URL}/account/${address}`;
}
