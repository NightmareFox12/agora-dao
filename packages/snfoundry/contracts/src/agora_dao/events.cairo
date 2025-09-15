use starknet::ContractAddress;

#[derive(Drop, starknet::Event)]
pub struct UserJoined {
    #[key]
    pub user: ContractAddress,
    pub user_ID: u16,
}

#[derive(Drop, starknet::Event)]
pub struct TaskCreated {
    #[key]
    pub creator: ContractAddress,
    #[key]
    pub task_ID: u16,
    pub title: ByteArray,
    pub category: ByteArray,
    pub reward: u256,
    pub deadline: u64,
}
