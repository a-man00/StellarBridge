#![no_std]

use soroban_sdk::{testutils::Address as _, Address, Env, String};
use fee_registry::FeeRegistryContract;
use remittance_message::RemittanceMessageContract;
use remittance_router::{RemittanceRouterContract, RemittanceRouterContractClient};

#[test]
fn test_router_inter_contract_routing() {
    let env = Env::default();

    // Register all 3 contracts in the test environment
    let fee_registry_id = env.register_contract(None, FeeRegistryContract);
    let remittance_message_id = env.register_contract(None, RemittanceMessageContract);
    let router_id = env.register_contract(None, RemittanceRouterContract);

    let router_client = RemittanceRouterContractClient::new(&env, &router_id);

    let sender = Address::generate(&env);
    let receiver = Address::generate(&env);
    let gross_amount: u64 = 10_000_000; // 1 XLM
    let message = String::from_str(&env, "Inter-contract test");

    env.mock_all_auths();

    // Execute route_remittance (invokes FeeRegistry then RemittanceMessage)
    let (net_amount, fee_amount, total_records) = router_client.route_remittance(
        &sender,
        &receiver,
        &gross_amount,
        &message,
        &fee_registry_id,
        &remittance_message_id,
    );

    assert_eq!(fee_amount, 100_000); // 1% of 10,000,000
    assert_eq!(net_amount, 9_900_000);
    assert_eq!(total_records, 1);
}

#[test]
fn test_router_estimate_fee() {
    let env = Env::default();
    let fee_registry_id = env.register_contract(None, FeeRegistryContract);
    let router_id = env.register_contract(None, RemittanceRouterContract);

    let router_client = RemittanceRouterContractClient::new(&env, &router_id);
    let estimated_fee = router_client.estimate_fee(&fee_registry_id, &5_000_000);

    assert_eq!(estimated_fee, 50_000); // 1% of 5,000,000
}
