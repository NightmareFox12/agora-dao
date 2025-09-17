'use client';

import { Users } from 'lucide-react';
import React from 'react';
import { useScaffoldReadContract } from '~~/hooks/scaffold-stark/useScaffoldReadContract';
import { useAccount } from '~~/hooks/useAccount';
import { useDaoState } from '~~/services/store/dao';

export const RoleSection: React.FC = () => {
  const { address } = useAccount();
  const { daoAddress } = useDaoState();

  //Smart Contract
  const { data: isUser, isLoading: isUserLoading } = useScaffoldReadContract({
    contractName: 'AgoraDao',
    functionName: 'is_user',
    args: [address],
    contractAddress: daoAddress,
  });

  const { data: adminRoleCounter, isLoading: adminRoleCounterLoading } =
    useScaffoldReadContract({
      contractName: 'AgoraDao',
      functionName: 'admin_role_counter',
      contractAddress: daoAddress,
    });

  const { data: auditorRoleCounter, isLoading: auditorRoleCounterLoading } =
    useScaffoldReadContract({
      contractName: 'AgoraDao',
      functionName: 'auditor_role_counter',
      contractAddress: daoAddress,
    });

  const {
    data: taskCreatorRoleCounter,
    isLoading: taskCreatorRoleCounterLoading,
  } = useScaffoldReadContract({
    contractName: 'AgoraDao',
    functionName: 'task_creator_role_counter',
    contractAddress: daoAddress,
  });

  const { data: propossalRoleCounter, isLoading: propossalRoleCounterLoading } =
    useScaffoldReadContract({
      contractName: 'AgoraDao',
      functionName: 'proposal_creator_role_counter',
      contractAddress: daoAddress,
    });

  const { data: userRoleCounter, isLoading: userRoleCounterLoading } =
    useScaffoldReadContract({
      contractName: 'AgoraDao',
      functionName: 'user_role_counter',
      contractAddress: daoAddress,
    });

  if (isUserLoading || (isUser !== undefined && isUser)) {
    return (
      <section className='h-screen sm:px-2 lg:px-4 grid grid-cols-1 md:grid-cols-2 gap-6'>
        {Array(5)
          .fill(0)
          .map((_, y) => (
            <div key={y} className='h-56 w-full skeleton bg-base-200' />
          ))}
      </section>
    );
  }

  return (
    <section className='h-screen sm:px-2 lg:px-4 grid grid-cols-1 md:grid-cols-2 gap-6'>
      {/* Admin card */}
      {adminRoleCounterLoading ? (
        <div className='h-56 w-full skeleton bg-base-200' />
      ) : (
        <div className='card bg-base-200 w-full border border-gradient shadow-sm'>
          <div className='card-body'>
            <h2 className='card-title'>Admin Role</h2>
            <p>Can accept tasks and participate in voting.</p>
            <div className='flex items-center gap-2'>
              <Users className='w-5 h-5' />
              <p className='my-0'>
                {adminRoleCounter?.toString() ?? 0} members
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Auditor card */}
      {auditorRoleCounterLoading ? (
        <div className='h-56 w-full skeleton bg-base-200' />
      ) : (
        <div className='card bg-base-200 w-full border border-gradient shadow-sm'>
          <div className='card-body'>
            <h2 className='card-title'>Auditor Role</h2>
            <p>Can accept tasks and participate in voting.</p>
            <div className='flex items-center gap-2'>
              <Users className='w-5 h-5' />
              <p className='my-0'>
                {auditorRoleCounter?.toString() ?? 0} members
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Task creator card */}
      {taskCreatorRoleCounterLoading ? (
        <div className='h-56 w-full skeleton bg-base-200' />
      ) : (
        <div className='card bg-base-200 w-full border border-gradient shadow-sm'>
          <div className='card-body'>
            <h2 className='card-title'>Task Creator Role</h2>
            <p>Can accept tasks and participate in voting.</p>
            <div className='flex items-center gap-2'>
              <Users className='w-5 h-5' />
              <p className='my-0'>
                {taskCreatorRoleCounter?.toString() ?? 0} members
              </p>
            </div>
          </div>
        </div>
      )}

      {/* propossal creator card */}
      {propossalRoleCounterLoading ? (
        <div className='h-56 w-full skeleton bg-base-200' />
      ) : (
        <div className='card bg-base-200 w-full border border-gradient shadow-sm'>
          <div className='card-body'>
            <h2 className='card-title'>Propossal Role</h2>
            <p>Can accept tasks and participate in voting.</p>
            <div className='flex items-center gap-2'>
              <Users className='w-5 h-5' />
              <p className='my-0'>
                {propossalRoleCounter?.toString() ?? 0} members
              </p>
            </div>
          </div>
        </div>
      )}

      {/* User card */}
      {userRoleCounterLoading ? (
        <div className='h-56 w-full skeleton bg-base-200' />
      ) : (
        <div className='card bg-base-200 w-full border border-gradient shadow-sm'>
          <div className='card-body'>
            <h2 className='card-title'>User Role</h2>
            <p>Can accept tasks and participate in voting.</p>
            <div className='flex items-center gap-2'>
              <Users className='w-5 h-5' />
              <p className='my-0'>{userRoleCounter?.toString() ?? 0} members</p>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
