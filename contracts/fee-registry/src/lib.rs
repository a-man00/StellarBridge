#![no_std]

use soroban_sdk::{contract, contractimpl, Symbol, Address, Env};

const BPS_KEY: &str = "fee_bps";
const DEFAULT_BPS: u32 = 100; // 1.00% = 100 bps
const MIN_FEE_STROOPS: u64 = 100; // 0.0000100 XLM

fn get_bps(env: &Env) -> u32 {
    env.storage()
        .instance()
        .get(&Symbol::new(env, BPS_KEY))
        .unwrap_or(DEFAULT_BPS)
}

#[contract]
pub struct FeeRegistryContract;

#[contractimpl]
impl FeeRegistryContract {
    /// Calculate fee for a given amount in stroops (1 XLM = 10,000,000 stroops).
    pub fn get_fee(env: Env, amount: u64) -> u64 {
        let bps = get_bps(&env) as u64;
        let calculated_fee = (amount * bps) / 10_000;
        if calculated_fee < MIN_FEE_STROOPS && amount > 0 {
            MIN_FEE_STROOPS
        } else {
            calculated_fee
        }
    }

    /// Calculate net amount after fee deduction: returns (net_amount, fee_amount).
    pub fn calculate_net(env: Env, amount: u64) -> (u64, u64) {
        let bps = get_bps(&env) as u64;
        let fee = (amount * bps) / 10_000;
        let actual_fee = if fee < MIN_FEE_STROOPS && amount > 0 {
            MIN_FEE_STROOPS
        } else {
            fee
        };
        let net = amount.saturating_sub(actual_fee);
        (net, actual_fee)
    }

    /// Update fee basis points (requires admin authorization).
    pub fn set_fee_bps(env: Env, admin: Address, bps: u32) {
        admin.require_auth();
        env.storage()
            .instance()
            .set(&Symbol::new(&env, BPS_KEY), &bps);
    }
}
