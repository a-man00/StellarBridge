// Mock corridor + country/currency data for the remittance-themed UI.
// Entirely simulated — never affects real transactions.

export interface Country {
  code: string;
  name: string;
  currency: string;
  flag: string;
}

export const COUNTRIES: Country[] = [
  { code: "US", name: "United States", currency: "USD", flag: "🇺🇸" },
  { code: "GB", name: "United Kingdom", currency: "GBP", flag: "🇬🇧" },
  { code: "EU", name: "Eurozone", currency: "EUR", flag: "🇪🇺" },
  { code: "CA", name: "Canada", currency: "CAD", flag: "🇨🇦" },
  { code: "AU", name: "Australia", currency: "AUD", flag: "🇦🇺" },
  { code: "IN", name: "India", currency: "INR", flag: "🇮🇳" },
  { code: "PH", name: "Philippines", currency: "PHP", flag: "🇵🇭" },
  { code: "NG", name: "Nigeria", currency: "NGN", flag: "🇳🇬" },
  { code: "MX", name: "Mexico", currency: "MXN", flag: "🇲🇽" },
  { code: "VN", name: "Vietnam", currency: "VND", flag: "🇻🇳" },
];

export function findCountry(code: string): Country {
  return COUNTRIES.find((c) => c.code === code) ?? COUNTRIES[0];
}

export interface Corridor {
  from: string;
  to: string;
}

// Popular remittance corridors for the home hero + marquee (mock).
export const CORRIDORS: Corridor[] = [
  { from: "US", to: "PH" },
  { from: "GB", to: "NG" },
  { from: "EU", to: "MX" },
  { from: "CA", to: "IN" },
  { from: "AU", to: "VN" },
  { from: "US", to: "MX" },
];

// Static mock FX rates expressed as "units of destination currency per 1 USD".
// Purely illustrative; no external API is ever called.
export const MOCK_FX_PER_USD: Record<string, number> = {
  USD: 1,
  GBP: 0.79,
  EUR: 0.92,
  CAD: 1.36,
  AUD: 1.52,
  INR: 83.2,
  PHP: 58.4,
  NGN: 1580,
  MXN: 17.1,
  VND: 25400,
};

export function corridorLabel(c: Corridor): string {
  return `${c.from} → ${c.to}`;
}
