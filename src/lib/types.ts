export type ConnectionStatus =
  | "idle"
  | "connecting"
  | "connected"
  | "error";

export type TxStatus = "idle" | "pending" | "success" | "error";

export interface WalletState {
  address: string | null;
  network: string | null;
  status: ConnectionStatus;
  error: string | null;
}

export interface AccountState {
  loading: boolean;
  exists: boolean;
  balance: string | null; // native XLM balance as string
  error: string | null;
}

export interface SendResult {
  hash: string;
}

// Simulated remittance fields — UI only, never touch the real transaction.
export interface RemittanceContext {
  sourceCountry: string;
  destCountry: string;
  sourceCurrency: string;
  destCurrency: string;
}
