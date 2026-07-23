# StellarBridge Soroban Contracts

This directory contains the Soroban smart contracts used by StellarBridge.

## Contracts

- `remittance-message` — stores remittance records on-chain (sender, receiver, amount, message, timestamp).

## Prerequisites

1. Install Rust:
   ```bash
   curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
   rustup target add wasm32-unknown-unknown
   ```
2. Install the Stellar CLI:
   ```bash
   cargo install --locked stellar-cli --features opt
   ```
3. Add a funded testnet account to the CLI:
   ```bash
   stellar keys add my-account
   ```

## Build

```bash
cd contracts
cargo build --target wasm32-unknown-unknown --release
```

## Test

```bash
cd contracts
cargo test
```

## Deploy

```bash
cd contracts/remittance-message
./deploy.sh <SOURCE_ACCOUNT>
```

## Deployed Contract Information (Testnet)

- **Contract Name:** `RemittanceMessage` (`remittance-message`)
- **Contract ID:** [`CDOZMZ45ZI44OMPFY35BCR3KXNPXMUFODMJLW2EX33O4CO3LJSF37NYI`](https://stellar.expert/explorer/testnet/contract/CDOZMZ45ZI44OMPFY35BCR3KXNPXMUFODMJLW2EX33O4CO3LJSF37NYI)
- **Deployment Tx Hash:** [`2585c3a380c7b860489c0be74ca4f982543e02d268d2ea4149a2d5991cb88427`](https://stellar.expert/explorer/testnet/tx/2585c3a380c7b860489c0be74ca4f982543e02d268d2ea4149a2d5991cb88427)
- **WASM Hash:** `a2dd80dcae18f8a82e2d073265ff4bdcee3ead8135d9d591c6ad54e74d791a3f`
- **Network:** Stellar Testnet

```
NEXT_PUBLIC_REMITTANCE_MESSAGE_CONTRACT_ID=CDOZMZ45ZI44OMPFY35BCR3KXNPXMUFODMJLW2EX33O4CO3LJSF37NYI
```

## Contract methods

- `send_message(env, sender, receiver, amount, message) -> u32` — stores a record, requires sender auth.
- `get_records(env) -> Vec<RemittanceRecord>` — returns all stored records.
- `count(env) -> u32` — returns the total number of records.
- `last_record(env) -> Option<RemittanceRecord>` — returns the most recent record.
