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

After deployment, copy the printed Contract ID into the root `.env` file:

```
NEXT_PUBLIC_REMITTANCE_MESSAGE_CONTRACT_ID=<CONTRACT_ID>
```

## Contract methods

- `send_message(env, sender, receiver, amount, message) -> u32` — stores a record, requires sender auth.
- `get_records(env) -> Vec<RemittanceRecord>` — returns all stored records.
- `count(env) -> u32` — returns the total number of records.
- `last_record(env) -> Option<RemittanceRecord>` — returns the most recent record.
