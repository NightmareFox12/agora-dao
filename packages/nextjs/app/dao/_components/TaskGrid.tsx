'use client';

import React from 'react';
import { useScaffoldReadContract } from '~~/hooks/scaffold-stark/useScaffoldReadContract';
import { useDaoState } from '~~/services/store/dao';
import { TaskCard } from './TaskCard';
import { ITask } from '~~/types/task';
import { LoadingCards } from './LoadingCard';

const statusColors = {
  pending: 'bg-gray-100 text-gray-800 border-gray-200',
  'in-progress': 'bg-blue-100 text-blue-800 border-blue-200',
  review: 'bg-purple-100 text-purple-800 border-purple-200',
  completed: 'bg-green-100 text-green-800 border-green-200',
};

type TaskGridProps = {
  tabName: 'available' | 'created' | 'accepted';
};

export const TaskGrid: React.FC<TaskGridProps> = ({ tabName }) => {
  const { daoAddress } = useDaoState();

  //Smart Contract
  const { data: availableTasks, isLoading: availableTasksLoading } =
    useScaffoldReadContract({
      contractName: 'AgoraDao',
      functionName: 'get_available_tasks',
      contractAddress: daoAddress,
    });

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
