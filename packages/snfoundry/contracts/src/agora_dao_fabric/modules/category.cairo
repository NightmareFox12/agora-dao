use OwnableComponent::InternalTrait;
use openzeppelin_access::ownable::OwnableComponent;
use starknet::storage::{
    StorageMapReadAccess, StorageMapWriteAccess, StoragePointerReadAccess,
    StoragePointerWriteAccess,
};
use super::super::contract::AgoraDaoFabric::ContractState;

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


pub fn _get_all_categories(self: @ContractState) -> Array<ByteArray> {
    let mut res: Array<ByteArray> = ArrayTrait::new();
    let mut i: u16 = 0;

    while i != self.category_counter.read() {
        res.append(self.categories.read(i));
        i += 1;
    }
    res
}
