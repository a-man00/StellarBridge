#!/usr/bin/env bash
set -e

# Deploy the RemittanceMessage Soroban contract to Stellar testnet.
# Requires: Rust, cargo, and the Stellar CLI installed and authenticated.

NETWORK="testnet"
CONTRACT_WASM="./target/wasm32-unknown-unknown/release/remittance_message.wasm"

echo "Building contract..."
cargo build --target wasm32-unknown-unknown --release

echo "Deploying to Stellar ${NETWORK}..."
# The --source flag must be a funded testnet account you control.
stellar contract deploy \
  --wasm "${CONTRACT_WASM}" \
  --source "${1:?Usage: ./deploy.sh <SOURCE_ACCOUNT>}" \
  --network "${NETWORK}" \
  -- \
  > contract_id.txt

echo "Contract deployed. ID saved to contracts/remittance-message/contract_id.txt"
cat contract_id.txt
