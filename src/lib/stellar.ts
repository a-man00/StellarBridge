import {
  Asset,
  BASE_FEE,
  Horizon,
  Memo,
  Operation,
  TransactionBuilder,
} from "@stellar/stellar-sdk";
import {
  FRIENDBOT_URL,
  HORIZON_URL,
  NETWORK_PASSPHRASE,
} from "./constants";

let server: Horizon.Server | null = null;

export function getServer(): Horizon.Server {
  if (!server) {
    server = new Horizon.Server(HORIZON_URL);
  }
  return server;
}

export interface LoadedAccount {
  exists: boolean;
  nativeBalance: string;
}

// Returns balance info. If the account is not funded yet, Horizon returns 404;
// we treat that as { exists: false }.
export async function getAccount(address: string): Promise<LoadedAccount> {
  try {
    const account = await getServer().loadAccount(address);
    const native = account.balances.find((b) => b.asset_type === "native");
    return {
      exists: true,
      nativeBalance: native ? native.balance : "0",
    };
  } catch (err: unknown) {
    if (isNotFound(err)) {
      return { exists: false, nativeBalance: "0" };
    }
    throw err;
  }
}

export async function getNativeBalance(address: string): Promise<string | null> {
  const acct = await getAccount(address);
  return acct.exists ? acct.nativeBalance : null;
}

function isNotFound(err: unknown): boolean {
  if (typeof err !== "object" || err === null) return false;
  const e = err as { response?: { status?: number }; name?: string };
  return e.response?.status === 404 || e.name === "NotFoundError";
}

export interface BuildPaymentParams {
  sourceAddress: string;
  destination: string;
  amount: string;
  memo?: string;
}

// Builds an unsigned XLM payment transaction and returns its XDR string.
// Uses the fetched base fee when available, falling back to the SDK BASE_FEE.
export async function buildXlmPaymentXdr({
  sourceAddress,
  destination,
  amount,
  memo,
}: BuildPaymentParams): Promise<string> {
  const srv = getServer();
  const source = await srv.loadAccount(sourceAddress);

  let fee = BASE_FEE;
  try {
    const feeStats = await srv.feeStats();
    // Use the recommended (mode) fee, but never below BASE_FEE.
    const mode = Number(feeStats.fee_charged.mode);
    if (Number.isFinite(mode) && mode >= Number(BASE_FEE)) {
      fee = String(mode);
    }
  } catch {
    // Non-fatal: fall back to BASE_FEE.
  }

  const builder = new TransactionBuilder(source, {
    fee,
    networkPassphrase: NETWORK_PASSPHRASE,
  }).addOperation(
    Operation.payment({
      destination,
      asset: Asset.native(),
      amount,
    }),
  );

  if (memo && memo.trim()) {
    builder.addMemo(Memo.text(memo.trim()));
  }

  return builder.setTimeout(180).build().toXDR();
}

// Submits a signed transaction XDR and returns the transaction hash.
export async function submitSignedXdr(signedXdr: string): Promise<string> {
  const srv = getServer();
  const tx = TransactionBuilder.fromXDR(signedXdr, NETWORK_PASSPHRASE);
  const result = await srv.submitTransaction(tx);
  return result.hash;
}

// Maps a Horizon/Freighter error into a user-friendly message.
export function humanizeError(err: unknown): string {
  if (typeof err === "string") return err;
  if (typeof err !== "object" || err === null) return "Unexpected error.";

  const e = err as {
    message?: string;
    response?: {
      status?: number;
      data?: {
        extras?: { result_codes?: { operations?: string[]; transaction?: string } };
        title?: string;
      };
    };
  };

  const codes = e.response?.data?.extras?.result_codes;
  const opCodes = codes?.operations ?? [];
  if (opCodes.includes("op_no_destination")) {
    return "The destination account does not exist yet. It must be funded first.";
  }
  if (opCodes.includes("op_underfunded")) {
    return "Insufficient balance to complete this payment (including fee and reserve).";
  }
  if (opCodes.includes("op_low_reserve")) {
    return "This payment would drop the account below the minimum XLM reserve.";
  }
  if (codes?.transaction === "tx_insufficient_fee") {
    return "The network fee was too low. Please try again.";
  }
  if (codes?.transaction === "tx_bad_seq") {
    return "Sequence number mismatch. Refresh and try again.";
  }
  if (e.response?.data?.title) return String(e.response.data.title);
  if (e.message) return e.message;
  return "Unexpected error.";
}

export interface FriendbotResult {
  ok: boolean;
  message: string;
}

export async function fundWithFriendbot(
  address: string,
): Promise<FriendbotResult> {
  const res = await fetch(`${FRIENDBOT_URL}${encodeURIComponent(address)}`);
  if (res.ok) {
    return { ok: true, message: "Account funded with testnet XLM." };
  }
  // Friendbot returns 400 with detail when already funded or rate-limited.
  let detail = `Friendbot returned ${res.status}.`;
  try {
    const body = await res.json();
    if (body?.detail) detail = String(body.detail);
    else if (body?.title) detail = String(body.title);
  } catch {
    // ignore parse errors
  }
  return { ok: false, message: detail };
}

// A normalized payment record for the history view.
export interface PaymentRecord {
  id: string;
  type: "sent" | "received" | "created" | "other";
  amount: string | null;
  asset: string;
  counterparty: string | null;
  txHash: string;
  createdAt: string;
}

// Fetches recent payment-like operations for an account, newest first, and
// maps them into a UI-friendly shape (sent / received / account created).
export async function fetchAccountPayments(
  address: string,
  limit = 20,
): Promise<PaymentRecord[]> {
  const srv = getServer();
  const page = await srv
    .payments()
    .forAccount(address)
    .order("desc")
    .limit(limit)
    .call();

  const records: PaymentRecord[] = [];
  for (const op of page.records) {
    // Each operation carries the parent transaction hash + timestamp.
    const txHash = op.transaction_hash;
    const createdAt = op.created_at;

    if (op.type === "create_account") {
      const created = op as unknown as {
        account: string;
        funder: string;
        starting_balance: string;
      };
      const isSelf = created.account === address;
      records.push({
        id: op.id,
        type: isSelf ? "created" : "other",
        amount: created.starting_balance,
        asset: "XLM",
        counterparty: isSelf ? created.funder : created.account,
        txHash,
        createdAt,
      });
      continue;
    }

    if (op.type === "payment") {
      const pay = op as unknown as {
        from: string;
        to: string;
        amount: string;
        asset_type: string;
        asset_code?: string;
      };
      const isSent = pay.from === address;
      const asset =
        pay.asset_type === "native" ? "XLM" : pay.asset_code ?? "asset";
      records.push({
        id: op.id,
        type: isSent ? "sent" : "received",
        amount: pay.amount,
        asset,
        counterparty: isSent ? pay.to : pay.from,
        txHash,
        createdAt,
      });
      continue;
    }

    records.push({
      id: op.id,
      type: "other",
      amount: null,
      asset: "—",
      counterparty: null,
      txHash,
      createdAt,
    });
  }

  return records;
}
