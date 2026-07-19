# Future Remittance Roadmap

StellarBridge's Level 1 submission is intentionally a minimal testnet MVP: it
sends native XLM payments and **simulates** the cross-border remittance
experience (FX rate, corridor, anchor payout) in the UI only. This document
describes how the product would evolve into a real cross-border remittance hub.

> None of the features below are implemented in Level 1.

## Level 2 — Simulated anchors & stablecoins

- Simulate an **anchor deposit and withdrawal** flow end to end.
- Mock a **SEP-24** interactive deposit/withdraw handshake (hosted flow stub).
- Issue or use **testnet stablecoins** (e.g. a test USDC asset) and add trustlines.
- Display **sender country currency** and **receiver country currency** with a
  mock but internally consistent FX conversion.
- Show an itemized quote: send amount, FX rate, spread, payout amount.

## Level 3 — Real cross-border orchestration

- Integrate **SEP-31** (cross-border payments) between a sending and receiving
  anchor, tracking the transaction through its lifecycle states.
- Implement the **`GET /rate`** quote flow for firm/indicative FX quotes.
- Implement **SEP-12** KYC customer endpoints (register customer, provide fields,
  handle `needs_info` / `accepted` states).
- Track the full **transaction lifecycle** (pending_sender → completed) with a
  status timeline in the UI.
- Support **path payments** through the Stellar DEX so the sender can pay in one
  asset and the receiver gets another, using `strictSend`/`strictReceive`.
- Consider **liquidity pool** / market-maker routing for thin corridors.

## Advanced

- **CCTP** USDC burn/mint bridging to move value across chains.
- **Soroban** smart contracts for batching, escrow, or programmable settlement.
- **Refund / recovery** flows for failed or rejected payouts.
- **Compliance & audit logging**, sanctions screening, travel-rule data exchange.
- **Multi-sig** issuing/distribution accounts for anchor operations.

## Why keep Level 1 simple

Anchors, KYC, fiat rails, and stablecoin issuance each add real integration and
compliance surface. Level 1 proves the core Stellar mechanics — wallet, funding,
balance, signed payment, explorer verification — with a clean UX, giving a solid
foundation the later levels build on.
