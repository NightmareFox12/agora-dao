use starknet::ContractAddress;

#[derive(Drop, Serde,starknet::Store)]
pub struct Dao {
    pub dao_id: u16,
    pub creator: ContractAddress,
    pub dao_address: ContractAddress,
    pub name: ByteArray,
    pub description: ByteArray,
    pub category: ByteArray,
    pub image_URI: ByteArray,
    pub is_public: bool,
    pub creation_timestamp: u64,
}
