# StellarBridge — Project Context

> Working context for the StellarBridge dApp. Location:
> `/Users/anuragtamrakar/Documents/StellarBridge`

## What this is

A **Stellar testnet Level 1 (White Belt) hackathon MVP** — a cross-border
remittance-themed dApp built on Stellar rails. It connects a Freighter wallet,
funds testnet accounts via Friendbot, displays the XLM balance, sends an XLM
payment with clear pending/success/failure feedback + tx hash, and shows
transaction history. FX quotes and remittance corridors are **simulated (UI
only)** — they never affect the real transaction.

- **Network:** Stellar Testnet only. No mainnet, no real funds, no secret keys.
- **Frontend-only:** no backend, database, or auth. Freighter signs everything.

## Design direction (IMPORTANT — hard constraints)

The final agreed design is **minimal and flat**. An earlier "synthwave / neon"
direction was explicitly **rejected** by the user. Do not reintroduce it.

- **NO** gradients, pink, neon, purple, violet, indigo, glassmorphism, or heavy
  shadows.
- **Color system:** neutral base (white/black/slate/gray/zinc) + ONE muted blue
  accent (sky-600 light / sky-400 dark) used only for links, the network
  indicator, and the route animation. success = emerald, error = red,
  warning = amber. Primary button = solid black (light) / solid white (dark);
  secondary = transparent with 1px border.
- **Typography (next/font/google):** Space Grotesk (600,700) display; Inter
  (400,500,600) body; IBM Plex Mono (400,500) for all data/numbers.
- Subtle dot-grid ambient background; CSS-only animations (route dot, pulsing
  dots, marquee). Scroll reveals via `useReveal` (IntersectionObserver) and
  **must** respect `prefers-reduced-motion`.

## Tech stack

- Next.js 16.2.10 App Router (Turbopack), React 19.2.4, TypeScript strict
- Tailwind CSS v4 — **no config file**; theme tokens live in `globals.css` via
  `@theme inline` + `@custom-variant dark`
- `@stellar/stellar-sdk` ^16.0.1 · `@stellar/freighter-api` ^6.0.1 (returns
  `{ value, error }` objects) · `next-themes` ^0.4.6
- Import alias `@/*` → `./src/*`

## Stellar testnet config

| Setting | Value |
| --- | --- |
| Horizon | `https://horizon-testnet.stellar.org` |
| Passphrase | `Test SDF Network ; September 2015` |
| Explorer | `https://stellar.expert/explorer/testnet` |
| Friendbot | `https://friendbot.stellar.org/?addr=` |

Env vars (all `NEXT_PUBLIC_*`, all optional — app falls back to testnet
defaults): `NEXT_PUBLIC_HORIZON_URL`, `NEXT_PUBLIC_STELLAR_NETWORK_PASSPHRASE`,
`NEXT_PUBLIC_STELLAR_EXPLORER_URL`, `NEXT_PUBLIC_FRIENDBOT_URL`. See
`.env.example`.

## Routes

| Route | Purpose |
| --- | --- |
| `/` | Redirects to `/home` |
| `/home` | Onboarding: hero, corridor card + route animation, stats, how-it-works steps, feature bento, corridor marquee, CTA |
| `/app` | Dashboard: connect, balance, send XLM |
| `/history` | Transaction history for the connected account (from Horizon) |
| `/guide` | Step-by-step setup guide + troubleshooting |
| `/about` | Mission, Level 1 checklist, architecture, tech stack, security, roadmap |
| `*` | Custom `not-found.tsx` 404 ("Off the corridor") |

## Project structure

```
src/
  app/
    layout.tsx        # fonts, ThemeProvider > WalletProvider > Header/Footer
    page.tsx          # redirects to /home
    globals.css       # Tailwind v4 tokens + light/dark + animations
    home/ app/ history/ guide/ about/  page.tsx each
    not-found.tsx     # custom 404
  components/
    providers/  ThemeProvider  WalletProvider
    layout/     Header Footer ThemeToggle MobileNav
    wallet/     WalletConnectButton BalanceCard SendXlmForm
                TransactionStatus QuotePanel
    home/       RouteAnimation CorridorCard StatsStrip StepsSection
                BentoFeatures CorridorMarquee CtaBand
    history/    TransactionList
    ui/         Button Card Input Select Label Badge Alert Reveal SectionHeading
  hooks/
    useFreighter.ts       # connect/disconnect, network detection, silent reconnect
    useStellarAccount.ts  # balance fetch + Friendbot funding
    useSendXlm.ts         # build -> sign -> submit
    useTransactions.ts    # payment history from Horizon (404 => unfunded)
    useReveal.ts          # IntersectionObserver scroll reveal
  lib/
    constants.ts  stellar.ts  format.ts  validation.ts  types.ts  corridors.ts
docs/
  future-remittance.md    # roadmap beyond Level 1
README.md  PLAN.md  TODO.md  context.md  .env.example  .gitignore
```

