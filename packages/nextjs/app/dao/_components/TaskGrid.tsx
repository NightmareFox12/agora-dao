'use client';

import { CalendarDays, Coins, Info, User } from 'lucide-react';
import React from 'react';
import { Address } from '~~/components/scaffold-stark';

interface Task {
  id: string;
  title: string;
  description: string;
  assignee: {
    name: string;
    avatar?: string;
  };
  priority: 'low' | 'medium' | 'high' | 'critical';
  status: 'pending' | 'in-progress' | 'review' | 'completed';
  dueDate: string;
  reward: number;
  category: string;
}

const mockTasks: Task[] = [
  {
    id: '1',
    title: 'Implementar sistema de votación',
    description:
      'Desarrollar el smart contract para el sistema de votación descentralizada de la DAO',
    assignee: { name: 'Alex Chen', avatar: '/developer-working.png' },
    priority: 'high',
    status: 'in-progress',
    dueDate: '2024-01-15',
    reward: 500,
    category: 'Desarrollo',
  },
  {
    id: '2',
    title: 'Auditoría de seguridad',
    description:
      'Realizar auditoría completa de los contratos inteligentes antes del lanzamiento',
    assignee: {
      name: 'Maria Rodriguez',
      avatar: '/digital-security-abstract.png',
    },
    priority: 'critical',
    status: 'pending',
    dueDate: '2024-01-20',
    reward: 1000,
    category: 'Seguridad',
  },
  {
    id: '3',
    title: 'Diseño de interfaz de usuario',
    description:
      'Crear mockups y prototipos para la nueva interfaz de la plataforma DAO',
    assignee: {
      name: 'Jordan Kim',
      avatar: '/diverse-designers-brainstorming.png',
    },
    priority: 'medium',
    status: 'review',
    dueDate: '2024-01-12',
    reward: 300,
    category: 'Diseño',
  },
  {
    id: '4',
    title: 'Documentación técnica',
    description:
      'Escribir documentación completa para desarrolladores y usuarios finales',
    assignee: { name: 'Sam Wilson', avatar: '/writer-at-desk.png' },
    priority: 'low',
    status: 'completed',
    dueDate: '2024-01-10',
    reward: 200,
    category: 'Documentación',
  },
  {
    id: '5',
    title: 'Integración con wallet',
    description:
      'Implementar conexión con múltiples wallets para facilitar la participación',
    assignee: { name: 'Taylor Brown', avatar: '/interconnected-blocks.png' },
    priority: 'high',
    status: 'pending',
    dueDate: '2024-01-18',
    reward: 400,
    category: 'Desarrollo',
  },
  {
    id: '6',
    title: 'Marketing y comunidad',
    description:
      'Desarrollar estrategia de marketing para aumentar la participación en la DAO',
    assignee: {
      name: 'Casey Davis',
      avatar: '/marketing-strategy-meeting.png',
    },
    priority: 'medium',
    status: 'in-progress',
    dueDate: '2024-01-25',
    reward: 350,
    category: 'Marketing',
  },
];

const priorityColors = {
  low: 'bg-blue-100 text-blue-800 border-blue-200',
  medium: 'bg-yellow-100 text-yellow-800 border-yellow-200',
  high: 'bg-orange-100 text-orange-800 border-orange-200',
  critical: 'bg-red-100 text-red-800 border-red-200',
};

const statusColors = {
  pending: 'bg-gray-100 text-gray-800 border-gray-200',
  'in-progress': 'bg-blue-100 text-blue-800 border-blue-200',
  review: 'bg-purple-100 text-purple-800 border-purple-200',
  completed: 'bg-green-100 text-green-800 border-green-200',
};

export const TaskGrid: React.FC = () => {
  //Smart Contract

  // const 
  return (
    <section className='sm:px-2 lg:px-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
      {mockTasks.map((task) => (
        <div
          key={task.id}
          className='card bg-base-200 shadow-sm border border-gradient'
        >
          <div className='card-body'>
            <h2 className='card-title'>{task.title}</h2>
            <div className='badge badge-warning'>{task.status}</div>
            <p className='my-1'>{task.description}</p>
            <Address address='0x123456789'/>
            <p className='my-0'>{task.dueDate}</p>
            <p className='my-0 font-bold'>{task.reward}</p>
            <div className='card-actions justify-center'>
              <button className='btn btn-info'>
                <Info className='w-4 h-4'/>
                Info</button>
            </div>
          </div>
        </div>
      ))}
    </section>
  );
};

// <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//   {mockTasks.map((task) => (
//     <Card key={task.id} className="hover:shadow-lg transition-shadow duration-200 border-border/50">
//       <CardHeader className="pb-3">
//         <div className="flex items-start justify-between gap-2">
//           <CardTitle className="text-lg font-semibold text-balance leading-tight">{task.title}</CardTitle>
//           <Badge variant="outline" className={`${priorityColors[task.priority]} text-xs font-medium shrink-0`}>
//             {task.priority}
//           </Badge>
//         </div>
//         <Badge variant="outline" className={`${statusColors[task.status]} text-xs font-medium w-fit`}>
//           {task.status}
//         </Badge>
//       </CardHeader>

//       <CardContent className="space-y-4">
//         <p className="text-sm text-muted-foreground text-pretty line-clamp-2">{task.description}</p>

//         <div className="space-y-3">
//           <div className="flex items-center gap-2">
//             <User className="h-4 w-4 text-muted-foreground" />
//             <div className="flex items-center gap-2">
//               <Avatar className="h-6 w-6">
//                 <AvatarImage src={task.assignee.avatar || "/placeholder.svg"} alt={task.assignee.name} />
//                 <AvatarFallback className="text-xs">
//                   {task.assignee.name
//                     .split(" ")
//                     .map((n) => n[0])
//                     .join("")}
//                 </AvatarFallback>
//               </Avatar>
//               <span className="text-sm font-medium">{task.assignee.name}</span>
//             </div>
//           </div>

//           <div className="flex items-center gap-2">
//             <CalendarDays className="h-4 w-4 text-muted-foreground" />
//             <span className="text-sm text-muted-foreground">
//               {new Date(task.dueDate).toLocaleDateString("es-ES", {
//                 day: "numeric",
//                 month: "short",
//                 year: "numeric",
//               })}
//             </span>
//           </div>

//           <div className="flex items-center gap-2">
//             <Coins className="h-4 w-4 text-muted-foreground" />
//             <span className="text-sm font-semibold text-primary">{task.reward} tokens</span>
//           </div>
//         </div>

//         <div className="pt-2 border-t border-border/50">
//           <Badge variant="secondary" className="text-xs">
//             {task.category}
//           </Badge>
//         </div>
//       </CardContent>
//     </Card>
//   ))}
// </div>
