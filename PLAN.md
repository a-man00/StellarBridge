# PLAN — StellarBridge Level 1 MVP

## Goal

Ship a polished, working Level 1 (White Belt) Stellar testnet dApp: connect
Freighter, fund via Friendbot, show XLM balance, send an XLM payment with clear
pending/success/failure feedback — under a cross-border remittance theme where
FX and anchor payout are simulated (UI only).

## Architecture

- **Frontend-only** Next.js App Router app. No backend, DB, or auth.
- Stellar logic isolated in `src/lib/` (constants, stellar, format, validation,
  types). UI never talks to the SDK directly.
- Browser/wallet state in custom hooks (`useFreighter`, `useStellarAccount`,
  `useSendXlm`). Components are presentational + wire callbacks.
- Signing delegated entirely to Freighter; the app never touches secret keys.
- Theme via `next-themes` (class strategy) + Tailwind v4 CSS tokens.

## Phases

1. Scaffold Next.js (TS, Tailwind, ESLint, App Router, src dir) + deps. ✅
2. Stellar utilities: server, account/balance, build/submit payment, humanized
   errors, Friendbot, formatting, validation. ✅
3. Freighter hook: detect, connect, disconnect, network check, silent reconnect. ✅
4. Balance UI: loading / unfunded / funded / error, Friendbot, refresh, mock USD. ✅
5. Send flow: form + validation + build → sign → submit + status component. ✅
6. Polish: flat minimal UI, dark mode, a11y labels, aria-live, responsive. ✅
7. Repo readiness: README, PLAN, TODO, .env.example, roadmap, git. ✅
8. Deployment readiness: Vercel notes + build verification. ✅

## Key decisions

- **Tailwind v4** (from create-next-app default) — no `tailwind.config.ts`;
  theme tokens live in `globals.css` with a `@custom-variant dark`.
- **freighter-api v6** returns `{ value, error }` objects — wrapped defensively.
- Fee = Horizon `feeStats` mode, floored at `BASE_FEE`, with try/catch fallback.
- 404 from `loadAccount` ⇒ treated as "unfunded", not an error.
- Simulated remittance fields are kept in page state and passed only to the
  quote panel — they never enter the transaction builder.
