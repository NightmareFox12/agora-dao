use starknet::storage::StoragePointerReadAccess;
use super::AgoraDaoFabric::ContractState;

pub fn create_dao_validation(
    ref self: ContractState, name: ByteArray, description: ByteArray, category_ID: u16,
) {
    assert!(name.len() > 0, "Dao name must not be empty");
    assert!(name.len() <= 30, "The name of the DAO is very long");
    assert!(description.len() > 0, "Dao description must not be empty");
    assert!(description.len() <= 300, "The description of the DAO is very long");
    assert!(category_ID < self.category_counter.read(), "Invalid category ID.");
}
