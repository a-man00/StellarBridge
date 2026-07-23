#![no_std]

use soroban_sdk::{contract, contractimpl, Address, Env, IntoVal, String, Symbol};

#[contract]
pub struct RemittanceRouterContract;

#[contractimpl]
impl RemittanceRouterContract {
    /// Route a cross-border remittance by invoking:
    /// 1. `FeeRegistryContract` (inter-contract call to calculate net amount and fee)
    /// 2. `RemittanceMessageContract` (inter-contract call to store on-chain record)
    pub fn route_remittance(
        env: Env,
        sender: Address,
        receiver: Address,
        gross_amount: u64,
        message: String,
        fee_registry: Address,
        remittance_message: Address,
    ) -> (u64, u64, u32) {
        // Require sender signature
        sender.require_auth();

        // 1. Inter-contract call to FeeRegistryContract -> calculate_net(gross_amount)
        let (net_amount, fee_amount): (u64, u64) = env.invoke_contract(
            &fee_registry,
            &Symbol::new(&env, "calculate_net"),
            (gross_amount,).into_val(&env),
        );

        // 2. Inter-contract call to RemittanceMessageContract -> send_message(...)
        let record_count: u32 = env.invoke_contract(
            &remittance_message,
            &Symbol::new(&env, "send_message"),
            (
                sender.clone(),
                receiver.clone(),
                net_amount,
                message.clone(),
            )
                .into_val(&env),
        );

        // 3. Emit router event on-chain for real-time indexing
        env.events().publish(
            (Symbol::new(&env, "route_remittance"), sender),
            (receiver, gross_amount, net_amount, fee_amount, message),
        );

        (net_amount, fee_amount, record_count)
    }

    /// Read fee for a given gross amount directly from FeeRegistry via inter-contract call.
    pub fn estimate_fee(env: Env, fee_registry: Address, amount: u64) -> u64 {
        env.invoke_contract(
            &fee_registry,
            &Symbol::new(&env, "get_fee"),
            (amount,).into_val(&env),
        )
    }
}
