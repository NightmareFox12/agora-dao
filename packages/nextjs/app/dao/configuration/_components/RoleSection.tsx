'use client';

import { ArrowLeft } from 'lucide-react';
import React, { useState } from 'react';
import { useScaffoldReadContract } from '~~/hooks/scaffold-stark/useScaffoldReadContract';
import { useAccount } from '~~/hooks/useAccount';
import { useDaoState } from '~~/services/store/dao';
import { TableRole } from './TableRole';
import { AddRoleDialog } from './AddRoleDialog';
import { RoleCard } from './RoleCard';

interface IShowData {
  showTable: boolean;
  role:
    | 'roleManager'
    | 'auditor'
    | 'task_creator'
    | 'propossal_creator'
    | 'user';
}

export const RoleSection: React.FC = () => {
  const { address } = useAccount();
  const { daoAddress } = useDaoState();

  const [showData, setShowData] = useState<IShowData>({
    showTable: false,
    role: 'user',
  });

  //Smart Contract
  const { data: isUser } = useScaffoldReadContract({
    contractName: 'AgoraDao',
    functionName: 'is_user',
    args: [address],
    contractAddress: daoAddress,
    // watch: false,
  });

  const { data: isMember } = useScaffoldReadContract({
    contractName: 'AgoraDao',
    functionName: 'is_member',
    contractAddress: daoAddress,
    args: [address],
    watch: false,
  });

  const { data: roleManagerCounter, isLoading: roleManagerCounterLoading } =
    useScaffoldReadContract({
      contractName: 'AgoraDao',
      functionName: 'role_manager_role_counter',
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

  //parsedData
  const isMemberParsed = isMember as any as boolean | undefined;
  const isUserParsed = isUser as any as boolean | undefined;

  if (
    address === undefined ||
    isUserParsed === undefined ||
    isMemberParsed === undefined ||
    isUserParsed ||
    isMemberParsed === false
  ) {
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
        <section className='h-screen'>
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

          <div className='w-full flex justify-center'>
            <AddRoleDialog
              role={showData.role}
              daoAddress={daoAddress}
              address={address}
            />
          </div>
          <p className='font-semibold text-center'>{showData.role}s</p>

          <TableRole
            role={showData.role}
            daoAddress={daoAddress}
            address={address}
          />
        </section>
      ) : (
        <section className='h-screen sm:px-2 lg:px-4 grid grid-cols-1 md:grid-cols-2 gap-6'>
          {/* Role Manager card */}
          <RoleCard
            title='Role Manager'
            description='Can manage roles.'
            counter={roleManagerCounter as bigint | undefined}
            counterLoading={roleManagerCounterLoading}
            setShowData={setShowData}
            role={'roleManager'}
          />

          {/* Auditor card */}
          <RoleCard
            title='Auditor'
            description='Can audit tasks.'
            counter={auditorRoleCounter as bigint | undefined}
            counterLoading={auditorRoleCounterLoading}
            setShowData={setShowData}
            role={'auditor'}
          />

          {/* Task creator card */}
          <RoleCard
            title='Task Creator'
            description='Can create tasks.'
            counter={taskCreatorRoleCounter as bigint | undefined}
            counterLoading={taskCreatorRoleCounterLoading}
            setShowData={setShowData}
            role={'user'}
          />

          {/* propossal creator card */}
          <RoleCard
            title='Proposal Creator'
            description='Can create proposals.'
            setShowData={setShowData}
            counter={propossalRoleCounter as bigint | undefined}
            counterLoading={propossalRoleCounterLoading}
            role=''
          />
          {/* User card */}

          <RoleCard
            title='User'
            description='Can accept tasks and participate in voting.'
            setShowData={setShowData}
            counter={userRoleCounter as bigint | undefined}
            counterLoading={userRoleCounterLoading}
            role={'user'}
          />
        </section>
      )}
    </>
  );
};
