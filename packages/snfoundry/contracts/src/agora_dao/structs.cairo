use starknet::ContractAddress;

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
    // pub status: u8,

}
