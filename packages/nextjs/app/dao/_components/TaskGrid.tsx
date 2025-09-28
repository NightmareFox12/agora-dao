'use client';

import React, { useMemo } from 'react';
import { useScaffoldReadContract } from '~~/hooks/scaffold-stark/useScaffoldReadContract';
import { useDaoState } from '~~/services/store/dao';
import { TaskCard } from './TaskCard';
import { ITask } from '~~/types/task';
import { LoadingCards } from './LoadingCard';
import { useAccount } from '~~/hooks/useAccount';
import { Frown } from 'lucide-react';

const statusColors = {
  pending: 'bg-gray-100 text-gray-800 border-gray-200',
  'in-progress': 'bg-blue-100 text-blue-800 border-blue-200',
  review: 'bg-purple-100 text-purple-800 border-purple-200',
  completed: 'bg-green-100 text-green-800 border-green-200',
};

//Components
const AvailableTasks = ({ daoAddress }: { daoAddress: string }) => {
  //Smart Contract
  const { data: availableTasks, isLoading: availableTasksLoading } =
    useScaffoldReadContract({
      contractName: 'AgoraDao',
      functionName: 'get_available_tasks',
      contractAddress: daoAddress,
    });

  const parsedAvailableTasks = useMemo(() => {
    if (availableTasks === undefined) return [];
    return availableTasks as any as ITask[];
  }, [availableTasks]);

  return (
    <>
      {availableTasksLoading || availableTasks === undefined ? (
        <LoadingCards />
      ) : parsedAvailableTasks.length === 0 ? (
        <div className='col-span-full text-center '>
          No available tasks at the moment.
        </div>
      ) : (
        parsedAvailableTasks.map((x, y) => {
          return <TaskCard key={y} task={x} daoAddress={daoAddress} />;
        })
      )}
    </>
  );
};

const CreatedTasks = ({
  daoAddress,
  userAddress,
}: {
  daoAddress: string;
  userAddress: `0x${string}` | undefined;
}) => {
  //Smart Contract
  const { data: createdTasks, isLoading: createdTasksLoading } =
    useScaffoldReadContract({
      contractName: 'AgoraDao',
      functionName: 'get_created_tasks',
      args: [userAddress],
      contractAddress: daoAddress,
    });

  const parsedAvailableTasks = useMemo(() => {
    if (createdTasks === undefined) return [];
    return createdTasks as any as ITask[];
  }, [createdTasks]);

  return (
    <>
      {createdTasksLoading ||
      createdTasks === undefined ||
      userAddress === undefined ? (
        <LoadingCards />
      ) : parsedAvailableTasks.length === 0 ? (
        <div className='h-screen col-span-full'>
          <p className='col-span-full text-center'>
            You have not created any tasks yet.
          </p>
          <div className='col-span-full flex justify-center'>
            <Frown className='size-20' />
          </div>
        </div>
      ) : (
        parsedAvailableTasks.map((x, y) => {
          const task = x as unknown as ITask;
          return <TaskCard key={y} task={task} daoAddress={daoAddress} />;
        })
      )}
    </>
  );
};

type TaskGridProps = {
  tabName: 'available' | 'created' | 'accepted';
};

export const TaskGrid: React.FC<TaskGridProps> = ({ tabName }) => {
  const { daoAddress } = useDaoState();
  const { address } = useAccount();

  return (
    <section className='sm:px-2 lg:px-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
      {tabName === 'available' && <AvailableTasks daoAddress={daoAddress} />}
      {tabName === 'created' && (
        <CreatedTasks daoAddress={daoAddress} userAddress={address} />
      )}
    </section>
  );
};
