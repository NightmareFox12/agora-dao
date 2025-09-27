
#[derive(Drop, starknet::Event)]
pub struct DaoCreated {
    #[key]
    pub dao_id: u16,
    pub name: ByteArray,
}
