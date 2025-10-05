use starknet::ContractAddress;
use super::enums::TaskStatus;

#[derive(Drop, Serde, Clone, starknet::Store)]
pub struct Task {
    pub task_id: u16,
    pub creator: ContractAddress,
    pub title: ByteArray,
    pub description: ByteArray,
    pub category: ByteArray,
    pub difficulty: ByteArray,
    pub reward: u256,
    pub deadline: u64,
    pub status: TaskStatus,
    pub accepted_by: Option<ContractAddress>,
}

#[derive(Drop, Serde, Clone, starknet::Store)]
pub struct TaskProof {
    pub proof: ByteArray,
    pub need_fix: bool,
}
