#[derive(Serde, Drop, Clone, PartialEq, starknet::Store)]
pub enum TaskStatus {
    #[default]
    OPEN,
    IN_PROGRESS,
    CANCELLED,
    COMPLETED,
}
