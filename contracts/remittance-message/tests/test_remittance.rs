#![no_std]

use soroban_sdk::{testutils::Address as _, Address, Env, String};

use remittance_message::{RemittanceMessageContract, RemittanceMessageContractClient};

#[test]
fn test_send_message_increases_count() {
    let env = Env::default();
    let contract_id = env.register_contract(None, RemittanceMessageContract);
    let client = RemittanceMessageContractClient::new(&env, &contract_id);

    let sender = Address::generate(&env);
    let receiver = Address::generate(&env);
    let amount: u64 = 10_000_0000;
    let message = String::from_str(&env, "Rent for July");

    env.mock_all_auths();

    let count = client.send_message(&sender, &receiver, &amount, &message);
    assert_eq!(count, 1);

    let count = client.send_message(&sender, &receiver, &(amount * 2), &message);
    assert_eq!(count, 2);
}

#[test]
fn test_get_records_returns_all() {
    let env = Env::default();
    let contract_id = env.register_contract(None, RemittanceMessageContract);
    let client = RemittanceMessageContractClient::new(&env, &contract_id);

    let sender = Address::generate(&env);
    let receiver = Address::generate(&env);
    let amount: u64 = 5_000_0000;
    let message = String::from_str(&env, "Family support");

    env.mock_all_auths();

    client.send_message(&sender, &receiver, &amount, &message);
    let records = client.get_records();
    assert_eq!(records.len(), 1);

    let first = records.get(0).unwrap();
    assert_eq!(first.sender, sender);
    assert_eq!(first.receiver, receiver);
    assert_eq!(first.amount, amount);
    assert_eq!(first.message, message);
}

#[test]
fn test_last_record_when_empty() {
    let env = Env::default();
    let contract_id = env.register_contract(None, RemittanceMessageContract);
    let client = RemittanceMessageContractClient::new(&env, &contract_id);

    assert!(client.last_record().is_none());
}
