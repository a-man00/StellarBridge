// Soroban Client wrapper for the RemittanceMessage contract.
// The contract must be deployed on Stellar Testnet and its ID set in .env.

import type { AssembledTransaction } from "@stellar/stellar-sdk/contract";
import { Contract } from "@stellar/stellar-sdk";
import { signWithWallet } from "@/lib/wallet";
import { NETWORK_PASSPHRASE, DEFAULT_REMITTANCE_CONTRACT_ID } from "@/lib/constants";

export const SOROBAN_RPC_URL = "https://soroban-testnet.stellar.org";

export function getRemittanceContractId(): string | null {
  return process.env.NEXT_PUBLIC_REMITTANCE_MESSAGE_CONTRACT_ID || DEFAULT_REMITTANCE_CONTRACT_ID;
}

// Build a signTransaction callback compatible with the contract Client.
function makeSigner(sourceAddress: string) {
  return async (xdr: string): Promise<{ signedTxXdr: string }> => {
    return signWithWallet(xdr, {
      networkPassphrase: NETWORK_PASSPHRASE,
      address: sourceAddress,
    });
  };
}

// Lazily loads the contract Client from the deployed wasm on the network.
// Throws if NEXT_PUBLIC_REMITTANCE_MESSAGE_CONTRACT_ID is missing.
export async function getRemittanceClient(sourceAddress: string) {
  const { Client } = await import("@stellar/stellar-sdk/contract");
  const contractId = getRemittanceContractId();
  if (!contractId) {
    throw new Error("RemittanceMessage contract ID is not configured.");
  }

  const client = await Client.from({
    contractId,
    networkPassphrase: NETWORK_PASSPHRASE,
    rpcUrl: SOROBAN_RPC_URL,
    publicKey: sourceAddress,
    signTransaction: makeSigner(sourceAddress),
  });
  return client as unknown as RemittanceMessageClient;
}

// Read-only client for queries that do not need a signer.
export async function getRemittanceReadClient() {
  const { Client } = await import("@stellar/stellar-sdk/contract");
  const contractId = getRemittanceContractId();
  if (!contractId) {
    throw new Error("RemittanceMessage contract ID is not configured.");
  }

  const client = await Client.from({
    contractId,
    networkPassphrase: NETWORK_PASSPHRASE,
    rpcUrl: SOROBAN_RPC_URL,
  });
  return client as unknown as RemittanceMessageClient;
}

// Raw contract helper, useful for event listening.
export function getRemittanceContract() {
  const contractId = getRemittanceContractId();
  if (!contractId) return null;
  return new Contract(contractId);
}

// AssembledTransaction-like return type for contract calls.
type ContractCall<T> = AssembledTransaction<T>;

// Typed shape of the generated Soroban client methods.
export interface RemittanceMessageClient {
  send_message: (args: {
    sender: string;
    receiver: string;
    amount: bigint;
    message: string;
  }) => ContractCall<bigint>;
  get_records: () => ContractCall<RemittanceRecord[]>;
  count: () => ContractCall<bigint>;
  last_record: () => ContractCall<RemittanceRecord | null>;
}

export interface RemittanceRecord {
  sender: string;
  receiver: string;
  amount: bigint;
  message: string;
  timestamp: bigint;
}
