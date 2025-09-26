use openzeppelin_access::accesscontrol::AccessControlComponent::{
    AccessControlCamelImpl, AccessControlWithDelayImpl, InternalImpl,
};
use openzeppelin_access::accesscontrol::interface::AccessControlABI;
use starknet::event::EventEmitter;
use starknet::storage::{
    StorageMapReadAccess, StorageMapWriteAccess, StoragePointerReadAccess,
    StoragePointerWriteAccess,
};
use starknet::{ContractAddress, get_caller_address};

//imports
use crate::agora_dao::contract::AgoraDao::ContractState;
use crate::agora_dao::core::events::RoleCreated;
use crate::agora_dao::core::roles::{ADMIN_ROLE, ROLE_MANAGER_ROLE};

pub fn _create_role_manager_role(ref self: ContractState, new_role_manager: ContractAddress) {
    let caller = get_caller_address();

    assert!(self.accesscontrol.has_role(ADMIN_ROLE, caller), "only admin");
    assert!(caller != new_role_manager, "Admin cannot be the same as new role manager");

    //verify manager role exist
    let manager_role_counter = self.manager_role_counter.read();
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
