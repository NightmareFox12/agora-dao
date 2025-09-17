use starknet::storage::{
    StorageMapReadAccess, StorageMapWriteAccess, StoragePointerReadAccess,
    StoragePointerWriteAccess,
};
use super::AgoraDao::ContractState;

pub fn add_task_category(ref self: ContractState, category: ByteArray) {
    assert!(category.len() > 0, "category name must not be empty");

    let mut category_counter = self.task_category_counter.read();
    let mut i: u16 = 0;

    while i != category_counter {
        assert!(self.task_categories.read(i) != category, "Category already exists");
        i += 1;
    }

    self.task_categories.write(category_counter, category);
    self.task_category_counter.write(category_counter + 1);
}

pub fn add_task_difficulty(ref self: ContractState, difficulty: ByteArray) {
    assert!(difficulty.len() > 0, "difficulty name must not be empty");

    let mut difficulty_counter = self.task_difficulty_counter.read();
    let mut i: u16 = 0;

    while i != difficulty_counter {
        assert!(self.task_categories.read(i) != difficulty, "Difficulty already exists");
        i += 1;
    }

    self.task_difficulties.write(difficulty_counter, difficulty);
    self.task_difficulty_counter.write(difficulty_counter + 1);
}
