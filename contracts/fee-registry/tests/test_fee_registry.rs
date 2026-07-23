#![no_std]

use soroban_sdk::{testutils::Address as _, Address, Env};
use fee_registry::{FeeRegistryContract, FeeRegistryContractClient};

#[test]
fn test_default_fee_calculation() {
    let env = Env::default();
    let contract_id = env.register_contract(None, FeeRegistryContract);
    let client = FeeRegistryContractClient::new(&env, &contract_id);

    // 10,000,000 stroops (1 XLM) @ 1% (100 bps) = 100,000 stroops (0.01 XLM)
    let amount: u64 = 10_000_000;
    let fee = client.get_fee(&amount);
    assert_eq!(fee, 100_000);

    let (net, actual_fee) = client.calculate_net(&amount);
    assert_eq!(actual_fee, 100_000);
    assert_eq!(net, 9_900_000);
}

#[test]
fn test_min_fee_floor() {
    let env = Env::default();
    let contract_id = env.register_contract(None, FeeRegistryContract);
    let client = FeeRegistryContractClient::new(&env, &contract_id);

    // Small amount where 1% < MIN_FEE_STROOPS (100 stroops)
    let amount: u64 = 50;
    let fee = client.get_fee(&amount);
    assert_eq!(fee, 100);

    let (net, actual_fee) = client.calculate_net(&amount);
    assert_eq!(actual_fee, 100);
    assert_eq!(net, 0); // saturating_sub
}

#[test]
fn test_set_fee_bps_by_admin() {
    let env = Env::default();
    let contract_id = env.register_contract(None, FeeRegistryContract);
    let client = FeeRegistryContractClient::new(&env, &contract_id);

    let admin = Address::generate(&env);
    env.mock_all_auths();

    // Change fee to 2.5% (250 bps)
    client.set_fee_bps(&admin, &250);

    let amount: u64 = 10_000_000;
    let fee = client.get_fee(&amount);
    assert_eq!(fee, 250_000); // 2.5% of 10,000,000
}
