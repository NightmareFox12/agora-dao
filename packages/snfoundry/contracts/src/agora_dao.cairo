mod constants;
mod enums;
mod events;
mod functions;
mod roles;
mod structs;
mod validations;

//interface depends
use starknet::ContractAddress;
use structs::Task;
#[starknet::interface]
pub trait IAgoraDao<TContractState> {
    // --- WRITE FUNCTIONS ---
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

    // --- WRITE ROLES ---
    fn create_role_manager_role(ref self: TContractState, new_role_manager: ContractAddress);
    fn create_auditor_role(ref self: TContractState, auditor: ContractAddress);
    fn create_task_creator_role(ref self: TContractState, task_creator: ContractAddress);
    fn create_proposal_creator_role(ref self: TContractState, proposal_creator: ContractAddress);
    fn create_user_role(ref self: TContractState, user: ContractAddress);


    // --- READ ROLES ---
    fn manager_role_counter(self: @TContractState) -> u16;

    // --- READ STATES ---
    fn member_counter(self: @TContractState) -> u16;
    // fn user_counter(self: @TContractState) -> u16;
    // fn fabric(self: @TContractState) -> ContractAddress;
    fn auditor_role_counter(self: @TContractState) -> u16;
    fn task_creator_role_counter(self: @TContractState) -> u16;
    fn proposal_creator_role_counter(self: @TContractState) -> u16;
    fn user_role_counter(self: @TContractState) -> u16;

    // --- READ FUNCTIONS ---
    fn is_user(self: @TContractState, caller: ContractAddress) -> bool;
    fn is_member(self: @TContractState, caller: ContractAddress) -> bool;
    fn get_task_categories(self: @TContractState) -> Array<ByteArray>;
    fn get_task_difficulties(self: @TContractState) -> Array<ByteArray>;
    fn get_available_tasks(self: @TContractState) -> Array<Task>;
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
    use starknet::syscalls::call_contract_syscall;
    use starknet::{ContractAddress, get_caller_address, get_contract_address};
    use super::constants::FELT_STRK_CONTRACT;
    use super::enums::TaskStatus;

    //imports
    use super::events::{RoleCreated, TaskCreated, UserJoined};
    use super::functions::{_add_task_category, _add_task_difficulty};
    use super::roles::{
        ADMIN_ROLE, AUDITOR_ROLE, PROPOSSAL_CREATOR_ROLE, ROLE_MANAGER_ROLE, TASK_CREATOR_ROLE,
        USER_ROLE,
    };
    use super::structs::Task;
    use super::validations::_create_task_validation;

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
        pub task_creator__role_counter: u16,
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
        // --- WRITE FUNCTIONS ---
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

            //add member into counter
            let member_id = self.member_counter.read();
            self.members.write(member_id, caller);
            self.member_counter.write(member_id + 1);

            //save user into fabric
            let sel = selector!("add_user");
            let calldata = [caller.into()].span();
            if let Ok(_r) =
                call_contract_syscall(
                    self.fabric.read(), selector!("add_user"), [caller.into()].span(),
                ) {}

            match call_contract_syscall(self.fabric.read(), sel, calldata) {
                Ok(_) => {},
                Err(e) => { panic!("fabric.add_user failed: {:?}", e); },
            }

            let res = call_contract_syscall(self.fabric.read(), sel, calldata);

            if res.is_err() {
                panic!("fabric.add_user failed: {:?}", res.unwrap_err());
            }

            //grant user role
            self.accesscontrol._grant_role(USER_ROLE, caller);
            let user_role_counter = self.user_role_counter.read();
            self.user_roles.write(user_role_counter, caller);
            self.user_role_counter.write(user_role_counter + 1);

            //emit event
            self.emit(UserJoined { user: caller, user_ID: member_id });
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
            _create_task_validation(
                ref self,
                title.clone(),
                description.clone(),
                category_ID,
                difficulty_ID,
                amount,
                deadline,
            );

            let caller = get_caller_address();

            //TODO: crear una super funcion para verificar el rol/roles
            //TODO: lo que se me ocurrio a futuro es poner condicionales para darle permisos a los
            //roles. por ejemplo: que el admin pueda elegir si los usuarios pueden crear tareas
            //(true/false)
            assert!(
                self.accesscontrol.has_role(ADMIN_ROLE, caller)
                    || self.accesscontrol.has_role(AUDITOR_ROLE, caller)
                    || self.accesscontrol.has_role(TASK_CREATOR_ROLE, caller),
                "role no cumplided",
            );

