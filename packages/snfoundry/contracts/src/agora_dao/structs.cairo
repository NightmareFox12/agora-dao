use starknet::ContractAddress;

pub struct Task {
    pub task_id: u16,
    pub creator: ContractAddress,
    pub title: ByteArray,
    pub description: ByteArray,
    pub category: ByteArray,
    pub difficulty: ByteArray,
    pub reward: u128,
    pub deadline: u64,
    // pub status: u8,

}
