# Hackathon Judge Presentation Script & Demo Guide
## Project: StellarBridge — Cross-Border Remittance Hub

Welcome judges! This script provides a structured 5-minute walkthrough of **StellarBridge**, demonstrating how the project satisfies all criteria across **Level 1 (White Belt)**, **Level 2 (Yellow Belt)**, and **Level 3 (Orange Belt)**.

---

## 🎯 Executive Summary & Problem Statement

Cross-border remittances are often plagued by high fees, opaque transaction status, slow settlement, and fragmented wallet access. 

**StellarBridge** solves this by providing a unified, multi-wallet remittance portal powered by **Stellar rails** and **Soroban smart contracts**, delivering:
- **Instant settlement (~5s)** and transparent transaction tracking.
- **Multi-wallet compatibility** via `@creit.tech/stellar-wallets-kit`.
- **On-chain record persistence & real-time event indexing**.
- **Level 3 Inter-contract routing**: 3-contract architecture (`Router` → `FeeRegistry` → `RemittanceMessage`).

---

## 🎬 5-Minute Live Demo Walkthrough

### Part 1: Onboarding & Architecture Overview (`/home` & `/about`)
- **Action**: Open `http://localhost:3000/home`.
- **Narration**: *"StellarBridge begins with an asymmetric hero landing page that explains the cross-border remittance flow. Users can interact with a live corridor simulator, view real-time stats, and switch seamlessly between Light and Dark mode."*
- **Key Highlight**: Flat, minimal design system with neutral palette and responsive scroll-reveal animations.

### Part 2: Multi-Wallet Connection & Friendbot Funding (`/app`)
- **Action**: Navigate to `/app` and click **Connect Wallet**.
- **Narration**: *"Using StellarWalletsKit, StellarBridge supports Freighter, xBull, Lobstr, Hana, and Albedo. We connect our wallet and immediately view our XLM balance trimmed to 7 decimal places along with a mock USD valuation."*
- **Action**: Click **Fund Testnet Wallet** (if unfunded).
- **Narration**: *"For unfunded testnet accounts, 1-click Friendbot integration requests ~10,000 test XLM and automatically refreshes the balance."*

### Part 3: Level 1 XLM Transfer & Horizon History (`/app` & `/history`)
- **Action**: Enter a recipient Stellar address (`G...`), amount (e.g. `10 XLM`), optional memo (`Rent July`), and click **Send XLM**.
- **Narration**: *"We sign the payment transaction via our wallet module. Notice the instant status transition: pending → success with transaction hash and a direct link to Stellar Expert block explorer."*
- **Action**: Navigate to `/history`.
- **Narration**: *"The transaction is instantly queried and indexed from Horizon's `/payments` API endpoint."*

### Part 4: Level 2 Soroban Contract Write/Read & Event Listening (`/app`)
- **Action**: Scroll to the **Remittance Message Contract** panel.
- **Narration**: *"This panel interacts directly with our deployed Soroban smart contract (`CDOZMZ...`). We enter a receiver, amount, and message, then click Store Record."*
- **Narration**: *"Upon submission, our frontend polls Soroban RPC `getEvents` to capture the emitted `send_message` event on-chain, displaying a real-time 'Event Received' confirmation."*

### Part 5: Level 3 Advanced Inter-Contract Router (`/app`)
- **Action**: Scroll to the **On-Chain Remittance Router** panel (`Level 3 — Inter-Contract Communication`).
- **Narration**: *"Here we showcase our Level 3 advanced contract pipeline. The `RemittanceRouter` contract receives a transaction request and executes an on-chain inter-contract call to `FeeRegistry` to compute a 1% fee quote. It then executes a second on-chain call to `RemittanceMessage` to record the net deposit."*
- **Action**: Click **Route Remittance On-Chain**.
- **Narration**: *"The 3-contract pipeline executes atomically on-chain, returning a single transaction hash confirming the inter-contract execution."*

### Part 6: Level 3 Testing & CI/CD Pipeline
- **Action**: Show terminal running `npm test` and `cargo test`.
- **Narration**: *"StellarBridge features rigorous quality assurance with 8 Rust Soroban contract unit tests, 16 Vitest frontend component tests, TypeScript strict mode, ESLint, and a complete GitHub Actions CI/CD pipeline (`.github/workflows/ci.yml`)."*

---

## 🔒 Security & Best Practices

1. **No Secret Keys**: All transaction signing is handled safely inside the user's wallet module.
2. **Strict Testnet Scoping**: Built exclusively for Stellar Testnet; no mainnet risk.
3. **Error Boundaries**: Wrapped with a React `ErrorBoundary` fallback for graceful error handling.

Thank you for reviewing **StellarBridge**!
