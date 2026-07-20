import { MOCK_USD_PER_XLM } from "./constants";

// Trim trailing zeros while keeping up to 7 decimals (Stellar precision).
export function formatStellarAmount(amount: string | number): string {
  const n = typeof amount === "string" ? Number(amount) : amount;
  if (!Number.isFinite(n)) return "0";
  // toFixed(7) then strip trailing zeros and a dangling dot.
  return n.toFixed(7).replace(/\.?0+$/, "");
}

export function shortenAddress(address: string, chars = 4): string {
  if (!address) return "";
  if (address.length <= chars * 2 + 3) return address;
  return `${address.slice(0, chars)}...${address.slice(-chars)}`;
}

export function mockUsd(xlm: string | number): string {
  const n = typeof xlm === "string" ? Number(xlm) : xlm;
  if (!Number.isFinite(n)) return "0.00";
  return (n * MOCK_USD_PER_XLM).toFixed(2);
}

// Formats an ISO timestamp into a compact, locale-friendly date + time.
export function formatTimestamp(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}
