'use client';

import { ArrowLeft, Users } from 'lucide-react';
import React, { useState } from 'react';
import { useScaffoldReadContract } from '~~/hooks/scaffold-stark/useScaffoldReadContract';
import { useAccount } from '~~/hooks/useAccount';
import { useDaoState } from '~~/services/store/dao';
import { TableRole } from './TableRole';

interface IShowData {
  showTable: boolean;
  role: 'admin' | 'auditor' | 'user';
}

export const RoleSection: React.FC = () => {
  const { address } = useAccount();
  const { daoAddress } = useDaoState();

  const [showData, setShowData] = useState<IShowData>({
    showTable: false,
    role: 'admin',
  });

  //Smart Contract
  const { data: isUser } = useScaffoldReadContract({
    contractName: 'AgoraDao',
    functionName: 'is_user',
    args: [address],
    contractAddress: daoAddress,
    watch: false,
  });

  const { data: adminRoleCounter, isLoading: adminRoleCounterLoading } =
    useScaffoldReadContract({
      contractName: 'AgoraDao',
      functionName: 'admin_role_counter',
      contractAddress: daoAddress,
      watch: false,
    });

  const { data: auditorRoleCounter, isLoading: auditorRoleCounterLoading } =
    useScaffoldReadContract({
      contractName: 'AgoraDao',
      functionName: 'auditor_role_counter',
      contractAddress: daoAddress,
      watch: false,
    });

  const {
    data: taskCreatorRoleCounter,
    isLoading: taskCreatorRoleCounterLoading,
  } = useScaffoldReadContract({
    contractName: 'AgoraDao',
    functionName: 'task_creator_role_counter',
    contractAddress: daoAddress,
    watch: false,
  });

  const { data: propossalRoleCounter, isLoading: propossalRoleCounterLoading } =
    useScaffoldReadContract({
      contractName: 'AgoraDao',
      functionName: 'proposal_creator_role_counter',
      contractAddress: daoAddress,
      watch: false,
    });

  const { data: userRoleCounter, isLoading: userRoleCounterLoading } =
    useScaffoldReadContract({
      contractName: 'AgoraDao',
      functionName: 'user_role_counter',
      contractAddress: daoAddress,
      watch: false,
    });

  if (isUser !== undefined && isUser) {
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
    <>
      {showData.showTable ? (
        <section>
          <button
            onClick={() =>
              setShowData((prev) => {
                return {
                  ...prev,
                  showTable: false,
                };
              })
            }
            className='btn btn-accent btn-circle btn-sm'
          >
            <ArrowLeft className='w-4 h-4' />
          </button>

          <p className='font-semibold'>{showData.role}</p>

          {address === undefined ? (
            <div />
          ) : (
            <TableRole
              role={showData.role}
              daoAddress={daoAddress}
              address={address}
            />
          )}
        </section>
      ) : (
        <section className='h-screen sm:px-2 lg:px-4 grid grid-cols-1 md:grid-cols-2 gap-6'>
          {/* Admin card */}
          {adminRoleCounterLoading ? (
            <div className='h-56 w-full skeleton bg-base-200' />
          ) : (
            <div
              onClick={() =>
                setShowData({
                  showTable: true,
                  role: 'admin',
                })
              }
              className='card bg-base-200 w-full border border-gradient shadow-sm cursor-pointer hover:scale-[1.03] transition-all delay-75'
            >
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
                  <p className='my-0'>
                    {userRoleCounter?.toString() ?? 0} members
                  </p>
                </div>
              </div>
            </div>
          )}
        </section>
      )}
    </>
  );
};
