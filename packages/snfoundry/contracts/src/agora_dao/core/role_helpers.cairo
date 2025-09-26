use starknet::ContractAddress;
use starknet::event::EventEmitter;

//imports
use crate::agora_dao::contract::AgoraDao::ContractState;
use super::events::RoleCreated;

pub fn _emit_create_role(
    ref self: ContractState,
    caller: ContractAddress,
    new_role: ContractAddress,
    role_name: felt252,
    counter: u16,
) {
    self
        .emit(
            RoleCreated {
                assigned_by: caller, assigned_to: new_role, role_name: role_name, role_ID: counter,
            },
        );
}
