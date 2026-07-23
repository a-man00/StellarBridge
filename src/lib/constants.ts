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

// Deployed Soroban contracts on Stellar testnet.
export const DEFAULT_REMITTANCE_CONTRACT_ID =
  "CDOZMZ45ZI44OMPFY35BCR3KXNPXMUFODMJLW2EX33O4CO3LJSF37NYI";

export const DEFAULT_FEE_REGISTRY_CONTRACT_ID =
  "CDEOGU3IHCOMDF66XJEJ6LCXGSAAS3IWX5FVTTIMV7X3HCDICEBVOS3S";

export const DEFAULT_REMITTANCE_ROUTER_CONTRACT_ID =
  "CDMASVVLKQYFEHFCQROYW3PG5Z4UNUVNIVKYOUUXDVTXSGWQU3KQI23D";

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

// Primary navigation shared by the header and mobile menu.
export const NAV_LINKS = [
  { href: "/home", label: "Home" },
  { href: "/app", label: "App" },
  { href: "/guide", label: "Guide" },
  { href: "/history", label: "History" },
  { href: "/about", label: "About" },
] as const;
