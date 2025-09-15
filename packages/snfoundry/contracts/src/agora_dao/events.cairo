use starknet::ContractAddress;

#[derive(Drop, starknet::Event)]
pub struct UserJoined {
    #[key]
    pub user: ContractAddress,
    pub user_ID: u16,
}
