import { StrKey } from "@stellar/stellar-sdk";
import { MEMO_TEXT_MAX_BYTES } from "./constants";

export function isValidStellarAddress(address: string): boolean {
  try {
    return StrKey.isValidEd25519PublicKey(address.trim());
  } catch {
    return false;
  }
}

export interface AmountValidation {
  valid: boolean;
  error?: string;
}

export function validateAmount(
  amount: string,
  availableBalance: string | null,
): AmountValidation {
  const trimmed = amount.trim();
  if (!trimmed) return { valid: false, error: "Enter an amount." };
  const n = Number(trimmed);
  if (!Number.isFinite(n)) return { valid: false, error: "Amount must be a number." };
  if (n <= 0) return { valid: false, error: "Amount must be greater than zero." };
  // Stellar smallest unit is 1 stroop = 0.0000001 XLM.
  if (n < 0.0000001) return { valid: false, error: "Amount is below the minimum (0.0000001 XLM)." };
  // Reject more than 7 decimal places.
  if (/\.\d{8,}$/.test(trimmed)) {
    return { valid: false, error: "Maximum 7 decimal places." };
  }
  if (availableBalance !== null && n > Number(availableBalance)) {
    return { valid: false, error: "Amount exceeds your available balance." };
  }
  return { valid: true };
}

export function validateMemo(memo: string): AmountValidation {
  if (!memo) return { valid: true };
  const bytes = new TextEncoder().encode(memo).length;
  if (bytes > MEMO_TEXT_MAX_BYTES) {
    return {
      valid: false,
      error: `Memo is too long (${bytes}/${MEMO_TEXT_MAX_BYTES} bytes).`,
    };
  }
  return { valid: true };
}
