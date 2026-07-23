# Soroban Contract Deployment Workflow

This document details the deployment pipeline and workflow for deploying StellarBridge Soroban smart contracts to Stellar Testnet.

## Automated Deployment (Node.js SDK Script)

StellarBridge includes an automated, self-contained deployment script (`scripts/deploy_all.js`) using `@stellar/stellar-sdk`.

### Steps:

1. **Compile WASM Contracts**:
   ```bash
   source $HOME/.cargo/env
   cd contracts
   RUSTFLAGS="-C target-feature=-reference-types,-bulk-memory" cargo build --target wasm32-unknown-unknown --release
   ```

2. **Optimize WASM Files**:
   ```bash
   npx wasm-opt -O3 --disable-reference-types contracts/target/wasm32-unknown-unknown/release/fee_registry.wasm -o contracts/target/wasm32-unknown-unknown/release/fee_registry_opt.wasm
   npx wasm-opt -O3 --disable-reference-types contracts/target/wasm32-unknown-unknown/release/remittance_router.wasm -o contracts/target/wasm32-unknown-unknown/release/remittance_router_opt.wasm
   ```

3. **Deploy to Stellar Testnet**:
   ```bash
   node scripts/deploy_all.js
   ```

The script automatically:
- Generates and funds a testnet deployer account via Friendbot.
- Uploads the contract WASM bytecode to Stellar Testnet RPC (`https://soroban-testnet.stellar.org`).
- Instantiates `FeeRegistry` and `RemittanceRouter`.
- Saves contract IDs to `.env`, `.env.example`, and `contract_id.txt` files.

---

## Manual Deployment via Stellar CLI

If using `stellar-cli`:

```bash
# 1. Add funded identity
stellar keys generate deployer --network testnet --fund

# 2. Deploy RemittanceMessage
stellar contract deploy \
  --wasm contracts/target/wasm32-unknown-unknown/release/remittance_message_opt.wasm \
  --source deployer \
  --network testnet

# 3. Deploy FeeRegistry
stellar contract deploy \
  --wasm contracts/target/wasm32-unknown-unknown/release/fee_registry_opt.wasm \
  --source deployer \
  --network testnet

# 4. Deploy RemittanceRouter
stellar contract deploy \
  --wasm contracts/target/wasm32-unknown-unknown/release/remittance_router_opt.wasm \
  --source deployer \
  --network testnet
```

---

## Live Deployed Testnet Contract Verification

- **RemittanceMessage Contract ID**: [`CDOZMZ45ZI44OMPFY35BCR3KXNPXMUFODMJLW2EX33O4CO3LJSF37NYI`](https://stellar.expert/explorer/testnet/contract/CDOZMZ45ZI44OMPFY35BCR3KXNPXMUFODMJLW2EX33O4CO3LJSF37NYI)
- **FeeRegistry Contract ID**: [`CDEOGU3IHCOMDF66XJEJ6LCXGSAAS3IWX5FVTTIMV7X3HCDICEBVOS3S`](https://stellar.expert/explorer/testnet/contract/CDEOGU3IHCOMDF66XJEJ6LCXGSAAS3IWX5FVTTIMV7X3HCDICEBVOS3S)
- **RemittanceRouter Contract ID**: [`CDMASVVLKQYFEHFCQROYW3PG5Z4UNUVNIVKYOUUXDVTXSGWQU3KQI23D`](https://stellar.expert/explorer/testnet/contract/CDMASVVLKQYFEHFCQROYW3PG5Z4UNUVNIVKYOUUXDVTXSGWQU3KQI23D)
