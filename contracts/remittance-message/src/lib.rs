#![no_std]

use soroban_sdk::{contract, contractimpl, contracttype, Address, Env, String, Symbol, Vec};

#[contracttype]
#[derive(Clone, Debug, Eq, PartialEq)]
pub struct RemittanceRecord {
    pub sender: Address,
    pub receiver: Address,
    pub amount: u64,
    pub message: String,
    pub timestamp: u64,
}

const RECORDS_KEY: &str = "records";

/// Helper to load the stored remittance records vector.
fn load_records(env: &Env) -> Vec<RemittanceRecord> {
    env.storage()
        .instance()
        .get(&Symbol::new(env, RECORDS_KEY))
        .unwrap_or(Vec::new(env))
}

/// Helper to persist the remittance records vector.
fn save_records(env: &Env, records: &Vec<RemittanceRecord>) {
    env.storage()
        .instance()
        .set(&Symbol::new(env, RECORDS_KEY), records);
}

#[contract]
pub struct RemittanceMessageContract;

#[contractimpl]
impl RemittanceMessageContract {
    /// Store a new remittance record. Requires the sender to authorize the call.
    pub fn send_message(
        env: Env,
        sender: Address,
        receiver: Address,
        amount: u64,
        message: String,
    ) -> u32 {
        sender.require_auth();

        let timestamp = env.ledger().timestamp();
        let mut records = load_records(&env);

        let record = RemittanceRecord {
            sender: sender.clone(),
            receiver: receiver.clone(),
            amount,
            timestamp,
            message: message.clone(),
        };

        records.push_back(record);
        save_records(&env, &records);

        // Emit an event so the UI can sync without polling state.
        env.events().publish(
            (Symbol::new(&env, "send_message"), sender),
            (receiver, amount, message, timestamp),
        );

        // Return the current count of records.
        records.len()
    }

    /// Retrieve all remittance records.
    pub fn get_records(env: Env) -> Vec<RemittanceRecord> {
        load_records(&env)
    }

    /// Retrieve the total number of stored remittance records.
    pub fn count(env: Env) -> u32 {
        load_records(&env).len()
    }

    /// Retrieve the last stored remittance record.
    pub fn last_record(env: Env) -> Option<RemittanceRecord> {
        let records = load_records(&env);
        if records.is_empty() {
            None
        } else {
            // Vec::len returns u32, so last index is len - 1.
            Some(records.get(records.len() - 1).unwrap())
        }
    }
}
