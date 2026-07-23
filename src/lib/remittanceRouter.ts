// Soroban Client wrapper for the Level 3 RemittanceRouter contract.
// Inter-contract communication: RemittanceRouter -> FeeRegistry -> RemittanceMessage.

import type { AssembledTransaction } from "@stellar/stellar-sdk/contract";
import {
  NETWORK_PASSPHRASE,
  DEFAULT_FEE_REGISTRY_CONTRACT_ID,
  DEFAULT_REMITTANCE_ROUTER_CONTRACT_ID,
  DEFAULT_REMITTANCE_CONTRACT_ID,
} from "@/lib/constants";
import { SOROBAN_RPC_URL } from "@/lib/remittanceMessage";
import { signWithWallet } from "@/lib/wallet";

export interface RemittanceRouterClient {
  route_remittance: (args: {
    sender: string;
    receiver: string;
    gross_amount: bigint;
    message: string;
    fee_registry: string;
    remittance_message: string;
  }) => AssembledTransaction<[bigint, bigint, number]>;
}

export function getFeeRegistryContractId(): string {
  return (
    process.env.NEXT_PUBLIC_FEE_REGISTRY_CONTRACT_ID ||
    DEFAULT_FEE_REGISTRY_CONTRACT_ID
  );
}

export function getRemittanceRouterContractId(): string {
  return (
    process.env.NEXT_PUBLIC_REMITTANCE_ROUTER_CONTRACT_ID ||
    DEFAULT_REMITTANCE_ROUTER_CONTRACT_ID
  );
}

// Build helper for inter-contract route execution
export async function routeRemittanceInterContract(args: {
  sender: string;
  receiver: string;
  grossAmountStroops: bigint;
  message: string;
}): Promise<string> {
  const { Client } = await import("@stellar/stellar-sdk/contract");

  const routerId = getRemittanceRouterContractId();
  const feeRegistryId = getFeeRegistryContractId();
  const remittanceMessageId =
    process.env.NEXT_PUBLIC_REMITTANCE_MESSAGE_CONTRACT_ID ||
    DEFAULT_REMITTANCE_CONTRACT_ID;

  const rawClient = await Client.from({
    contractId: routerId,
    networkPassphrase: NETWORK_PASSPHRASE,
    rpcUrl: SOROBAN_RPC_URL,
    publicKey: args.sender,
    signTransaction: async (xdr: string) => {
      return signWithWallet(xdr, {
        networkPassphrase: NETWORK_PASSPHRASE,
        address: args.sender,
      });
    },
  });

  const client = rawClient as unknown as RemittanceRouterClient;

  const tx = await client.route_remittance({
    sender: args.sender,
    receiver: args.receiver,
    gross_amount: args.grossAmountStroops,
    message: args.message,
    fee_registry: feeRegistryId,
    remittance_message: remittanceMessageId,
  });

  const response = await tx.signAndSend();
  return response.sendTransactionResponse?.hash ?? "submitted";
}
