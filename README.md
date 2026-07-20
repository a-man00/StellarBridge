# StellarBridge — Cross-Border Remittance Hub

A **Stellar testnet Level 1 (White Belt) hackathon MVP**. StellarBridge is a
cross-border remittance concept built on Stellar rails. This Level 1 submission
is a minimal, reliable dApp that connects a Freighter wallet, funds a testnet
account via Friendbot, displays the XLM balance, and sends an XLM payment on the
Stellar testnet — wrapped in a remittance-themed UI with a **simulated** FX quote
and corridor selector.

> **Hackathon level:** Level 1 — White Belt
> **Network:** Stellar Testnet only. No mainnet, no real funds, no secret keys.

## Demo

- **Live demo:** _<add your Vercel URL here>_

## Screenshots

_Add screenshots here:_

- `docs/screenshot-connect.png` — landing / connect wallet
- `docs/screenshot-balance.png` — funded balance + quote panel
- `docs/screenshot-send.png` — send form
- `docs/screenshot-success.png` — success state with explorer link

## Pages

StellarBridge is a multi-page App Router app. Wallet state is held in a React
context (`WalletProvider`) so it persists across every route.

| Route | Purpose |
| --- | --- |
| `/` | Redirects to `/home`. |
| `/home` | Onboarding: hero, simulated corridor card + route animation, stats, how-it-works steps, feature bento, corridor marquee, CTA. |
| `/app` | The dashboard: connect, balance, and send XLM. |
| `/history` | Transaction history for the connected account (from Horizon). |
| `/guide` | Step-by-step setup guide + troubleshooting. |
| `/about` | Mission, Level 1 checklist, architecture, tech stack, security, roadmap. |
| `*` | Custom `not-found.tsx` 404. |

## Features

- Connect / disconnect a **Freighter** wallet (with silent reconnect).
- Detects if Freighter is not installed and links to install.
- Warns if Freighter is on the wrong network (must be Testnet).
- Fetches and displays the connected wallet's **XLM balance** (trimmed to 7 dp).
- Mock USD equivalent, clearly labeled as a mock rate.
- **Friendbot** funding button for unfunded accounts, with graceful error handling.
- Send an **XLM payment** on testnet: recipient, amount, optional memo.
- Simulated remittance corridor (country/currency selectors) — **UI only**, never
  affects the real transaction.
- Static remittance **quote panel** (mock FX, fee estimate, ~5s arrival, route).
- Transaction feedback: **pending → success/failure**, transaction hash, and a
  link to the block explorer.
- **Transaction history** for the connected account, read from Horizon.
- Collapsible **technical error details** for developers.
- Input validation for address, amount, memo, balance, and self-send.
- **Max** button (balance minus reserve + fee buffer) and copy-address button.
- Minimal, flat, responsive UI (no gradients/neon), **light/dark mode** persisted
  across reloads, and subtle scroll-reveal animations that respect
  `prefers-reduced-motion`.

## Stellar testnet configuration

| Setting | Value |
| --- | --- |
| Horizon URL | `https://horizon-testnet.stellar.org` |
| Network passphrase | `Test SDF Network ; September 2015` |
| Explorer | `https://stellar.expert/explorer/testnet` |
| Friendbot | `https://friendbot.stellar.org/?addr=` |

## Tech stack

