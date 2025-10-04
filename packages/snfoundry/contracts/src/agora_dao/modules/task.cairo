use core::traits::TryInto;
use openzeppelin_access::accesscontrol::AccessControlComponent::{
    AccessControlCamelImpl, AccessControlWithDelayImpl, InternalImpl,
};
use openzeppelin_access::accesscontrol::interface::AccessControlABI;
use openzeppelin_token::erc20::interface::{IERC20Dispatcher, IERC20DispatcherTrait};
use starknet::event::EventEmitter;
use starknet::storage::{
    StorageMapReadAccess, StorageMapWriteAccess, StoragePointerReadAccess,
    StoragePointerWriteAccess,
};
use starknet::{ContractAddress, get_block_timestamp, get_caller_address, get_contract_address};

//imports
use crate::agora_dao::contract::AgoraDao::ContractState;
use crate::agora_dao::core::constants::FELT_STRK_CONTRACT;
use crate::agora_dao::core::enums::TaskStatus;
use crate::agora_dao::core::events::{TaskAccepted, TaskCompleted, TaskCreated};
use crate::agora_dao::core::roles::{ADMIN_ROLE, USER_ROLE};
use crate::agora_dao::core::structs::Task;
use crate::agora_dao::core::validations::{_accept_task_validation, _create_task_validation};


// --- WRITE FUNCTIONS ---
pub fn _create_task(
    ref self: ContractState,
    title: ByteArray,
    description: ByteArray,
    category_ID: u16,
    difficulty_ID: u16,
    amount: u256,
    deadline: u64,
) {
    let caller: ContractAddress = get_caller_address();

    _create_task_validation(
        ref self,
        caller,
        title.clone(),
        description.clone(),
        category_ID,
        difficulty_ID,
        amount,
        deadline,
    );

    //transfer
    let strk_contract_address: ContractAddress = FELT_STRK_CONTRACT.try_into().unwrap();
    let strk_dispatcher: IERC20Dispatcher = IERC20Dispatcher {
        contract_address: strk_contract_address,
    };
    strk_dispatcher.transfer_from(caller, get_contract_address(), amount);

    //save task
    let task_id: u16 = self.task_counter.read();
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
                accepted_by: Option::None,
            },
        );

    //emit event
    self
        .emit(
            TaskCreated {
                creator: caller,
                task_id: task_id,
                title: title,
                category: self.task_categories.read(category_ID),
                reward: amount,
                deadline: deadline,
            },
        );

    self.task_counter.write(task_id + 1);
}

pub fn _add_task_category(ref self: ContractState, category: ByteArray) {
    assert!(category.len() > 0, "category name must not be empty");

    let mut category_counter: u16 = self.task_category_counter.read();
    let mut i: u16 = 0;

    while i != category_counter {
        assert!(self.task_categories.read(i) != category, "Category already exists");
        i += 1;
    }

    self.task_categories.write(category_counter, category);
    self.task_category_counter.write(category_counter + 1);
}

pub fn _add_task_difficulty(ref self: ContractState, difficulty: ByteArray) {
    assert!(difficulty.len() > 0, "difficulty name must not be empty");

    let mut difficulty_counter: u16 = self.task_difficulty_counter.read();
    let mut i: u16 = 0;

    while i != difficulty_counter {
        assert!(self.task_categories.read(i) != difficulty, "Difficulty already exists");
        i += 1;
    }

    self.task_difficulties.write(difficulty_counter, difficulty);
    self.task_difficulty_counter.write(difficulty_counter + 1);
}

pub fn _accept_task(ref self: ContractState, task_id: u16) {
    let caller: ContractAddress = get_caller_address();
    let current_time: u64 = get_block_timestamp();
    let mut task: Task = self.tasks.read(task_id);

    _accept_task_validation(ref self, caller, task.clone(), current_time);

    task.accepted_by = Option::Some(caller);
    task.status = TaskStatus::IN_PROGRESS;
    self.tasks.write(task_id, task);

    self.emit(TaskAccepted { task_id: task_id, accepted_by: caller })
}

//TODO: crear un apartado en la UI para que los roles correspondientes puedan verificar el proof
pub fn _complete_task(ref self: ContractState, task_id: u16, proof: ByteArray) {
    let caller: ContractAddress = get_caller_address();

    assert!(
        self.accesscontrol.has_role(USER_ROLE, caller)
            || self.accesscontrol.has_role(ADMIN_ROLE, caller),
        "Role no cumplided",
    );
    assert!(task_id <= self.task_counter.read(), "Task does not exist");
    assert!(proof.len() > 0, "Proof is required");

    let mut task: Task = self.tasks.read(task_id);

    assert!(task.status == TaskStatus::IN_PROGRESS, "Task is not in progress");
    assert!(
        task.accepted_by == Some(caller), "
    Task is not accepted by the caller {:?}", caller,
    );

    if (task.deadline != 0 && get_block_timestamp() > task.deadline) {
        //cancel task
        task.status = TaskStatus::CANCELLED;
        self.tasks.write(task_id, task.clone());

        assert!(task.deadline >= get_block_timestamp(), "Task deadline has passed");
    }

    task.status = TaskStatus::COMPLETED;
    self.tasks.write(task_id, task);

    self.emit(TaskCompleted { task_id: task_id, completed_by: caller, proof: proof });
}

// --- READ FUNCTIONS ---
pub fn _get_available_tasks(self: @ContractState) -> Array<Task> {
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

pub fn _get_accepted_tasks(self: @ContractState, caller: ContractAddress) -> Array<Task> {
    let mut res: Array<Task> = ArrayTrait::new();
    let mut i: u16 = 0;
    let task_counter: u16 = self.task_counter.read();

    while i != task_counter {
        if self.tasks.read(i).status == TaskStatus::IN_PROGRESS
            && self.tasks.read(i).accepted_by.unwrap() == caller {
            res.append(self.tasks.read(i));
        }
        i += 1;
    }
    res
}

pub fn _get_created_task(self: @ContractState, caller: ContractAddress) -> Array<Task> {
    let mut res: Array<Task> = ArrayTrait::new();
    let mut i: u16 = 0;
    let task_counter: u16 = self.task_counter.read();

    while i != task_counter {
        if self.tasks.read(i).creator == caller {
            res.append(self.tasks.read(i));
        }
        i += 1;
    }
    res
}

pub fn _get_task_categories(self: @ContractState) -> Array<ByteArray> {
    let mut res: Array<ByteArray> = ArrayTrait::new();
    let mut i: u16 = 0;

    while i != self.task_category_counter.read() {
        res.append(self.task_categories.read(i));
        i += 1;
    }
    res
}

pub fn _get_task_difficulties(self: @ContractState) -> Array<ByteArray> {
    let mut res: Array<ByteArray> = ArrayTrait::new();
    let mut i: u16 = 0;

    while i != self.task_difficulty_counter.read() {
        res.append(self.task_difficulties.read(i));
        i += 1;
    }
    res
}

