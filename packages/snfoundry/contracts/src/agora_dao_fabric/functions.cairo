use OwnableComponent::InternalTrait;
use openzeppelin_access::ownable::OwnableComponent;
use starknet::ContractAddress;
use starknet::storage::{
    StorageMapReadAccess, StorageMapWriteAccess, StoragePointerReadAccess,
    StoragePointerWriteAccess,
};
use super::AgoraDaoFabric::ContractState;

pub fn _add_user(ref self: ContractState, caller: ContractAddress) {
    if (!self.users.read(caller)) {
        self.users.write(caller, true);
        self.user_counter.write(self.user_counter.read() + 1);
    }
}


pub fn _add_category(ref self: ContractState, category: ByteArray) {
    let mut category_counter = self.category_counter.read();

    self.ownable.assert_only_owner();
    assert!(category.len() > 0, "category name must not be empty");

    let mut i: u16 = 0;

    while i != category_counter {
        assert!(self.categories.read(i) != category, "Category already exists");
        i += 1;
    }

    self.categories.write(category_counter, category);
    self.category_counter.write(category_counter + 1);
}
