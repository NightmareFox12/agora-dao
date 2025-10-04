'use client';

import { useMemo } from 'react';
import { useScaffoldReadContract } from '~~/hooks/scaffold-stark/useScaffoldReadContract';
import { useAccount } from '~~/hooks/useAccount';
import { useDaoState } from '~~/services/store/dao';
import { ITask } from '~~/types/task';

export const AvailableTaskCounterSpan: React.FC = () => {
  const { daoAddress } = useDaoState();

  //smart contract
  const { data: availableTasks } = useScaffoldReadContract({
    contractName: 'AgoraDao',
    functionName: 'get_available_tasks',
    contractAddress: daoAddress,
  });

  const parsedAvailableTasks = useMemo(() => {
    if (availableTasks === undefined) return [];
    return availableTasks as any as ITask[];
  }, [availableTasks]);

  return (
    parsedAvailableTasks.length > 0 && (
      <span className='badge bg-accent text-[12px] rounded-full px-1.5 mr-1 flex items-center justify-center h-[20px]'>
        {parsedAvailableTasks.length}
      </span>
    )
  );
};

export const AcceptedTaskCounterSpan: React.FC = () => {
  const { daoAddress } = useDaoState();
  const { address } = useAccount();

  //smart contract
  const { data: acceptedTasks } = useScaffoldReadContract({
    contractName: 'AgoraDao',
    functionName: 'get_accepted_tasks',
    args: [address],
    contractAddress: daoAddress,
  });

  const parsedAcceptedTasks = useMemo(() => {
    if (acceptedTasks === undefined) return [];
    return acceptedTasks as any as ITask[];
  }, [acceptedTasks]);

  return (
    parsedAcceptedTasks.length > 0 && (
      <span className='badge bg-accent text-[12px] rounded-full px-1.5 mr-1 flex items-center justify-center h-[20px]'>
        {parsedAcceptedTasks.length}
      </span>
    )
  );
};

export const CreatedTaskCounterSpan: React.FC = () => {
  const { daoAddress } = useDaoState();
  const { address } = useAccount();

  //smart contract
  const { data: createdTasks } = useScaffoldReadContract({
    contractName: 'AgoraDao',
    functionName: 'get_created_tasks',
    args: [address],
    contractAddress: daoAddress,
  });

  const parsedCreatedTasks = useMemo(() => {
    if (createdTasks === undefined) return [];
    return createdTasks as any as ITask[];
  }, [createdTasks]);

  return (
    parsedCreatedTasks.length > 0 && (
      <span className='badge bg-accent text-[12px] rounded-full px-1.5 mr-1 flex items-center justify-center h-[20px]'>
        {parsedCreatedTasks.length}
      </span>
    )
  );
};
