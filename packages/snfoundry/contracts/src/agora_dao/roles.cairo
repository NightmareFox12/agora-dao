pub const ADMIN_ROLE: felt252 = selector!("ADMIN_ROLE"); //todos los permisos
pub const ROLE_MANAGER_ROLE: felt252 = selector!("ROLE_MANAGER_ROLE"); //puede crear roles y eliminarlos con limite de tiempo
pub const AUDITOR_ROLE: felt252 = selector!("AUDITOR_ROLE"); // puede supervisar las tareas y votaciones
pub const TASK_CREATOR_ROLE: felt252 = selector!("TASK_CREATOR_ROLE"); // Puede crear tareas y tambien verificarlas una vez completadas (solo verifica las creadas por el)
pub const PROPOSSAL_CREATOR_ROLE: felt252 = selector!("PROPOSSAL_CREATOR_ROLE"); // Puede crear votaciones
pub const USER_ROLE: felt252 = selector!("USER_ROLE"); // pueden participar en las votaciones y aceptar tareas
