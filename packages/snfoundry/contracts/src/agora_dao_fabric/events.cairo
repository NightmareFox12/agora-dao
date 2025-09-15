
#[derive(Drop, starknet::Event)]
pub struct DaoCreated {
    #[key]
    pub dao_ID: u16,
    pub name: ByteArray,
}
