use starknet::storage::StoragePointerReadAccess;
use super::AgoraDao::ContractState;

pub fn create_task_validation(
    ref self: ContractState,
    title: ByteArray,
    description: ByteArray,
    category_ID: u16,
    difficulty_ID: u16,
    amount: u256,
    deadline: u64,
) {
    assert!(title.len() > 0, "task title must not be empty");
    assert!(title.len() <= 50, "The title of the task is very long");
    assert!(description.len() > 0, "Dao description must not be empty");
    assert!(description.len() <= 500, "The description of the DAO is very long");
    assert!(category_ID < self.task_category_counter.read(), "Invalid category ID.");
    assert!(difficulty_ID < self.task_difficulty_counter.read(), "Invalid difficulty ID.");

    if (deadline != 0) {//TODO: buscar la forma en el front de enviar el date compatible para aca
    //TODO: terminar de completar la struct de la task porque se me olvidaron los status de la task
    //TODO: agregar la verificacion de roles para las tasks
    }

    assert!(amount > 0, "Amount must be greater than 0");
}
