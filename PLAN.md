# PLAN — StellarBridge Level 1 MVP

## Goal

Ship a polished, working Level 1 (White Belt) Stellar testnet dApp: connect
Freighter, fund via Friendbot, show XLM balance, send an XLM payment with clear
pending/success/failure feedback — under a cross-border remittance theme where
FX and anchor payout are simulated (UI only). Delivered as a minimal, flat
multi-page app (home / app / history / guide / about).

## Architecture

- **Frontend-only** Next.js App Router app. No backend, DB, or auth.
- Multi-page: `/` → `/home`, plus `/app`, `/history`, `/guide`, `/about`, and a
  custom 404. Wallet state lives in a `WalletProvider` context so it persists
  across routes.
- Stellar logic isolated in `src/lib/` (constants, stellar, format, validation,
  types, corridors). UI never talks to the SDK directly.
- Browser/wallet state in custom hooks (`useFreighter`, `useStellarAccount`,
  `useSendXlm`, `useTransactions`, `useReveal`). Components are presentational +
  wire callbacks.
- Signing delegated entirely to Freighter; the app never touches secret keys.
- Theme via `next-themes` (class strategy) + Tailwind v4 CSS tokens.

## Phases

1. Scaffold Next.js (TS, Tailwind, ESLint, App Router, src dir) + deps. ✅
2. Stellar utilities: server, account/balance, build/submit payment, humanized
   errors, Friendbot, formatting, validation, payment history. ✅
3. Freighter hook + `WalletProvider` context: detect, connect, disconnect,
   network check, silent reconnect. ✅
4. Balance UI: loading / unfunded / funded / error, Friendbot, refresh, mock USD. ✅
5. Send flow: form + validation + build → sign → submit + status component. ✅
6. Multi-page shell: header/footer/nav, home onboarding, history, guide, about,
   404, redirect. ✅
7. Polish: minimal flat UI (no gradients/neon), dark mode, a11y labels,
   aria-live, scroll reveals honoring `prefers-reduced-motion`, responsive. ✅
8. Repo readiness: README, PLAN, TODO, .env.example, roadmap, git. ✅
9. Deployment readiness: Vercel notes + `tsc`/`eslint`/`build` verification. ✅

## Key decisions

- **Tailwind v4** (from create-next-app default) — no `tailwind.config.ts`;
  theme tokens live in `globals.css` with a `@custom-variant dark`.
- **freighter-api v6** returns `{ value, error }` objects — wrapped defensively.
- Fee = Horizon `feeStats` mode, floored at `BASE_FEE`, with try/catch fallback.
- 404 from `loadAccount` ⇒ treated as "unfunded", not an error.
- Simulated remittance fields are kept in page state and passed only to the
  quote panel — they never enter the transaction builder.
