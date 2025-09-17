'use client';
import { Users } from 'lucide-react';
import React from 'react';
import { useScaffoldReadContract } from '~~/hooks/scaffold-stark/useScaffoldReadContract';
import { useDaoState } from '~~/services/store/dao';

type CardRoleProps = {
  title: string;
  description: string;
};

export const CardRole: React.FC<CardRoleProps> = ({ title, description }) => {
  const { daoAddress } = useDaoState();

  //Smart Contract
  const { data: userRoleCounter, isLoading: userRoleCounterLoading } =
    useScaffoldReadContract({
      contractName: 'AgoraDao',
      functionName: 'user_role_counter',
      contractAddress: daoAddress,
    });

  return (
    <div className='card bg-base-200 w-full border border-gradient shadow-sm'>
      <div className='card-body'>
        <h2 className='card-title'>{title}</h2>
        <p>{description}</p>
        <div className='flex items-center gap-2'>
          <Users className='w-5 h-5' />
          <p className='my-0'>32 members</p>
        </div>
      </div>
    </div>
  );
};
