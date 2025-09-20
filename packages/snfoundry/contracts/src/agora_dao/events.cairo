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

#[derive(Drop, starknet::Event)]
pub struct RoleCreated {
    #[key]
    pub assigned_by: ContractAddress,
    #[key]
    pub assigned_to: ContractAddress,
    #[key]
    pub role_name: felt252,
    pub role_ID: u16,
}
