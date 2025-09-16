use starknet::get_block_timestamp;
use starknet::storage::StoragePointerReadAccess;
use super::AgoraDao::ContractState;

pub fn create_task_validation(
    ref self: ContractState,
    title: ByteArray,
    description: ByteArray,
    category_ID: u16,
    difficulty_ID: u16,
    amount: u256,
    deadline: u64,
) {
    assert!(title.len() > 0, "task title must not be empty");
    assert!(title.len() <= 50, "The title of the task is very long");
    assert!(description.len() > 0, "title description must not be empty");
    assert!(description.len() <= 1000, "The description of the task is very long");
    assert!(category_ID < self.task_category_counter.read(), "Invalid category ID");
    assert!(difficulty_ID < self.task_difficulty_counter.read(), "Invalid difficulty ID");

    assert!(amount > 0, "Amount must be greater than 0");

    assert!(deadline == 0 || deadline > get_block_timestamp(), "Deadline must be in the future");
}
