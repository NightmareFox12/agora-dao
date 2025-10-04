use starknet::ContractAddress;

#[derive(Drop, starknet::Event)]
pub struct UserJoined {
    #[key]
    pub user: ContractAddress,
    pub user_id: u16,
}


#[derive(Drop, starknet::Event)]
pub struct RoleCreated {
    #[key]
    pub assigned_by: ContractAddress,
    #[key]
    pub assigned_to: ContractAddress,
    #[key]
    pub role_name: felt252,
    pub role_id: u16,
}

// --- TASK EVENTS ---
#[derive(Drop, starknet::Event)]
pub struct TaskAccepted {
    #[key]
    pub task_id: u16,
    #[key]
    pub accepted_by: ContractAddress,
}

#[derive(Drop, starknet::Event)]
pub struct TaskCreated {
    #[key]
    pub creator: ContractAddress,
    #[key]
    pub task_id: u16,
    pub title: ByteArray,
    pub category: ByteArray,
    pub reward: u256,
    pub deadline: u64,
}

#[derive(Drop, starknet::Event)]
pub struct TaskCompleted {
    #[key]
    pub task_id: u16,
    #[key]
    pub completed_by: ContractAddress,
    pub proof: ByteArray,
}
