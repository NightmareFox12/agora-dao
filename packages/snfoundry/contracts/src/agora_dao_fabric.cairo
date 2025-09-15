mod events;
mod functions;
mod structs;
mod validations;

//Types for interface
use super::agora_dao_fabric::structs::Dao;

#[starknet::interface]
trait IAgoraDaoFabric<TContractState> {
    // --- write functions ---
    fn create_dao(
        ref self: TContractState,
        name: ByteArray,
        description: ByteArray,
        category_ID: u16,
        image_URI: ByteArray,
        is_public: bool,
    );

    // --- read states ---
    fn user_counter(self: @TContractState) -> u16;
    fn dao_counter(self: @TContractState) -> u16;

    // --- read functions ---
    fn get_all_categories(self: @TContractState) -> Array<ByteArray>;
    fn get_public_daos(self: @TContractState) -> Array<Dao>;
}

#[starknet::contract]
mod AgoraDaoFabric {
    use openzeppelin_access::ownable::OwnableComponent;
    use starknet::storage::{
        Map, StorageMapReadAccess, StorageMapWriteAccess, StoragePointerReadAccess,
        StoragePointerWriteAccess,
    };
    use starknet::syscalls::deploy_syscall;
    use starknet::{
        ClassHash, ContractAddress, get_block_timestamp, get_caller_address, get_contract_address,
    };
    use super::events::DaoCreated;

    //imports
    use super::functions::{add_category, add_user_counter};
    use super::structs::Dao;
    use super::validations::create_dao_validation;

    //constants
    const CLASS_HASH: felt252 = 0x451973f1c0ef03310a1be1ec6b2295db08367d94433ab3091aa0c488efb0631;

    component!(path: OwnableComponent, storage: ownable, event: OwnableEvent);

    #[storage]
    pub struct Storage {
        pub user_counter: u16,
        pub dao_counter: u16,
        pub category_counter: u16,
        //Mappings
        pub users: Map<ContractAddress, bool>,
        pub daos: Map<u16, Dao>,
        pub categories: Map<u16, ByteArray>,
        #[substorage(v0)]
        pub ownable: OwnableComponent::Storage,
    }


    #[constructor]
    fn constructor(ref self: ContractState) {
        self.ownable.initializer(get_caller_address());

        add_category(ref self, "DEFI");
        add_category(ref self, "GAMING");
        add_category(ref self, "SOCIAL IMPACT");
        add_category(ref self, "SERVICE");
        add_category(ref self, "ENERGY");
        add_category(ref self, "GOVERNANCE");
    }

    #[event]
    #[derive(Drop, starknet::Event)]
    enum Event {
        DaoCreated: DaoCreated,
        #[flat]
        OwnableEvent: OwnableComponent::Event,
    }

    impl OwnableInternalImpl = OwnableComponent::InternalImpl<ContractState>;

    #[abi(embed_v0)]
    impl AgoraDaoFabric of super::IAgoraDaoFabric<ContractState> {
        fn create_dao(
            ref self: ContractState,
            name: ByteArray,
            description: ByteArray,
            category_ID: u16,
            image_URI: ByteArray,
            is_public: bool,
        ) {
            let caller = get_caller_address();

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

            let (dao_address, _) = deploy_syscall(class_hash, salt, calldata.span(), false)
                .unwrap();

            //store dao
            let newDao: Dao = Dao {
                dao_ID: self.dao_counter.read(),
                creator: caller,
                name: name.clone(),
                description: description,
                category: self.categories.read(category_ID),
                dao_address: dao_address,
                image_URI: image_URI,
                is_public: is_public,
                creation_timestamp: get_block_timestamp(),
            };

            self.emit(DaoCreated { dao_ID: self.dao_counter.read(), name: name });

            add_user_counter(ref self, caller);

            self.daos.write(self.dao_counter.read(), newDao);
            self.dao_counter.write(self.dao_counter.read() + 1);
        }

        // --- read functions ---
        fn user_counter(self: @ContractState) -> u16 {
            self.user_counter.read()
        }

        fn dao_counter(self: @ContractState) -> u16 {
            self.dao_counter.read()
        }

        fn get_all_categories(self: @ContractState) -> Array<ByteArray> {
            let mut res: Array<ByteArray> = ArrayTrait::new();
            let mut i: u16 = 0;

            while i != self.category_counter.read() {
                res.append(self.categories.read(i));
                i += 1;
            }
            res
        }

        fn get_public_daos(self: @ContractState) -> Array<Dao> {
            let mut res: Array<Dao> = ArrayTrait::new();
            let mut i: u16 = 0;

            while i != self.dao_counter.read() {
                if self.daos.read(i).is_public {
                    res.append(self.daos.read(i));
                }
                i += 1;
            }
            res
        }
    }
}
