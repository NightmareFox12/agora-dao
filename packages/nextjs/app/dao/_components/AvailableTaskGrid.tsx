'use client';

import { CalendarDays, Coins, Info, User } from 'lucide-react';
import React from 'react';
import { Address } from '~~/components/scaffold-stark';
import { useScaffoldReadContract } from '~~/hooks/scaffold-stark/useScaffoldReadContract';
import { useTaskState } from '~~/services/store/task';
import { CairoCustomEnum } from 'starknet';
import { formatEther } from 'ethers';

interface ITask {
  task_id: bigint;
  creator: bigint;
  title: string;
  description: string;
  category: string;
  difficulty: string;
  reward: bigint;
  deadline: bigint;
  status: CairoCustomEnum;
}

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

export const AvailableTaskGrid: React.FC = () => {
  const { daoAddress } = useTaskState();

  //Smart Contract
  const { data: availableTasks, isLoading: availableTasksLoading } =
    useScaffoldReadContract({
      contractName: 'AgoraDao',
      functionName: 'get_available_tasks',
      contractAddress: daoAddress,
    });

  //components
  const LoadingCards = () => {
    const arr = new Array(9).fill(0);
    return arr.map((_, y) => (
      <div key={y + '-loading'} className='flex justify-center items-center'>
        <div className='h-56 w-[300px] max-w-[400px] skeleton bg-primary' />
      </div>
    ));
  };

  return (
    <section className='sm:px-2 lg:px-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
      {availableTasksLoading || availableTasks === undefined ? (
        <LoadingCards />
      ) : (
        availableTasks.map((x, y) => {
          const task = x as unknown as ITask;

          const status = task.status.activeVariant();

          const parsedDate = new Date(Number(task.deadline) * 1000)
            .toISOString()
            .slice(0, 10)
            .replace(/-/g, '/');

          return (
            <div
              key={y}
              className='card bg-base-200 shadow-sm border border-gradient'
            >
              <div className='card-body'>
                <h2 className='card-title break-all'>
                  {task.title}
                </h2>
                <div className='badge badge-warning'>{status}</div>
                <p className='my-1 break-all line-clamp-3'>
                  {task.description}
                </p>
                <Address address='0x123456789' />
                {task.deadline !== 0n && <p className='my-0'>{parsedDate}</p>}
                <p className='my-0 font-bold'>
                  {formatEther(task.reward)} STRK
                </p>
                <div className='card-actions justify-center'>
                  <button className='btn btn-info'>
                    <Info className='w-4 h-4' />
                    Info
                  </button>
                </div>
              </div>
            </div>
          );
        })
      )}
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
