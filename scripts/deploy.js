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

async function main() {
  console.log('--- Deploying RemittanceMessage Soroban Contract to Stellar Testnet ---');

  // 1. Generate deployer keypair & fund via Friendbot
  const deployer = Keypair.random();
  console.log('Deployer Public Key:', deployer.publicKey());

  console.log('Funding deployer account via Friendbot...');
  const fundResp = await fetch(FRIENDBOT_URL + deployer.publicKey());
  if (!fundResp.ok) {
    throw new Error(`Friendbot funding failed: ${fundResp.statusText}`);
  }
  console.log('Account funded successfully.');

  const server = new rpc.Server(RPC_URL);

  // 2. Load account info
  const account = await server.getAccount(deployer.publicKey());

  // 3. Read WASM file
  const wasmPath = path.resolve(
    process.cwd(),
    'contracts/target/wasm32-unknown-unknown/release/remittance_message_opt.wasm'
  );
  if (!fs.existsSync(wasmPath)) {
    throw new Error(`WASM file not found at ${wasmPath}`);
  }
  const wasmBuffer = fs.readFileSync(wasmPath);
  console.log(`Loaded WASM file: ${wasmPath} (${wasmBuffer.length} bytes)`);

  const wasmHashBuffer = crypto.createHash('sha256').update(wasmBuffer).digest();
  const wasmHashHex = wasmHashBuffer.toString('hex');
  console.log('Calculated WASM SHA256 Hash:', wasmHashHex);

  // 4. Upload WASM Code
  console.log('Step 1/2: Uploading WASM code to testnet...');
  const uploadOp = Operation.uploadContractWasm({ wasm: wasmBuffer });
  let tx = new TransactionBuilder(account, {
    fee: '100000',
    networkPassphrase: NETWORK_PASSPHRASE,
  })
    .addOperation(uploadOp)
    .setTimeout(30)
    .build();

  tx = await server.prepareTransaction(tx);
  tx.sign(deployer);

  const uploadSendResp = await server.sendTransaction(tx);
  if (uploadSendResp.status === 'ERROR') {
    console.error('Upload transaction submit error:', uploadSendResp);
    throw new Error('Failed to submit WASM upload transaction');
  }

  console.log('Waiting for WASM upload transaction completion...', uploadSendResp.hash);
  let statusResp = await pollTxStatus(server, uploadSendResp.hash);
  if (statusResp.status !== rpc.Api.GetTransactionStatus.SUCCESS) {
    throw new Error(`WASM upload failed with status: ${statusResp.status}`);
  }
  console.log('WASM uploaded successfully! Tx Hash:', uploadSendResp.hash);

  // Refresh account sequence
  const accountUpdated = await server.getAccount(deployer.publicKey());

  // 5. Create Contract Instance
  console.log('Step 2/2: Creating contract instance on testnet...');
  const createOp = Operation.createCustomContract({
    address: new Address(deployer.publicKey()),
    wasmHash: wasmHashBuffer,
  });

  let createTx = new TransactionBuilder(accountUpdated, {
    fee: '100000',
    networkPassphrase: NETWORK_PASSPHRASE,
  })
    .addOperation(createOp)
    .setTimeout(30)
    .build();

  createTx = await server.prepareTransaction(createTx);
  createTx.sign(deployer);

  const createSendResp = await server.sendTransaction(createTx);
  if (createSendResp.status === 'ERROR') {
    console.error('Create contract submit error:', createSendResp);
    throw new Error('Failed to submit contract creation transaction');
  }

  console.log('Waiting for contract creation transaction completion...', createSendResp.hash);
  let createStatusResp = await pollTxStatus(server, createSendResp.hash);
  if (createStatusResp.status !== rpc.Api.GetTransactionStatus.SUCCESS) {
    throw new Error(`Contract creation failed with status: ${createStatusResp.status}`);
  }

  let contractId = null;
  if (createStatusResp.returnValue) {
    contractId = scValToNative(createStatusResp.returnValue);
  }

  if (!contractId) {
    console.log('Raw return value / statusResp:', createStatusResp);
    throw new Error('Could not extract Contract ID from transaction response');
  }

  console.log('\n==================================================');
  console.log('🎉 REMITTANCE MESSAGE CONTRACT DEPLOYED SUCCESSFULLY!');
  console.log('Contract ID:', contractId);
  console.log('Deployment Tx Hash:', createSendResp.hash);
  console.log('Explorer URL:', `https://stellar.expert/explorer/testnet/contract/${contractId}`);
  console.log('==================================================\n');

  // Save contract ID to file
  fs.writeFileSync('contracts/remittance-message/contract_id.txt', contractId);
  console.log('Saved Contract ID to contracts/remittance-message/contract_id.txt');
  return { contractId, deployer: deployer.publicKey(), txHash: createSendResp.hash };
}

async function pollTxStatus(server, hash) {
  for (let i = 0; i < 30; i++) {
    const res = await server.getTransaction(hash);
    if (res.status !== rpc.Api.GetTransactionStatus.NOT_FOUND) {
      return res;
    }
    await new Promise((r) => setTimeout(r, 1500));
  }
  throw new Error(`Tx ${hash} timed out polling`);
}

main().catch((err) => {
  console.error('Deployment error:', err);
  process.exit(1);
});
