use starknet::storage::{
    StorageMapReadAccess, StorageMapWriteAccess, StoragePointerReadAccess,
    StoragePointerWriteAccess,
};
use starknet::{ContractAddress, get_caller_address};
use crate::agora_dao_fabric::contract::AgoraDaoFabric::ContractState;

pub fn _add_user(ref self: ContractState, user: ContractAddress) {
    let caller = get_caller_address();

    let mut is_dao: bool = false;
    let mut i: u16 = 0;
    let dao_counter: u16 = self.dao_counter.read();

    while i != dao_counter {
        if self.daos.read(i).dao_address == caller {
            is_dao = true;
            break;
        }
        i += 1;
    }

    assert!(is_dao, "Caller is not a DAO");

    //save user
    if (!self.users.read(caller)) {
        self.users.write(caller, true);
        self.user_counter.write(self.user_counter.read() + 1);
    }
}
