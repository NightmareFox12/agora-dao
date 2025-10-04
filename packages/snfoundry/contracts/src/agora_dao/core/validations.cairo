// use openzeppelin_access::accesscontrol::interface::IAccessControl;
use openzeppelin_access::accesscontrol::AccessControlComponent::{
    AccessControlCamelImpl, AccessControlWithDelayImpl, InternalImpl,
};
use openzeppelin_access::accesscontrol::interface::AccessControlABI;
use starknet::storage::StoragePointerReadAccess;
use starknet::{ContractAddress, get_block_timestamp};

//imports
use crate::agora_dao::contract::AgoraDao::ContractState;
use super::enums::TaskStatus;
use super::roles::{ADMIN_ROLE, TASK_CREATOR_ROLE, USER_ROLE};
use super::structs::Task;

pub fn _create_task_validation(
    ref self: ContractState,
    caller: ContractAddress,
    title: ByteArray,
    description: ByteArray,
    category_ID: u16,
    difficulty_ID: u16,
    amount: u256,
    deadline: u64,
) {
    assert!(title.len() > 0, "task title must not be empty");
    assert!(title.len() <= 50, "The title of the task is very long");
    assert!(description.len() > 0, "title description must not be empty");
    assert!(description.len() <= 1000, "The description of the task is very long");
    assert!(category_ID < self.task_category_counter.read(), "Invalid category ID");
    assert!(difficulty_ID < self.task_difficulty_counter.read(), "Invalid difficulty ID");

    assert!(amount > 0, "Amount must be greater than 0");

    assert!(deadline == 0 || deadline > get_block_timestamp(), "Deadline must be in the future");

    assert!(
        self.accesscontrol.has_role(ADMIN_ROLE, caller)
            || self.accesscontrol.has_role(TASK_CREATOR_ROLE, caller),
        "role no cumplided",
    );
}

pub fn _accept_task_validation(
    ref self: ContractState, caller: ContractAddress, task: Task, current_time: u64,
) {
    assert!(
        self.accesscontrol.has_role(USER_ROLE, caller)
            || self.accesscontrol.has_role(ADMIN_ROLE, caller),
        "Role no cumplided",
    );
    assert!(task.title.len() > 0, "Task does not exist");
    assert!(task.status == TaskStatus::OPEN, "Task is not open");
    assert!(task.accepted_by.is_none(), "Task already accepted");
    assert!(task.creator != caller, "Task creator cannot accept their own task");
    assert!(current_time <= task.deadline, "Task deadline has passed");
}
