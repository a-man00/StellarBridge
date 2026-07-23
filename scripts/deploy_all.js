import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import {
  Keypair,
  rpc,
  TransactionBuilder,
  Operation,
  Networks,
  Address,
  scValToNative,
} from '@stellar/stellar-sdk';

const RPC_URL = 'https://soroban-testnet.stellar.org';
const NETWORK_PASSPHRASE = Networks.TESTNET;
const FRIENDBOT_URL = 'https://friendbot.stellar.org/?addr=';

async function withRetry(fn, retries = 5, delay = 2000) {
  for (let i = 0; i < retries; i++) {
    try {
      return await fn();
    } catch (err) {
      if (i === retries - 1) throw err;
      console.warn(`Retry ${i + 1}/${retries} after error:`, err.message || err);
      await new Promise((r) => setTimeout(r, delay * (i + 1)));
    }
  }
}

async function deployContract(server, deployer, wasmFileName, label) {
  console.log(`\n--- Deploying ${label} ---`);
  const wasmPath = path.resolve(
    process.cwd(),
    `contracts/target/wasm32-unknown-unknown/release/${wasmFileName}`
  );
  if (!fs.existsSync(wasmPath)) {
    throw new Error(`WASM file not found at ${wasmPath}`);
  }
  const wasmBuffer = fs.readFileSync(wasmPath);
  const wasmHashBuffer = crypto.createHash('sha256').update(wasmBuffer).digest();
  console.log(`${label} WASM SHA256:`, wasmHashBuffer.toString('hex'));

  // 1. Upload WASM
  const account1 = await withRetry(() => server.getAccount(deployer.publicKey()));
  const uploadOp = Operation.uploadContractWasm({ wasm: wasmBuffer });
  let tx1 = new TransactionBuilder(account1, {
    fee: '100000',
    networkPassphrase: NETWORK_PASSPHRASE,
  })
    .addOperation(uploadOp)
    .setTimeout(30)
    .build();

  tx1 = await withRetry(() => server.prepareTransaction(tx1));
  tx1.sign(deployer);

  const send1 = await withRetry(() => server.sendTransaction(tx1));
  if (send1.status === 'ERROR') {
    throw new Error(`Failed to submit ${label} upload transaction: ${JSON.stringify(send1)}`);
  }
  console.log(`Uploading ${label} WASM (tx: ${send1.hash})...`);
  const status1 = await pollTxStatus(server, send1.hash);
  if (status1.status !== rpc.Api.GetTransactionStatus.SUCCESS) {
    throw new Error(`${label} upload failed with status ${status1.status}`);
  }

  // 2. Instantiate Contract
  const account2 = await withRetry(() => server.getAccount(deployer.publicKey()));
  const createOp = Operation.createCustomContract({
    address: new Address(deployer.publicKey()),
    wasmHash: wasmHashBuffer,
  });

  let tx2 = new TransactionBuilder(account2, {
    fee: '100000',
    networkPassphrase: NETWORK_PASSPHRASE,
  })
    .addOperation(createOp)
    .setTimeout(30)
    .build();

  tx2 = await withRetry(() => server.prepareTransaction(tx2));
  tx2.sign(deployer);

  const send2 = await withRetry(() => server.sendTransaction(tx2));
  if (send2.status === 'ERROR') {
    throw new Error(`Failed to submit ${label} creation transaction: ${JSON.stringify(send2)}`);
  }
  console.log(`Creating ${label} contract instance (tx: ${send2.hash})...`);
  const status2 = await pollTxStatus(server, send2.hash);
  if (status2.status !== rpc.Api.GetTransactionStatus.SUCCESS) {
    throw new Error(`${label} creation failed with status ${status2.status}`);
  }

  const contractId = scValToNative(status2.returnValue);
  console.log(`✅ ${label} Deployed! Contract ID: ${contractId}`);
  console.log(`   Tx Hash: ${send2.hash}`);
  return { contractId, txHash: send2.hash, wasmHash: wasmHashBuffer.toString('hex') };
}

async function pollTxStatus(server, hash) {
  for (let i = 0; i < 30; i++) {
    const res = await withRetry(() => server.getTransaction(hash));
    if (res.status !== rpc.Api.GetTransactionStatus.NOT_FOUND) {
      return res;
    }
    await new Promise((r) => setTimeout(r, 1500));
  }
  throw new Error(`Tx ${hash} timed out polling`);
}

async function main() {
  console.log('=== STELLARBRIDGE LEVEL 3 INTER-CONTRACT DEPLOYMENT ===');
  const server = new rpc.Server(RPC_URL);

  const deployer = Keypair.random();
  console.log('Deployer Public Key:', deployer.publicKey());

  console.log('Funding deployer account via Friendbot...');
  const fundResp = await withRetry(() => fetch(FRIENDBOT_URL + deployer.publicKey()));
  if (!fundResp.ok) throw new Error(`Friendbot funding failed: ${fundResp.statusText}`);
  console.log('Account funded successfully.');

  const feeRegistry = await deployContract(server, deployer, 'fee_registry_opt.wasm', 'FeeRegistry');
  const router = await deployContract(server, deployer, 'remittance_router_opt.wasm', 'RemittanceRouter');

  const remittanceMessageId = 'CDOZMZ45ZI44OMPFY35BCR3KXNPXMUFODMJLW2EX33O4CO3LJSF37NYI';

  console.log('\n==================================================');
  console.log('🎉 ALL LEVEL 3 ADVANCED CONTRACTS DEPLOYED SUCCESSFULLY!');
  console.log('RemittanceMessage ID:', remittanceMessageId);
  console.log('FeeRegistry ID      :', feeRegistry.contractId);
  console.log('RemittanceRouter ID :', router.contractId);
  console.log('==================================================\n');

  // Save artifacts
  fs.writeFileSync('contracts/fee-registry/contract_id.txt', feeRegistry.contractId);
  fs.writeFileSync('contracts/remittance-router/contract_id.txt', router.contractId);

  const envContent = `NEXT_PUBLIC_HORIZON_URL=https://horizon-testnet.stellar.org
NEXT_PUBLIC_STELLAR_NETWORK_PASSPHRASE=Test SDF Network ; September 2015
NEXT_PUBLIC_STELLAR_EXPLORER_URL=https://stellar.expert/explorer/testnet
NEXT_PUBLIC_FRIENDBOT_URL=https://friendbot.stellar.org/?addr=

# Deployed Soroban Contracts on Stellar Testnet
NEXT_PUBLIC_REMITTANCE_MESSAGE_CONTRACT_ID=${remittanceMessageId}
NEXT_PUBLIC_FEE_REGISTRY_CONTRACT_ID=${feeRegistry.contractId}
NEXT_PUBLIC_REMITTANCE_ROUTER_CONTRACT_ID=${router.contractId}
`;

  fs.writeFileSync('.env', envContent);
  fs.writeFileSync('.env.example', envContent);
  console.log('Updated .env and .env.example with Level 3 Contract IDs.');
}

main().catch((err) => {
  console.error('Level 3 Deployment error:', err);
  process.exit(1);
});
