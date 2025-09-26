use openzeppelin_access::accesscontrol::AccessControlComponent::{
    AccessControlCamelImpl, AccessControlWithDelayImpl, InternalImpl,
};
use openzeppelin_access::accesscontrol::interface::AccessControlABI;
use starknet::storage::{
    StorageMapReadAccess, StorageMapWriteAccess, StoragePointerReadAccess,
    StoragePointerWriteAccess,
};
use starknet::{ContractAddress, get_caller_address};

//imports
use crate::agora_dao::contract::AgoraDao::ContractState;
use crate::agora_dao::core::role_helpers::_emit_create_role;
use crate::agora_dao::core::roles::{
    ADMIN_ROLE, AUDITOR_ROLE, PROPOSAL_CREATOR_ROLE, ROLE_MANAGER_ROLE, TASK_CREATOR_ROLE,
    USER_ROLE,
};

// --- WRITE FUNCTIONS ---
pub fn _create_role_manager_role(ref self: ContractState, new_role_manager: ContractAddress) {
    let caller: ContractAddress = get_caller_address();

    assert!(self.accesscontrol.has_role(ADMIN_ROLE, caller), "only admin");
    assert!(caller != new_role_manager, "Admin cannot be the same as new role manager");

    //verify manager role exist
    let manager_role_counter: u16 = self.manager_role_counter.read();
    let mut i: u16 = 0;

    while i != manager_role_counter {
        assert!(self.role_manager_roles.read(i) != new_role_manager, "Manager role already exists");
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

    //grant role
    self.accesscontrol._grant_role(ROLE_MANAGER_ROLE, new_role_manager);

    if (empty_space) {
        self.role_manager_roles.write(j, new_role_manager);
        _emit_create_role(ref self, caller, new_role_manager, ROLE_MANAGER_ROLE, j);
    } else {
        self.role_manager_roles.write(manager_role_counter, new_role_manager);
        self.manager_role_counter.write(manager_role_counter + 1);
        _emit_create_role(
            ref self, caller, new_role_manager, ROLE_MANAGER_ROLE, manager_role_counter,
        );
    }
}

pub fn _create_auditor_role(ref self: ContractState, new_auditor: ContractAddress) {
    let caller: ContractAddress = get_caller_address();

    assert!(self.accesscontrol.has_role(ADMIN_ROLE, caller), "only admin");
    assert!(caller != new_auditor, "Admin cannot be the same as new role manager");

    //verify manager role exist
    let auditor_role_counter: u16 = self.auditor_role_counter.read();
    let mut i: u16 = 0;

    while i != auditor_role_counter {
        assert!(self.auditor_roles.read(i) != new_auditor, "Auditor role already exists");
        i += 1;
    }

    let mut j: u16 = 0;
    let mut empty_space: bool = false;

    let empty_contract: ContractAddress = TryInto::try_into(0x0).unwrap();

    //save role manager
    while j != auditor_role_counter {
        if (self.auditor_roles.read(j) == empty_contract) {
            empty_space = true;
            break;
        }
        j += 1;
    }

    self.accesscontrol._grant_role(AUDITOR_ROLE, new_auditor);

    if (empty_space) {
        self.auditor_roles.write(j, new_auditor);
        _emit_create_role(ref self, caller, new_auditor, AUDITOR_ROLE, j);
    } else {
        self.auditor_roles.write(auditor_role_counter, new_auditor);
        self.auditor_role_counter.write(auditor_role_counter + 1);
        _emit_create_role(ref self, caller, new_auditor, AUDITOR_ROLE, auditor_role_counter);
    }
}

pub fn _create_task_creator_role(ref self: ContractState, new_task_creator: ContractAddress) {
    let caller: ContractAddress = get_caller_address();

    assert!(
        self.accesscontrol.has_role(ADMIN_ROLE, caller)
            || self.accesscontrol.has_role(ROLE_MANAGER_ROLE, caller),
        "only admin or manager",
    );
    assert!(caller != new_task_creator, "Caller and new task creator must be different");

    //verify manager role exist
    let task_creator_role_counter: u16 = self.task_creator_role_counter.read();
    let mut i: u16 = 0;

    while i != task_creator_role_counter {
        assert!(
            self.task_creator_roles.read(i) != new_task_creator, "Task creator already assigned",
        );
        i += 1;
    }

    let mut j: u16 = 0;
    let mut empty_space: bool = false;

    let empty_contract: ContractAddress = TryInto::try_into(0x0).unwrap();

    //save role manager
    while j != task_creator_role_counter {
        if (self.task_creator_roles.read(j) == empty_contract) {
            empty_space = true;
            break;
        }
        j += 1;
    }

    self.accesscontrol._grant_role(TASK_CREATOR_ROLE, new_task_creator);

    if (empty_space) {
        self.task_creator_roles.write(j, new_task_creator);
        _emit_create_role(ref self, caller, new_task_creator, TASK_CREATOR_ROLE, j);
    } else {
        self.task_creator_roles.write(task_creator_role_counter, new_task_creator);
        self.task_creator_role_counter.write(task_creator_role_counter + 1);
        _emit_create_role(
            ref self, caller, new_task_creator, TASK_CREATOR_ROLE, task_creator_role_counter,
        );
    }
}

pub fn _create_proposal_creator_role(
    ref self: ContractState, new_proposal_creator: ContractAddress,
) {
    let caller: ContractAddress = get_caller_address();

    assert!(
        self.accesscontrol.has_role(ADMIN_ROLE, caller)
            || self.accesscontrol.has_role(ROLE_MANAGER_ROLE, caller),
        "only admin or manager",
    );
    assert!(caller != new_proposal_creator, "Caller and new propossal creator must be different");

    //verify manager role exist
    let proposal_creator_counter: u16 = self.proposal_creator_role_counter.read();
    let mut i: u16 = 0;

    while i != proposal_creator_counter {
        assert!(
            self.proposal_creator_roles.read(i) != new_proposal_creator,
            "Proposal creator already assigned",
        );
        i += 1;
    }

    let mut j: u16 = 0;
    let mut empty_space: bool = false;

    let empty_contract: ContractAddress = TryInto::try_into(0x0).unwrap();

    //save role manager
    while j != proposal_creator_counter {
        if (self.proposal_creator_roles.read(j) == empty_contract) {
            empty_space = true;
            break;
        }
        j += 1;
    }

    self.accesscontrol._grant_role(PROPOSAL_CREATOR_ROLE, new_proposal_creator);

    if (empty_space) {
        self.proposal_creator_roles.write(j, new_proposal_creator);
        _emit_create_role(ref self, caller, new_proposal_creator, PROPOSAL_CREATOR_ROLE, j);
    } else {
        self.proposal_creator_roles.write(proposal_creator_counter, new_proposal_creator);
        self.proposal_creator_role_counter.write(proposal_creator_counter + 1);
        _emit_create_role(
            ref self, caller, new_proposal_creator, PROPOSAL_CREATOR_ROLE, proposal_creator_counter,
        );
    }
}

pub fn _create_user_role(ref self: ContractState, new_user: ContractAddress) {
    let caller: ContractAddress = get_caller_address();

    assert!(
        self.accesscontrol.has_role(ADMIN_ROLE, caller)
            || self.accesscontrol.has_role(ROLE_MANAGER_ROLE, caller),
        "only admin or manager",
    );
    assert!(caller != new_user, "Caller and new task creator must be different");

    //verify manager role exist
    let user_role_counter: u16 = self.user_role_counter.read();
    let mut i: u16 = 0;

    while i != user_role_counter {
        assert!(self.user_roles.read(i) != new_user, "User role already assigned");
        i += 1;
    }

    let mut j: u16 = 0;
    let mut empty_space: bool = false;

    let empty_contract: ContractAddress = TryInto::try_into(0x0).unwrap();

    //save role manager
    while j != user_role_counter {
        if (self.user_roles.read(j) == empty_contract) {
            empty_space = true;
            break;
        }
        j += 1;
    }

    self.accesscontrol._grant_role(USER_ROLE, new_user);

    if (empty_space) {
        self.user_roles.write(j, new_user);
        _emit_create_role(ref self, caller, new_user, USER_ROLE, j);
    } else {
        self.user_roles.write(user_role_counter, new_user);
        self.user_role_counter.write(user_role_counter + 1);
        _emit_create_role(ref self, caller, new_user, USER_ROLE, user_role_counter);
    }
}

// --- READ FUNCTIONS ---
pub fn _get_all_manager_role(
    self: @ContractState, caller: ContractAddress,
) -> Array<ContractAddress> {
    let mut res: Array<ContractAddress> = ArrayTrait::new();

    let mut i: u16 = 0;
    while i != self.manager_role_counter.read() {
        res.append(self.role_manager_roles.read(i));
        i += 1;
    }
    res
}

pub fn _get_all_auditor_role(
    self: @ContractState, caller: ContractAddress,
) -> Array<ContractAddress> {
    // assert!(self.accesscontrol.has_role(ADMIN_ROLE, caller), "only admin");
    let mut res: Array<ContractAddress> = ArrayTrait::new();

    let mut i: u16 = 0;
    while i != self.auditor_role_counter.read() {
        res.append(self.auditor_roles.read(i));
        i += 1;
    }
    res
}