- [Next.js](https://nextjs.org/) (App Router) + React 19 + TypeScript (strict)
- [Tailwind CSS v4](https://tailwindcss.com/)
- [@stellar/stellar-sdk](https://www.npmjs.com/package/@stellar/stellar-sdk)
- [@stellar/freighter-api](https://www.npmjs.com/package/@stellar/freighter-api)
- [next-themes](https://www.npmjs.com/package/next-themes) for light/dark mode
- npm · ESLint

## Local setup

```bash
# 1. Install dependencies
npm install

# 2. (Optional) copy env defaults — the app falls back to testnet defaults if omitted
cp .env.example .env.local

# 3. Run the dev server
npm run dev
# open http://localhost:3000

# Production build
npm run build
npm run start
```

## Environment variables

All variables are **public** (`NEXT_PUBLIC_*`) and optional — the app ships with
testnet defaults. No secrets are ever stored. See `.env.example`.

```
NEXT_PUBLIC_HORIZON_URL=https://horizon-testnet.stellar.org
NEXT_PUBLIC_STELLAR_NETWORK_PASSPHRASE=Test SDF Network ; September 2015
NEXT_PUBLIC_STELLAR_EXPLORER_URL=https://stellar.expert/explorer/testnet
NEXT_PUBLIC_FRIENDBOT_URL=https://friendbot.stellar.org/?addr=
```

## How to use Freighter

1. Install the [Freighter](https://www.freighter.app/) browser extension.
2. Create or import a wallet.
3. In Freighter settings, switch the network to **Testnet**.
4. Click **Connect Freighter Wallet** in StellarBridge and approve access.

## How to fund a testnet wallet

If your account is not yet funded, StellarBridge shows a **Fund Testnet Wallet**
button. It calls Friendbot, which deposits ~10,000 test XLM. Then the balance
refreshes automatically. (Friendbot may rate-limit repeat requests.)

## How to send XLM

1. Connect a funded testnet wallet.
2. Enter a valid recipient Stellar address (`G...`).
3. Enter an amount (use **Max** to fill balance minus a small fee buffer).
4. Optionally add a memo (max 28 bytes) and pick a simulated corridor.
5. Click **Send XLM**, approve the signature in Freighter.
6. Watch the pending → success state; open the explorer link to verify.

## Project structure

```
src/
  app/
    layout.tsx        # fonts, theme + wallet providers, header/footer
    page.tsx          # redirects to /home
    globals.css       # Tailwind v4 + light/dark theme tokens + animations
    home/page.tsx     # onboarding landing
    app/page.tsx      # dashboard: connect → balance → send → status
    history/page.tsx  # transaction history
    guide/page.tsx    # setup guide + troubleshooting
    about/page.tsx    # about, checklist, architecture, roadmap
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
    useFreighter.ts       # connect/disconnect, network detection
    useStellarAccount.ts  # balance fetch + Friendbot funding
    useSendXlm.ts         # build → sign → submit
    useTransactions.ts    # payment history from Horizon
    useReveal.ts          # IntersectionObserver scroll reveal
  lib/
    constants.ts  stellar.ts  format.ts  validation.ts  types.ts  corridors.ts
docs/
  future-remittance.md    # roadmap beyond Level 1
```

## Manual testing checklist

- [ ] App runs with `npm install` + `npm run dev`.
- [ ] App builds with `npm run build`.
- [ ] "Install Freighter" shown when the extension is absent.
- [ ] Connect wallet works; address shows in header.
- [ ] Wrong-network warning appears if Freighter is not on Testnet.
- [ ] Disconnect clears state.
- [ ] Unfunded account shows Friendbot button; funding works and refreshes.
- [ ] Balance displays trimmed XLM + mock USD.
- [ ] Refresh balance works.
- [ ] Invalid address / amount / memo are rejected with clear messages.
- [ ] Self-send is blocked.
- [ ] Send XLM → pending → success with hash + working explorer link.
- [ ] Failed tx (e.g. unfunded destination) shows friendly error + details.
- [ ] Balance refreshes after a successful send.
- [ ] History page lists the sent payment after a successful send.
- [ ] Wallet stays connected when navigating between pages.
- [ ] All nav routes render: `/home`, `/app`, `/history`, `/guide`, `/about`.
- [ ] Unknown route shows the custom 404 with a link back to `/home`.
- [ ] Light/dark toggle works and persists across reload.
- [ ] Responsive on mobile and desktop; mobile nav opens/closes.

## Known limitations

- Testnet only; no mainnet support by design.
- FX rate, corridor, and quote panel are **mocked** — no real FX or anchors.
- No persistence beyond a local "was connected" flag; no backend or database.
- Fee uses Horizon fee stats with a base-fee fallback; no fee-bump handling.
- Reserve handling is simplified (relies on Horizon's `op_low_reserve` error).

## Future roadmap

See [`docs/future-remittance.md`](docs/future-remittance.md). Highlights:

- **Level 2:** simulated anchor deposit/withdrawal, mock SEP-24 flow, testnet
  stablecoins, sender/receiver currency display.
- **Level 3:** SEP-31 cross-border orchestration, `GET /rate` quotes, SEP-12 KYC,
  transaction lifecycle tracking, path payments via the Stellar DEX.
- **Advanced:** CCTP USDC bridging, Soroban escrow/batching/settlement,
  refund/recovery flows, compliance & audit logging, multi-sig issuing accounts.

## Deployment (Vercel)

1. Push this repo to GitHub.
2. Import the repo at [vercel.com/new](https://vercel.com/new).
3. Framework preset: **Next.js** (auto-detected). Build command `next build`,
   output handled automatically.
4. (Optional) add the `NEXT_PUBLIC_*` env vars from `.env.example` — defaults
   already target testnet, so this is not required.
5. Deploy. Update the demo URL above.

## Security notes

- **No secret keys** are ever requested, entered, or stored. All signing happens
  inside the Freighter extension.
- The app is **frontend-only** — no backend, no database, no authentication.
- **Testnet only** — no real fiat, KYC, or funds are involved.
- Only a boolean "previously connected" flag is stored in `localStorage`.

---

Built for the Stellar Level 1 Hackathon.
