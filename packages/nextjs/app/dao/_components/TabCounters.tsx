'use client';

import { useMemo } from 'react';
import { useScaffoldReadContract } from '~~/hooks/scaffold-stark/useScaffoldReadContract';
import { useDaoState } from '~~/services/store/dao';
import { ITask } from '~~/types/task';

export const AvailableSpanTaskCounter: React.FC = () => {
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
      <span className='badge bg-accent text-[12px] rounded-full px-2 mr-1'>
        {parsedAvailableTasks.length}
      </span>
    )
  );
};
