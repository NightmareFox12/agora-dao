mod constants;
mod events;
mod functions;
mod roles;
mod structs;
mod validations;

#[starknet::interface]
pub trait IAgoraDao<TContractState> {
    // --- write functions ---
    fn join_dao(ref self: TContractState);
    fn create_task(
        ref self: TContractState,
        title: ByteArray,
        description: ByteArray,
        category_ID: u16,
        difficulty_ID: u16,
        amount: u256,
        deadline: u64,
    );

    // --- read states ---
    fn user_counter(self: @TContractState) -> u16;

    // --- read functions ---
    fn is_user(self: @TContractState) -> bool;
    fn get_task_categories(self: @TContractState) -> Array<ByteArray>;
    fn get_task_difficulties(self: @TContractState) -> Array<ByteArray>;
}

#[starknet::contract]
pub mod AgoraDao {
    //OpenZeppelin imports
    use openzeppelin_access::accesscontrol::AccessControlComponent;
    use openzeppelin_introspection::src5::SRC5Component;
    use openzeppelin_token::erc20::interface::{IERC20Dispatcher, IERC20DispatcherTrait};
    //Starknet imports
    use starknet::event::EventEmitter;
    use starknet::storage::{
        Map, StorageMapReadAccess, StorageMapWriteAccess, StoragePointerReadAccess,
        StoragePointerWriteAccess,
    };
    use starknet::{ContractAddress, get_caller_address, get_contract_address};
    use super::constants::FELT_STRK_CONTRACT;

    //imports
    use super::events::UserJoined;
    use super::functions::{add_task_category, add_task_difficulty};
    use super::roles::{ADMIN_ROLE, USER_ROLE};
    use super::structs::Task;
    use super::validations::create_task_validation;


    //components
    component!(path: AccessControlComponent, storage: accesscontrol, event: AccessControlEvent);
    component!(path: SRC5Component, storage: src5, event: SRC5Event);

    // AccessControl
    #[abi(embed_v0)]
    impl AccessControlImpl =
        AccessControlComponent::AccessControlImpl<ContractState>;
    impl AccessControlInternalImpl = AccessControlComponent::InternalImpl<ContractState>;

    // SRC5
    #[abi(embed_v0)]
    impl SRC5Impl = SRC5Component::SRC5Impl<ContractState>;

    #[storage]
    struct Storage {
        pub fabric: ContractAddress,
        pub user_counter: u16,
        pub task_category_counter: u16,
        pub task_difficulty_counter: u16,
        //Mappings
        pub users: Map<u16, ContractAddress>,
        pub task_categories: Map<u16, ByteArray>,
        pub task_difficulties: Map<u16, ByteArray>,
        #[substorage(v0)]
        pub accesscontrol: AccessControlComponent::Storage,
        #[substorage(v0)]
        pub src5: SRC5Component::Storage,
    }

    #[event]
    #[derive(Drop, starknet::Event)]
    enum Event {
        UserJoined: UserJoined,
        #[flat]
        AccessControlEvent: AccessControlComponent::Event,
        #[flat]
        SRC5Event: SRC5Component::Event,
    }

    #[constructor]
    fn constructor(ref self: ContractState, fabric: ContractAddress, creator: ContractAddress) {
        self.fabric.write(fabric);

        // AccessControl-related initialization
        self.accesscontrol.initializer();
        self.accesscontrol._grant_role(ADMIN_ROLE, creator);

        add_task_category(ref self, "DOCUMENTATION");
        add_task_category(ref self, "DESIGN");
        add_task_category(ref self, "MARKETING");
        add_task_category(ref self, "DEVELOPMENT");
        add_task_category(ref self, "TRANSLATION");
        add_task_category(ref self, "PARTNERSHIPS");
        add_task_category(ref self, "OTHER");

        add_task_difficulty(ref self, "TRIVIAL");
        add_task_difficulty(ref self, "LOW");
        add_task_difficulty(ref self, "MEDIUM");
        add_task_difficulty(ref self, "HIGH");
        add_task_difficulty(ref self, "CRITICAL");
    }

    // #[external(v0)]

    #[abi(embed_v0)]
    impl AgoraDaoImpl of super::IAgoraDao<ContractState> {
        fn join_dao(ref self: ContractState) {
            let caller = get_caller_address();

            assert!(
                !self.accesscontrol.has_role(USER_ROLE, get_caller_address()),
                "User already joined",
            );
            assert!(
                !self.accesscontrol.has_role(ADMIN_ROLE, get_caller_address()),
                "Creator cannot join",
            );

            let user_id = self.user_counter.read();

            self.users.write(user_id, caller);
            self.emit(UserJoined { user: caller, user_ID: user_id });
            self.accesscontrol._grant_role(USER_ROLE, caller);
            self.user_counter.write(user_id + 1);
        }

        fn create_task(
            ref self: ContractState,
            title: ByteArray,
            description: ByteArray,
            category_ID: u16,
            difficulty_ID: u16,
            amount: u256,
            deadline: u64,
        ) {
            create_task_validation(
                ref self,
                title.clone(),
                description.clone(),
                category_ID,
                difficulty_ID,
                amount,
                deadline,
            );
            //TODO: crear una super funcion para verificar el rol/roles
            let caller = get_caller_address();

            let strk_contract_address: ContractAddress = FELT_STRK_CONTRACT.try_into().unwrap();
            let strk_dispatcher = IERC20Dispatcher { contract_address: strk_contract_address };
            strk_dispatcher.transfer_from(caller, get_contract_address(), amount);
        }

        fn user_counter(self: @ContractState) -> u16 {
            self.user_counter.read()
        }

        fn is_user(self: @ContractState) -> bool {
            self.has_role(USER_ROLE, get_caller_address())
        }

        fn get_task_categories(self: @ContractState) -> Array<ByteArray> {
            let mut res: Array<ByteArray> = ArrayTrait::new();
            let mut i: u16 = 0;

            while i != self.task_category_counter.read() {
                res.append(self.task_categories.read(i));
                i += 1;
            }
            res
        }

        fn get_task_difficulties(self: @ContractState) -> Array<ByteArray> {
            let mut res: Array<ByteArray> = ArrayTrait::new();
            let mut i: u16 = 0;

            while i != self.task_difficulty_counter.read() {
                res.append(self.task_difficulties.read(i));
                i += 1;
            }
            res
        }
    }
}
