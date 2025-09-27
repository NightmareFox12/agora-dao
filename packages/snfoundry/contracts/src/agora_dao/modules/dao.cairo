use openzeppelin_access::accesscontrol::AccessControlComponent::{
    AccessControlCamelImpl, AccessControlWithDelayImpl, InternalImpl,
};
use openzeppelin_access::accesscontrol::interface::AccessControlABI;
use starknet::event::EventEmitter;
use starknet::get_caller_address;
use starknet::storage::{StorageMapWriteAccess, StoragePointerReadAccess, StoragePointerWriteAccess};
use starknet::syscalls::call_contract_syscall;

//imports
use crate::agora_dao::contract::AgoraDao::ContractState;
use crate::agora_dao::core::events::UserJoined;
use crate::agora_dao::core::roles::{ADMIN_ROLE, USER_ROLE};

pub fn _join_dao(ref self: ContractState) {
    let caller = get_caller_address();

    assert!(!self.accesscontrol.has_role(USER_ROLE, get_caller_address()), "User already joined");
    assert!(!self.accesscontrol.has_role(ADMIN_ROLE, get_caller_address()), "Creator cannot join");

    //add member into counter
    let member_id = self.member_counter.read();
    self.members.write(member_id, caller);
    self.member_counter.write(member_id + 1);

    //save user into fabric
    let sel = selector!("add_user");
    let calldata = [caller.into()].span();
    if let Ok(_r) =
        call_contract_syscall(self.fabric.read(), selector!("add_user"), [caller.into()].span()) {}

    match call_contract_syscall(self.fabric.read(), sel, calldata) {
        Ok(_) => {},
        Err(e) => { panic!("fabric.add_user failed: {:?}", e); },
    }

    let res = call_contract_syscall(self.fabric.read(), sel, calldata);

    //show err
    assert!(!res.is_err(), "fabric.add_user failed: {:?}", res.unwrap_err());

    //grant user role
    self.accesscontrol._grant_role(USER_ROLE, caller);
    let user_role_counter = self.user_role_counter.read();
    self.user_roles.write(user_role_counter, caller);
    self.user_role_counter.write(user_role_counter + 1);

    //emit event
    self.emit(UserJoined { user: caller, user_ID: member_id });
}