            //transfer
            let strk_contract_address: ContractAddress = FELT_STRK_CONTRACT.try_into().unwrap();
            let strk_dispatcher = IERC20Dispatcher { contract_address: strk_contract_address };
            strk_dispatcher.transfer_from(caller, get_contract_address(), amount);

            //save task
            let task_id = self.task_counter.read();
            self
                .tasks
                .write(
                    task_id,
                    Task {
                        task_id: task_id,
                        creator: caller,
                        title: title.clone(),
                        description: description,
                        category: self.task_categories.read(category_ID),
                        difficulty: self.task_difficulties.read(difficulty_ID),
                        reward: amount,
                        deadline: deadline,
                        status: TaskStatus::OPEN,
                    },
                );
            //emit event
            self
                .emit(
                    TaskCreated {
                        creator: caller,
                        task_ID: task_id,
                        title: title,
                        category: self.task_categories.read(category_ID),
                        reward: amount,
                        deadline: deadline,
                    },
                );

            self.task_counter.write(task_id + 1);
        }

        // --- WRITE ROLES ---
        fn create_role_manager_role(ref self: ContractState, new_role_manager: ContractAddress) {
            let caller = get_caller_address();

            assert!(self.accesscontrol.has_role(ADMIN_ROLE, caller), "only admin");

            //verify manager role exist
            let manager_role_counter = self.manager_role_counter.read();
            let mut i: u16 = 0;

            while i != manager_role_counter {
                assert!(
                    self.role_manager_roles.read(i) != new_role_manager,
                    "Manager role already exists",
                );
                i += 1;
            }

            let mut j: u16 = 0;
            let mut empty_space: bool = false;

            let empty_contract: ContractAddress = TryInto::try_into(0x0).unwrap();

            //save role manager
            while j != manager_role_counter {
                if (self.role_manager_roles.read(j) == empty_contract) {
                    empty_space = true;
                    break;
                }
                j += 1;
            }

            if (empty_space) {
                self.role_manager_roles.write(j, new_role_manager);
            } else {
                self.role_manager_roles.write(manager_role_counter, new_role_manager);
                self.manager_role_counter.write(manager_role_counter + 1);
            }

            //grant role
            self.accesscontrol._grant_role(ROLE_MANAGER_ROLE, new_role_manager);

            self
                .emit(
                    RoleCreated {
                        assigned_by: caller,
                        assigned_to: new_role_manager,
                        role_name: ROLE_MANAGER_ROLE,
                        role_ID: self.manager_role_counter.read() - 1,
                    },
                );
        }

        fn create_auditor_role(ref self: ContractState, auditor: ContractAddress) {}

        fn create_task_creator_role(ref self: ContractState, task_creator: ContractAddress) {}

        fn create_proposal_creator_role(
            ref self: ContractState, proposal_creator: ContractAddress,
        ) {}
        fn create_user_role(ref self: ContractState, user: ContractAddress) {}

        // --- READ STATES ---
        // fn fabric(self: @ContractState) -> ContractAddress {
        //     self.fabric.read()
        // }

        // fn user_counter(self: @ContractState) -> u16 {
        //     self.user_counter.read()
        // }

        fn manager_role_counter(self: @ContractState) -> u16 {
            self.manager_role_counter.read()
        }

        fn member_counter(self: @ContractState) -> u16 {
            self.member_counter.read()
        }

        fn auditor_role_counter(self: @ContractState) -> u16 {
            self.auditor_role_counter.read()
        }

        fn task_creator_role_counter(self: @ContractState) -> u16 {
            self.task_creator__role_counter.read()
        }

        fn proposal_creator_role_counter(self: @ContractState) -> u16 {
            self.proposal_creator_role_counter.read()
        }

        fn user_role_counter(self: @ContractState) -> u16 {
            self.user_role_counter.read()
        }

        // --- READ FUNCTIONS ---
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

        fn is_user(self: @ContractState, caller: ContractAddress) -> bool {
            self.has_role(USER_ROLE, caller)
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

        fn get_available_tasks(self: @ContractState) -> Array<Task> {
            let mut res: Array<Task> = ArrayTrait::new();
            let mut i: u16 = 0;
            let task_counter: u16 = self.task_counter.read();

            while i != task_counter {
                if self.tasks.read(i).status == TaskStatus::OPEN {
                    res.append(self.tasks.read(i));
                }
                i += 1;
            }
            res
        }
    }
}
