// Rol con todos los permisos. Puede gestionar usuarios, roles, tareas y votaciones sin restricciones.
pub const ADMIN_ROLE: felt252 = selector!("ADMIN_ROLE");

// Responsable de la gestión de roles. Puede crear roles (USER_ROLE, PROPOSSAL_CREATOR_ROLE y TASK_CREATOR_ROLE).
// Además, puede eliminar hasta 3 roles por día para evitar abusos y proteger la DAO.
pub const ROLE_MANAGER_ROLE: felt252 = selector!("ROLE_MANAGER_ROLE");

// Encargado de la supervisión. Puede revisar tareas, procesos y votaciones para garantizar transparencia.
pub const AUDITOR_ROLE: felt252 = selector!("AUDITOR_ROLE");

// Permite crear nuevas tareas y validarlas una vez completadas.
// Nota: solo puede verificar las tareas que él mismo haya creado.
pub const TASK_CREATOR_ROLE: felt252 = selector!("TASK_CREATOR_ROLE");

// Autoriza la creación de propuestas y votaciones dentro del sistema.
pub const PROPOSSAL_CREATOR_ROLE: felt252 = selector!("PROPOSSAL_CREATOR_ROLE");

// Rol base de los participantes. Pueden aceptar tareas y participar en votaciones.
pub const USER_ROLE: felt252 = selector!("USER_ROLE");
