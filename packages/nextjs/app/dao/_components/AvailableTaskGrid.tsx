'use client';

import { CalendarDays, Coins, Info, User } from 'lucide-react';
import React from 'react';
import { Address } from '~~/components/scaffold-stark';
import { useScaffoldReadContract } from '~~/hooks/scaffold-stark/useScaffoldReadContract';
import { CairoCustomEnum, num } from 'starknet';
import { formatEther } from 'ethers';
import { useDaoState } from '~~/services/store/dao';
import { TaskCard } from './TaskCard';
import { ITask } from '~~/types/task';

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
  const { daoAddress } = useDaoState();

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

          return <TaskCard key={y} task={task} daoAddress={daoAddress} />;
        })
      )}
    </section>
  );
};
