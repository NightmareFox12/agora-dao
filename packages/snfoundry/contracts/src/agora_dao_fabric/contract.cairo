use super::core::{events, structs};
use super::modules::{category, dao, user};

//Types for interface
use super::core::structs::Dao;
use starknet::ContractAddress;

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

    fn add_user(ref self: TContractState, user: ContractAddress);

    // --- read states ---
    fn user_counter(self: @TContractState) -> u16;
    fn dao_counter(self: @TContractState) -> u16;

    // --- read functions ---
    fn get_all_categories(self: @TContractState) -> Array<ByteArray>;
    fn get_public_daos(self: @TContractState) -> Array<Dao>;
}

#[starknet::contract]
pub mod AgoraDaoFabric {
    use openzeppelin_access::ownable::OwnableComponent;
    use starknet::storage::{Map, StorageMapReadAccess, StoragePointerReadAccess};
    use starknet::{ContractAddress, get_caller_address};

    //imports
    use super::category::{_add_category, _get_all_categories};
    use super::dao::_create_dao;
    use super::events::DaoCreated;
    use super::structs::Dao;
    use super::user::_add_user;

    component!(path: OwnableComponent, storage: ownable, event: OwnableEvent);

    #[storage]
    pub struct Storage {
        pub user_counter: u16,
        pub dao_counter: u16,
        pub category_counter: u16,
        pub vote_counter: u16,
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

        _add_category(ref self, "DEFI");
        _add_category(ref self, "GAMING");
        _add_category(ref self, "SOCIAL IMPACT");
        _add_category(ref self, "SERVICE");
        _add_category(ref self, "ENERGY");
        _add_category(ref self, "GOVERNANCE");
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
        // --- WRITE FUNCTIONS ---
        fn create_dao(
            ref self: ContractState,
            name: ByteArray,
            description: ByteArray,
            category_ID: u16,
            image_URI: ByteArray,
            is_public: bool,
        ) {
            _create_dao(
                ref self,
                name.clone(),
                description.clone(),
                category_ID,
                image_URI.clone(),
                is_public,
            );
        }

        fn add_user(ref self: ContractState, user: ContractAddress) {
            _add_user(ref self, user);
            // let caller = get_caller_address();

            // let mut is_dao: bool = false;
        // let mut i: u16 = 0;
        // let dao_counter: u16 = self.dao_counter.read();

            // while i != dao_counter {
        //     if self.daos.read(i).dao_address == caller {
        //         is_dao = true;
        //         break;
        //     }
        //     i += 1;
        // }

            // assert!(is_dao, "Caller is not a DAO");
        // _add_user(ref self, user);
        }

        fn user_counter(self: @ContractState) -> u16 {
            self.user_counter.read()
        }

        fn dao_counter(self: @ContractState) -> u16 {
            self.dao_counter.read()
        }

        // --- READ FUNCTIONS ---
        fn get_all_categories(self: @ContractState) -> Array<ByteArray> {
            _get_all_categories(self)
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
