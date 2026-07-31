# StellarBridge — Cross-Border Remittance Hub

A **Stellar Level 3 (Orange Belt) Hackathon Project**. StellarBridge is an enterprise-grade, cross-border remittance dApp built on Stellar rails and Soroban smart contracts.

> **Hackathon Level:** Level 3 — Orange Belt  
> **Network:** Stellar Testnet only. No mainnet, no real funds, no secret keys handled.

[![CI/CD Pipeline](https://github.com/a-man00/StellarBridge/actions/workflows/ci.yml/badge.svg)](https://github.com/a-man00/StellarBridge/actions/workflows/ci.yml)

---

## ✅ Hackathon Submission Checklist

| Requirement | Status | Evidence |
| --- | --- | --- |
| **Public GitHub repository** | ✅ | [github.com/a-man00/StellarBridge](https://github.com/a-man00/StellarBridge) (public) |
| **README with complete documentation** | ✅ | This file |
| **10+ meaningful commits** | ✅ | 17 commits — [history](https://github.com/a-man00/StellarBridge/commits/main) |
| **Live demo link** | ✅ | [stellarbridge.vercel.app](https://stellarbridge.vercel.app) |
| **Contract deployment address** | ✅ | 3 Soroban contracts — [Deployed Contracts](#-deployed-testnet-soroban-contracts) |
| **Transaction hash for contract interaction** | ✅ | Deploy + interaction hashes — [Deployed Contracts](#-deployed-testnet-soroban-contracts) |
| **Screenshot — mobile responsive UI** | ✅ | [`Screenshots/Mobile.png`](Screenshots/Mobile.png) |
| **Screenshot — CI/CD pipeline running** | ✅ | [`Screenshots/CI Pipeline.png`](Screenshots/CI%20Pipeline.png) — [Run #4](https://github.com/a-man00/StellarBridge/actions/runs/30561561294) |
| **Screenshot — test output (3+ passing)** | ✅ | [`Screenshots/Test Output.png`](Screenshots/Test%20Output.png) — 16 Vitest + 8 Cargo tests |
| **Demo video link (1–2 min)** | 🟡 | See [Demo Video for Judges](#-demo-video-for-judges) |

---

## 📸 Screenshots

| | |
|---|---|
| ![Wallet Options](Screenshots/Wallet%20Options.png) | **Wallet Selector Modal** — Choose from multiple Stellar wallets (Freighter, xBull, Lobstr, Albedo, and more). Installed wallets are detected and shown at the top; missing wallets link to their install pages. |
| ![Wallet Connected](Screenshots/Wallet%20Connected.png) | **Wallet Connected Notification** — After connecting, a toast notification slides in at the bottom-right corner showing the wallet address (with explorer link and copy button), wallet name, and network. Auto-dismisses after 4 seconds. |
| ![Wallet Balance](Screenshots/Wallet%20Balance.png) | **Wallet Balance Dashboard** — The main dashboard displays the connected wallet's XLM balance with mock USD equivalent, Friendbot funding button, and account address with copy and explorer links. |

---

## 🌟 Progressive Hackathon Level Implementation

### ⚪ Level 1: White Belt (Wallets, Balances & Payments)
- **Freighter Wallet Integration**: Connect, disconnect, silent reconnection, network warning (Testnet required).
- **Balance & Funding**: Displays live XLM balance trimmed to 7 decimal places, mock USD equivalent, and 1-click **Friendbot** funding for unfunded accounts.
- **XLM Payments**: Send testnet XLM payments with recipient validation, amount checks, optional memo (max 28 bytes), and self-send prevention.
- **Horizon Transaction History**: Real-time payment history fetched from Horizon `/payments` endpoint.
- **UI & Accessibility**: Flat minimal design system (no gradients/neon), persisted Light/Dark themes via `next-themes`, responsive layout, scroll-reveal animations respecting `prefers-reduced-motion`.

### 🟡 Level 2: Yellow Belt (Multi-Wallet, Smart Contracts & Events)
- **Multi-Wallet Support**: Integrated `@creit.tech/stellar-wallets-kit`, allowing users to connect via Freighter, xBull, Lobstr, Hana, Albedo, and more.
- **Wallet Modal UI**: Custom wallet selector modal displaying installed/missing wallets with installation links.
- **Soroban Smart Contract**: Developed and deployed `RemittanceMessage` contract in Rust to store remittance records on-chain (sender, receiver, amount, message, timestamp).
- **Real-Time Event Listening**: Polling Soroban RPC `getEvents` after contract execution to display real-time "event received" confirmations.

### 🟠 Level 3: Orange Belt (Advanced Inter-Contract Architecture, Testing & CI/CD)
- **Advanced Inter-Contract Communication**: 3-contract pipeline where `RemittanceRouter` invokes `FeeRegistry` (on-chain 1% fee quote) and then invokes `RemittanceMessage` (record deposit).
- **Comprehensive Unit Testing**:
  - **Soroban Contract Tests**: `8/8` Rust unit tests (`cargo test`).
  - **Frontend Unit Tests**: `16/16` Vitest + React Testing Library tests (`npm test`).
- **CI/CD Pipeline**: GitHub Actions workflow (`.github/workflows/ci.yml`) automating contract testing, TypeScript typechecking, ESLint, Vitest, and Next.js builds.
- **Production Architecture**: React Error Boundary provider (`ErrorBoundary.tsx`) for graceful exception fallback handling.

---

## 📜 Deployed Testnet Soroban Contracts

All smart contracts are compiled, WASM-optimized, and deployed to **Stellar Testnet**:

| Contract Name | Role | Contract ID & Explorer Link | Transaction Hash |
| --- | --- | --- | --- |
| **RemittanceMessage** | Stores remittance records on-chain | [`CDOZMZ45ZI44OMPFY35BCR3KXNPXMUFODMJLW2EX33O4CO3LJSF37NYI`](https://stellar.expert/explorer/testnet/contract/CDOZMZ45ZI44OMPFY35BCR3KXNPXMUFODMJLW2EX33O4CO3LJSF37NYI) | [`2585c3a380c7...`](https://stellar.expert/explorer/testnet/tx/2585c3a380c7b860489c0be74ca4f982543e02d268d2ea4149a2d5991cb88427) |
| **FeeRegistry** | Calculates on-chain fee quotes | [`CDEOGU3IHCOMDF66XJEJ6LCXGSAAS3IWX5FVTTIMV7X3HCDICEBVOS3S`](https://stellar.expert/explorer/testnet/contract/CDEOGU3IHCOMDF66XJEJ6LCXGSAAS3IWX5FVTTIMV7X3HCDICEBVOS3S) | [`273bfeb633fb...`](https://stellar.expert/explorer/testnet/tx/273bfeb633fba022c842199f7b89f04e16dca7c7f022ae4c7b05e703c9945bf7) |
| **RemittanceRouter** | Inter-contract communication invoker | [`CDMASVVLKQYFEHFCQROYW3PG5Z4UNUVNIVKYOUUXDVTXSGWQU3KQI23D`](https://stellar.expert/explorer/testnet/contract/CDMASVVLKQYFEHFCQROYW3PG5Z4UNUVNIVKYOUUXDVTXSGWQU3KQI23D) | [`5d116b409df0...`](https://stellar.expert/explorer/testnet/tx/5d116b409df0d49b921f4186b5009bc27ba9843677bf8c37a0d0c36d23402f4f) |

---

## 🗺️ Application Routes

| Route | Description |
| --- | --- |
| `/` | Redirects to `/home`. |
| `/home` | Onboarding landing page featuring hero section, animated remittance route, corridor calculator, stats, and feature bento. |
| `/app` | Main dApp Dashboard: multi-wallet connect, XLM transfer, single contract calls, and Level 3 inter-contract routing. |
| `/history` | Payment transaction history loaded from Stellar Horizon. |
| `/guide` | Setup guide and troubleshooting for wallet installation and funding. |
| `/about` | Architecture overview, Level 1–3 checklist, and production roadmap. |

---

## ⚙️ Tech Stack

- **Frontend**: Next.js 16 (App Router), React 19, TypeScript, Tailwind CSS v4, `next-themes`
- **Blockchain**: `@stellar/stellar-sdk`, `@creit.tech/stellar-wallets-kit`, Rust, Soroban SDK
- **Testing**: Vitest, React Testing Library, `jsdom`, Cargo Test
- **CI/CD & Tools**: GitHub Actions, `wasm-opt`, ESLint

---

## 🚀 Quick Start & Local Setup

### 1. Clone & Install Dependencies
```bash
git clone https://github.com/a-man00/StellarBridge.git
cd StellarBridge
npm install --legacy-peer-deps
```

### 2. Environment Variables (.env)
The repository ships with pre-configured Stellar Testnet defaults and deployed Contract IDs:
```env
NEXT_PUBLIC_HORIZON_URL=https://horizon-testnet.stellar.org
NEXT_PUBLIC_STELLAR_NETWORK_PASSPHRASE=Test SDF Network ; September 2015
NEXT_PUBLIC_STELLAR_EXPLORER_URL=https://stellar.expert/explorer/testnet
NEXT_PUBLIC_FRIENDBOT_URL=https://friendbot.stellar.org/?addr=

NEXT_PUBLIC_REMITTANCE_MESSAGE_CONTRACT_ID=CDOZMZ45ZI44OMPFY35BCR3KXNPXMUFODMJLW2EX33O4CO3LJSF37NYI
NEXT_PUBLIC_FEE_REGISTRY_CONTRACT_ID=CDEOGU3IHCOMDF66XJEJ6LCXGSAAS3IWX5FVTTIMV7X3HCDICEBVOS3S
NEXT_PUBLIC_REMITTANCE_ROUTER_CONTRACT_ID=CDMASVVLKQYFEHFCQROYW3PG5Z4UNUVNIVKYOUUXDVTXSGWQU3KQI23D
```

### 3. Run Development Server
```bash
npm run dev
# Open http://localhost:3000
```

---

## 🧪 Running Unit & Contract Tests

### Frontend Unit Tests (Vitest)
```bash
npm test
```

### Soroban Smart Contract Tests (Cargo)
```bash
cd contracts
cargo test
```

### Typecheck & Lint
```bash
npx tsc --noEmit
npm run lint
```

---

## 🛠️ Building & Deploying Soroban Contracts

To re-compile and deploy custom contract instances to Stellar Testnet:

```bash
# 1. Build WASM
cd contracts
RUSTFLAGS="-C target-feature=-reference-types,-bulk-memory" cargo build --target wasm32-unknown-unknown --release

# 2. Optimize WASM
npx wasm-opt -O3 --disable-reference-types target/wasm32-unknown-unknown/release/fee_registry.wasm -o target/wasm32-unknown-unknown/release/fee_registry_opt.wasm
npx wasm-opt -O3 --disable-reference-types target/wasm32-unknown-unknown/release/remittance_router.wasm -o target/wasm32-unknown-unknown/release/remittance_router_opt.wasm

# 3. Deploy to Testnet via Node script
node scripts/deploy_all.js
```

---

## 📹 Hackathon Presentation & Judge Guide

See [`docs/DEMO_SCRIPT.md`](docs/DEMO_SCRIPT.md) for a step-by-step judge presentation script and demo walkthrough.

---

## 🚀 Deploy to Vercel

The app is Vercel-ready (`vercel.json` included). Stellar Testnet env vars and deployed contract IDs ship as safe defaults (see `.env.example`), so a default deployment works with zero configuration.

```bash
npm i -g vercel
vercel deploy --prod
```

Or import the repository at [vercel.com/new](https://vercel.com/new).

> **Live demo link:** [https://stellarbridge.vercel.app](https://stellarbridge.vercel.app)

---

## 🎬 Demo Video for Judges

Record a 1–2 minute walkthrough of the `/app` dashboard (connect wallet → fund via Friendbot → send XLM → store a contract record → run the Level 3 inter-contract routing) and paste the link here (YouTube, Loom, or Drive).

> **Note:** Video recording pending — needs to be completed before final submission.