Wallet state lives in a **`WalletProvider`** React context so it persists across
routes. `useWallet()` exposes `{ address, network, isConnected, isConnecting,
installed, isWrongNetwork, error, connect, disconnect }`. Only a boolean
"was previously connected" flag is stored in `localStorage` (key checked in
`useFreighter.ts`) — never the public key or any secret.

## Key implementation notes

- **Max button reserve fix:** `SendXlmForm` fillMax must subtract BOTH the
  ~1 XLM account reserve and the fee buffer:
  `Math.max(0, Number(balance) - BASE_RESERVE_XLM - FEE_BUFFER_XLM)`. Only
  subtracting the fee buffer causes `op_low_reserve` failures. (Fixed & in place.)
- **freighter-api v6** returns `{ value, error }` — wrapped defensively.
- Fee = Horizon `feeStats` mode, floored at `BASE_FEE`, try/catch fallback.
- `loadAccount` 404 is treated as "unfunded", not an error (both in
  `useStellarAccount` and `useTransactions`).
- Simulated corridor/FX fields stay in component state and only feed the quote
  panel — never the transaction builder.
- **useReveal lint fix:** the IntersectionObserver-unsupported fallback defers
  `setVisible(true)` via `setTimeout(...,0)` with cleanup, to avoid the
  `react-hooks/set-state-in-effect` error (no synchronous setState in effect).

## Verification status (all passing)

- `npx tsc --noEmit` → clean
- `npx eslint .` → clean
- `npm run build` → succeeds; all 7 routes + 404 prerender as static

Run all three from the project root (`/Users/anuragtamrakar/Documents/StellarBridge`),
NOT from `/tmp`.

## Documentation state

- **README.md** — updated for multi-page: Pages table, features (incl. history),
  new project structure, expanded manual test checklist, security notes.
- **PLAN.md** — updated architecture + 9 phases (all ✅).
- **TODO.md** — Level 1 items done; history + multi-page marked complete.
- **docs/future-remittance.md** — pre-existing roadmap beyond Level 1.

---

## Remaining tasks

All code + docs are complete and verified. What's left are **manual / external
actions the user must perform** (tracked in `TODO.md` under "Before submitting"):

- [ ] **Screenshots** — add real screenshots to `docs/` and link them in the
      README (placeholders referenced: `screenshot-connect.png`,
      `screenshot-balance.png`, `screenshot-send.png`, `screenshot-success.png`).
- [ ] **Deploy to Vercel** — framework preset auto-detects Next.js; env vars are
      optional (testnet defaults). Then paste the live URL into the README
      (`Demo` section currently says `<add your Vercel URL here>`).
- [ ] **Manual test pass** — run the full checklist in the README against a real
      Freighter wallet on Testnet (connect/disconnect, wrong-network warning,
      Friendbot funding, send → success with explorer link, failed tx, history
      updates, wallet persists across pages, all routes render, 404, dark mode,
      mobile nav).
- [ ] **GitHub** — create the public repo and push.

### Nice-to-have (NOT required for Level 1)

- [ ] Toast notifications instead of inline alerts
- [x] Recent-transactions list from Horizon `/payments` (done — `/history`)
- [ ] Optional real FX rate via a public API (non-blocking)
- [ ] Unit tests for `validation.ts` and `format.ts`

### Future levels (see docs/future-remittance.md)

- **Level 2:** simulated anchor deposit/withdrawal, mock SEP-24, testnet
  stablecoins, sender/receiver currency display.
- **Level 3:** SEP-31 cross-border orchestration, `GET /rate` quotes, SEP-12
  KYC, path payments via the Stellar DEX.
- **Advanced:** CCTP USDC bridging, Soroban escrow/batching/settlement,
  refund/recovery flows, compliance & audit logging.
