use starknet::ContractAddress;
use structs::Task;
use super::core::{events, roles, structs};
use super::modules::{dao, rol, task};

#[starknet::interface]
pub trait IAgoraDao<TContractState> {
    // --- WRITE DAO ---
    fn join_dao(ref self: TContractState);

    // --- READ DAO ---
    fn member_counter(self: @TContractState) -> u16;
    fn is_member(self: @TContractState, caller: ContractAddress) -> bool;

    // --- WRITE ROLES ---
    fn create_role_manager_role(ref self: TContractState, new_role_manager: ContractAddress);
    fn create_auditor_role(ref self: TContractState, auditor: ContractAddress);
    fn create_task_creator_role(ref self: TContractState, task_creator: ContractAddress);
    fn create_proposal_creator_role(ref self: TContractState, proposal_creator: ContractAddress);
    fn create_user_role(ref self: TContractState, user: ContractAddress);

    // --- READ ROLES ---
    fn is_admin_role(self: @TContractState, caller: ContractAddress) -> bool;
    fn is_manager_role(self: @TContractState, caller: ContractAddress) -> bool;
    fn is_auditor_role(self: @TContractState, caller: ContractAddress) -> bool;
    fn is_task_creator_role(self: @TContractState, caller: ContractAddress) -> bool;
    fn is_proposal_creator_role(self: @TContractState, caller: ContractAddress) -> bool;
    fn is_user_role(self: @TContractState, caller: ContractAddress) -> bool;

    fn manager_role_counter(self: @TContractState, caller: ContractAddress) -> u16;
    fn auditor_role_counter(self: @TContractState) -> u16;
    fn task_creator_role_counter(self: @TContractState) -> u16;
    fn proposal_creator_role_counter(self: @TContractState) -> u16;
    fn user_role_counter(self: @TContractState) -> u16;

    fn get_all_manager_role(
        self: @TContractState, caller: ContractAddress,
    ) -> Array<ContractAddress>;
    fn get_all_auditor_role(
        self: @TContractState, caller: ContractAddress,
    ) -> Array<ContractAddress>;
    fn get_all_task_creator_role(
        self: @TContractState, caller: ContractAddress,
    ) -> Array<ContractAddress>;
    fn get_all_proposal_creator_role(
        self: @TContractState, caller: ContractAddress,
    ) -> Array<ContractAddress>;
    fn get_all_user_role(self: @TContractState, caller: ContractAddress) -> Array<ContractAddress>;

    // --- WRITE TASKS ---
    fn create_task(
        ref self: TContractState,
        title: ByteArray,
        description: ByteArray,
        category_ID: u16,
        difficulty_ID: u16,
        amount: u256,
        deadline: u64,
    );

    fn accept_task(ref self: TContractState, task_id: u16);
    fn complete_task(ref self: TContractState, task_id: u16, proof: ByteArray);

    // --- READ TASKS ---
    fn get_available_tasks(self: @TContractState) -> Array<Task>;
    fn get_accepted_tasks(self: @TContractState, caller: ContractAddress) -> Array<Task>;
    fn get_created_tasks(self: @TContractState, caller: ContractAddress) -> Array<Task>;

    fn get_task_categories(self: @TContractState) -> Array<ByteArray>;
    fn get_task_difficulties(self: @TContractState) -> Array<ByteArray>;
}

#[starknet::contract]
pub mod AgoraDao {
    //OpenZeppelin imports
    use openzeppelin_access::accesscontrol::AccessControlComponent;
    use openzeppelin_access::accesscontrol::interface::IAccessControl;
    use openzeppelin_introspection::src5::SRC5Component;
    use starknet::ContractAddress;

    //Starknet imports
    use starknet::storage::{
        Map, StorageMapReadAccess, StorageMapWriteAccess, StoragePointerReadAccess,
        StoragePointerWriteAccess,
    };
    use super::dao::_join_dao;
    use super::events::TaskCompleted;

