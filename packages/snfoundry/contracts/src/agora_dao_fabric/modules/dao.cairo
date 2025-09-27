use starknet::event::EventEmitter;
use starknet::storage::{
    StorageMapReadAccess, StorageMapWriteAccess, StoragePointerReadAccess,
    StoragePointerWriteAccess,
};
use starknet::syscalls::deploy_syscall;
use starknet::{
    ClassHash, ContractAddress, get_block_timestamp, get_caller_address, get_contract_address,
};
use crate::agora_dao_fabric::contract::AgoraDaoFabric::ContractState;
use crate::agora_dao_fabric::core::constants::CLASS_HASH;

//imports
use crate::agora_dao_fabric::core::events::DaoCreated;
use crate::agora_dao_fabric::core::structs::Dao;
use crate::agora_dao_fabric::core::validations::create_dao_validation;

pub fn _create_dao(
    ref self: ContractState,
    name: ByteArray,
    description: ByteArray,
    category_ID: u16,
    image_URI: ByteArray,
    is_public: bool,
) {
    let caller: ContractAddress = get_caller_address();

    //validations
    create_dao_validation(ref self, name.clone(), description.clone(), category_ID);

    //create dao
    let salt: felt252 = get_block_timestamp().into();
    let mut calldata: Array<felt252> = ArrayTrait::new();
    let fabric_felt: felt252 = get_contract_address().into();
    let creator_felt: felt252 = caller.into();

    calldata.append(fabric_felt);
    calldata.append(creator_felt);

    let class_hash: ClassHash = TryInto::try_into(CLASS_HASH).unwrap();

    let (dao_address, _) = deploy_syscall(class_hash, salt, calldata.span(), false).unwrap();

    //store dao
    let newDao: Dao = Dao {
        dao_id: self.dao_counter.read(),
        creator: caller,
        name: name.clone(),
        description: description,
        category: self.categories.read(category_ID),
        dao_address: dao_address,
        image_URI: image_URI,
        is_public: is_public,
        creation_timestamp: get_block_timestamp(),
    };

    self.emit(DaoCreated { dao_id: self.dao_counter.read(), name: name });

    self.daos.write(self.dao_counter.read(), newDao);
    self.dao_counter.write(self.dao_counter.read() + 1);
}
