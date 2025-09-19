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
  role: 'roleManager' | 'auditor' | 'taskCreator' | 'propossalCreator' | 'user';
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
            description='
            Manage roles within the DAO. You can create basic roles (User, Proposal Creator, and Task Creator) and delete up to 3 roles per day to maintain balance and prevent abuse.'
            counter={roleManagerCounter as bigint | undefined}
            counterLoading={roleManagerCounterLoading}
            setShowData={setShowData}
            role='roleManager'
          />

          {/* Auditor card */}
          <RoleCard
            title='Auditor'
            description='Oversees the operation of the DAO. Can review tasks, processes, and votes to ensure transparency and compliance with the rules.'
            counter={auditorRoleCounter as bigint | undefined}
            counterLoading={auditorRoleCounterLoading}
            setShowData={setShowData}
            role='auditor'
          />

          {/* Task creator card */}
          <RoleCard
            title='Task Creator'
            description='Responsible for generating new tasks. In addition, they can validate tasks once they are completed, but only those that they have created themselves.'
            counter={taskCreatorRoleCounter as bigint | undefined}
            counterLoading={taskCreatorRoleCounterLoading}
            setShowData={setShowData}
            role='user'
          />

          {/* propossal creator card */}
          <RoleCard
            title='Proposal Creator'
            description='Responsible for initiating proposals and votes within the DAO. Allows the community to participate in decision-making.'
            setShowData={setShowData}
            counter={propossalRoleCounter as bigint | undefined}
            counterLoading={propossalRoleCounterLoading}
            role=''
          />

          {/* User card */}
          <RoleCard
            title='User'
            description='Basic role of all participants. They can accept assigned tasks and participate in DAO voting.'
            setShowData={setShowData}
            counter={userRoleCounter as bigint | undefined}
            counterLoading={userRoleCounterLoading}
            role='user'
          />
        </section>
      )}
    </>
  );
};
