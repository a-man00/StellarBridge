# StellarBridge — Cross-Border Remittance Hub

A **Stellar testnet Level 2 (Yellow Belt) hackathon MVP**. StellarBridge is a
cross-border remittance concept built on Stellar rails. This Level 2 submission
adds multi-wallet support through StellarWalletsKit, a deployed Soroban smart
contract (`RemittanceMessage`), and real-time event listening — while keeping
the Level 1 ability to connect a wallet, fund it via Friendbot, display the XLM
balance, and send XLM payments on testnet.

> **Hackathon level:** Level 2 — Yellow Belt  
> **Network:** Stellar Testnet only. No mainnet, no real funds, no secret keys.

## Demo

- **Live demo:** _<add your Vercel URL here>_

## Screenshots

_Add screenshots here:_

- `docs/screenshot-connect.png` — landing / connect wallet
- `docs/screenshot-balance.png` — funded balance + quote panel
- `docs/screenshot-send.png` — send form
- `docs/screenshot-success.png` — success state with explorer link
- `docs/screenshot-contract.png` — RemittanceMessage contract panel

## Pages

StellarBridge is a multi-page App Router app. Wallet state is held in a React
context (`WalletProvider`) so it persists across every route.

| Route | Purpose |
| --- | --- |
| `/` | Redirects to `/home`. |
| `/home` | Onboarding: hero, simulated corridor card + route animation, stats, how-it-works steps, feature bento, corridor marquee, CTA. |
| `/app` | The dashboard: connect, balance, send XLM, and interact with the RemittanceMessage Soroban contract. |
| `/history` | Transaction history for the connected account (from Horizon). |
| `/guide` | Step-by-step setup guide + troubleshooting. |
| `/about` | Mission, Level 2 checklist, architecture, tech stack, security, roadmap. |
| `*` | Custom `not-found.tsx` 404. |

## Features

### Level 1 (White Belt)

- Connect / disconnect a **Freighter** wallet (with silent reconnect).
- Detects if Freighter is not installed and links to install.
- Warns if the wallet is on the wrong network (must be Testnet).
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

### Level 2 (Yellow Belt)

- **Multi-wallet support** via `@creit.tech/stellar-wallets-kit`, allowing users
  to connect with Freighter, xBull, Lobstr, Hana, Albedo, and other supported
  wallets.
- Custom **wallet selection modal** that lists detected wallets, shows install
  links for missing ones, and persists the selected wallet across reloads.
- Wallet-agnostic transaction signing: XLM payments are signed through the
  selected wallet module.
- Robust error handling for **wallet-not-found**, **rejected signature**, and
  **insufficient balance**.
- **RemittanceMessage Soroban contract** (`contracts/remittance-message`) that
  stores remittance records on-chain: sender, receiver, amount, message, and
  timestamp.
- Contract integration panel on the dashboard to **write** a remittance record
  and **read** all stored records.
- **Event listening** via Soroban RPC `getEvents`: the UI polls for contract
  events after a write and shows a "received" confirmation when the event is
  detected.
- Transaction status tracking for contract calls: **pending → success/error**
  with transaction hash and feedback messages.

## Stellar testnet configuration

| Setting | Value |
| --- | --- |
| Horizon URL | `https://horizon-testnet.stellar.org` |
| Soroban RPC | `https://soroban-testnet.stellar.org` |
| Network passphrase | `Test SDF Network ; September 2015` |
| Explorer | `https://stellar.expert/explorer/testnet` |
| Friendbot | `https://friendbot.stellar.org/?addr=` |
| Contract ID | `CDOZMZ45ZI44OMPFY35BCR3KXNPXMUFODMJLW2EX33O4CO3LJSF37NYI` |

## Contract Deployment Evidence

The Soroban `RemittanceMessage` smart contract is compiled and live on Stellar Testnet:

- **Contract Name:** `RemittanceMessage` (`contracts/remittance-message`)
- **Contract ID:** [`CDOZMZ45ZI44OMPFY35BCR3KXNPXMUFODMJLW2EX33O4CO3LJSF37NYI`](https://stellar.expert/explorer/testnet/contract/CDOZMZ45ZI44OMPFY35BCR3KXNPXMUFODMJLW2EX33O4CO3LJSF37NYI)
- **Deployment Transaction Hash:** [`2585c3a380c7b860489c0be74ca4f982543e02d268d2ea4149a2d5991cb88427`](https://stellar.expert/explorer/testnet/tx/2585c3a380c7b860489c0be74ca4f982543e02d268d2ea4149a2d5991cb88427)
- **WASM SHA-256 Hash:** `a2dd80dcae18f8a82e2d073265ff4bdcee3ead8135d9d591c6ad54e74d791a3f` (Upload Tx: [`2f6acf52f3111c53f6753e97f1c537bb844229c4b525cc2a07feb6ad148c26bb`](https://stellar.expert/explorer/testnet/tx/2f6acf52f3111c53f6753e97f1c537bb844229c4b525cc2a07feb6ad148c26bb))
- **Network:** Stellar Testnet

## Tech stack

- [Next.js](https://nextjs.org/) (App Router) + React 19 + TypeScript (strict)
- [Tailwind CSS v4](https://tailwindcss.com/)
- [@stellar/stellar-sdk](https://www.npmjs.com/package/@stellar/stellar-sdk)
- [@creit.tech/stellar-wallets-kit](https://www.npmjs.com/package/@creit.tech/stellar-wallets-kit)
- [next-themes](https://www.npmjs.com/package/next-themes) for light/dark mode
- Rust + Soroban SDK for the smart contract
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
testnet defaults (including the deployed contract ID). No secrets are ever stored. See `.env.example`.

```
NEXT_PUBLIC_HORIZON_URL=https://horizon-testnet.stellar.org
NEXT_PUBLIC_STELLAR_NETWORK_PASSPHRASE=Test SDF Network ; September 2015
NEXT_PUBLIC_STELLAR_EXPLORER_URL=https://stellar.expert/explorer/testnet
NEXT_PUBLIC_FRIENDBOT_URL=https://friendbot.stellar.org/?addr=

# Deployed RemittanceMessage Soroban Contract ID on Stellar Testnet
NEXT_PUBLIC_REMITTANCE_MESSAGE_CONTRACT_ID=CDOZMZ45ZI44OMPFY35BCR3KXNPXMUFODMJLW2EX33O4CO3LJSF37NYI
```

## How to use a wallet

1. Install a supported wallet such as [Freighter](https://www.freighter.app/),
   xBull, or Lobstr.
2. Create or import a wallet.
3. In the wallet settings, switch the network to **Testnet**.
4. Click **Connect Wallet** in StellarBridge, choose a wallet, and approve access.

## How to fund a testnet wallet

If your account is not yet funded, StellarBridge shows a **Fund Testnet Wallet**
button. It calls Friendbot, which deposits ~10,000 test XLM. Then the balance
refreshes automatically. (Friendbot may rate-limit repeat requests.)

## How to send XLM

1. Connect a funded testnet wallet.
2. Enter a valid recipient Stellar address (`G...`).
3. Enter an amount (use **Max** to fill balance minus a small fee buffer).
4. Optionally add a memo (max 28 bytes) and pick a simulated corridor.
5. Click **Send XLM**, approve the signature in your wallet.
6. Watch the pending → success state; open the explorer link to verify.

## How to use the RemittanceMessage contract

1. The `RemittanceMessage` contract is already deployed to Stellar Testnet with Contract ID `CDOZMZ45ZI44OMPFY35BCR3KXNPXMUFODMJLW2EX33O4CO3LJSF37NYI` (pre-configured in `.env` and application constants).
2. To deploy your own custom instance (optional), run `node scripts/deploy.js` or see `contracts/README.md`.
3. On the dashboard (`/app`), scroll to the **Remittance Message Contract** panel.
4. Enter a receiver address (`G...`), amount (XLM), and an optional message.
5. Click **Store Record** and approve the transaction in your wallet.
6. The panel refreshes to show the stored record, and the UI listens for the emitted contract event.

## Project structure

```
src/
  app/
    layout.tsx        # fonts, theme + wallet providers, header/footer
    page.tsx          # redirects to /home
    globals.css       # Tailwind v4 + light/dark theme tokens + animations
    home/page.tsx     # onboarding landing
    app/page.tsx      # dashboard: connect → balance → send → contract
    history/page.tsx  # transaction history
    guide/page.tsx    # setup guide + troubleshooting
    about/page.tsx    # about, checklist, architecture, roadmap
    not-found.tsx     # custom 404
  components/
    providers/  ThemeProvider  WalletProvider
    layout/     Header Footer ThemeToggle MobileNav
    wallet/     WalletConnectButton WalletSelectorModal BalanceCard
                SendXlmForm RemittanceMessagePanel TransactionStatus QuotePanel
    home/       RouteAnimation CorridorCard StatsStrip StepsSection
                BentoFeatures CorridorMarquee CtaBand
    history/    TransactionList
    ui/         Button Card Input Select Label Badge Alert Reveal SectionHeading
  hooks/
    useWalletKit.ts       # StellarWalletsKit connection logic
    useStellarAccount.ts  # balance fetch + Friendbot funding
    useSendXlm.ts         # build → sign → submit XLM payment
    useRemittanceContract.ts  # read/write contract records
    useContractEvents.ts   # Soroban RPC event polling
    useTransactions.ts    # payment history from Horizon
    useReveal.ts          # IntersectionObserver scroll reveal
  lib/
    constants.ts  stellar.ts  wallet.ts  remittanceMessage.ts
    format.ts  validation.ts  types.ts  corridors.ts
contracts/
  remittance-message/   # Rust Soroban contract
    Cargo.toml
    src/lib.rs
    tests/test_remittance.rs
  deploy.sh             # helper script to deploy on testnet
  README.md             # contract build/test/deploy instructions
docs/
  future-remittance.md  # roadmap beyond Level 2
```

## Manual testing checklist

- [ ] App runs with `npm install` + `npm run dev`.
- [ ] App builds with `npm run build`.
- [ ] "Connect Wallet" opens the wallet selector modal.
- [ ] Wallet selector shows detected wallets and install links for missing wallets.
- [ ] Connect wallet works with a supported wallet; address shows in header.
- [ ] Wrong-network warning appears if the wallet is not on Testnet.
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
- [ ] RemittanceMessage contract panel shows a form when contract ID is configured.
- [ ] Storing a contract record → pending → success + event received confirmation.
- [ ] Stored records list refreshes after a successful write.
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
- The RemittanceMessage contract stores records in instance storage, which is
  reset if the contract instance is re-deployed.
- The contract is live on Stellar testnet (`CDOZMZ45ZI44OMPFY35BCR3KXNPXMUFODMJLW2EX33O4CO3LJSF37NYI`); deploying a new instance creates a distinct contract ID.

## Future roadmap

See [`docs/future-remittance.md`](docs/future-remittance.md). Highlights:

- **Level 3:** advanced Soroban contracts with inter-contract communication,
  comprehensive Rust/Vitest testing, and CI/CD with GitHub Actions.
- **Advanced:** SEP-24/SEP-31 anchor flows, path payments via the Stellar DEX,
  stablecoin swaps, CCTP USDC bridging, Soroban escrow/batching/settlement,
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
  inside the user's wallet.
- The app is **frontend-only** — no backend, no database, no authentication.
- **Testnet only** — no real fiat, KYC, or funds are involved.
- Only a boolean "previously connected" flag and the selected wallet ID are stored
  in `localStorage`.

---

Built for the Stellar Level 2 Hackathon.