    //imports
    use super::events::{RoleCreated, TaskAccepted, TaskCreated, UserJoined};
    use super::rol::{
        _create_auditor_role, _create_proposal_creator_role, _create_role_manager_role,
        _create_task_creator_role, _create_user_role, _get_all_auditor_role, _get_all_manager_role,
        _get_all_proposal_creator_role, _get_all_task_creator_role, _get_all_user_role,
    };
    use super::roles::{
        ADMIN_ROLE, AUDITOR_ROLE, PROPOSAL_CREATOR_ROLE, ROLE_MANAGER_ROLE, TASK_CREATOR_ROLE,
        USER_ROLE,
    };
    use super::structs::Task;
    use super::task::{
        _accept_task, _add_task_category, _add_task_difficulty, _complete_task, _create_task,
        _get_accepted_tasks, _get_available_tasks, _get_created_task, _get_task_categories,
        _get_task_difficulties,
    };

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
        pub member_counter: u16,
        pub task_counter: u16,
        pub task_category_counter: u16,
        pub task_difficulty_counter: u16,
        //Role counters
        pub manager_role_counter: u16,
        pub auditor_role_counter: u16,
        pub task_creator_role_counter: u16,
        pub proposal_creator_role_counter: u16,
        pub user_role_counter: u16,
        //Mappings
        pub members: Map<u16, ContractAddress>,
        pub tasks: Map<u16, Task>,
        pub task_categories: Map<u16, ByteArray>,
        pub task_difficulties: Map<u16, ByteArray>,
        //Role Mappings
        pub role_manager_roles: Map<u16, ContractAddress>,
        pub auditor_roles: Map<u16, ContractAddress>,
        pub task_creator_roles: Map<u16, ContractAddress>,
        pub proposal_creator_roles: Map<u16, ContractAddress>,
        pub user_roles: Map<u16, ContractAddress>,
        #[substorage(v0)]
        pub accesscontrol: AccessControlComponent::Storage,
        #[substorage(v0)]
        pub src5: SRC5Component::Storage,
    }

    #[event]
    #[derive(Drop, starknet::Event)]
    enum Event {
        UserJoined: UserJoined,
        TaskCreated: TaskCreated,
        RoleCreated: RoleCreated,
        TaskAccepted: TaskAccepted,
        TaskCompleted: TaskCompleted,
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

        self.members.write(0, creator);
        self.member_counter.write(self.member_counter.read() + 1);

        //grant role
        self.accesscontrol._grant_role(ADMIN_ROLE, creator);

        _add_task_category(ref self, "DOCUMENTATION");
        _add_task_category(ref self, "DESIGN");
        _add_task_category(ref self, "MARKETING");
        _add_task_category(ref self, "DEVELOPMENT");
        _add_task_category(ref self, "TRANSLATION");
        _add_task_category(ref self, "PARTNERSHIPS");
        _add_task_category(ref self, "OTHER");

        _add_task_difficulty(ref self, "TRIVIAL");
        _add_task_difficulty(ref self, "LOW");
        _add_task_difficulty(ref self, "MEDIUM");
        _add_task_difficulty(ref self, "HIGH");
        _add_task_difficulty(ref self, "CRITICAL");
    }

    #[abi(embed_v0)]
    impl AgoraDaoImpl of super::IAgoraDao<ContractState> {
        // --- WRITE DAO ---
        fn join_dao(ref self: ContractState) {
            _join_dao(ref self)
        }

        // --- READ DAO ---
        fn member_counter(self: @ContractState) -> u16 {
            self.member_counter.read()
        }

        fn is_member(self: @ContractState, caller: ContractAddress) -> bool {
            let mut i: u16 = 0;
            let member_counter: u16 = self.member_counter.read();

            while i != member_counter {
                if self.members.read(i) == caller {
                    return true;
                }
                i += 1;
            }
            false
        }

        // --- WRITE ROLES ---
        fn create_role_manager_role(ref self: ContractState, new_role_manager: ContractAddress) {
            _create_role_manager_role(ref self, new_role_manager)
        }

        fn create_auditor_role(ref self: ContractState, auditor: ContractAddress) {
            _create_auditor_role(ref self, auditor)
        }

        fn create_task_creator_role(ref self: ContractState, task_creator: ContractAddress) {
            _create_task_creator_role(ref self, task_creator)
        }

        fn create_proposal_creator_role(
            ref self: ContractState, proposal_creator: ContractAddress,
        ) {
            _create_proposal_creator_role(ref self, proposal_creator)
        }

        fn create_user_role(ref self: ContractState, user: ContractAddress) {
            _create_user_role(ref self, user)
        }

        // --- READ ROLES ---
        fn is_admin_role(self: @ContractState, caller: ContractAddress) -> bool {
            self.has_role(ADMIN_ROLE, caller)
        }

        fn is_manager_role(self: @ContractState, caller: ContractAddress) -> bool {
            self.has_role(ROLE_MANAGER_ROLE, caller)
        }

        fn is_auditor_role(self: @ContractState, caller: ContractAddress) -> bool {
            self.has_role(AUDITOR_ROLE, caller)
        }

        fn is_task_creator_role(self: @ContractState, caller: ContractAddress) -> bool {
            self.has_role(TASK_CREATOR_ROLE, caller)
        }

        fn is_proposal_creator_role(self: @ContractState, caller: ContractAddress) -> bool {
            self.has_role(PROPOSAL_CREATOR_ROLE, caller)
        }

        fn is_user_role(self: @ContractState, caller: ContractAddress) -> bool {
            self.has_role(USER_ROLE, caller)
        }

        fn manager_role_counter(self: @ContractState, caller: ContractAddress) -> u16 {
            self.manager_role_counter.read()
        }

        fn auditor_role_counter(self: @ContractState) -> u16 {
            self.auditor_role_counter.read()
        }

        fn task_creator_role_counter(self: @ContractState) -> u16 {
            self.task_creator_role_counter.read()
        }

        fn proposal_creator_role_counter(self: @ContractState) -> u16 {
            self.proposal_creator_role_counter.read()
        }

        fn user_role_counter(self: @ContractState) -> u16 {
            self.user_role_counter.read()
        }

        fn get_all_manager_role(
            self: @ContractState, caller: ContractAddress,
        ) -> Array<ContractAddress> {
            _get_all_manager_role(self, caller)
        }

        fn get_all_auditor_role(
            self: @ContractState, caller: ContractAddress,
        ) -> Array<ContractAddress> {
            _get_all_auditor_role(self, caller)
        }

        fn get_all_task_creator_role(
            self: @ContractState, caller: ContractAddress,
        ) -> Array<ContractAddress> {
            _get_all_task_creator_role(self, caller)
        }

        fn get_all_proposal_creator_role(
            self: @ContractState, caller: ContractAddress,
        ) -> Array<ContractAddress> {
            _get_all_proposal_creator_role(self, caller)
        }

        fn get_all_user_role(
            self: @ContractState, caller: ContractAddress,
        ) -> Array<ContractAddress> {
            _get_all_user_role(self, caller)
        }

        // --- WRITE TASKS ---
        fn create_task(
            ref self: ContractState,
            title: ByteArray,
            description: ByteArray,
            category_ID: u16,
            difficulty_ID: u16,
            amount: u256,
            deadline: u64,
        ) {
            _create_task(ref self, title, description, category_ID, difficulty_ID, amount, deadline)
        }

        fn accept_task(ref self: ContractState, task_id: u16) {
            _accept_task(ref self, task_id)
        }

        fn complete_task(ref self: ContractState, task_id: u16, proof: ByteArray) {
            _complete_task(ref self, task_id, proof)
        }

        // --- READ TASKS ---
        fn get_task_categories(self: @ContractState) -> Array<ByteArray> {
            _get_task_categories(self)
        }

        fn get_created_tasks(self: @ContractState, caller: ContractAddress) -> Array<Task> {
            _get_created_task(self, caller)
        }
        
        fn get_accepted_tasks(self: @ContractState, caller: ContractAddress) -> Array<Task> {
            _get_accepted_tasks(self, caller)
        }

        fn get_task_difficulties(self: @ContractState) -> Array<ByteArray> {
            _get_task_difficulties(self)
        }

        fn get_available_tasks(self: @ContractState) -> Array<Task> {
            _get_available_tasks(self)
        }
    }
}
